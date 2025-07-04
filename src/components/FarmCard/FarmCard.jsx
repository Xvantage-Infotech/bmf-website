"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Bed, Users, Star, MapPin } from "lucide-react";
import { formatPrice, generateStars } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addToWishlist } from "@/services/Wishlist/wishlist.service";

export default function FarmCard({
  farm,
  className = "",
  isFavorited: isFavoriteProp = false,
}) {
  const [isFavorited, setIsFavorited] = useState(isFavoriteProp);
  const [imageIndex, setImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  

  const intervalRef = useRef(null);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const images = farm.farm_images || [];
  const mainImage =
    images.length > 0
      ? `https://api.bookmyfarm.net/assets/images/farm_images/${images[0].image}`
      : "/placeholder.jpg";

  const handleClick = (e) => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    sessionStorage.setItem("farmScrollPosition", scrollPosition.toString());
    sessionStorage.setItem("farmScrollHeight", scrollHeight.toString());

    e.currentTarget.classList.add("last-clicked-farm");
  };

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [isHovered, images.length]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.token) {
      return alert("Please login to add to wishlist");
    }

    try {
      await addToWishlist(farm.id, user.token);
      setIsFavorited(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const rating = parseFloat(farm.rating);

  return (
    <Link
      href={`/farm/${farm.id}`}
      scroll={false}
      onClick={handleClick}
      className="block"
    >
      <div
        className={`farm-card animate-card-hover cursor-pointer ${className}`}
      >
        <div className="relative">
          <div
            className="relative h-48 w-full bg-neutral-200 overflow-hidden rounded-t-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setImageIndex(0);
            }}
          >
            {images.length > 0 ? (
              images.map((img, idx) => (
                <img
                  key={idx}
                  src={`https://api.bookmyfarm.net/assets/images/farm_images/${img.image}`}
                  alt={`${farm.name} - Image ${idx + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
                    idx === imageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  loading="lazy"
                />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                <span>No Image</span>
              </div>
            )}

            {/* Heart icon */}
            {isAuthenticated && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white z-20"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-neutral-600"
                  }`}
                />
              </Button>
            )}

            {/* Category badge */}
            <div className="absolute bottom-3 left-3 z-20">
              <span className="bg-white/90 backdrop-blur-sm text-neutral-700 px-2 py-1 rounded text-xs font-medium capitalize">
                {farm.category?.name || "Farm"}
              </span>
            </div>
          </div>

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={toggleFavorite}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? "fill-red-500 text-red-500" : "text-neutral-600"
              }`}
            />
          </Button>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-neutral-700 px-2 py-1 rounded text-xs font-medium capitalize">
              {farm.category?.name || "Farm"}
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* Farm Name and Location */}
          <h3 className="font-semibold text-lg mb-1 text-neutral-900 truncate">
            {farm.farm_alias_name || farm.name}
          </h3>
          <p className="text-neutral-600 text-sm mb-3 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {farm.area?.name}
          </p>

          {/* Amenities */}
          <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
            <span className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {farm.bedrooms} Bedroom{farm.bedrooms !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {farm.person_limit} Guest{farm.person_limit !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <div className="flex mr-2">{generateStars(rating)}</div>
              <span className="text-neutral-600">
                {farm.reviews_avg_star} ({farm.reviews_count} review
                {farm.reviews_count !== 1 ? "s" : ""})
              </span>
            </div>
          </div>

          {/* Price and discount */}
          {(() => {
            const price = parseFloat(farm.final_price) || 0;
            const percent = parseFloat(farm.increase_percentage) || 0;
            const increase = Math.round((price * percent) / 100);
            const originalPrice = price + increase;

            return (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {percent > 0 && (
                    <span className="text-base line-through text-[#737373] font-normal">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-black">
                    {formatPrice(price)}
                  </span>
                </div>

                {percent > 0 && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 border border-yellow-300 border-dashed rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.83 0l7-7a2 2 0 0 0-.01-2.83ZM7.5 7A1.5 1.5 0 1 1 9 5.5 1.5 1.5 0 0 1 7.5 7Z" />
                    </svg>
                    {percent}% off
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </Link>
  );
}
