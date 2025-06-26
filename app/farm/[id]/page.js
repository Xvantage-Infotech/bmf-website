'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

// Layout Components
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import MobileBottomNav from '@/components/Layout/MobileBottomNav';

// Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Bed, Wifi, Car, Utensils, Shield } from 'lucide-react';
import { getFarmById } from '@/lib/staticFarms';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: false,
    },
  },
});

function FarmDetailContent() {
  const params = useParams();
  const [farm, setFarm] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      const farmData = getFarmById(parseInt(params.id));
      setFarm(farmData);
    }
  }, [params.id]);

  if (!farm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Farm not found</h2>
          <p className="text-gray-600">The farm you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    'WiFi': Wifi,
    'Free WiFi': Wifi,
    'Parking': Car,
    'Kitchen': Utensils,
    'Security': Shield,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Images */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src={farm.images[selectedImage]}
                  alt={farm.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {farm.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${farm.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Farm Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{farm.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{farm.rating}</span>
                    <span className="text-gray-600">({farm.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{farm.name}</h1>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{farm.location}, {farm.city}, {farm.state}</span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {farm.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{farm.bedrooms} bedrooms</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{parseInt(farm.pricePerNight).toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-600"> per night</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About this place</h2>
          <p className="text-gray-700 leading-relaxed">{farm.description}</p>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {farm.amenities.map((amenity, index) => {
              const IconComponent = amenityIcons[amenity] || Shield;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function FarmDetail() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <FarmDetailContent />
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}