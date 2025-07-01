'use client';
const { add } = require("date-fns")

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatPrice, generateStars } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin, Bed, Users, Waves, Car, Wifi, ChefHat, Shield, Images
} from 'lucide-react';
import BookingForm from '@/components/BookingForm/BookingForm';
import CustomerReviews from '@/components/Reviews/CustomerReviews';
import VideoPlayer from '@/components/VideoGallery/VideoPlayer';
import { fetchFarmById } from '@/services/Farm/farm.service';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export default function FarmDetail() {
  const params = useParams();
  const farmId = parseInt(params?.id);
  
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

const [selectedImageIndex, setSelectedImageIndex] = useState(1);

// Move this declaration above the useEffect
const farmImages = farm?.farm_images || [];


const scrollRef = useRef(null);


const scrollToIndex = (index) => {
  const container = scrollRef.current;
  if (!container || !container.children.length) return;

  const actualIndex = index + 1; // because of the cloned start image
  const child = container.children[actualIndex];
  if (child) {
    child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setSelectedImageIndex(index);
  }
};


const handleNext = () => {
  const nextIndex = (selectedImageIndex + 1) % farmImages.length;
  scrollToIndex(nextIndex);
};

const handlePrev = () => {
  const prevIndex = (selectedImageIndex - 1 + farmImages.length) % farmImages.length;
  scrollToIndex(prevIndex);
};
const loopCount = 10; // or any large number
const extendedImages = Array.from({ length: loopCount }, () => farmImages).flat();



// Auto-scroll carousel every 3s
useEffect(() => {
  if (!farm || farmImages.length <= 1) return;

  const interval = setInterval(() => {
    setSelectedImageIndex((prevIndex) => {
      const next = prevIndex + 1;
      if (scrollRef.current) {
       const child = scrollRef.current.children[next + 1]; // adjust for +1 index shift

        if (child) {
          child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
      return next;
    });
  }, 3000);

  return () => clearInterval(interval);
}, [farm, farmImages.length]);

useEffect(() => {
  if (scrollRef.current && farmImages.length > 1) {
    const initialIndex = 1;
    const child = scrollRef.current.children[initialIndex + 1];
    if (child) {
      child.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
    }
  }
}, [farmImages.length]);




useEffect(() => {
  const container = scrollRef.current;
  if (!container) return;

  const handleScrollEnd = () => {
    const total = extendedImages.length;
    const resetIndex = farmImages.length;

    if (selectedImageIndex >= total - 2) {
      // Jump back to second set to simulate loop
      const resetTo = resetIndex;
      const child = container.children[resetTo];
      if (child) {
        child.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
        setSelectedImageIndex(resetTo);
      }
    }
  };

  container.addEventListener('scrollend', handleScrollEnd);
  return () => container.removeEventListener('scrollend', handleScrollEnd);
}, [selectedImageIndex, extendedImages.length]);



  useEffect(() => {
    if (!farmId) return;
    const loadFarm = async () => {
      try {
        const data = await fetchFarmById(farmId);
        setFarm(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadFarm();
  }, [farmId]);

  if (loading) return <div className="p-8 text-center">Loading farm details...</div>;
  if (!farm) return <div className="p-8 text-center text-red-500">Farm not found.</div>;

  const rating = parseFloat(farm.reviews_avg_star || 0);
  const mainImage = farmImages[selectedImageIndex]
    ? `https://api.bookmyfarm.net/assets/images/farm_images/${farmImages[selectedImageIndex].image}`
    : '/placeholder.jpg';



  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto container-padding py-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="p-8 border-b border-neutral-100">
            <div className="flex justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{farm.farm_alias_name || farm.name}</h1>
                <p className="text-lg text-neutral-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {farm.area?.name}, {farm.city?.name}

                </p>
              </div>
              <div className="text-right">
                {(() => {
  const price = parseFloat(farm.final_price) || 0;
  const percent = parseFloat(farm.increase_percentage) || 0;
  const increase = Math.round((price * percent) / 100);
  const originalPrice = price + increase;

  return (
    <div className="text-right">
      <div className="text-3xl font-bold text-primary flex items-center gap-3 justify-end">
        {percent > 0 && (
          <span className="text-xl line-through text-red-600 font-medium">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}
        ₹{price.toLocaleString('en-IN')}
      </div>
      <span className="text-lg font-normal text-neutral-600"></span>
    </div>
  );
})()}

                <div className="flex items-center text-sm mt-1">
                  <div className="flex mr-2">
                    {generateStars(rating)}
                  </div>
                  <span className="text-neutral-600">
                    {rating} ({farm.reviews_count} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary"><Bed className="w-4 h-4 mr-1" /> {farm.bedrooms} Bedroom</Badge>
              <Badge variant="secondary"><Users className="w-4 h-4 mr-1" /> {farm.person_limit} Guests</Badge>
              <Badge variant="secondary">{farm.category?.name}</Badge>
              <Badge variant="outline" className="text-primary border-primary">
              {farm.city?.name}, {farm.state}
            </Badge>

            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left */}
            <div className="lg:col-span-2">
           
              <div className="relative overflow-hidden mb-8">
  <div className="relative flex items-center">
    <button
      className="absolute left-0 z-10 bg-white/70 hover:bg-white rounded-full shadow p-1"
      onClick={handlePrev}
    >
      <ChevronLeft className="w-6 h-6 text-primary" />
    </button>

    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto snap-x scroll-smooth px-16 scrollbar-hide"
      style={{ scrollPadding: '0 50%' }}
    >
      {extendedImages.map((img, index) => (
        <div
          key={index}
          className={`flex-shrink-0 w-[100%] md:w-[80%] lg:w-[80%] snap-center transition-transform duration-300 ${
            index === selectedImageIndex ? 'scale-100' : 'scale-95 opacity-80'
          }`}
        >
          <img
            src={`https://api.bookmyfarm.net/assets/images/farm_images/${img.image}`}
            alt={`Farm image ${index + 1}`}
            className="w-full h-full object-cover rounded-2xl shadow"
          />
        </div>
      ))}
    </div>

    <button
      className="absolute right-0 z-10 bg-white/70 hover:bg-white rounded-full shadow p-1"
      onClick={handleNext}
    >
      <ChevronRight className="w-6 h-6 text-primary" />
    </button>
  </div>
</div>


              {/* Tabs */}
              <Tabs defaultValue="policy">
                <TabsList>
                  <TabsTrigger value="policy">House Policy</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

<TabsContent value="policy">
  {farm.house_rule_policy ? (
    <div
      className="prose prose-sm text-neutral-700"
      dangerouslySetInnerHTML={{
        __html: farm.house_rule_policy
          .replace(/<p><br><\/p>/g, '') // remove extra empty lines
          .replace(/&nbsp;/g, ' ')     // normalize spacing
      }}
    />
  ) : (
    <p className="text-neutral-700">No house policy provided.</p>
  )}
</TabsContent>




            <TabsContent value="description">
  {farm.description ? (
    <ol className="list-decimal list-inside text-neutral-700 space-y-1">
      {farm.description
        .split('\n')
        .filter(line => line.trim())
        .map((point, index) => {
          const cleaned = point.replace(/^\d+\.\s*/, '');
          return <li key={index}>{cleaned}</li>;
        })}
    </ol>
  ) : (
    <p className="text-neutral-700">No description available.</p>
  )}
</TabsContent>

<TabsContent value="amenities">
  {farm.rooms?.map((room) => (
    <div key={room.name} className="mb-4">
      <h4 className="font-semibold text-lg mb-2">{room.name}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {room.room_amenities.map((ra, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
            <img
              src={`https://api.bookmyfarm.net/assets/images/amenity-icons/${ra.amenities.icon}`}
              alt={ra.amenities.name}
              className="w-5 h-5 object-contain"
            />
            <span className="text-sm text-neutral-700 font-medium">{ra.amenities.name}</span>
          </div>
        ))}
      </div>
    </div>
  ))}
</TabsContent>


                {/* <TabsContent value="location">
  <p className="text-neutral-600 mb-2">{farm.address}</p>
  {farm.location_link && (
    <Button asChild variant="outline">
      <a href={farm.location_link} target="_blank" rel="noopener noreferrer">
        Get Directions
      </a>
    </Button>
  )}
</TabsContent> */}
<TabsContent value="location">
  <h4 className="text-lg font-semibold mb-3">Our Location</h4>
  <p className="text-neutral-600 mb-2">{farm.address}</p>
  {farm.location_link && (
    <Button asChild variant="outline">
      <a href={farm.location_link} target="_blank" rel="noopener noreferrer">
        Open in Google Maps
      </a>
    </Button>
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
    </div>
  );
}








