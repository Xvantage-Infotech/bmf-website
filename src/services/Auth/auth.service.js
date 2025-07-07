import { api } from '@/axiosApi';

export const registerUserWithPhone = async (phoneNumber) => {
  const response = await api.post('/api/add_user', { phone_number: phoneNumber });
  return response.data;
};



// export const updateUserProfile = async (userData, token) => {
//   const formData = new FormData();

//   formData.append("name", userData.name);
//     formData.append("email", userData.email);
//   formData.append("street", userData.street);
//   formData.append("city", userData.city);
//   formData.append("date_of_birth", userData.date_of_birth || null);


//   if (userData.profile_image instanceof File) {
//     formData.append("profile_image", userData.profile_image); // image File
//   }

//   const response = await api.post('/api/update_user', formData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'multipart/form-data',
//     },
//   });

//   return response.data;
// };

export const updateUserProfile = async (userData, token) => {
  try {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("street", userData.street);
    formData.append("city", userData.city);

    // Use null instead of empty string for DOB
    formData.append("date_of_birth", userData.date_of_birth || null);

    if (userData.profile_image instanceof File) {
      formData.append("profile_image", userData.profile_image);
    }

    const response = await api.post('/api/update_user', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
    throw error;
  }
};


export const getUserProfile = async (token) => {
  const response = await api.get('/api/get_user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const loginOrRegisterUser = async (phone_number) => {
  try {
    const response = await api.post("/api/add_user", {
      phone_number,
    });

    return response.data;
  } catch (error) {
    console.error("❌ API loginOrRegisterUser failed:", error);
    throw error;
  }
};
