import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { staticFarms } from '@/data/staticFarms';
import { Farm } from '@shared/schema';
import { cn } from '@/lib/utils';

interface LiveSearchBarProps {
  placeholder?: string;
  className?: string;
  onSelect?: (farm: Farm) => void;
}

export default function LiveSearchBar({ 
  placeholder = "Search by farm name, location...", 
  className = "",
  onSelect
}: LiveSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Farm[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = staticFarms.filter(farm => 
      farm.name.toLowerCase().includes(query.toLowerCase()) ||
      farm.location.toLowerCase().includes(query.toLowerCase()) ||
      farm.city.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results

    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (farm: Farm) => {
    setQuery(farm.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect?.(farm);
    setLocation(`/farm/${farm.id}`);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-primary/20 text-primary font-medium">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="w-full pl-4 pr-10 py-2 border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-neutral-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto">
          {results.map((farm, index) => (
            <button
              key={farm.id}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors",
                selectedIndex === index && "bg-primary/5"
              )}
              onClick={() => handleSelect(farm)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start space-x-3">
                <img 
                  src={farm.images[0]} 
                  alt={farm.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-neutral-900 truncate">
                    {highlightMatch(farm.name, query)}
                  </h4>
                  <p className="text-sm text-neutral-600 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    {highlightMatch(farm.location, query)}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">
                    ₹{farm.pricePerNight}/night
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}