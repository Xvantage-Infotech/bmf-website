import { api } from '@/axiosApi';

export const registerUserWithPhone = async (phoneNumber) => {
  const response = await api.post('/api/add_user', { phone_number: phoneNumber });
  return response.data;
};



export const updateUserProfile = async (userData, token) => {
  const formData = new FormData();

  formData.append("name", userData.name);
  formData.append("street", userData.street);
  formData.append("city", userData.city);
  formData.append("date_of_birth", userData.date_of_birth || "");

  if (userData.profile_image instanceof File) {
    formData.append("profile_image", userData.profile_image); // image File
  }

  const response = await api.post('/api/update_user', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

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
