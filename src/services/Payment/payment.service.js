import { api } from '@/axiosApi';
import { getAccessToken } from '@/hooks/cookies';

export const createRazorpayOrder = async ({ farmId, amount }) => {
  const accessToken = getAccessToken();// or use your auth context if needed

  const response = await api.post(
    '/api/create_order',
    {
      farm_id: farmId,
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency: 'INR',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};


export const verifyPaymentSignature = async ({ payment_id, order_id, signature }) => {
  const accessToken = getAccessToken();

  const response = await api.post(
    '/api/verify_signature',
    { payment_id, order_id, signature },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const updatePaymentStatus = async ({ order_id, status }) => {
  const accessToken = getAccessToken();

  const response = await api.post(
    '/api/payment_status',
    { order_id, status }, // status = "Cancel" or "Fail"
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

