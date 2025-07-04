import { api } from "@/axiosApi";

// Add to wishlist
export const addToWishlist = async (farmId, token) => {
  try {
    const response = await api.post(
      "/api/add_wishlist",
      { farm_id: farmId.toString() },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("❌ [addToWishlist] Error:", error);
    throw error?.response?.data || error;
  }
};