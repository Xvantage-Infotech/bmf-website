import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { getCities } from '@/data/staticFarms';

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function SearchFilters({ onSearch, className = '' }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
  });

  const cities = getCities();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const guestOptions = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <Label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
            Location
          </Label>
          <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in */}
        <div>
          <Label htmlFor="checkin" className="block text-sm font-medium text-neutral-700 mb-2">
            Check-in
          </Label>
          <Input
            id="checkin"
            type="date"
            min={today}
            value={filters.checkIn}
            onChange={(e) => handleFilterChange('checkIn', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Check-out */}
        <div>
          <Label htmlFor="checkout" className="block text-sm font-medium text-neutral-700 mb-2">
            Check-out
          </Label>
          <Input
            id="checkout"
            type="date"
            min={filters.checkIn || tomorrow}
            value={filters.checkOut}
            onChange={(e) => handleFilterChange('checkOut', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Guests */}
        <div>
          <Label htmlFor="guests" className="block text-sm font-medium text-neutral-700 mb-2">
            Guests
          </Label>
          <Select value={filters.guests.toString()} onValueChange={(value) => handleFilterChange('guests', parseInt(value))}>
            <SelectTrigger id="guests">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {guestOptions.map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Guest{num !== 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 md:mt-4">
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 px-8"
          size="lg"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Farms
        </Button>
      </div>
    </div>
  );
}
