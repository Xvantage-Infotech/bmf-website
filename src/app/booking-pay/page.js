'use client';

import dynamic from 'next/dynamic';

// Import from new path (not pages/)
const BookingPay = dynamic(() => import('@/components/booking/BookingPay'), {
  ssr: false,
});

export default function BookingPayPage() {
  return <BookingPay />;
}
