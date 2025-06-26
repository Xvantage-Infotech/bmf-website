"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Download,
  Share2,
  Home
} from 'lucide-react';

export default function BookingConfirmation() {
  const bookingDetails = {
    id: `BMF${Date.now().toString().slice(-6)}`,
    farmName: 'Green Valley Resort',
    location: 'Lonavala, Maharashtra',
    checkIn: new Date('2025-06-28'),
    checkOut: new Date('2025-06-30'),
    guests: 4,
    totalAmount: 15750,
    guestName: 'John Doe',
    guestEmail: 'john.doe@example.com',
    guestPhone: '+91 98765 43210',
    bookingDate: new Date()
  };

  const handleDownloadVoucher = () => {
    const voucher = `
BOOKING CONFIRMATION
BookMyFarm

Booking ID: ${bookingDetails.id}
Property: ${bookingDetails.farmName}
Location: ${bookingDetails.location}
Check-in: ${bookingDetails.checkIn.toLocaleDateString()}
Check-out: ${bookingDetails.checkOut.toLocaleDateString()}
Guests: ${bookingDetails.guests}
Total Amount: ₹${bookingDetails.totalAmount.toLocaleString()}

Guest Details:
Name: ${bookingDetails.guestName}
Email: ${bookingDetails.guestEmail}
Phone: ${bookingDetails.guestPhone}

Booking Date: ${bookingDetails.bookingDate.toLocaleDateString()}

Thank you for booking with BookMyFarm!
`;

    const blob = new Blob([voucher], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BookMyFarm-${bookingDetails.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareText = `I just booked ${bookingDetails.farmName} for my getaway! Booking ID: ${bookingDetails.id}`;

    if (navigator.share) {
      navigator.share({
        title: 'My BookMyFarm Booking',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-neutral-600">
              Your reservation has been successfully confirmed
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Booking Summary</CardTitle>
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-neutral-500 mb-1">Booking ID</div>
                      <div className="font-mono font-semibold text-lg">
                        {bookingDetails.id}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500 mb-1">Booking Date</div>
                      <div className="font-medium">
                        {bookingDetails.bookingDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {bookingDetails.farmName}
                    </h3>
                    <p className="text-neutral-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {bookingDetails.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                      <div className="text-xs text-neutral-500">Check-in</div>
                      <div className="font-medium">
                        {bookingDetails.checkIn.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                      <div className="text-xs text-neutral-500">Check-out</div>
                      <div className="font-medium">
                        {bookingDetails.checkOut.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <Users className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                      <div className="text-xs text-neutral-500">Guests</div>
                      <div className="font-medium">{bookingDetails.guests}</div>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-sm text-neutral-600 mb-1">Total Amount Paid</div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{bookingDetails.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Primary Guest</div>
                    <div className="font-medium">{bookingDetails.guestName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      <div>
                        <div className="text-sm text-neutral-500">Email</div>
                        <div className="font-medium">{bookingDetails.guestEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-neutral-500" />
                      <div>
                        <div className="text-sm text-neutral-500">Phone</div>
                        <div className="font-medium">{bookingDetails.guestPhone}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <Bullet> A confirmation email has been sent to {bookingDetails.guestEmail} </Bullet>
                    <Bullet> The property owner will contact you 24 hours before check-in </Bullet>
                    <Bullet> Please carry a valid ID proof for verification at check-in </Bullet>
                    <Bullet> Cancellation is free up to 24 hours before check-in </Bullet>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={handleDownloadVoucher}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Voucher
                  </Button>

                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Booking
                  </Button>

                  <Button
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => (window.location.href = '/')}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-neutral-900 mb-2">Need Help?</h4>
                    <div className="space-y-2 text-sm">
                      <a href="/contact" className="block text-primary hover:text-primary/80">
                        Contact Support
                      </a>
                      <a
                        href="https://wa.me/919277778778"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary hover:text-primary/80"
                      >
                        WhatsApp Us
                      </a>
                      <a href="/faq" className="block text-primary hover:text-primary/80">
                        View FAQ
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Bullet({ children }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
      <p>{children}</p>
    </div>
  );
}
