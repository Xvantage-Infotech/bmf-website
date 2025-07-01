import { api } from "@/axiosApi";

export const fetchFarms = async (filters = {}) => {
  try {
    // Compose the request body exactly as your backend expects:
    const payload = {
      city_id: "",
      no_of_guest: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      min_price: "",
      max_price: "",
      category_id: "",
      farm_id: "",
      sort_by: "",
      page: "1",
      per_page: "50", // or any number you prefer
      ...filters, // this allows you to override fields if needed
    };

    const response = await api.post("/api/farms", payload);

    return response.data;
  } catch (error) {
    console.error("Error fetching farms:", error);
    throw error?.response?.data || error;
  }
};

export const fetchFarmById = async (farmId) => {
  try {
    const payload = {
      farm_id: farmId.toString(), // Ensure it's a string
    };
    const response = await api.post("/api/farm_details", payload);
    const farmData = response?.data?.data;

    if (!farmData) {
      throw new Error(`No farm found for ID ${farmId}`);
    }

    return farmData;
  } catch (error) {
    console.error("Error in fetchFarmById:", error);
    throw error;
  }
};
