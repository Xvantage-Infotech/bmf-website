"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  AMENITY_ICON_BASE_URL,
  FARM_IMAGE_BASE_URL,
  generateStars,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Bed, Users } from "lucide-react";
import BookingForm from "@/components/BookingForm/BookingForm";
import CustomerReviews from "@/components/Reviews/CustomerReviews";
import { fetchFarmById } from "@/services/Farm/farm.service";
import { useRef } from "react";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles
import "swiper/css/navigation"; // Import Navigation module styles
import "swiper/css/pagination"; // Import Pagination module styles

// Import Swiper required modules
import { Autoplay } from "swiper/modules";

export default function FarmDetail() {
  const params = useParams();
  const farmId = parseInt(params?.id);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const farmImages = farm?.farm_images || [];

  const totalBedrooms =
    farm?.rooms?.filter((room) => room.is_room == 1).length || 0;

  // Fetch farm data
  useEffect(() => {
    const loadFarm = async () => {
      try {
        const data = await fetchFarmById(farmId);
        setFarm(data);
      } catch (error) {
        console.error("Error loading farm data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFarm();
  }, [farmId]);

  useEffect(() => {
    if (!farmId) return;

    const loadFarm = async () => {
      try {
        const data = await fetchFarmById(farmId);

        // Extract latitude & longitude from location_link
        let latitude = null;
        let longitude = null;

        if (data?.location_link) {
          const match = data.location_link.match(/[-+]?[0-9]*\.?[0-9]+/g);
          if (match && match.length >= 2) {
            latitude = match[0];
            longitude = match[1];
          }
        }

        // Store them in state, or attach to the farm object if you like
        setFarm({
          ...data,
          latitude,
          longitude,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadFarm();
  }, [farmId]);

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setSelectedImageIndex(swiper.activeIndex); // Update the selected image index
  };

  const stopAutoScroll = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const startAutoScroll = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Instant jump to top, no animation
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <img
          src="/bmflogofoot.svg"
          alt="Book My Farm Logo"
          loading="eager"
          style={{ width: "350px", height: "350px" }}
          className="mb-4"
        />

        {/* <p className="text-neutral-500 text-sm animate-pulse">Loading farm details...</p> */}
      </div>
    );

  if (!farm)
    return <div className="p-8 text-center text-red-500">Farm not found.</div>;

  const rating = parseFloat(farm.reviews_avg_star || 0);
  const mainImage = farmImages[selectedImageIndex]
    ? `${FARM_IMAGE_BASE_URL}/${farmImages[selectedImageIndex].image}`
    : "/placeholder.jpg";

  const handleWhatsAppClick = () => {
    if (!farm) return;

    const name = farm.farm_alias_name || farm.name;
    const message = `Hello, I am interested to book this Property: ${name} - https://bookmyfarm.net/farm/${farm.id}`;

    const encodedMessage = encodeURIComponent(message).replace(/\+/g, "%20");

    const url = `https://wa.me/919277778778?text=${encodedMessage}`;

    // Some mobile browsers block new tab if not directly triggered by user event
    window.open(url, "_blank");
  };

  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="p-8 border-b border-neutral-100">
              {/* Main content container */}
              <div className="grid grid-cols-2 md:flex md:justify-between gap-x-4 gap-y-1 mb-4">
                {/* Left side - farm name, location, and mobile rating */}
                <div className="md:flex-1">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {farm.farm_alias_name || farm.name}
                    </h1>
                    <p className="text-lg text-neutral-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {farm.area?.name}, {farm.city?.name}
                    </p>
                  </div>

                  {/* Mobile rating - under location */}
                  <div className="flex items-center text-sm mt-1 md:hidden">
                    {/* Full Yellow Star SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-yellow-500 mr-1"
                    >
                      <polygon points="12 17.27 18.18 21 15.54 13.97 21 9.24 14.81 8.63 12 2 9.19 8.63 3 9.24 8.46 13.97 5.82 21 12 17.27" />
                    </svg>

                    {/* Rating with dynamically generated stars */}
                    <div className="flex mr-2">{generateStars(rating)}</div>

                    {/* Rating text */}
                    <span className="text-neutral-600">
                      {rating} ({farm.reviews_count} reviews)
                    </span>
                  </div>
                </div>

                {/* Right side - price and discount */}
                <div className="text-right">
                  {(() => {
                    const finalPrice = parseFloat(farm.final_price) || 0; // This is the final price after the discount
                    const discountPercent =
                      parseFloat(farm.increase_percentage) || 0; // This is the discount percentage

                    // Calculate the original price before the discount was applied
                    const originalPrice =
                      finalPrice / (1 - discountPercent / 100);

                    // Function to round to the nearest 50 and return an integer
                    // Round to nearest 100 instead of 50
                    const roundToNearest100 = (price) => {
                      return Math.round(price / 100) * 100;
                    };

                    // Display the price after discount
                    const price = roundToNearest100(finalPrice);

                    // Display the original price after discount
                    const originalPriceRounded =
                      roundToNearest100(originalPrice);

                    return (
                      <div>
                        {/* Price section */}
                        <div className="text-3xl font-bold text-primary flex flex-col md:flex-row md:items-center gap-1 justify-end">
                          {/* For Mobile View: Stack original and current price */}
                          <div className="flex flex-col items-end md:flex-row md:gap-3">
                            {discountPercent > 0 && (
                              <span className="text-xl line-through text-neutral-800 font-semibold md:block mb-1 md:mb-0">
                                ₹{originalPriceRounded.toLocaleString("en-IN")}
                              </span>
                            )}
                            <span className="text-xl md:text-3xl font-bold text-primary">
                              ₹{finalPrice.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* Discount badge - consistent size */}
                          {discountPercent > 0 && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 border border-yellow-300 border-dashed rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium mt-1 md:mt-0 w-fit ml-auto md:ml-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 fill-current"
                                viewBox="0 0 24 24"
                              >
                                <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.83 0l7-7a2 2 0 0 0-.01-2.83ZM7.5 7A1.5 1.5 0 1 1 9 5.5 1.5 1.5 0 0 1 7.5 7Z" />
                              </svg>
                              {discountPercent}% off
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Desktop rating - under price */}
                  <div className="hidden md:flex items-center text-sm mt-1 justify-end">
                    {/* Full Yellow Star SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-yellow-500 mr-1"
                    >
                      <polygon points="12 17.27 18.18 21 15.54 13.97 21 9.24 14.81 8.63 12 2 9.19 8.63 3 9.24 8.46 13.97 5.82 21 12 17.27" />
                    </svg>

                    {/* Rating with dynamically generated stars */}
                    <div className="flex mr-2">{generateStars(rating)}</div>

                    {/* Rating text */}
                    <span className="text-neutral-600">
                      {rating} ({farm.reviews_count} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges section */}
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary">
                  <Bed className="w-4 h-4 mr-1" />
                  {totalBedrooms} Bedroom{totalBedrooms !== 1 ? "s" : ""}
                </Badge>

                <Badge variant="secondary">
                  <Users className="w-4 h-4 mr-1" />
                  {farm.day_time_person_limit} Guests (Day Capacity)
                </Badge>

                <Badge variant="secondary">
                  <Users className="w-4 h-4 mr-1" />
                  {farm.night_time_person_limit} Guests (Night Capacity)
                </Badge>

                <Badge variant="secondary">{farm.category?.name}</Badge>
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  {farm.city?.name}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Left */}
              <div className="lg:col-span-2">
                {/* ✅ Mobile Image Slider (Visible below md) */}
                <div
                  onMouseEnter={stopAutoScroll}
                  onMouseLeave={startAutoScroll}
                  className="relative overflow-hidden mb-8 block md:hidden"
                >
                  <div className="relative flex items-center">
                    <Swiper
                      ref={swiperRef}
                      modules={[Autoplay]}
                      loop={true}
                      spaceBetween={16}
                      slidesPerView={1}
                      centeredSlides={false}
                      speed={1500}
                      onSlideChange={handleSlideChange}
                      autoplay={{
                        delay: 1500, // stay duration
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      className="w-full"
                    >
                      {farmImages.length > 0 ? (
                        farmImages.map((img, index) => (
                          <SwiperSlide key={img.id}>
                            <div className="w-full h-[250px] sm:h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-md">
                              <img
                                src={`${FARM_IMAGE_BASE_URL}/${img.image}`}
                                alt={`Farm image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide>
                          <div className="w-full h-[250px] sm:h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-md">
                            <img
                              src="/placeholder.jpg"
                              alt="Placeholder Image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  </div>
                </div>

                {/* ✅ Desktop Image Slider (Visible from md and up) */}
                <div
                  onMouseEnter={stopAutoScroll}
                  onMouseLeave={startAutoScroll}
                  className="relative overflow-hidden mb-8 hidden md:block"
                >
                  <div className="relative flex items-center">
                    <Swiper
                      ref={swiperRef}
                      modules={[Autoplay]}
                      loop={true}
                      spaceBetween={20}
                      slidesPerView={1.6}
                      centeredSlides={true}
                      speed={1500}
                      onSlideChange={handleSlideChange}
                      autoplay={{
                        delay: 1500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      className="w-full"
                    >
                      {farmImages.length > 0 ? (
                        farmImages.map((img, index) => (
                          <SwiperSlide
                            key={img.id}
                            className="flex-shrink-0 w-[60%]"
                          >
                            <div className="w-full h-[400px] transition-transform duration-300">
                              <img
                                src={`${FARM_IMAGE_BASE_URL}/${img.image}`}
                                alt={`Farm image ${index + 1}`}
                                className="w-full h-full object-cover rounded-2xl shadow"
                              />
                            </div>
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide className="flex-shrink-0 w-[60%]">
                          <div className="w-full h-[400px] transition-transform duration-300">
                            <img
                              src="/placeholder.jpg"
                              alt="Placeholder Image"
                              className="w-full h-full object-cover rounded-2xl shadow"
                            />
                          </div>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="policy">
                  <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <TabsList className="flex w-max space-x-2">
                      <TabsTrigger value="policy">House Policy</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                      <TabsTrigger value="CancelPolicy">
                        Cancellation Policy
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="policy">
                    {farm.house_rule_policy ? (
                      <div
                        className="prose prose-sm text-neutral-700"
                        dangerouslySetInnerHTML={{
                          __html: farm.house_rule_policy
                            .replace(/<p><br><\/p>/g, "") // remove extra empty lines
                            .replace(/&nbsp;/g, " "), // normalize spacing
                        }}
                      />
                    ) : (
                      <p className="text-neutral-700">
                        No house policy provided.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="CancelPolicy">
                    {farm.house_cancellation_policy ? (
                      <div
                        className="prose prose-sm text-neutral-700"
                        dangerouslySetInnerHTML={{
                          __html: farm.house_cancellation_policy
                            .replace(/<p><br><\/p>/g, "") // remove empty lines
                            .replace(/&nbsp;/g, " "), // normalize spacing
                        }}
                      />
                    ) : (
                      <p className="text-neutral-700">
                        No cancellation policy provided.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="description">
                    {farm.description ? (
                      <ol className="list-decimal list-inside text-neutral-700 space-y-1">
                        {farm.description
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((point, index) => {
                            const cleaned = point.replace(/^\d+\.\s*/, "");
                            return <li key={index}>{cleaned}</li>;
                          })}
                      </ol>
                    ) : (
                      <p className="text-neutral-700">
                        No description available.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="amenities">
                    {farm.rooms?.map((room) => (
                      <div key={room.name} className="mb-4">
                        <h4 className="font-semibold text-lg mb-2">
                          {room.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {room.room_amenities.map((ra, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 bg-neutral-50 rounded"
                            >
                              <img
                                src={`${AMENITY_ICON_BASE_URL}/${ra.amenities.icon}`}
                                alt={ra.amenities.name}
                                className="w-5 h-5 object-contain"
                              />
                              <span className="text-sm text-neutral-700 font-medium">
                                {ra.amenities.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="location">
                    {farm.latitude && farm.longitude ? (
                      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.google.com/maps?q=${farm.latitude},${farm.longitude}&hl=es;z=14&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>

                        {/* Overlay only blocks click, not scroll/zoom */}
                        <div
                          className="absolute inset-0 z-10"
                          style={{ pointerEvents: "none" }}
                        />
                      </div>
                    ) : (
                      <p className="text-neutral-500">
                        Location map not available.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Booking */}
              <div className="lg:col-span-1">
                <BookingForm farm={farm} />
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-16">
            <CustomerReviews />
          </div>
        </div>
        {/* Floating WhatsApp Button */}
        {farm && (
          <button
            onClick={handleWhatsAppClick}
            className="fixed bottom-20 sm:bottom-6 right-6 z-50
  w-12 h-12 sm:w-14 sm:h-14
  bg-green-500 hover:bg-green-600
  text-white rounded-full shadow-lg
  flex items-center justify-center
  transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7"
            >
              <path d="M16.004 2.986C8.82 2.986 3 8.735 3 15.884c0 2.55.753 5.017 2.157 7.151L3 29l6.14-2.09a13.71 13.71 0 006.865 1.75h.002c7.183 0 13.003-5.748 13.003-12.898.001-7.149-5.82-12.876-13.006-12.876zm0 23.564a11.26 11.26 0 01-5.765-1.595l-.414-.246-3.648 1.24 1.208-3.555-.269-.406a10.235 10.235 0 01-1.632-5.62c0-5.715 4.675-10.367 10.373-10.367 5.697 0 10.335 4.652 10.335 10.367.002 5.715-4.637 10.182-10.188 10.182zm5.632-7.653c-.308-.155-1.82-.896-2.1-.997-.281-.1-.485-.155-.688.156-.203.309-.79.996-.968 1.201-.178.204-.357.229-.664.077-.308-.155-1.297-.479-2.47-1.528-.912-.812-1.528-1.816-1.707-2.125-.178-.308-.019-.475.135-.63.139-.138.308-.357.46-.536.154-.179.203-.309.308-.513.102-.204.051-.383-.025-.537-.077-.155-.688-1.66-.942-2.273-.248-.597-.502-.514-.688-.523l-.587-.01c-.204 0-.536.077-.817.383-.281.308-1.072 1.045-1.072 2.547s1.097 2.951 1.249 3.156c.154.204 2.157 3.293 5.227 4.62.731.316 1.3.504 1.744.644.733.234 1.4.2 1.927.122.588-.087 1.82-.743 2.077-1.46.256-.716.256-1.33.179-1.46-.077-.128-.281-.204-.587-.357z" />
            </svg>
          </button>
        )}
      </div>
    </PublicPageLayout>
  );
}
