"use client";

import { useEffect, useState } from "react";
import ClientOnly from "@/components/Clientonly/ClientOnly";
import FarmCard from "@/components/FarmCard/FarmCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWishlist } from "@/services/Wishlist/wishlist.service";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";
import Cookies from "js-cookie";
import { getUserProfile } from "@/services/Auth/auth.service";
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";

export default function SavedFarms() {
  const { user, updateUser, authInitialized, userLoading, isAuthenticated } =
    useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const router = useRouter();

  const token = Cookies.get("access_token");

  // ✅ 1. Hydrate user from cookie
  useEffect(() => {
    if (authInitialized && token && !user && !isAuthenticated) {
      getUserProfile(token)
        .then((res) => {
          if (res?.data) {
            updateUser({ ...res.data, token });
          }
        })
        .catch((err) => {
          console.error("🔥 Failed to hydrate user on /saved:", err);
          Cookies.remove("access_token");
        });
    }
  }, [authInitialized, token, user, isAuthenticated, updateUser]);

  // ✅ 2. Show login modal if not authenticated
  const shouldShowModal =
    authInitialized &&
    !authModalOpen &&
    !isAuthenticated &&
    !userLoading &&
    !token;

  useEffect(() => {
    if (shouldShowModal && !modalDismissed) {
      setAuthModalOpen(true);
    }
  }, [shouldShowModal, modalDismissed]);

  useEffect(() => {
    if (shouldShowModal && modalDismissed) {
      router.push("/");
    }
  }, [shouldShowModal, modalDismissed]);

  // ✅ 3. Fetch wishlist
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
    window.scrollTo(0, 0);
  }, []);

  if (!authInitialized) return null;
  if (!isAuthenticated && !authModalOpen) return null;

  return (
    <PublicPageLayout>
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
            <h1 className="text-2xl font-bold mb-6 text-center">Favorite Farms</h1>

            {wishlist.length === 0 ? (
              <div className="text-center text-neutral-600 mt-20">
                <p className="mb-2">You haven't saved any farms yet.</p>
                <p>
                  Tap the{" "}
                  <span className="inline-block align-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 inline text-red-500"
                    >
                      <path
                        d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                          4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 
                          3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                          3.78-3.4 6.86-8.55 11.54L12.1 21.35z"
                      />
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
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setModalDismissed(true);
          }}
        />
      </ClientOnly>
    </PublicPageLayout>
  );
}
