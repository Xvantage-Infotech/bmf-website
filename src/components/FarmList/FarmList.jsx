// "use client";
// import { useState, useMemo } from 'react';
// import { staticFarms } from '@/data/staticFarms';
// import FarmCard from '@/components/FarmCard/FarmCard';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { SlidersHorizontal } from 'lucide-react';

// export default function FarmList({
//   selectedCity,
//   selectedCategory,
//   searchQuery = '',
//   title = 'Featured Farmhouses',
//   description = 'Discover premium properties for your perfect getaway'
// }) {
//   const [sortBy, setSortBy] = useState('featured');
//   const [showFilters, setShowFilters] = useState(false);

//   const filteredAndSortedFarms = useMemo(() => {
//     let farms = [...staticFarms];

//     // Filter by city
//     if (selectedCity && selectedCity !== 'all') {
//       farms = farms.filter(farm => farm.city.toLowerCase() === selectedCity.toLowerCase());
//     }

//     // Filter by category
//     if (selectedCategory && selectedCategory !== 'all') {
//       const categoryMapping = {
//         farms: 'rustic',
//         villas: 'luxury',
//         resorts: 'modern',
//       };
//       const mappedCategory = categoryMapping[selectedCategory] || selectedCategory;
//       farms = farms.filter(farm => farm.category.toLowerCase() === mappedCategory.toLowerCase());
//     }

//     // Filter by search
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       farms = farms.filter(farm =>
//         farm.name.toLowerCase().includes(query) ||
//         farm.location.toLowerCase().includes(query) ||
//         farm.city.toLowerCase().includes(query) ||
//         farm.description.toLowerCase().includes(query)
//       );
//     }

//     // Sort logic
//     switch (sortBy) {
//       case 'price-low':
//         farms.sort((a, b) => parseFloat(a.pricePerNight) - parseFloat(b.pricePerNight));
//         break;
//       case 'price-high':
//         farms.sort((a, b) => parseFloat(b.pricePerNight) - parseFloat(a.pricePerNight));
//         break;
//       case 'rating':
//         farms.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
//         break;
//       default:
//         // featured - do nothing
//         break;
//     }

//     return farms;
//   }, [selectedCity, selectedCategory, searchQuery, sortBy]);

//   const sortOptions = [
//     { value: 'featured', label: 'Featured' },
//     { value: 'price-low', label: 'Price: Low to High' },
//     { value: 'price-high', label: 'Price: High to Low' },
//     { value: 'rating', label: 'Guest Rating' },
//   ];

//   return (
//     <section className="section-padding bg-white">
//       <div className="max-w-7xl mx-auto container-padding">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-neutral-900 mb-2">{title}</h2>
//             <p className="text-neutral-600">{description}</p>
//             {filteredAndSortedFarms.length > 0 && (
//               <p className="text-sm text-neutral-500 mt-1">
//                 Showing {filteredAndSortedFarms.length} result{filteredAndSortedFarms.length !== 1 ? 's' : ''}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center space-x-4">
//             <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
//               <SelectTrigger className="w-48">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 {sortOptions.map(option => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Uncomment to show filters */}
//             {/*
//             <Button
//               variant="outline"
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center space-x-2"
//             >
//               <SlidersHorizontal className="w-4 h-4" />
//               <span>Filters</span>
//             </Button>
//             */}
//           </div>
//         </div>

//         {/* Farms Grid */}
//         {filteredAndSortedFarms.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredAndSortedFarms.map(farm => (
//               <FarmCard key={farm.id} farm={farm} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
//                 <SlidersHorizontal className="w-8 h-8 text-neutral-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-neutral-900 mb-2">No farms found</h3>
//               <p className="text-neutral-600 mb-6">
//                 Try adjusting your search criteria or explore different locations.
//               </p>
//               <Button onClick={() => window.location.reload()}>
//                 Clear Filters
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Load More Button */}
//         {filteredAndSortedFarms.length >= 8 && (
//           <div className="text-center mt-12">
//             <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
//               Load More Farms
//             </Button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// "use client";

// import { useState, useMemo } from 'react';
// import { staticFarms } from '@/data/staticFarms';
// import FarmCard from '@/components/FarmCard/FarmCard';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// export default function FarmList({
//   selectedCity,
//   selectedCategory,
//   searchFilters = {},
//   title = 'Featured Farmhouses',
//   description = 'Discover premium properties for your perfect getaway',
// }) {
//   const [sortBy, setSortBy] = useState('featured');

