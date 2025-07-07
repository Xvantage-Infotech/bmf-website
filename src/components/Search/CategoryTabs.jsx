'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CITY_IDS = {
  surat: 1,
  navsari: 2,
  daman: 3,
  // bharuch: 4,
  // vadodara: 5,
  // valsad: 6,
  // bilimora: 7,
  // sevani: 10,
  saputara: 13,
  // dang: 12,
  silvassa:15
};

const cityDisplayNames = {
  all: 'All Farms',
  surat: 'Surat',
  navsari: 'Navsari',
  daman: 'Daman',
  // bharuch: 'Bharuch',
  // vadodara: 'Vadodara',
  // valsad: 'Valsad',
  // bilimora: 'Bilimora',
  sevani: 'Sevani',
  saputara: 'Saputara',
  dang: 'Dang',
  silvassa: 'Silvassa'
};

const cities = Object.keys(CITY_IDS);
const allCities = ['all', ...cities];

export default function CategoryTabs({ 
  selectedCity = 'all', 
  onCityChange,
  className = ''
}) {
  return (
    <section className={`py-8 bg-white border-b border-neutral-100 ${className}`}>
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Browse by Location</h2>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80 transition-colors flex items-center"
          >
            View All 
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {allCities.map((city) => {
            const isActive = selectedCity === city;
            const displayName = cityDisplayNames[city] || city;

            return (
              <Button
                key={city}
                variant={isActive ? 'default' : 'outline'}
                className={`
                  px-6 py-3 rounded-full font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200'
                  }
                `}
                onClick={() => onCityChange?.(city)}
              >
                {displayName}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { CITY_IDS }; // so you can use it in Homes.jsx
