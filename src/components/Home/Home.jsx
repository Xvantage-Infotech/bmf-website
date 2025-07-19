"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart, Shield } from "lucide-react";
import { getFeaturedFarms } from "@/data/staticFarms";
import { FARM_IMAGE_BASE_URL, formatPrice } from "@/lib/utils";
import SearchFilters from "@/components/Search/SearchFilters";
import SearchResultsPanel from "@/components/Search/SearchResultsPanel";
import CategoryTabs from "@/components/Search/CategoryTabs";
import PropertyCategoryTabs from "@/components/common/PropertyCategoryTabs";
import VideoGallery from "@/components/VideoGallery/VideoGallery";
import FarmList from "@/components/FarmList/FarmList";
import CustomerReviews from "@/components/Reviews/CustomerReviews";
import { CITY_IDS } from "@/constants/categories";
import { fetchFarms } from "@/services/Farm/farm.service";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  MoreVertical,
  MoreHorizontal,
  Facebook,
  Instagram,
} from "lucide-react";
import PublicPageLayout from "../Layout/PublicPageLayout";

export default function Homes() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [selectedCity, setSelectedCity] = useState("all");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchFilters, setSearchFilters] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [farms, setFarms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [featuredFarms, setFeaturedFarms] = useState([]);
  const [open, setOpen] = useState(false);

  const selectedCity = searchParams.get("city") || "all";

  const scrollToFarmList = () => {
    const section = document.getElementById("farm-list");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCityChange = (city) => {
    const params = new URLSearchParams(searchParams);
    if (city === "all") {
      params.delete("city");
    } else {
      params.set("city", city);
    }

    // ✅ Reset search mode when user manually changes city
    setIsSearchMode(false);
    setSearchFilters(null);
    setFarms([]); // optional: forces fresh fetch if needed

    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const loadTop3Farms = async () => {
      try {
        const res = await fetchFarms({
          page: "1",
          per_page: "3", // ✅ Only fetch 3 farms
          category_id: 2, // Optional: if you want only farmhouses
        });

        const farms = res?.data || [];

        const topFarms = farms.map((farm) => {
          const finalPrice = parseInt(farm.final_price) || 0;
          const increasePercentage = parseInt(farm.increase_percentage) || 0;

          return {
            id: farm.id,
            name: farm.farm_alias_name,
            location: farm.area?.name || farm.city?.name || "",
            final_price: finalPrice,
            increase_percentage: increasePercentage,
            pricePerNight: finalPrice,
            images: farm.farm_images.map(
              (img) => `${FARM_IMAGE_BASE_URL}/${img.image}`
            ),
            rating: farm.reviews_avg_star || 4.8,
          };
        });

        setFeaturedFarms(topFarms);
      } catch (error) {
        console.error("Error loading farms:", error);
      }
    };

    loadTop3Farms();
  }, []);

  const handleSearch = async (filters) => {
    setSearchFilters(filters);
    setIsSearchMode(true);
    // console.log("Search filters:", filters);

    try {
      const farmsData = await fetchFarms(filters);
      // console.log("Fetched farms:", farmsData);
      setFarms(farmsData?.data || []);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  return (
    <PublicPageLayout>
      <div className="min-h-screen pb-20">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 overflow-hidden">
          {/* <section className="relative min-h-[80vh] bg-gradient-to-br from-[#f0fff4] via-[#f0faff] to-[#f6f0ff] overflow-hidden"> */}
          {/* <section className="relative min-h-[80vh] bg-[#f0f8f4] bg-gradient-to-br from-[#f0fff4] via-[#f0faff] to-[#f6f0ff] overflow-hidden"> */}

          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-emerald-300/20 rounded-full blur-xl animate-float"></div>
          </div>

          <div className="max-w-7xl mx-auto container-padding section-padding relative z-10">
            <div className="text-center mb-16 pt-12">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-sm font-medium text-primary border border-primary/20">
                <Shield className="w-4 h-4" />
                Trusted by 10,000+ Happy Guests
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Escape to Your Perfect
                <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent block">
                  Farmhouse
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover handpicked farmhouses nestled in nature's embrace...
              </p>
              <div className="flex items-center justify-center gap-8 mb-12 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span className="font-medium">99% Love Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="font-medium">100% Secure</span>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              <SearchFilters
                onSearch={handleSearch}
                className="animate-slide-up"
              />
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  "Weekend Getaway",
                  "Pool Villa",
                  "Pet Friendly",
                  "Near Mumbai",
                  "Family Retreat",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-600 hover:bg-white hover:text-primary transition-all duration-200 border border-white/20 hover:border-primary/20"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 text-sm font-medium text-primary">
                ⭐ Featured Properties
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Most Loved Farmhouses
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Handpicked properties that our guests can't stop raving about
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* {featuredFarms.map((farm) => (
              <Link key={farm.id} href={`/farm/${farm.id}`}>
                <div className="group relative overflow-hidden rounded-3xl h-96 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  <img 
                    src={farm.images[0]}
                    alt={farm.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                        Premium
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">
                      {farm.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-3">{farm.location}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">{formatPrice(farm.pricePerNight)}</span>
                        <span className="text-sm opacity-75">/night</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium">View Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))} */}
              {featuredFarms.map((farm) => {
                const finalPrice = parseFloat(farm.final_price) || 0; // This is the final price after the discount
                const discountPercent =
                  parseFloat(farm.increase_percentage) || 0; // This is the discount percentage

                // Calculate the original price before the discount was applied
                const originalPrice = finalPrice / (1 - discountPercent / 100);

                // Display the price after discount
                const price = finalPrice;
                return (
                  <Link key={farm.id} href={`/farm/${farm.id}`}>
                    <div className="group relative overflow-hidden rounded-3xl h-96 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                      <img
                        src={farm.images[0]}
                        alt={farm.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                        <Heart className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                            Premium
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">
                          {farm.name}
                        </h3>
                        <p className="text-sm opacity-90 mb-3">
                          {farm.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl text-primary line-through">
                                {formatPrice(originalPrice)}
                              </span>
                              <span className="text-2xl font-bold">
                                {formatPrice(farm.pricePerNight)}
                              </span>
                            </div>
                            <span className="text-sm opacity-75">/night</span>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-xs font-medium">
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={() =>
                  router.push("/farms")
                }
                size="lg"
                variant="outline"
                className="border-2 hover:bg-primary hover:text-white transition-all"
              >
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Categories and Listings */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Browse by Property Type
              </h2>
              <p className="text-lg text-gray-600">
                Find the perfect accommodation for your getaway
              </p>
            </div>
            <PropertyCategoryTabs
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </section>

        <CategoryTabs
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />

        {/* <FarmList
        selectedCity={selectedCity !== 'all' ? selectedCity : undefined}
        selectedCategory={selectedCategory !== 'all' ? selectedCategory : undefined}
        searchQuery={searchFilters?.location || ''}
      /> */}
        <div id="farm-list">
          <FarmList
            selectedCity={selectedCity} // Make sure to pass these if they're available
            selectedCategory={selectedCategory}
            searchFilters={{
              ...(searchFilters || {}),
              category_id:
                selectedCategory !== "all" ? Number(selectedCategory) : "",
              city_id:
                selectedCity !== "all"
                  ? CITY_IDS[selectedCity.toLowerCase()]
                  : "",
            }}
            farms={isSearchMode ? farms : null}
          />
        </div>

        <VideoGallery />
        <CustomerReviews />

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-50 relative overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl"></div>
          <div className="max-w-4xl mx-auto text-center container-padding relative z-10">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to List Your Property?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of property owners who are earning extra income
                by hosting guests...
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Extra Income</h4>
                  <p className="text-sm text-gray-600">Earn up to ₹50K/month</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Secure Platform
                  </h4>
                  <p className="text-sm text-gray-600">100% safe & secure</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Easy Management
                  </h4>
                  <p className="text-sm text-gray-600">Simple dashboard</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-emerald-600 text-white hover:from-primary/90 hover:to-emerald-600/90 px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 leading-snug text-center"
                  onClick={() => router.push("/owner/register")}
                >
                  <span>List Your Farm Today</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div
          className="
    fixed
    bottom-20 sm:bottom-6
    right-4 sm:right-6
    z-[9999]
    flex flex-row items-center gap-3
    transition-all
  "
        >
          {/* Action Buttons */}
          <div
            className={`
      flex flex-row items-center gap-3
      transition-all duration-300 ease-in-out
      ${
        open
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4 pointer-events-none"
      }
    `}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com/book_my_farms"
              target="_blank"
              rel="noopener noreferrer"
              className="
            w-12 h-12 sm:w-14 sm:h-14
            bg-gradient-to-br from-pink-500 to-yellow-500
            hover:opacity-90
            text-white rounded-full shadow-lg
            flex items-center justify-center
            transition-all
          "
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919277778778"
              target="_blank"
              rel="noopener noreferrer"
              className="
            w-12 h-12 sm:w-14 sm:h-14
            bg-green-500 hover:bg-green-600
            text-white rounded-full shadow-lg
            flex items-center justify-center
            transition-all
          "
              aria-label="Chat on WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                className="w-6 h-6 sm:w-7 sm:h-7"
              >
                <path d="M16.004 2.986C8.82 2.986 3 8.735 3 15.884c0 2.55.753 5.017 2.157 7.151L3 29l6.14-2.09a13.71 13.71 0 006.865 1.75h.002c7.183 0 13.003-5.748 13.003-12.898.001-7.149-5.82-12.876-13.006-12.876zm0 23.564a11.26 11.26 0 01-5.765-1.595l-.414-.246-3.648 1.24 1.208-3.555-.269-.406a10.235 10.235 0 01-1.632-5.62c0-5.715 4.675-10.367 10.373-10.367 5.697 0 10.335 4.652 10.335 10.367.002 5.715-4.637 10.182-10.188 10.182zm5.632-7.653c-.308-.155-1.82-.896-2.1-.997-.281-.1-.485-.155-.688.156-.203.309-.79.996-.968 1.201-.178.204-.357.229-.664.077-.308-.155-1.297-.479-2.47-1.528-.912-.812-1.528-1.816-1.707-2.125-.178-.308-.019-.475.135-.63.139-.138.308-.357.46-.536.154-.179.203-.309.308-.513.102-.204.051-.383-.025-.537-.077-.155-.688-1.66-.942-2.273-.248-.597-.502-.514-.688-.523l-.587-.01c-.204 0-.536.077-.817.383-.281.308-1.072 1.045-1.072 2.547s1.097 2.951 1.249 3.156c.154.204 2.157 3.293 5.227 4.62.731.316 1.3.504 1.744.644.733.234 1.4.2 1.927.122.588-.087 1.82-.743 2.077-1.46.256-.716.256-1.33.179-1.46-.077-.128-.281-.204-.587-.357z" />
              </svg>
            </a>

            {/* Google Play */}
            <a
              href="https://play.google.com/store/apps/details?id=com.app.bookmyfarm&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="
    w-12 h-12 sm:w-14 sm:h-14
    bg-white hover:bg-gray-100
    rounded-full shadow-lg
    flex items-center justify-center
    transition-all
  "
              aria-label="Google Play"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 511.999 511.999"
                className="w-6 h-6 sm:w-7 sm:h-7"
              >
                <g>
                  <path
                    fill="#32BBFF"
                    d="M382.369,175.623C322.891,142.356,227.427,88.937,79.355,6.028C69.372-0.565,57.886-1.429,47.962,1.93l254.05,254.05L382.369,175.623z"
                  />
                  <path
                    fill="#32BBFF"
                    d="M47.962,1.93c-1.86,0.63-3.67,1.39-5.401,2.308C31.602,10.166,23.549,21.573,23.549,36v439.96c0,14.427,8.052,25.834,19.012,31.761c1.728,0.917,3.537,1.68,5.395,2.314L302.012,255.98L47.962,1.93z"
                  />
                  <path
                    fill="#32BBFF"
                    d="M302.012,255.98L47.956,510.035c9.927,3.384,21.413,2.586,31.399-4.103c143.598-80.41,237.986-133.196,298.152-166.746c1.675-0.941,3.316-1.861,4.938-2.772L302.012,255.98z"
                  />
                </g>
                <path
                  fill="#2C9FD9"
                  d="M23.549,255.98v219.98c0,14.427,8.052,25.834,19.012,31.761c1.728,0.917,3.537,1.68,5.395,2.314L302.012,255.98H23.549z"
                />
                <path
                  fill="#29CC5E"
                  d="M79.355,6.028C67.5-1.8,53.52-1.577,42.561,4.239l255.595,255.596l84.212-84.212C322.891,142.356,227.427,88.937,79.355,6.028z"
                />
                <path
                  fill="#D93F21"
                  d="M298.158,252.126L42.561,507.721c10.96,5.815,24.939,6.151,36.794-1.789c143.598-80.41,237.986-133.196,298.152-166.746c1.675-0.941,3.316-1.861,4.938-2.772L298.158,252.126z"
                />
                <path
                  fill="#FFD500"
                  d="M488.45,255.98c0-12.19-6.151-24.492-18.342-31.314c0,0-22.799-12.721-92.682-51.809l-83.123,83.123l83.204,83.205c69.116-38.807,92.6-51.892,92.6-51.892C482.299,280.472,488.45,268.17,488.45,255.98z"
                />
                <path
                  fill="#FFAA00"
                  d="M470.108,287.294c12.191-6.822,18.342-19.124,18.342-31.314H294.303l83.204,83.205C446.624,300.379,470.108,287.294,470.108,287.294z"
                />
              </svg>
            </a>

            {/* App Store */}
            <a
              href="https://apps.apple.com/in/app/bookmyfarm-book-farmhouse/id6747479573"
              target="_blank"
              rel="noopener noreferrer"
              className="
    w-12 h-12 sm:w-14 sm:h-14
    bg-black hover:bg-black/80
    rounded-full shadow-lg
    flex items-center justify-center
    transition-all
  "
              aria-label="App Store"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                fill="currentColor"
              >
                <path d="M318.7 268.5c-2.1-35.3 16.2-61.8 50.4-80.4-19.1-27.8-47.6-43.1-84.2-45.3-35.3-2.1-73.5 20.7-86.4 20.7-13.1 0-48.3-19.8-74.6-19.3-59.6.9-113.1 43.6-113.1 126.3 0 27.7 5 56.5 16.7 85.5 14.8 37 69.4 128.7 112.6 127.3 21.7-.6 37.1-15.4 68.5-15.4 31.1 0 44.7 15.4 68.5 15.4 43.5 0 89.7-84.4 103.4-121.4-65.3-31.1-62.3-91.7-62.3-93.9zM260.1 100.4c23.1-27.9 21.3-53.6 20.5-62.5-19.9 1-43 13.3-56.2 30.1-13 16.6-24.3 42.6-21.3 67.3 21.9 1.7 42.2-9.5 57-24.9z" />
              </svg>
            </a>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="
    w-12 h-12 sm:w-14 sm:h-14
    bg-neutral-700 hover:bg-neutral-800
    text-white rounded-full shadow-lg
    flex items-center justify-center
    transition-all duration-300
  "
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200"
            >
              {open ? (
                // Left arrow "<"
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              ) : (
                // Right arrow ">"
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </PublicPageLayout>
  );
}
