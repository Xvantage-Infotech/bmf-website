"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Star
} from 'lucide-react';
import { formatPrice, calculateNights, formatDate } from '@/lib/utils';

export default function BookingModal({
  farm,
  isOpen,
  onClose,
  onSuccess,
  onCancel,
  checkIn,
  checkOut,
  guests = 2
}) {
  const [paymentState, setPaymentState] = useState('form');
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 1;
  if (!farm) return null;

const pricePerNight = parseFloat(farm.pricePerNight ?? '0');
const basePrice = pricePerNight * nights;

  const extraGuestCharge = Math.max(0, guests - 2) * 500 * nights;
  const serviceFee = basePrice * 0.05;
  const taxes = basePrice * 0.12;
  const totalAmount = basePrice + extraGuestCharge + serviceFee + taxes;

  const handleInputChange = (field, value) => {
    setGuestDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setPaymentState('processing');
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      if (isSuccess) {
        setPaymentState('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setPaymentState('cancelled');
        setTimeout(() => {
          onCancel();
        }, 2000);
      }
    }, 3000);
  };

  const resetModal = () => {
    setPaymentState('form');
    setGuestDetails({
      name: '',
      email: '',
      phone: '',
      specialRequests: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderPaymentState = () => {
    switch (paymentState) {
      case 'processing':
        return (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Processing Payment</h3>
            <p className="text-neutral-600">Please wait while we process your booking...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Booking Confirmed!</h3>
            <p className="text-neutral-600 mb-4">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </p>
            <Badge className="bg-green-100 text-green-800">
              Booking ID: BMF{Date.now().toString().slice(-6)}
            </Badge>
          </div>
        );

      case 'cancelled':
        return (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Payment Cancelled</h3>
            <p className="text-neutral-600 mb-6">
              Your payment was cancelled. No charges have been made to your account.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => setPaymentState('form')}>
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={farm.images[0]}
                    alt={farm.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">{farm.name}</h4>
                    <p className="text-sm text-neutral-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {farm.location}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-sm text-neutral-600">
                        {farm.rating} ({farm.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-sm text-neutral-500">Check-in</div>
                      <div className="font-medium">
                        {checkIn ? formatDate(checkIn) : 'Select dates'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-sm text-neutral-500">Check-out</div>
                      <div className="font-medium">
                        {checkOut ? formatDate(checkOut) : 'Select dates'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-500" />
                  <div>
                    <div className="text-sm text-neutral-500">Guests</div>
                    <div className="font-medium">{guests} guests</div>
                  </div>
                </div>

                <div className="text-sm text-neutral-600">
                  <strong>{nights}</strong> night{nights !== 1 ? 's' : ''} stay
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={guestDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={guestDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9277778778"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <textarea
                    id="requests"
                    value={guestDetails.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any special requirements or requests..."
                    className="w-full p-3 border border-neutral-200 rounded-md resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Base price ({nights} nights)</span>
                  <span>{formatPrice(basePrice)}</span>
                </div>

                {extraGuestCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Extra guests ({guests - 2} × {nights} nights)</span>
                    <span>{formatPrice(extraGuestCharge)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & fees</span>
                  <span>{formatPrice(taxes)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-primary text-white hover:bg-primary/90"
              size="lg"
              onClick={handlePayment}
              disabled={!guestDetails.name || !guestDetails.email || !guestDetails.phone}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {formatPrice(totalAmount)}
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {paymentState === 'form' ? 'Complete Your Booking' : 'Booking Status'}
          </DialogTitle>
        </DialogHeader>
        {renderPaymentState()}
      </DialogContent>
    </Dialog>
  );
}
