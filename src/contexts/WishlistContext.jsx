import { addToWishlist, fetchWishlist } from "@/services/Wishlist/wishlist.service";
import { useAuth } from "./AuthContext";
import { createContext, useState } from "react";

// contexts/WishlistContext.tsx
export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);

  const fetchWishlistIds = async () => {
    if (!user?.token) return;
    const data = await fetchWishlist(1, 50, user.token);
    setWishlistIds(data.map(f => f.id));
  };

  useEffect(() => {
    fetchWishlistIds();
  }, [user]);

  const toggleWishlist = async (farmId) => {
    if (!user?.token) return;
    await addToWishlist(farmId, user.token);
    setWishlistIds((prev) =>
      prev.includes(farmId)
        ? prev.filter((id) => id !== farmId)
        : [...prev, farmId]
    );
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
