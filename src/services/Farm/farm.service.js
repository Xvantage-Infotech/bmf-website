import { api } from "@/axiosApi";

export const fetchFarms = async (filters = {}) => {
  try {
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
      per_page: "100",
      ...filters,
    };

    // console.log("🔵 [fetchFarms] Sending payload:", payload);

    const response = await api.post("/api/farms", payload);

    // console.log("🟢 [fetchFarms] Raw response:", response);
    // console.log("🟢 [fetchFarms] response.data:", response.data);

    return response.data;
  } catch (error) {
    console.error("🔴 [fetchFarms] Error fetching farms:", error);
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

export const checkBookingAvailability = async (payload, token) => {
  const response = await api.post("/api/check_booking", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // expected to return { available: true/false }
};

export const fetchPropertyCategories = async () => {
  try {
    const response = await api.get("/api/category");
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching property categories:", error);
    throw error;
  }
};

export const fetchRulesAndPolicies = async (token) => {
  try {
    const response = await api.get("/api/rules-policies", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response?.data;
    return {
      rules: data?.rules_and_policies || [],
      cancellation: data?.cancellation_policy || [],
      commission: data?.commission_policy || [],
    };
  } catch (error) {
    console.error("Error fetching rules and policies:", error);
    throw error;
  }
};

export const fetchCities = async () => {
  try {
    const response = await api.get("/api/city");
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

export const fetchAreas = async () => {
  try {
    const response = await api.get("/api/areas");
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
};

export const fetchFarmList = async (token) => {
  try {
    const response = await api.post(
      "/api/list_farm",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization token in the header
        },
      }
    );

    // Returning the farm data
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching farm list:", error);
    throw error?.response?.data || error;
  }
};

