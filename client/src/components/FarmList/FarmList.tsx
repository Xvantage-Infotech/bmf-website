import { useState, useMemo } from 'react';
import { staticFarms } from '@/data/staticFarms';
import { Farm } from '@shared/schema';
import FarmCard from '@/components/FarmCard/FarmCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';

interface FarmListProps {
  selectedCity?: string;
  selectedCategory?: string;
  searchQuery?: string;
  title?: string;
  description?: string;
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

export default function FarmList({
  selectedCity,
  selectedCategory,
  searchQuery = '',
  title = 'Featured Farmhouses',
  description = 'Discover premium properties for your perfect getaway'
}: FarmListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedFarms = useMemo(() => {
    let farms = [...staticFarms];

    // Filter by city
    if (selectedCity && selectedCity !== 'all') {
      farms = farms.filter(farm => farm.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      farms = farms.filter(farm => farm.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      farms = farms.filter(farm => 
        farm.name.toLowerCase().includes(query) ||
        farm.location.toLowerCase().includes(query) ||
        farm.city.toLowerCase().includes(query) ||
        farm.description.toLowerCase().includes(query)
      );
    }

    // Sort farms
    switch (sortBy) {
      case 'price-low':
        farms.sort((a, b) => parseFloat(a.pricePerNight) - parseFloat(b.pricePerNight));
        break;
      case 'price-high':
        farms.sort((a, b) => parseFloat(b.pricePerNight) - parseFloat(a.pricePerNight));
        break;
      case 'rating':
        farms.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'featured':
      default:
        // Keep original order for featured
        break;
    }

    return farms;
  }, [selectedCity, selectedCategory, searchQuery, sortBy]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Guest Rating' },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">{title}</h2>
            <p className="text-neutral-600">{description}</p>
            {filteredAndSortedFarms.length > 0 && (
              <p className="text-sm text-neutral-500 mt-1">
                Showing {filteredAndSortedFarms.length} result{filteredAndSortedFarms.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Farms Grid */}
        {filteredAndSortedFarms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedFarms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <SlidersHorizontal className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No farms found</h3>
              <p className="text-neutral-600 mb-6">
                Try adjusting your search criteria or explore different locations.
              </p>
              <Button onClick={() => window.location.reload()}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filteredAndSortedFarms.length >= 8 && (
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Load More Farms
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
