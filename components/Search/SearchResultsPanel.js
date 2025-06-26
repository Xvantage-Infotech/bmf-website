import { useState } from 'react';
import { staticFarms } from '@/lib/staticFarms';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, Heart, Plus } from 'lucide-react';

export default function SearchResultsPanel({ searchFilters, selectedCity, selectedCategory }) {
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);

  const filteredFarms = staticFarms.filter(farm => {
    const matchesDestination = !searchFilters?.destination || 
      farm.name.toLowerCase().includes(searchFilters.destination.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchFilters.destination.toLowerCase());
    
    const matchesCity = !selectedCity || farm.city === selectedCity;
    const matchesCategory = !selectedCategory || farm.category === selectedCategory;
    
    return matchesDestination && matchesCity && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {filteredFarms.length} farms found
              </h1>
              {searchFilters?.destination && (
                <p className="text-gray-600">
                  for "{searchFilters.destination}"
                </p>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddFarmModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your Farm
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredFarms.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No farms found
            </h2>
            <p className="text-gray-600 mb-8">
              Try adjusting your search criteria or explore our featured farms
            </p>
            <Button
              onClick={() => setShowAddFarmModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Be the first to add a farm in this area
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarms.map(farm => (
              <div key={farm.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={farm.images[0]} 
                    alt={farm.name}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <Badge className="absolute bottom-4 left-4 bg-green-600 text-white">
                    {farm.category}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{farm.name}</h3>
                  <p className="text-gray-600 mb-2 flex items-center">
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
                      <span className="text-2xl font-bold text-gray-900">₹{farm.price}</span>
                      <span className="text-gray-500">/night</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.location.href = `/farm/${farm.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Farm Modal Placeholder */}
      {showAddFarmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Your Farm</h2>
            <p className="text-gray-600 mb-6">
              Join our network of premium farm stays and start earning from your property.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowAddFarmModal(false)}
              >
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}