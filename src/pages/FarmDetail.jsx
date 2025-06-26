'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin, Bed, Users, Waves, Car, Wifi, ChefHat, Shield, Images
} from 'lucide-react';

import { getFarmById } from '@/data/staticFarms';
import { getVideosByFarm } from '@/data/staticVideos';
import { formatPrice, generateStars } from '@/lib/utils';
import BookingForm from '@/components/BookingForm/BookingForm';
import VideoPlayer from '@/components/VideoGallery/VideoPlayer';
import CustomerReviews from '@/components/Reviews/CustomerReviews';

export default function FarmDetail() {
  const params = useParams();
  const farmId = parseInt(params.id || '1');
  const farm = getFarmById(farmId);
  const farmVideos = getVideosByFarm(farmId);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!farm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Farm Not Found</h1>
          <p className="text-neutral-600">The farm you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const rating = parseFloat(farm.rating);

  const amenityIcons = {
    'Private Swimming Pool': Waves,
    'Swimming Pool': Waves,
    'Air Conditioning': Car,
    'Free WiFi': Wifi,
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': ChefHat,
    'BBQ Grill': ChefHat,
    'Security': Shield,
    'Housekeeping': Shield,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto container-padding py-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          {/* Property Header */}
          <div className="p-8 border-b border-neutral-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{farm.name}</h1>
                <p className="text-lg text-neutral-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {farm.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(farm.pricePerNight)}
                  <span className="text-lg font-normal text-neutral-600">/night</span>
                </p>
                <div className="flex items-center text-sm mt-1">
                  <div className="flex mr-2">
                    {generateStars(rating)}
                  </div>
                  <span className="text-neutral-600">
                    {farm.rating} ({farm.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="flex items-center">
                <Bed className="w-3 h-3 mr-1" />
                {farm.bedrooms} Bedroom{farm.bedrooms !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {farm.maxGuests} Guest{farm.maxGuests !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="capitalize">{farm.category}</Badge>
              <Badge variant="outline" className="text-primary border-primary">
                {farm.city}, {farm.state}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-8">
                <div className="relative rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={farm.images[selectedImageIndex]}
                    alt={`${farm.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />
                  <Button
                    variant="secondary"
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Images className="w-4 h-4 mr-2" />
                    View All {farm.images.length} Photos
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {farm.images.slice(0, 4).map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`${farm.name} thumbnail ${index + 1}`}
                      className={`
                        w-full h-20 object-cover rounded-lg cursor-pointer transition-opacity
                        ${selectedImageIndex === index ? 'ring-2 ring-primary' : 'hover:opacity-80'}
                      `}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="border border-neutral-200 rounded-2xl overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-neutral-700 leading-relaxed mb-4">
                      {farm.description}
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      Whether you're looking to relax, explore nearby attractions, or simply enjoy quality time with 
                      loved ones, this property provides the perfect setting for an unforgettable experience.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {farm.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity] || Wifi;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-neutral-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="p-6">
                  {farmVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {farmVideos.map((video) => (
                        <VideoPlayer key={video.id} video={video} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-600">No videos available for this property.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="location" className="p-6">
                  <div className="space-y-4">
                    <div className="bg-neutral-100 rounded-lg h-64 flex items-center justify-center">
                      <p className="text-neutral-600">Interactive map would be loaded here</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-neutral-900">Exact location</h4>
                        <p className="text-neutral-600">{farm.location}</p>
                      </div>
                      <Button variant="outline">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Form */}
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
