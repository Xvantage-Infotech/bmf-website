'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Bed, ChevronDown } from 'lucide-react';
import { staticFarms, getFarmsByCity, getFarmsByCategory } from '@/lib/staticFarms';

export default function FarmList({ 
  selectedCity, 
  selectedCategory, 
  searchQuery, 
  title = "Featured Farm Stays",
  description = "Discover amazing farm properties"
}) {
  const [farms, setFarms] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    let filteredFarms = staticFarms;

    if (selectedCity) {
      filteredFarms = getFarmsByCity(selectedCity);
    }

    if (selectedCategory) {
      filteredFarms = getFarmsByCategory(selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredFarms = filteredFarms.filter(farm =>
        farm.name.toLowerCase().includes(query) ||
        farm.city.toLowerCase().includes(query) ||
        farm.location.toLowerCase().includes(query)
      );
    }

    // Sort farms
    switch (sortBy) {
      case 'price-low':
        filteredFarms.sort((a, b) => parseFloat(a.pricePerNight) - parseFloat(b.pricePerNight));
        break;
      case 'price-high':
        filteredFarms.sort((a, b) => parseFloat(b.pricePerNight) - parseFloat(a.pricePerNight));
        break;
      case 'rating':
        filteredFarms.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFarms(filteredFarms);
  }, [selectedCity, selectedCategory, searchQuery, sortBy]);

  const displayedFarms = farms.slice(0, displayCount);
  const hasMore = farms.length > displayCount;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            {farms.length} {farms.length === 1 ? 'property' : 'properties'} found
          </p>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Farms Grid */}
        {displayedFarms.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No farms found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedFarms.map((farm) => (
              <div key={farm.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group animate-card-hover">
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

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{parseInt(farm.pricePerNight).toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-600 text-sm"> / night</span>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/farm/${farm.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setDisplayCount(prev => prev + 6)}
            >
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}