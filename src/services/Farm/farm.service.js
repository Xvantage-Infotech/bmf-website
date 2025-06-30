import { api } from "@/axiosApi";

export const fetchFarms = async (filters = {}) => {
  try {
    const response = await api.post('/api/farms', filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching farms:', error);
    throw error?.response?.data || error;
  }
};



export const fetchFarmById = async (farmId) => {
  try {
    const payload = {
      farm_id: farmId.toString(), // Ensure it's a string
    };
    const response = await api.post('/api/farm_details', payload);
    const farmData = response?.data?.data;

    if (!farmData) {
      throw new Error(`No farm found for ID ${farmId}`);
    }

    return farmData;
  } catch (error) {
    console.error('Error in fetchFarmById:', error);
    throw error;
  }
};
