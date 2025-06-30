// 'use client';
// import { useParams } from 'next/navigation';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   MapPin, Bed, Users, Waves, Car, Wifi, ChefHat, Shield, Images
// } from 'lucide-react';

// import { getFarmById } from '@/data/staticFarms';
// import { getVideosByFarm } from '@/data/staticVideos';
// import { formatPrice, generateStars } from '@/lib/utils';
// import BookingForm from '@/components/BookingForm/BookingForm';
// import VideoPlayer from '@/components/VideoGallery/VideoPlayer';
// import CustomerReviews from '@/components/Reviews/CustomerReviews';

// export default function FarmDetail() {
//   const params = useParams();
//   const farmId = parseInt(params.id || '1');
//   const farm = getFarmById(farmId);
//   const farmVideos = getVideosByFarm(farmId);
  
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   if (!farm) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-neutral-900 mb-2">Farm Not Found</h1>
//           <p className="text-neutral-600">The farm you're looking for doesn't exist.</p>
//         </div>
//       </div>
//     );
//   }

//   const rating = parseFloat(farm.rating);

//   const amenityIcons = {
//     'Private Swimming Pool': Waves,
//     'Swimming Pool': Waves,
//     'Air Conditioning': Car,
//     'Free WiFi': Wifi,
//     'WiFi': Wifi,
//     'Parking': Car,
//     'Kitchen': ChefHat,
//     'BBQ Grill': ChefHat,
//     'Security': Shield,
//     'Housekeeping': Shield,
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto container-padding py-8">
//         <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
//           {/* Property Header */}
//           <div className="p-8 border-b border-neutral-100">
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h1 className="text-3xl font-bold text-neutral-900 mb-2">{farm.name}</h1>
//                 <p className="text-lg text-neutral-600 flex items-center">
//                   <MapPin className="w-4 h-4 mr-2 text-primary" />
//                   {farm.location}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-3xl font-bold text-primary">
//                   {formatPrice(farm.pricePerNight)}
//                   <span className="text-lg font-normal text-neutral-600">/night</span>
//                 </p>
//                 <div className="flex items-center text-sm mt-1">
//                   <div className="flex mr-2">
//                     {generateStars(rating)}
//                   </div>
//                   <span className="text-neutral-600">
//                     {farm.rating} ({farm.reviewCount} reviews)
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-4">
//               <Badge variant="secondary" className="flex items-center">
//                 <Bed className="w-3 h-3 mr-1" />
//                 {farm.bedrooms} Bedroom{farm.bedrooms !== 1 ? 's' : ''}
//               </Badge>
//               <Badge variant="secondary" className="flex items-center">
//                 <Users className="w-3 h-3 mr-1" />
//                 {farm.maxGuests} Guest{farm.maxGuests !== 1 ? 's' : ''}
//               </Badge>
//               <Badge variant="secondary" className="capitalize">{farm.category}</Badge>
//               <Badge variant="outline" className="text-primary border-primary">
//                 {farm.city}, {farm.state}
//               </Badge>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
//             {/* Left Content */}
//             <div className="lg:col-span-2">
//               {/* Image Gallery */}
//               <div className="mb-8">
//                 <div className="relative rounded-2xl overflow-hidden mb-4">
//                   <img 
//                     src={farm.images[selectedImageIndex]}
//                     alt={`${farm.name} - Image ${selectedImageIndex + 1}`}
//                     className="w-full h-96 object-cover"
//                   />
//                   <Button
//                     variant="secondary"
//                     className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
//                   >
//                     <Images className="w-4 h-4 mr-2" />
//                     View All {farm.images.length} Photos
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-4 gap-3">
//                   {farm.images.slice(0, 4).map((image, index) => (
//                     <img 
//                       key={index}
//                       src={image}
//                       alt={`${farm.name} thumbnail ${index + 1}`}
//                       className={`
//                         w-full h-20 object-cover rounded-lg cursor-pointer transition-opacity
//                         ${selectedImageIndex === index ? 'ring-2 ring-primary' : 'hover:opacity-80'}
//                       `}
//                       onClick={() => setSelectedImageIndex(index)}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Tabs */}
//               <Tabs defaultValue="description" className="border border-neutral-200 rounded-2xl overflow-hidden">
//                 <TabsList className="w-full justify-start rounded-none border-b">
//                   <TabsTrigger value="description">Description</TabsTrigger>
//                   <TabsTrigger value="amenities">Amenities</TabsTrigger>
//                   <TabsTrigger value="videos">Videos</TabsTrigger>
//                   <TabsTrigger value="location">Location</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="description" className="p-6">
//                   <div className="prose max-w-none">
//                     <p className="text-neutral-700 leading-relaxed mb-4">
//                       {farm.description}
//                     </p>
//                     <p className="text-neutral-700 leading-relaxed">
//                       Whether you're looking to relax, explore nearby attractions, or simply enjoy quality time with 
//                       loved ones, this property provides the perfect setting for an unforgettable experience.
//                     </p>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="amenities" className="p-6">
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     {farm.amenities.map((amenity, index) => {
//                       const IconComponent = amenityIcons[amenity] || Wifi;
//                       return (
//                         <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
//                           <IconComponent className="w-5 h-5 text-primary" />
//                           <span className="text-sm font-medium text-neutral-700">{amenity}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="videos" className="p-6">
//                   {farmVideos.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {farmVideos.map((video) => (
//                         <VideoPlayer key={video.id} video={video} />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-neutral-600">No videos available for this property.</p>
//                     </div>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="location" className="p-6">
//                   <div className="space-y-4">
//                     <div className="bg-neutral-100 rounded-lg h-64 flex items-center justify-center">
//                       <p className="text-neutral-600">Interactive map would be loaded here</p>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-semibold text-neutral-900">Exact location</h4>
//                         <p className="text-neutral-600">{farm.location}</p>
//                       </div>
//                       <Button variant="outline">
//                         Get Directions
//                       </Button>
//                     </div>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>

//             {/* Booking Form */}
//             <div className="lg:col-span-1">
//               <BookingForm farm={farm} />
//             </div>
//           </div>
//         </div>

//         {/* Reviews */}
//         <div className="mt-16">
//           <CustomerReviews />
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';

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

export default function FarmDetail() {
  const params = useParams();
  const farmId = parseInt(params.id);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!farmId) return;
    const loadFarm = async () => {
      const data = await fetchFarmById(farmId);
      setFarm(data);
      setLoading(false);
    };
    loadFarm();
  }, [farmId]);

  if (loading) return <div className="p-8 text-center">Loading farm details...</div>;
  if (!farm) return <div className="p-8 text-center text-red-500">Farm not found.</div>;

  const rating = parseFloat(farm.reviews_avg_star || 0);
  const farmImages = farm.farm_images || [];
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
                <p className="text-3xl font-bold text-primary">
                  ₹{farm.final_price}
                  <span className="text-lg font-normal text-neutral-600">/night</span>
                </p>
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
              {/* Gallery */}
              <div className="mb-8">
                <div className="relative rounded-2xl overflow-hidden mb-4">
                  <img src={mainImage} className="w-full h-96 object-cover" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {farmImages.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={`https://api.bookmyfarm.net/assets/images/farm_images/${img.image}`}
                      className={`w-full h-20 object-cover rounded-lg cursor-pointer ${
                        selectedImageIndex === i ? 'ring-2 ring-primary' : 'hover:opacity-80'
                      }`}
                      onClick={() => setSelectedImageIndex(i)}
                    />
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
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
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {(farm.rooms || [])
      .flatMap(room => room.room_amenities.map(ra => ra.amenities))
      .map((amenity, i) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
          <img
            src={`https://api.bookmyfarm.net/assets/images/amenity-icons/${amenity.icon}`}
            alt={amenity.name}
            className="w-5 h-5 object-contain"
          />
          <span className="text-sm text-neutral-700 font-medium">{amenity.name}</span>
        </div>
      ))}
  </div>
</TabsContent>

                {/* <TabsContent value="location">
                  <p className="text-neutral-600">{farm.location}</p>
                </TabsContent> */}
                <TabsContent value="location">
  <p className="text-neutral-600 mb-2">{farm.address}</p>
  {farm.location_link && (
    <Button asChild variant="outline">
      <a href={farm.location_link} target="_blank" rel="noopener noreferrer">
        Get Directions
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
