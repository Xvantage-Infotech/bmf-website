'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, MapPin, Users, Bed } from 'lucide-react';
import { staticFarms, getFarmsByCity, searchFarms } from '@/lib/staticFarms';

export default function SearchResultsPanel({ searchFilters, selectedCity, selectedCategory }) {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    let filteredFarms = staticFarms;

    if (searchFilters?.location) {
      filteredFarms = searchFarms(searchFilters.location);
    } else if (selectedCity) {
      filteredFarms = getFarmsByCity(selectedCity);
    }

    if (selectedCategory) {
      filteredFarms = filteredFarms.filter(farm => farm.category === selectedCategory);
    }

    setFarms(filteredFarms);
  }, [searchFilters, selectedCity, selectedCategory]);

  const handleBookNow = (farm) => {
    console.log('Booking farm:', farm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchFilters?.location ? `Results for "${searchFilters.location}"` : 
                 selectedCity ? `Farms in ${selectedCity}` : 'All Farms'}
              </h1>
              <p className="text-gray-600">{farms.length} properties found</p>
            </div>
          </div>
        </div>

        {/* No Results */}
        {farms.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No farms found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Want to list your farm?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Join our platform and start earning from your property
              </p>
              <Button asChild className="w-full">
                <Link href="/owner/register">Add Your Farm</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {farms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <div key={farm.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={farm.images[0]}
                    alt={farm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {farm.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-900">{farm.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {farm.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{farm.location}, {farm.city}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{farm.maxGuests} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{farm.bedrooms} bedrooms</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {farm.reviewCount} reviews
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{parseInt(farm.pricePerNight).toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-600 text-sm"> / night</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/farm/${farm.id}`}>View Details</Link>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleBookNow(farm)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Your Farm CTA */}
        {farms.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Own a Farm Property?</h3>
              <p className="text-green-100 mb-6 max-w-md mx-auto">
                Join thousands of hosts earning extra income by listing their properties
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/owner/register">
                  List Your Property
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}