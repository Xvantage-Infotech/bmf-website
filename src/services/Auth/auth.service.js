import { api } from '@/axiosApi';

export const registerUserWithPhone = async (phoneNumber) => {
  const response = await api.post('/api/add_user', { phone_number: phoneNumber });
  return response.data;
};
