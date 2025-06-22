import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users } from 'lucide-react';
import { getCities } from '@/data/staticFarms';
import EnhancedDatePicker from '@/components/common/EnhancedDatePicker';

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
}

export default function SearchFilters({ onSearch, className = '' }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: undefined,
  });

  const cities = getCities();

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | Date | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Date Range */}
        <div className="md:col-span-1">
          <Label className="block text-sm font-medium text-neutral-700 mb-2">
            Dates
          </Label>
          <EnhancedDatePicker
            checkIn={filters.checkIn}
            checkOut={filters.checkOut}
            onCheckInChange={(date) => handleFilterChange('checkIn', date)}
            onCheckOutChange={(date) => handleFilterChange('checkOut', date)}
            compact
          />
        </div>

        {/* Guests */}
        <div>
          <Label htmlFor="guests" className="block text-sm font-medium text-neutral-700 mb-2">
            Guests (optional)
          </Label>
          <div className="relative">
            <Input
              id="guests"
              type="number"
              min="1"
              max="20"
              placeholder="Number of guests"
              value={filters.guests || ''}
              onChange={(e) => handleFilterChange('guests', e.target.value ? parseInt(e.target.value) : undefined)}
              className="input-field pl-10"
            />
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <Button
          onClick={handleSearch}
          className="w-full bg-primary text-white hover:bg-primary/90"
          size="lg"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Properties
        </Button>
      </div>
    </div>
  );
}
