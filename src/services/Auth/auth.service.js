import { api } from '@/axiosApi';

export const registerUserWithPhone = async (phoneNumber) => {
  const response = await api.post('/api/add_user', { phone_number: phoneNumber });
  return response.data;
};



export const updateUserProfile = async (userData, token) => {
  const response = await api.post(
    '/api/update_user',
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const getUserProfile = async (token) => {
  const response = await api.get('/api/get_user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
