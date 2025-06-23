import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getFeaturedFarms } from '@/data/staticFarms';
import { formatPrice } from '@/lib/utils';
import SearchFilters, { SearchFilters as SearchFiltersType } from '@/components/Search/SearchFilters';
import SearchResultsPanel from '@/components/Search/SearchResultsPanel';
import CategoryTabs from '@/components/Search/CategoryTabs';
import PropertyCategoryTabs from '@/components/common/PropertyCategoryTabs';
import VideoGallery from '@/components/VideoGallery/VideoGallery';
import FarmList from '@/components/FarmList/FarmList';
import CustomerReviews from '@/components/Reviews/CustomerReviews';
import { PropertyCategory } from '@/constants/categories';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'all'>('all');
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const featuredFarms = getFeaturedFarms();

  const handleSearch = (filters: SearchFiltersType) => {
    setSearchFilters(filters);
    setIsSearchMode(true);
    console.log('Search filters:', filters);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto container-padding section-padding">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4 animate-fade-in">
              Find Your Perfect house<span className="text-primary">Farmhouse</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto animate-fade-in">
              Discover premium farmhouses for your perfect getaway. Book memorable experiences in nature's lap.
            </p>
          </div>

          {/* Search Filters */}
          <SearchFilters onSearch={handleSearch} className="mb-12 animate-slide-up" />

          {/* Featured Farms Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredFarms.map((farm) => (
              <Link key={farm.id} href={`/farm/${farm.id}`}>
                <div className="relative overflow-hidden rounded-2xl h-80 animate-card-hover cursor-pointer">
                  <img 
                    src={farm.images[0]}
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{farm.name}</h3>
                    <p className="text-sm opacity-90">{farm.location}</p>
                    <p className="text-lg font-bold mt-2">
                      {formatPrice(farm.pricePerNight)}/night
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <VideoGallery />

      {/* Property Category Section */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Browse by Property Type</h2>
            <p className="text-lg text-neutral-600">Find the perfect accommodation for your getaway</p>
          </div>
          <PropertyCategoryTabs 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Category Tabs by Location */}
      <CategoryTabs 
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Farm List */}
      <FarmList 
        selectedCity={selectedCity !== 'all' ? selectedCity : undefined}
        selectedCategory={selectedCategory !== 'all' ? selectedCategory : undefined}
        searchQuery={searchFilters?.location || ''}
      />

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Call to Action */}
      <section className="section-padding bg-primary/5">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join thousands of property owners who are earning extra income by hosting guests at their farmhouses.
          </p>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
            List Your Farm Today
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
