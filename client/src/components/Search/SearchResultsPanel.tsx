import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Users, Star, Calendar } from 'lucide-react';
import { staticFarms } from '@/data/staticFarms';
import { SearchFilters } from './SearchFilters';
import { formatPrice, generateStars } from '@/lib/utils';
import BookingModal from '@/components/BookingModal/BookingModal';
import { Farm } from '@shared/schema';

interface SearchResultsPanelProps {
  searchFilters: SearchFilters | null;
  selectedCity: string;
  selectedCategory: string;
}

export default function SearchResultsPanel({ 
  searchFilters, 
  selectedCity, 
  selectedCategory 
}: SearchResultsPanelProps) {
  const [, setLocation] = useLocation();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Filter farms based on search criteria
  let filteredFarms = [...staticFarms];

  if (searchFilters?.location && searchFilters.location !== 'all') {
    filteredFarms = filteredFarms.filter(farm => 
      farm.name.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
      farm.city.toLowerCase().includes(searchFilters.location.toLowerCase())
    );
  }

  if (selectedCity && selectedCity !== 'all') {
    filteredFarms = filteredFarms.filter(farm => 
      farm.city.toLowerCase() === selectedCity.toLowerCase()
    );
  }

  if (selectedCategory && selectedCategory !== 'all') {
    const categoryMapping: Record<string, string> = {
      'farms': 'rustic',
      'villas': 'luxury', 
      'resorts': 'modern'
    };
    const mappedCategory = categoryMapping[selectedCategory] || selectedCategory;
    filteredFarms = filteredFarms.filter(farm => 
      farm.category.toLowerCase() === mappedCategory.toLowerCase()
    );
  }

  const handleBookNow = (farm: Farm) => {
    setSelectedFarm(farm);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    setLocation('/booking/confirmation');
  };

  const handleBookingCancel = () => {
    setIsBookingModalOpen(false);
    // Show error banner - for now just log
    console.log('Booking cancelled');
  };

  return (
    <div className="space-y-6">
      {/* Add Your Farm CTA */}
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Can't find your perfect farm?
              </h3>
              <p className="text-neutral-600">
                Add your property to our platform and start earning today!
              </p>
            </div>
            <Button 
              onClick={() => setLocation('/owner/register')}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your Farm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">
          {filteredFarms.length} Properties Found
        </h2>
        <Badge variant="secondary" className="text-sm">
          {searchFilters?.checkIn && searchFilters?.checkOut 
            ? `${searchFilters.checkIn.toLocaleDateString()} - ${searchFilters.checkOut.toLocaleDateString()}`
            : 'All Dates'
          }
        </Badge>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {filteredFarms.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No farms found</h3>
              <p className="text-neutral-600 mb-4">
                Try adjusting your search criteria or browse all properties
              </p>
              <Button 
                variant="outline"
                onClick={() => setLocation('/owner/register')}
              >
                <Plus className="w-4 h-4 mr-2" />
                List Your Property Instead
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredFarms.map((farm) => (
            <Card key={farm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <div className="relative h-64 md:h-full">
                      <img 
                        src={farm.images[0]} 
                        alt={farm.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-neutral-700">
                          {farm.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-1">
                              {farm.name}
                            </h3>
                            <p className="text-neutral-600 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {farm.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(farm.pricePerNight)}
                            </div>
                            <div className="text-sm text-neutral-500">per night</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-neutral-500" />
                            <span className="text-sm text-neutral-600">
                              Up to {farm.maxGuests} guests
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="flex mr-1">
                              {generateStars(farm.rating)}
                            </div>
                            <span className="text-sm text-neutral-600">
                              {farm.rating} ({farm.reviewCount} reviews)
                            </span>
                          </div>
                        </div>

                        <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                          {farm.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {farm.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {farm.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{farm.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setLocation(`/farm/${farm.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          className="flex-1 bg-primary text-white hover:bg-primary/90"
                          onClick={() => handleBookNow(farm)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {selectedFarm && (
        <BookingModal
          farm={selectedFarm}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
          onCancel={handleBookingCancel}
          checkIn={searchFilters?.checkIn}
          checkOut={searchFilters?.checkOut}
          guests={searchFilters?.guests}
        />
      )}
    </div>
  );
}