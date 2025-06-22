import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, Bed, Users, Star, MapPin } from 'lucide-react';
import { Farm } from '@shared/schema';
import { formatPrice, generateStars } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FarmCardProps {
  farm: Farm;
  className?: string;
}

export default function FarmCard({ farm, className = '' }: FarmCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const rating = parseFloat(farm.rating);
  const mainImage = farm.images[0];

  return (
    <Link href={`/farm/${farm.id}`}>
      <div className={`farm-card animate-card-hover cursor-pointer ${className}`}>
        <div className="relative">
          {/* Image with loading state */}
          <div className="relative h-48 bg-neutral-200 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
            )}
            <img 
              src={mainImage}
              alt={farm.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {formatPrice(farm.pricePerNight)}/night
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
              {farm.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* Farm Name and Location */}
          <h3 className="font-semibold text-lg mb-1 text-neutral-900 truncate">{farm.name}</h3>
          <p className="text-neutral-600 text-sm mb-3 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {farm.location}
          </p>

          {/* Amenities */}
          <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
            <span className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {farm.bedrooms} Bedroom{farm.bedrooms !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {farm.maxGuests} Guest{farm.maxGuests !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <div className="flex mr-2">
                {generateStars(rating)}
              </div>
              <span className="text-neutral-600">
                {farm.rating} ({farm.reviewCount} review{farm.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
