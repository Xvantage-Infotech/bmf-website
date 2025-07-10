"use client";

import { useEffect, useState } from "react";
import ClientOnly from "@/components/Clientonly/ClientOnly";
import FarmCard from "@/components/FarmCard/FarmCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWishlist } from "@/services/Wishlist/wishlist.service";

export default function SavedFarms() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user?.token) return;

      try {
        const farms = await fetchWishlist(1, 20, user.token);
        setWishlist(farms);
      } catch (err) {
        console.error("❌ Error loading wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  useEffect(() => {
  window.scrollTo(0, 0); // Instant jump to top, no animation
}, []);


  return (
    <ClientOnly>
      {loading ? (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
          <img
            src="/bmflogofoot.svg"
            alt="Book My Farm Logo"
            className="w-40 h-40 md:w-60 md:h-60 animate-pulse mb-6"
          />
          <p className="text-neutral-500 text-sm animate-pulse">
            Loading your saved farms...
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto py-10 px-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Saved Farms</h1>

          {wishlist.length === 0 ? (
            <div className="text-center text-neutral-600 mt-20">
              <p className="mb-2">You haven't saved any farms yet.</p>
              <p>
                Tap the{" "}
                <span className="inline-block align-middle">
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="inline text-red-500"
                  >
                    <path d="M12.76 3.64a4.13 4.13 0 0 0-5.52 0A4.13 4.13 0 0 0 2.5 8.09c0 1.13.45 2.21 1.26 3.02l5.24 5.24c.2.2.51.2.71 0l5.24-5.24A4.27 4.27 0 0 0 17.5 8.1a4.13 4.13 0 0 0-1.26-2.95z" />
                  </svg>
                </span>{" "}
                icon on a farm to add it to your favorites!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wishlist.map((farm) => (
                <FarmCard key={farm.id} farm={farm} isFavorited={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </ClientOnly>
  );
}
