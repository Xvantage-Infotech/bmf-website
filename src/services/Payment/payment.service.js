import { api } from '@/axiosApi';

export const createRazorpayOrder = async ({ farmId, amount }) => {
  const accessToken = localStorage.getItem('accessToken'); // or use your auth context if needed

  const response = await api.post(
    'https://api.bookmyfarm.net/api/create_order',
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



