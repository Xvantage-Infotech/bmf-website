'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CategoryTabs({ selectedCity, onCityChange, className = '' }) {
  const cities = ['All', 'Surat', 'Daman', 'Silvassa', 'Bharuch', 'Vapi'];
  
  const handleCityChange = (city) => {
    const newCity = city === 'All' ? '' : city;
    if (onCityChange) {
      onCityChange(newCity);
    }
  };

  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {cities.map((city) => {
        const isActive = (city === 'All' && !selectedCity) || city === selectedCity;
        
        return (
          <Button
            key={city}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleCityChange(city)}
            className={cn(
              "transition-all duration-200",
              isActive 
                ? "bg-primary text-white shadow-md" 
                : "bg-white text-gray-700 hover:bg-primary hover:text-white"
            )}
          >
            {city}
          </Button>
        );
      })}
    </div>
  );
}