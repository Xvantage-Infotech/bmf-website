import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const { method = 'GET', data, params, headers } = options;

  return apiClient({
    url: endpoint,
    method,
    data,
    params,
    headers,
  });
}

// Auth API endpoints
export const authAPI = {
  sendOTP: async (phoneNumber) => {
    return fetchAPI('/auth/send-otp', {
      method: 'POST',
      data: { phoneNumber },
    });
  },

  verifyOTP: async (phoneNumber, otp) => {
    return fetchAPI('/auth/verify-otp', {
      method: 'POST',
      data: { phoneNumber, otp },
    });
  },

  signup: async (userData) => {
    return fetchAPI('/auth/signup', {
      method: 'POST',
      data: userData,
    });
  },

  updateProfile: async (userId, profileData) => {
    return fetchAPI('/auth/update-profile', {
      method: 'POST',
      data: { userId, ...profileData },
    });
  },
};

// Farms API endpoints
export const farmsAPI = {
  getAllFarms: async (filters) => {
    return fetchAPI('/farms', {
      params: filters,
    });
  },

  getFarmById: async (farmId) => {
    return fetchAPI(`/farms/${farmId}`);
  },

  searchFarms: async (query) => {
    return fetchAPI(`/farms/search/${query}`);
  },
};

// Bookings API endpoints
export const bookingsAPI = {
  createBooking: async (bookingData) => {
    return fetchAPI('/bookings', {
      method: 'POST',
      data: bookingData,
    });
  },

  getUserBookings: async (userId) => {
    return fetchAPI(`/bookings/user/${userId}`);
  },

  cancelBooking: async (bookingId) => {
    return fetchAPI(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  },
};

// Reviews API endpoints
export const reviewsAPI = {
  getFarmReviews: async (farmId) => {
    return fetchAPI(`/reviews/farm/${farmId}`);
  },

  createReview: async (reviewData) => {
    return fetchAPI('/reviews', {
      method: 'POST',
      data: reviewData,
    });
  },
};

// Export all APIs
export default {
  auth: authAPI,
  farms: farmsAPI,
  bookings: bookingsAPI,
  reviews: reviewsAPI,
};
