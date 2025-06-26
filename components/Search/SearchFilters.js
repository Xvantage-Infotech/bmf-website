import { useState } from 'react';
import { Button } from '../ui/button';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function SearchFilters({ onSearch, className = '' }) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search destinations..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="date"
          placeholder="Check-in"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="date"
          placeholder="Check-out"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
        >
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <option key={num} value={num}>
              {num} Guest{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      
      <Button 
        type="submit" 
        className="md:col-span-4 bg-green-600 hover:bg-green-700 text-white"
      >
        Search Available Farms
      </Button>
    </form>
  );
}