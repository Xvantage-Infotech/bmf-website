import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, MapPin, Calendar, Plus, Minus } from 'lucide-react';
import { getCities } from '@/data/staticFarms';
import EnhancedDatePicker from '@/components/common/EnhancedDatePicker';

export default function SearchFilters({ onSearch, className = '' }) {
  const [filters, setFilters] = useState({
    location: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: 2,
  });

  const cities = getCities();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const incrementGuests = () => {
    setFilters(prev => ({ ...prev, guests: Math.min((prev.guests || 0) + 1, 20) }));
  };

  const decrementGuests = () => {
    setFilters(prev => ({ ...prev, guests: Math.max((prev.guests || 0) - 1, 1) }));
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Getaway</h3>
          <p className="text-gray-600">Search from thousands of beautiful farmhouses</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Where do you want to go?
            </Label>
            <div className="relative group">
              <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                <SelectTrigger className="h-14 text-lg border-2 border-gray-200 rounded-xl hover:border-primary/50 focus:border-primary transition-colors bg-gray-50/50 hover:bg-white">
                  <SelectValue placeholder="Search destinations..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="all" className="py-3 text-base">🌍 All Locations</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city} className="py-3 text-base">
                      📍 {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                When are you going?
              </Label>
              <div className="bg-gray-50/50 p-4 rounded-xl border-2 border-gray-200 hover:border-primary/50 transition-colors">
                <EnhancedDatePicker
                  checkIn={filters.checkIn}
                  checkOut={filters.checkOut}
                  onCheckInChange={(date) => handleFilterChange('checkIn', date)}
                  onCheckOutChange={(date) => handleFilterChange('checkOut', date)}
                  compact
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                How many guests?
              </Label>
              <div className="bg-gray-50/50 p-4 rounded-xl border-2 border-gray-200 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Guests</div>
                    <div className="text-sm text-gray-500">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border-2"
                      onClick={decrementGuests}
                      disabled={(filters.guests || 0) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold min-w-[3rem] text-center">
                      {filters.guests || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border-2"
                      onClick={incrementGuests}
                      disabled={(filters.guests || 0) >= 20}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSearch}
              className="w-full h-16 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
            >
              <Search className="w-5 h-5 mr-3" />
              Search Amazing Farmhouses
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="font-bold text-lg text-primary">500+</div>
              <div className="text-xs text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-primary">50+</div>
              <div className="text-xs text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-primary">10K+</div>
              <div className="text-xs text-gray-600">Happy Guests</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/30 rounded-full animate-pulse delay-300"></div>
    </div>
  );
}