//   const filteredAndSortedFarms = useMemo(() => {
//     let farms = [...staticFarms];
//     const filters = searchFilters || {};

//     // City filter
//     if (selectedCity && selectedCity !== 'all') {
//       farms = farms.filter(
//         (farm) => farm.city.toLowerCase() === selectedCity.toLowerCase()
//       );
//     }

//     // Category filter
//     if (selectedCategory && selectedCategory !== 'all') {
//       const categoryMapping = {
//         farms: 'rustic',
//         villas: 'luxury',
//         resorts: 'modern',
//       };
//       const mapped = categoryMapping[selectedCategory] || selectedCategory;
//       farms = farms.filter(
//         (farm) => farm.category.toLowerCase() === mapped.toLowerCase()
//       );
//     }

//     // Search filter (location or name)
//     if (filters.location?.trim()) {
//       const query = filters.location.toLowerCase();
//       farms = farms.filter(
//         (farm) =>
//           farm.name.toLowerCase().includes(query) ||
//           farm.location.toLowerCase().includes(query) ||
//           farm.city.toLowerCase().includes(query) ||
//           farm.description.toLowerCase().includes(query)
//       );
//     }

//     // Guests filter
//     if (filters.guests) {
//       farms = farms.filter((farm) => farm.maxGuests >= filters.guests);
//     }

//     // Optional: Date filter
//     if (filters.checkIn && filters.checkOut) {
//       const checkIn = new Date(filters.checkIn);
//       const checkOut = new Date(filters.checkOut);

//       farms = farms.filter((farm) => {
//         if (!farm.availableFrom || !farm.availableTo) return true;
//         const from = new Date(farm.availableFrom);
//         const to = new Date(farm.availableTo);
//         return checkIn >= from && checkOut <= to;
//       });
//     }

//     // Sort logic
//     switch (sortBy) {
//       case 'price-low':
//         farms.sort((a, b) => parseFloat(a.pricePerNight) - parseFloat(b.pricePerNight));
//         break;
//       case 'price-high':
//         farms.sort((a, b) => parseFloat(b.pricePerNight) - parseFloat(a.pricePerNight));
//         break;
//       case 'rating':
//         farms.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
//         break;
//     }

//     return farms;
//   }, [selectedCity, selectedCategory, searchFilters, sortBy]);

//   const sortOptions = [
//     { value: 'featured', label: 'Featured' },
//     { value: 'price-low', label: 'Price: Low to High' },
//     { value: 'price-high', label: 'Price: High to Low' },
//     { value: 'rating', label: 'Guest Rating' },
//   ];

//   return (
//     <section id="farm-list" className="section-padding bg-white">
//       <div className="max-w-7xl mx-auto container-padding">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-neutral-900 mb-2">
//               {title}
//             </h2>
//             <p className="text-neutral-600">{description}</p>
//             {filteredAndSortedFarms.length > 0 && (
//               <p className="text-sm text-neutral-500 mt-1">
//                 Showing {filteredAndSortedFarms.length} result
//                 {filteredAndSortedFarms.length !== 1 ? 's' : ''}
//               </p>
//             )}
//           </div>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-48">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               {sortOptions.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Grid */}
//         {filteredAndSortedFarms.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredAndSortedFarms.map((farm) => (
//               <FarmCard key={farm.id} farm={farm} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <h3 className="text-xl font-semibold text-neutral-900 mb-2">
//               No farms found
//             </h3>
//             <p className="text-neutral-600 mb-6">
//               Try changing your search filters or explore other options.
//             </p>
//             <Button onClick={() => window.location.reload()}>
//               Clear Filters
//             </Button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { fetchWishlist } from "@/services/Wishlist/wishlist.service";

import FarmCard from "@/components/FarmCard/FarmCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchFarms } from "@/services/Farm/farm.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

