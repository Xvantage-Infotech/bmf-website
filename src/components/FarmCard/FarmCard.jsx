// 'use client';
// import { useState } from 'react';
// import Link from 'next/link';
// import { Heart, Bed, Users, Star, MapPin } from 'lucide-react';
// import { formatPrice, generateStars } from '@/lib/utils';
// import { Button } from '@/components/ui/button';

// export default function FarmCard({ farm, className = '' }) {
//   const [isFavorited, setIsFavorited] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const toggleFavorite = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsFavorited(!isFavorited);
//   };

//   const rating = parseFloat(farm.rating);
// const mainImage = farm?.farm_images?.[0]?.image
//   ? `https://api.bookmyfarm.net/assets/images/farm_images/${farm.farm_images[0].image}`
//   : '/placeholder.jpg';




//   return (
//     <Link href={`/farm/${farm.id}`}>
//       <div className={`farm-card animate-card-hover cursor-pointer ${className}`}>
//         <div className="relative">
//           {/* Image with loading state */}
//           <div className="relative h-48 bg-neutral-200 overflow-hidden">
//             {!imageLoaded && (
//               <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
//             )}
//             <img 
//               src={mainImage}
//               alt={farm.name}
//               className={`w-full h-full object-cover transition-opacity duration-300 ${
//                 imageLoaded ? 'opacity-100' : 'opacity-0'
//               }`}
//               onLoad={() => setImageLoaded(true)}
//               loading="lazy"
//             />
//           </div>

//           {/* Price Badge */}
//           <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
//             {formatPrice(farm.final_price)}
//           </div>

//           {/* Favorite Button */}
//           <Button
//             size="icon"
//             variant="secondary"
//             className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white"
//             onClick={toggleFavorite}
//           >
//             <Heart 
//               className={`w-4 h-4 ${
//                 isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-600'
//               }`} 
//             />
//           </Button>

//           {/* Category Badge */}
//           <div className="absolute bottom-3 left-3">
//             <span className="bg-white/90 backdrop-blur-sm text-neutral-700 px-2 py-1 rounded text-xs font-medium capitalize">
//               {farm.category?.name || 'Farm'}

//             </span>
//           </div>
//         </div>

//         <div className="p-4">
//           {/* Farm Name and Location */}
//          <h3 className="font-semibold text-lg mb-1 text-neutral-900 truncate">{farm.farm_alias_name || farm.name}</h3>

//           <p className="text-neutral-600 text-sm mb-3 flex items-center">
//             <MapPin className="w-3 h-3 mr-1" />
//             {farm.area?.name}

//           </p>

//           {/* Amenities */}
//           <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
//             <span className="flex items-center">
//               <Bed className="w-4 h-4 mr-1" />
//               {farm.bedrooms} Bedroom{farm.bedrooms !== 1 ? 's' : ''}
//             </span>
//             <span className="flex items-center">
//               <Users className="w-4 h-4 mr-1" />
//               {farm.person_limit} Guest{farm.person_limit !== 1 ? 's' : ''}
//             </span>
//           </div>

//           {/* Rating and Reviews */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center text-sm">
//               <div className="flex mr-2">
//                 {generateStars(rating)}
//               </div>
//               <span className="text-neutral-600">
//                 {farm.reviews_avg_star} ({farm.reviews_count} review{farm.reviewCount !== 1 ? 's' : ''})
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }







'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, Bed, Users, Star, MapPin } from 'lucide-react';
import { formatPrice, generateStars } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function FarmCard({ farm, className = '' }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const intervalRef = useRef(null);

  const images = farm.farm_images || [];
  const mainImage = images.length > 0
    ? `https://api.bookmyfarm.net/assets/images/farm_images/${images[0].image}`
    : '/placeholder.jpg';


useEffect(() => {
  if (!isHovered || images.length <= 1) return;

  intervalRef.current = setInterval(() => {
    setImageIndex((prev) => (prev + 1) % images.length);
  }, 2000);

  return () => clearInterval(intervalRef.current);
}, [isHovered, images.length]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const rating = parseFloat(farm.rating);

  return (
    <Link href={`/farm/${farm.id}`}>
      <div className={`farm-card animate-card-hover cursor-pointer ${className}`}>
        <div className="relative">
          {/* Auto-scroll image carousel */}
          {/* <div className="relative h-48 w-full bg-neutral-200 overflow-hidden rounded-t-lg"> */}
          <div
  className="relative h-48 w-full bg-neutral-200 overflow-hidden rounded-t-lg"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>

            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{
                transform: `translateX(-${imageIndex * 100}%)`,
                width: `${images.length * 16.7}%`,
              }}
            >
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-full flex-shrink-0"
                  style={{ flex: '0 0 100%' }}
                >
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                  )}
                  <img
                    src={`https://api.bookmyfarm.net/assets/images/farm_images/${img.image}`}
                    alt={`${farm.name} - Image ${idx + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                  />
                </div>
              ))}
              {images.length === 0 && (
                <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                  <span>No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {formatPrice(farm.final_price)}
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
                isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-600'
              }`}
            />
          </Button>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-neutral-700 px-2 py-1 rounded text-xs font-medium capitalize">
              {farm.category?.name || 'Farm'}
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
              {farm.bedrooms} Bedroom{farm.bedrooms !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {farm.person_limit} Guest{farm.person_limit !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <div className="flex mr-2">{generateStars(rating)}</div>
              <span className="text-neutral-600">
                {farm.reviews_avg_star} ({farm.reviews_count} review{farm.reviews_count !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}