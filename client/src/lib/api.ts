// API service for making requests to the backend
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
async function fetchAPI(endpoint: string, options: any = {}) {
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
  // Send OTP to phone number
  sendOTP: async (phoneNumber: string) => {
    return fetchAPI('/auth/send-otp', {
      method: 'POST',
      data: { phoneNumber },
    });
  },

  // Verify OTP and login/signup
  verifyOTP: async (phoneNumber: string, otp: string) => {
    return fetchAPI('/auth/verify-otp', {
      method: 'POST',
      data: { phoneNumber, otp },
    });
  },

  // Create a new user account
  signup: async (userData: { name: string, mobileNumber: string, email?: string }) => {
    return fetchAPI('/auth/signup', {
      method: 'POST',
      data: userData,
    });
  },

  // Update user profile
  updateProfile: async (userId: number, profileData: any) => {
    return fetchAPI(`/auth/update-profile`, {
      method: 'POST',
      data: { userId, ...profileData },
    });
  },
};

// Farms API endpoints
export const farmsAPI = {
  // Get all farms
  getAllFarms: async (filters?: { category?: string, minPrice?: number, maxPrice?: number, location?: string }) => {
    return fetchAPI('/farms', {
      params: filters
    });
  },

  // Get farm by ID
  getFarmById: async (farmId: number) => {
    return fetchAPI(`/farms/${farmId}`);
  },

  // Search farms by query
  searchFarms: async (query: string) => {
    return fetchAPI(`/farms/search/${query}`);
  },
};

// Bookings API endpoints
export const bookingsAPI = {
  // Create a new booking
  createBooking: async (bookingData: any) => {
    return fetchAPI('/bookings', {
      method: 'POST',
      data: bookingData,
    });
  },

  // Get user bookings
  getUserBookings: async (userId: number) => {
    return fetchAPI(`/bookings/user/${userId}`);
  },

  // Cancel booking
  cancelBooking: async (bookingId: number) => {
    return fetchAPI(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  },
};

// Reviews API endpoints
export const reviewsAPI = {
  // Get reviews for a farm
  getFarmReviews: async (farmId: number) => {
    return fetchAPI(`/reviews/farm/${farmId}`);
  },

  // Create a review
  createReview: async (reviewData: { farmId: number, userId: number, rating: number, comment?: string }) => {
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