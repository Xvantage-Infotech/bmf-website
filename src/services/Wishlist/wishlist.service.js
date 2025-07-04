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

// Fetch user's wishlist (paginated)
export const fetchWishlist = async (page = 1, perPage = 50, token) => {
  try {
    const response = await api.post(
      "/api/wishlist",
      {
        page: page.toString(),
        per_page: perPage.toString(),
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data?.data || []; 
  } catch (error) {
    console.error("❌ [fetchWishlist] Error:", error);
    throw error?.response?.data || error;
  }
};