export default function FarmList({
  selectedCity,
  selectedCategory,
  searchFilters = {},
  title = "Featured Farmhouses",
  description = "Discover premium properties for your perfect getaway",
  farms: externalFarms = null,
}) {
  const [sortBy, setSortBy] = useState("featured");
  const [farms, setFarms] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const isSearchMode = externalFarms !== null;
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [restored, setRestored] = useState(false);
  const scrollPositionRef = useRef(0);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user?.token) return;

      try {
        const wishlist = await fetchWishlist(1, 50, user.token); // adjust page size as needed
        const ids = wishlist.map((f) => f.id);
        setWishlistIds(ids);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    loadWishlist();
  }, [user]);

  const getFarms = async (append = false) => {
    if (isSearchMode) return;
    try {
      setLoading(true);
      const payload = {
        city: selectedCity !== "all" ? selectedCity : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        sort_by: "",
        page: page.toString(),
        per_page: "12",
        ...searchFilters,
      };
      const data = await fetchFarms(payload);
      const newFarms = data?.data || [];

      setFarms((prev) => (append ? [...prev, ...newFarms] : newFarms));
      setHasMore(newFarms.length === 12);
    } catch (err) {
      console.error("Error fetching farms:", err);
    } finally {
      setLoading(false);
    }
  };

  // On city/category/search/externalFarms change, reset page to 1 and farms to []
  useEffect(() => {
    setPage(1);
    setFarms([]);
    setHasMore(true);
    setRestored(false); 
    if (isSearchMode) {
      setFarms(externalFarms || []);
      setHasMore(false);
    }
  }, [
    selectedCity,
    selectedCategory,
    JSON.stringify(searchFilters),
    externalFarms,
  ]);

  useEffect(() => {
    if (isSearchMode) return;
    getFarms(page > 1); // append=true if page > 1
  }, [page, isSearchMode, externalFarms]);

  const sortedFarms = [...farms].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.final_price) - parseFloat(b.final_price);
      case "price-high":
        return parseFloat(b.final_price) - parseFloat(a.final_price);
      case "rating":
        return (
          parseFloat(b.reviews_avg_star || 0) -
          parseFloat(a.reviews_avg_star || 0)
        );
      default:
        return 0;
    }
  });

  useEffect(() => {
    setRestored(false); // allow scroll restoration after city/category/search changes
  }, [selectedCity, selectedCategory, JSON.stringify(searchFilters)]);

  // Add this effect to restore scroll position
  useEffect(() => {
    // Only restore scroll if coming back from a farm detail (i.e., the session value exists)
    const savedPosition = sessionStorage.getItem("farmScrollPosition");
    if (
      page === 1 &&
      !restored &&
      farms.length > 0 &&
      savedPosition !== null // <-- Only if this is present!
    ) {
      window.scrollTo({
        top: parseInt(savedPosition, 10),
        behavior: "auto",
      });

      const lastCard = document.querySelector(".last-clicked-farm");
      if (lastCard) {
        lastCard.scrollIntoView({ block: "nearest", behavior: "auto" });
        lastCard.classList.remove("last-clicked-farm");
      }

      sessionStorage.removeItem("farmScrollPosition");
      setRestored(true);
    }
  }, [page, farms.length, restored]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Guest Rating" },
  ];

  // Skeleton loader component that matches FarmCard structure
  const FarmCardSkeleton = () => (
    <div className="farm-card animate-card-hover cursor-pointer">
      <div className="relative">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <Skeleton className="absolute top-3 right-3 w-8 h-8 rounded-full" />
        <Skeleton className="absolute bottom-3 left-3 h-6 w-20 rounded" />
      </div>
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-4 w-1/3 mb-2" />
        <div className="flex justify-between mt-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
    </div>
  );

  return (
    <section id="farm-list" className="section-padding bg-white pt-6 mt-6">
      <div className="max-w-7xl mx-auto container-padding px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              {title}
            </h2>
            <p className="text-neutral-600">{description}</p>
            {!loading && sortedFarms.length > 0 && (
              <p className="text-sm text-neutral-500 mt-1">
                {/* {sortedFarms.length} result{sortedFarms.length !== 1 ? 's' : ''} */}
              </p>
            )}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!loading && sortedFarms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedFarms.map((farm) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  isFavorited={wishlistIds.includes(farm.id)}
                  onToggleFavorite={() => {
                    setWishlistIds((prev) =>
                      prev.filter((id) => id !== farm.id)
                    );
                  }}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button onClick={() => setPage((prev) => prev + 1)}>
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <FarmCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No farms found
            </h3>
            <p className="text-neutral-600 mb-6">
              Try changing your search filters or explore other options.
            </p>
            <Button onClick={() => window.location.reload()}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
