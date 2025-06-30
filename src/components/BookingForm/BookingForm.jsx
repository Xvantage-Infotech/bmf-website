'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Phone, MessageCircle } from 'lucide-react';
import { formatPrice, calculateTotalPrice, calculateNights } from '@/lib/utils';
import ImprovedDatePicker from './ImprovedDatePicker';

export default function BookingForm({ farm, className = '' }) {
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const pricePerNight = parseFloat(farm.pricePerNight);
  const pricing = nights > 0 ? calculateTotalPrice(pricePerNight, nights) : null;

  const totalGuests = adults + children;
  const isGuestLimitExceeded = totalGuests > farm.maxGuests;
  const isBookingValid = checkIn && checkOut && nights > 0 && !isGuestLimitExceeded;

  const handleBooking = () => {
    if (!checkIn || !checkOut || isGuestLimitExceeded) return;

    console.log('Booking request:', {
      farmId: farm.id,
      checkIn,
      checkOut,
      adults,
      children,
      totalPrice: pricing?.total,
    });
  };

  return (
    <div className={`sticky top-8 ${className}`}>
      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Book Your Stay</h3>

        <div className="space-y-6">
          {/* Date Selection */}
          <ImprovedDatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
          />

          {/* Guest Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-2">Adults</Label>
              <Select value={adults.toString()} onValueChange={(value) => setAdults(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Adult{num !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-2">Children</Label>
              <Select value={children.toString()} onValueChange={(value) => setChildren(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 6 }, (_, i) => i).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Child' : 'Children'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guest Limit Warning */}
          {isGuestLimitExceeded && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">
                This property accommodates up to {farm.maxGuests} guests. Please reduce the number of guests.
              </p>
            </div>
          )}

          {/* Pricing Breakdown */}
          {pricing && (
            <div className="bg-white rounded-lg p-4 border border-neutral-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatPrice(pricePerNight)} x {nights} night{nights !== 1 ? 's' : ''}</span>
                <span>{formatPrice(pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service fee</span>
                <span>{formatPrice(pricing.serviceFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & fees</span>
                <span>{formatPrice(pricing.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(pricing.total)}</span>
              </div>
            </div>
          )}

          {/* Booking Button */}
          <Button
            onClick={handleBooking}
            disabled={!isBookingValid}
            className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            size="lg"
          >
            {!checkIn || !checkOut
              ? 'Select Dates'
              : isGuestLimitExceeded
              ? 'Too Many Guests'
              : 'Check Availability'}
          </Button>

          <p className="text-xs text-neutral-600 text-center">
            You won't be charged yet
          </p>
        </div>

        {/* Contact Options */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-3">Need Help?</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('tel:+919277778778', '_self')}
            >
              <Phone className="w-4 h-4 mr-3" />
              Call us: +91 98765 43210
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('https://wa.me/919277778778', '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-3" />
              WhatsApp Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
