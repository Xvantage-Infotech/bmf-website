'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import Script from 'next/script';
import { createRazorpayOrder, updatePaymentStatus, verifyPaymentSignature } from '@/services/Payment/payment.service';
import { useAuth } from '@/contexts/AuthContext';
import { addBooking } from '@/services/Booking/booking.service';
import {  FARM_IMAGE_BASE_URL } from '@/lib/utils';




export default function BookingPay() {
  const [showPolicy, setShowPolicy] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const searchParams = useSearchParams();
const { user } = useAuth(); // Access logged-in user

function convertTo24Hour(timeStr) {
  if (!timeStr || timeStr.toLowerCase() === 'undefined') return null;

  const [time, modifier] = timeStr.split(' '); // e.g. ["7:00", "AM"]
  if (!time || !modifier) return null;

  let [hours, minutes] = time.split(':');
  if (!hours || !minutes) return null;

  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (modifier.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }

  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}


const farmId = searchParams.get('farmId');
  const bookingName = searchParams.get('name');
  const guest = searchParams.get('guest');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const checkInTime = searchParams.get('checkInTime');
  const checkOutTime = searchParams.get('checkOutTime');
  const price = searchParams.get('price');
  const farmName = searchParams.get('farmName');
  const farmLocation = searchParams.get('farmLocation');
  const areaCity = searchParams.get('areaCity');
  const rating = searchParams.get('rating') || '0';
  const housePolicy = searchParams.get('houseCancellationPolicy');
  const increasePercentage = parseFloat(searchParams.get('increase_percentage') || '0');
  const discountedPrice = parseFloat(price || '0');

const originalPrice = increasePercentage > 0
  ? discountedPrice * (1 + increasePercentage / 100)
  : discountedPrice;


  const router = useRouter();



  const handlePayNow = async () => {
    if (!agreedToPolicy) {
      alert('Please agree to the House & Cancellation Policy first.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Login required to proceed.');
      return;
    }

    try {
     const { status, data } = await createRazorpayOrder({
  farmId: String(farmId),
  amount: discountedPrice,
});
console.log('Order Response:', data);

      if (status !== 1 || !data.order_id) {
        alert('Order creation failed.');
        return;
      }

      // Get Razorpay key based on environment
const razorpayKey =
  window.location.hostname === 'localhost'
    ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_LOCAL
    : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_PRODUCTION;

// const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_PRODUCTION;



        if (typeof window.Razorpay === 'undefined') {
  alert('Razorpay SDK not loaded. Please refresh.');
  return;
}

const options = {
  key: razorpayKey,
  amount: Math.round(discountedPrice * 100),
  currency: 'INR',
  name: farmName,
  description: 'Farm Booking',
  order_id: data.order_id,

  // ✅ On Payment Success
handler: async (response) => {
  try {
    const result = await verifyPaymentSignature({
      payment_id: response.razorpay_payment_id,
      order_id: response.razorpay_order_id,
      signature: response.razorpay_signature,
    });

    if (result.status === 1) {
      const transactionId = result.data?.id;

const formattedCheckInTime = convertTo24Hour(checkInTime);
const formattedCheckOutTime = convertTo24Hour(checkOutTime);

const bookingResponse = await addBooking({
  farm_id: farmId,
  transaction_id: String(transactionId),
  check_in_date: checkIn,
  check_in_time: formattedCheckInTime,
  check_out_date: checkOut,
  check_out_time: formattedCheckOutTime,
  no_of_guest: guest,
  total_price: String(discountedPrice),
});

   console.log("🚀 ~ handler: ~ bookingResponse:", bookingResponse)


      if (bookingResponse.status === 1) {
  const bookingId = bookingResponse.data?.id;

  if (bookingId) {
    router.push(`/booking-confirmation?bookingId=${bookingId}`);
  } else {
    console.warn("Booking response missing ID:", bookingResponse);
    router.push(`/booking-confirmation`);
  }
} else {
  alert('Payment succeeded, but booking failed.');
}

    } else {
      alert('Payment verification failed.');
    }
  } catch (error) {
    console.error('Error in payment handler:', error);
    alert('Something went wrong during verification.');
  }
},


  prefill: {
    name: bookingName || user?.name || 'Guest',
    email: user?.email || 'fallback@example.com',
    contact: user?.phone_number?.replace('+91', '') || '9999999999',
  },

  theme: {
    color: '#17AE7D',
  },

  // ❌ On Cancel
  modal: {
    ondismiss: async () => {
      try {
        await updatePaymentStatus({
          order_id: data.order_id,
          status: 'Cancel',
        });
        console.log('Payment cancelled');
      } catch (err) {
        console.error('Cancel status error:', err);
      }
    },
  },
};

// ❌ On Failure (attach listener after rzp object is created)
const rzp = new window.Razorpay(options);
rzp.on('payment.failed', async () => {
  try {
    await updatePaymentStatus({
      order_id: data.order_id,
      status: 'Fail',
    });
    alert('Payment failed.');
  } catch (err) {
    console.error('Fail status error:', err);
  }
});

rzp.open();



console.log("🚀 ~ handlePayNow ~ options.prefill:", options.prefill)
console.log("Using Razorpay key:", razorpayKey);
      console.log("🚀 ~ handlePayNow ~ options.order_id:", options.order_id)

     



    } catch (error) {
  console.error('Payment error:', error.response?.data || error);
  alert('Something went wrong. Try again.');
}
  };

  const image = searchParams.get('image');
  const imageUrl = `${FARM_IMAGE_BASE_URL}/${image}`;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="max-w-md mx-auto p-4 mb-16">
        <div className="flex bg-white shadow rounded-xl overflow-hidden mb-4">
          <img src={imageUrl} alt={farmName} className="w-48 h-40 object-cover" />
          <div className="flex flex-col justify-between p-3 flex-1">
            <div>
              <h2 className="text-sm font-semibold text-green-700 mb-2">Farm</h2>
              <h1 className="text-base font-bold leading-tight mb-2">{farmName}</h1>
              <a href={farmLocation} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-gray-500 hover:text-green-700 transition">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {areaCity}
              </a>
            </div>
            <div className="flex items-center text-xs text-yellow-600">
              Reviews <span className="ml-1">{rating}(0)</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Your Booking</h3>
          <div className="text-sm space-y-2">
            <p><strong>Booking Name:</strong> {bookingName}</p>
            <p><strong>Number of Guests:</strong> {guest}</p>
            <p><strong>Check in:</strong> {checkIn} – {checkInTime}</p>
            <p><strong>Check out:</strong> {checkOut} – {checkOutTime}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
          <span className="text-gray-500 line-through text-sm">
            ₹{originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-green-700 font-bold text-xl">
            ₹{discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={agreedToPolicy}
              onChange={(e) => setAgreedToPolicy(e.target.checked)}
              className="form-checkbox mt-1 text-green-600"
            />
            <span className="text-sm">
              Agree to the{' '}
              <button
                className="underline text-green-600 hover:text-green-700"
                onClick={() => setShowPolicy(!showPolicy)}
                type="button"
              >
                House & Cancellation Policy
              </button>
            </span>
          </div>

          {showPolicy && housePolicy && (
            <div
              className="mt-2 p-3 border rounded-lg bg-gray-50 text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: housePolicy }}
            />
          )}
        </div>

        <button
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
          onClick={handlePayNow}
        >
          Pay Now
        </button>
      </div>
    </>
  );
}
