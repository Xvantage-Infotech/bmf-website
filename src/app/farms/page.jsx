// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { fetchFarms } from "@/services/Farm/farm.service";
// import { CITY_IDS } from "@/constants/categories";
// import CategoryTabs from "@/components/Search/CategoryTabs";
// import PropertyCategoryTabs from "@/components/common/PropertyCategoryTabs";
// import FarmList from "@/components/FarmList/FarmList";
// import PublicPageLayout from "@/components/Layout/PublicPageLayout";

// const Skeleton = ({ className = "" }) => (
//   <div className={`bg-neutral-200 rounded-md animate-pulse ${className}`} />
// );

// const FarmCardSkeleton = () => (
//   <div className="rounded-xl overflow-hidden shadow bg-white animate-card-hover cursor-pointer transition-transform hover:scale-[1.02]">
//     <div className="relative">
//       <Skeleton className="h-40 w-full" />
//       <Skeleton className="absolute top-2 right-2 w-6 h-6 rounded-full" />
//       <Skeleton className="absolute bottom-2 left-2 h-5 w-16 rounded" />
//     </div>
//     <div className="p-3">
//       <Skeleton className="h-5 w-2/3 mb-1" />
//       <Skeleton className="h-3 w-1/2 mb-3" />
//       <div className="flex justify-between mb-2">
//         <Skeleton className="h-3 w-1/4" />
//         <Skeleton className="h-3 w-1/4" />
//       </div>
//       <div className="flex justify-between mt-2">
//         <Skeleton className="h-5 w-1/3" />
//         <Skeleton className="h-5 w-1/4" />
//       </div>
//     </div>
//   </div>
// );

// export default function AllFarmsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const selectedCity = searchParams.get("city") || "all";
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [farms, setFarms] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchAllFarms = async () => {
//       try {
//         setIsLoading(true);
//         const filters = {
//           city_id:
//             selectedCity !== "all" ? CITY_IDS[selectedCity.toLowerCase()] : "",
//           category_id:
//             selectedCategory !== "all" ? parseInt(selectedCategory) : "",
//         };
//         const res = await fetchFarms(filters);
//         setFarms(res?.data || []);
//       } catch (err) {
//         console.error("Failed to load farms", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAllFarms();
//   }, [selectedCity, selectedCategory]);

//   const handleCityChange = (city) => {
//     const params = new URLSearchParams(searchParams);
//     if (city === "reset" || city === "all") {
//       params.delete("city");
//     } else {
//       params.set("city", city);
//     }
//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   return (
//     <PublicPageLayout>
//       <div className="min-h-screen py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
//             All Farmhouse Listings
//           </h1> */}

//           {/* Filter Tabs */}
//           {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//             <PropertyCategoryTabs
//               selectedCategory={selectedCategory}
//               onCategoryChange={setSelectedCategory}
//             />
//             <CategoryTabs
//               selectedCity={selectedCity}
//               onCityChange={handleCityChange}
//             />
//           </div> */}

//           {/* Farm Grid or Skeletons */}
//           <div className="mt-6">
//             {isLoading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {Array.from({ length: 8 }).map((_, idx) => (
//                   <FarmCardSkeleton key={idx} />
//                 ))}
//               </div>
//             ) : (
//               <FarmList
//                 selectedCity={selectedCity}
//                 selectedCategory={selectedCategory}
//                 farms={farms}
//                 searchFilters={{
//                   city_id:
//                     selectedCity !== "all"
//                       ? CITY_IDS[selectedCity.toLowerCase()]
//                       : "",
//                   category_id:
//                     selectedCategory !== "all"
//                       ? parseInt(selectedCategory)
//                       : "",
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </PublicPageLayout>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchFarms } from "@/services/Farm/farm.service";
import { CITY_IDS } from "@/constants/categories";
import FarmList from "@/components/FarmList/FarmList";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";

export default function AllFarmsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCity = searchParams.get("city") || "all";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set loading initially to true

  useEffect(() => {
    const fetchAllFarms = async () => {
      try {
        setIsLoading(true); // Start loading
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
        setIsLoading(false); // End loading once data is fetched
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <img
          src="/bmflogofoot.svg"
          alt="Book My Farm Logo"
          loading="eager"
          style={{ width: "350px", height: "350px" }}
          className="mb-4"
        />
        <p className="text-neutral-500 text-sm animate-pulse">
          Loading farms...
        </p>
      </div>
    );
  }

  return (
    <PublicPageLayout>
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 mt-0">
      {/* Removed vertical padding and top margin */}
      <div className="mt-0">
        {/* Reduced top margin */}
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
              selectedCategory !== "all" ? parseInt(selectedCategory) : "",
          }}
        />
      </div>
    </div>
  </div>
</PublicPageLayout>

  );
}
