"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, MapPin, Calendar, Plus, Minus } from "lucide-react";
import { fetchFarms } from "@/services/Farm/farm.service";
import EnhancedDatePicker from "@/components/common/EnhancedDatePicker";

export default function SearchFilters({ onSearch, className = "" }) {
  const [filters, setFilters] = useState({
    city_id: "",
    start_date: undefined,
    end_date: undefined,
    no_of_guest: 2,
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Fetch cities on mount
  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      try {
        const response = await fetchFarms({});
        const farms = response?.data || [];

        const seen = new Set();
        const uniqueCities = [];

        for (const farm of farms) {
          if (farm.city_id && !seen.has(farm.city_id)) {
            uniqueCities.push({
              id: farm.city_id.toString(),
              name: farm.city.name,
            });
            seen.add(farm.city_id);
          }
        }

        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
  };

  const handleSearch = () => {
    const formatDate = (date) => {
      if (!date) return "";
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    };

    // console.log("start_date raw:", filters.start_date);
    // console.log("end_date raw:", filters.end_date);

    // If neither date is selected, just scroll
    if (!filters.start_date && !filters.end_date) {
      const section = document.getElementById("farm-list");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // If only one date is selected, also just scroll
    if (
      (filters.start_date && !filters.end_date) ||
      (!filters.start_date && filters.end_date)
    ) {
      const section = document.getElementById("farm-list");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Both dates are selected => perform search
    const payload = {
      city_id: filters.city_id || "",
      no_of_guest: filters.no_of_guest?.toString() || "",
      start_date: formatDate(filters.start_date),
      start_time: "",
      end_date: formatDate(filters.end_date),
      end_time: "",
      min_price: "",
      max_price: "",
      category_id: "",
      farm_id: "",
      sort_by: "",
      page: "1",
      per_page: "50",
    };
    // console.log("Payload being sent:", payload);
    onSearch?.(payload);

    const section = document.getElementById("farm-list");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const incrementGuests = () => {
    setFilters((prev) => ({
      ...prev,
      no_of_guest: Math.min((prev.no_of_guest || 0) + 1, 20),
    }));
  };

  const decrementGuests = () => {
    setFilters((prev) => ({
      ...prev,
      no_of_guest: Math.max((prev.no_of_guest || 0) - 1, 1),
    }));
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Find Your Perfect Getaway
          </h3>
          <p className="text-gray-600">
            Search from thousands of beautiful farmhouses
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Where do you want to go?
            </Label>
            <div className="relative group">
              <Select
                value={filters.city_id}
                onValueChange={(value) => handleFilterChange("city_id", value)}
              >
                <SelectTrigger className="h-14 text-lg border-2 border-gray-200 rounded-xl hover:border-primary/50 focus:border-primary transition-colors bg-gray-50/50 hover:bg-white">
                  <SelectValue placeholder="Search destinations..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="all" className="py-3 text-base">
                    🌍 All Locations
                  </SelectItem>
                  {cities.map((city) => (
                    <SelectItem
                      key={city.id}
                      value={city.id}
                      className="py-3 text-base"
                    >
                      📍 {city.name}
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
                  checkIn={filters.start_date}
                  checkOut={filters.end_date}
                  onCheckInChange={(date) =>
                    handleFilterChange("start_date", date)
                  }
                  onCheckOutChange={(date) =>
                    handleFilterChange("end_date", date)
                  }
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
                    <div className="text-sm text-gray-500">
                      Ages 13 or above
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border-2"
                      onClick={decrementGuests}
                      disabled={(filters.no_of_guest || 0) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold min-w-[3rem] text-center">
                      {filters.no_of_guest || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border-2"
                      onClick={incrementGuests}
                      disabled={(filters.no_of_guest || 0) >= 20}
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
    </div>
  );
}
