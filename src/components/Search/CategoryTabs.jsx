import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getCities } from '@/data/staticFarms';

export default function CategoryTabs({ 
  selectedCity = 'all', 
  onCityChange,
  className = ''
}) {
  const cities = getCities();
  const allCities = ['all', ...cities];

  const cityDisplayNames = {
    all: 'All Farms',
    surat: 'Surat',
    daman: 'Daman', 
    mumbai: 'Mumbai',
    pune: 'Pune',
    vadodara: 'Vadodara',
  };

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
            const displayName = cityDisplayNames[city.toLowerCase()] || city;
            
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
