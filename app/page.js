'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';

// Layout Components
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import MobileBottomNav from '@/components/Layout/MobileBottomNav';

// Components
import SearchFilters from '@/components/Search/SearchFilters';
import CategoryTabs from '@/components/Search/CategoryTabs';
import SearchResultsPanel from '@/components/Search/SearchResultsPanel';
import FarmList from '@/components/FarmList/FarmList';
import VideoGallery from '@/components/VideoGallery/VideoGallery';
import CustomerReviews from '@/components/Reviews/CustomerReviews';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: false,
    },
  },
});

function FloatingWhatsApp() {
  const { isMobile } = useResponsive();
  
  if (!isMobile) return null;

  return (
    <Button
      size="icon"
      className="fixed bottom-20 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-40"
      onClick={() => window.open('https://wa.me/919277778778', '_blank')}
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
    </Button>
  );
}

function HomeContent() {
  const [searchFilters, setSearchFilters] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setShowSearchResults(true);
    console.log('Search filters:', filters);
  };

  if (showSearchResults) {
    return (
      <SearchResultsPanel 
        searchFilters={searchFilters}
        selectedCity={selectedCity}
        selectedCategory={selectedCategory}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Book Your Perfect
            <span className="text-primary block">Farm Stay</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover premium farmhouse rentals across India. Experience nature, comfort, and unforgettable memories.
          </p>
          
          {/* Search Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-4xl mx-auto">
            <SearchFilters onSearch={handleSearch} />
          </div>
          
          {/* Category Tabs */}
          <CategoryTabs 
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
        </div>
      </section>

      {/* Featured Farms */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Farm Stays</h2>
          <FarmList 
            selectedCity={selectedCity}
            selectedCategory={selectedCategory}
            title="Popular Destinations"
            description="Handpicked farm stays for your perfect getaway"
          />
        </div>
      </section>

      {/* Video Gallery */}
      <section className="py-16 bg-gray-50">
        <VideoGallery />
      </section>

      {/* Customer Reviews */}
      <section className="py-16">
        <CustomerReviews />
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <HomeContent />
            </main>
            <Footer />
            <MobileBottomNav />
            <FloatingWhatsApp />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}