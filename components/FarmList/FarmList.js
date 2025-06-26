import { staticFarms } from '../../lib/staticFarms';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Star, Heart, Users, Bed } from 'lucide-react';

export default function FarmList({ 
  selectedCity, 
  selectedCategory, 
  title = "Featured Farms",
  description = "Discover premium farm stays",
  limit = 6
}) {
  const filteredFarms = staticFarms.filter(farm => {
    const matchesCity = !selectedCity || farm.city === selectedCity;
    const matchesCategory = !selectedCategory || farm.category === selectedCategory;
    return matchesCity && matchesCategory;
  }).slice(0, limit);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarms.map(farm => (
          <div key={farm.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative">
              <img 
                src={farm.images[0]} 
                alt={farm.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>
              <Badge className="absolute bottom-4 left-4 bg-green-600 text-white">
                {farm.category}
              </Badge>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{farm.name}</h3>
              <p className="text-gray-600 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {farm.location}
              </p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{farm.rating}</span>
                </div>
                <span className="text-gray-500 text-sm ml-2">({farm.reviews} reviews)</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {farm.maxGuests} guests
                </div>
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {farm.bedrooms} bedrooms
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {farm.amenities.slice(0, 3).map(amenity => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {farm.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{farm.amenities.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{farm.price.toLocaleString()}</span>
                  <span className="text-gray-500">/night</span>
                </div>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.location.href = `/farm/${farm.id}`}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredFarms.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No farms found</h3>
          <p className="text-gray-600">Try adjusting your filters or explore all our listings</p>
        </div>
      )}
    </div>
  );
}