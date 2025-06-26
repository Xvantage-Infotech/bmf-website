import { Button } from '@/components/ui/button';

export default function CategoryTabs({ selectedCity, onCityChange, className = '' }) {
  const cities = ['All', 'Lonavala', 'Alibag', 'Mahabaleshwar', 'Pune', 'Mumbai'];
  const categories = [
    { id: 'farmhouse', label: 'Farmhouses', icon: '🏡' },
    { id: 'villa', label: 'Villas', icon: '🏖️' },
    { id: 'resort', label: 'Resorts', icon: '🏨' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* City Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {cities.map(city => (
          <Button
            key={city}
            variant={selectedCity === city || (city === 'All' && !selectedCity) ? "default" : "outline"}
            size="sm"
            onClick={() => onCityChange(city === 'All' ? '' : city)}
            className="transition-all"
          >
            {city}
          </Button>
        ))}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {categories.map(category => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
            <p className="text-gray-600 text-sm mt-2">
              Explore premium {category.label.toLowerCase()} for your perfect getaway
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}