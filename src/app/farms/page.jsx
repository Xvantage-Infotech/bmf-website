"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchFarms } from "@/services/Farm/farm.service";
import { CITY_IDS } from "@/constants/categories";
import CategoryTabs from "@/components/Search/CategoryTabs";
import PropertyCategoryTabs from "@/components/common/PropertyCategoryTabs";
import FarmList from "@/components/FarmList/FarmList";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";

// Skeleton element
const Skeleton = ({ className = "" }) => (
  <div className={`bg-neutral-200 animate-pulse ${className}`} />
);

// Smaller size skeleton card
const FarmCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden shadow bg-white animate-card-hover cursor-pointer">
    <div className="relative">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="absolute top-2 right-2 w-6 h-6 rounded-full" />
      <Skeleton className="absolute bottom-2 left-2 h-5 w-16 rounded" />
    </div>
    <div className="p-3">
      <Skeleton className="h-5 w-2/3 mb-1 rounded" />
      <Skeleton className="h-3 w-1/2 mb-3 rounded" />
      <div className="flex justify-between mb-2">
        <Skeleton className="h-3 w-1/4 rounded" />
        <Skeleton className="h-3 w-1/4 rounded" />
      </div>
      <div className="flex justify-between mt-2">
        <Skeleton className="h-5 w-1/3 rounded" />
        <Skeleton className="h-5 w-1/4 rounded" />
      </div>
    </div>
  </div>
);

export default function AllFarmsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCity = searchParams.get("city") || "all";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllFarms = async () => {
      try {
        setIsLoading(true);
        const filters = {
          city_id:
            selectedCity !== "all" ? CITY_IDS[selectedCity.toLowerCase()] : "",
          category_id:
            selectedCategory !== "all" ? parseInt(selectedCategory) : "",
        };
        const res = await fetchFarms(filters);
        setFarms(res?.data || []);
      } catch (err) {
        console.error("Failed to load farms", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFarms();
  }, [selectedCity, selectedCategory]);

  const handleCityChange = (city) => {
    const params = new URLSearchParams(searchParams);

    if (city === "reset" || city === "all") {
      params.delete("city");
    } else {
      params.set("city", city);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <PublicPageLayout>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <h1 className="text-4xl font-bold mb-6 text-center">
            All Farmhouse Listings
          </h1>

          <PropertyCategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="mt-8">
            <CategoryTabs
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
            />
          </div>

          <div className="mt-10">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <FarmCardSkeleton key={idx} />
                ))}
              </div>
            ) : (
              <FarmList
                selectedCity={selectedCity}
                selectedCategory={selectedCategory}
                farms={farms}
                searchFilters={{
                  city_id:
                    selectedCity !== "all"
                      ? CITY_IDS[selectedCity.toLowerCase()]
                      : "",
                  category_id:
                    selectedCategory !== "all"
                      ? parseInt(selectedCategory)
                      : "",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
