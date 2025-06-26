export const staticFarms = [
  {
    id: 1,
    name: "Green Valley Resort",
    description: "Escape to our luxurious Green Valley Resort, a stunning farmhouse nestled in the heart of Surat's countryside. This magnificent property offers the perfect blend of modern amenities and natural beauty, making it ideal for family gatherings, corporate retreats, or romantic getaways.",
    location: "Kamrej, Surat",
    city: "Surat",
    state: "Gujarat",
    pricePerNight: "3500",
    bedrooms: 4,
    maxGuests: 12,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Private Swimming Pool", "Air Conditioning", "Free WiFi", "Parking", 
      "Kitchen", "BBQ Grill", "Garden", "Security", "Housekeeping", "24/7 Support"
    ],
    category: "luxury",
    rating: "4.2",
    reviewCount: 48,
    ownerId: 1,
    isActive: true,
    createdAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: 2,
    name: "Heritage Villa",
    description: "Step back in time at our Heritage Villa in Daman, featuring traditional architecture with modern comforts. This charming property boasts authentic design elements, peaceful gardens, and a serene atmosphere perfect for a cultural retreat.",
    location: "Nani Daman",
    city: "Daman",
    state: "Gujarat",
    pricePerNight: "2800",
    bedrooms: 3,
    maxGuests: 8,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Traditional Architecture", "Garden Views", "WiFi", "Parking", 
      "Kitchen", "Cultural Tours", "Peaceful Environment", "Heritage Décor"
    ],
    category: "heritage",
    rating: "4.8",
    reviewCount: 32,
    ownerId: 2,
    isActive: true,
    createdAt: new Date("2024-01-20T10:00:00Z"),
  },
  {
    id: 3,
    name: "Riverside Retreat",
    description: "Unwind at our Riverside Retreat in the scenic hills of Silvassa. This modern farmhouse offers breathtaking river views, contemporary amenities, and direct access to nature trails, making it perfect for adventure enthusiasts and peace seekers alike.",
    location: "Silvassa Hills",
    city: "Silvassa",
    state: "Dadra and Nagar Haveli",
    pricePerNight: "4200",
    bedrooms: 5,
    maxGuests: 14,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1602919814671-0c81d5e30077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "River Views", "Nature Trails", "Modern Kitchen", "WiFi", "Parking", 
      "Outdoor Activities", "Fishing", "Bonfire Area", "Scenic Views"
    ],
    category: "modern",
    rating: "4.6",
    reviewCount: 67,
    ownerId: 3,
    isActive: true,
    createdAt: new Date("2024-02-01T10:00:00Z"),
  },
  {
    id: 4,
    name: "Country Cottage",
    description: "Experience rustic charm at our Country Cottage in Bharuch. This cozy farmhouse features traditional décor, organic gardens, and farm-to-table dining experiences. Perfect for families seeking an authentic rural experience.",
    location: "Bharuch Village",
    city: "Bharuch",
    state: "Gujarat",
    pricePerNight: "2200",
    bedrooms: 2,
    maxGuests: 6,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Organic Garden", "Farm-to-Table", "Traditional Décor", "WiFi", 
      "Parking", "Rural Experience", "Farm Animals", "Local Cuisine"
    ],
    category: "rustic",
    rating: "4.3",
    reviewCount: 28,
    ownerId: 4,
    isActive: true,
    createdAt: new Date("2024-02-10T10:00:00Z"),
  },
  {
    id: 5,
    name: "Family Paradise",
    description: "Discover our Family Paradise in Vapi, designed specifically for multi-generational gatherings. This spacious farmhouse features kid-friendly amenities, elderly-accessible facilities, and entertainment options for all ages.",
    location: "Vapi Outskirts",
    city: "Vapi",
    state: "Gujarat",
    pricePerNight: "3800",
    bedrooms: 6,
    maxGuests: 18,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Kid-Friendly", "Elderly Accessible", "Large Dining Area", "WiFi", 
      "Parking", "Games Room", "Safe Environment", "Family Activities"
    ],
    category: "family",
    rating: "4.7",
    reviewCount: 91,
    ownerId: 5,
    isActive: true,
    createdAt: new Date("2024-02-15T10:00:00Z"),
  }
];

export const getFarmById = (id) => {
  return staticFarms.find(farm => farm.id === parseInt(id));
};

export const getFarmsByCity = (city) => {
  if (!city) return staticFarms;
  return staticFarms.filter(farm => 
    farm.city.toLowerCase().includes(city.toLowerCase())
  );
};

export const getFarmsByCategory = (category) => {
  if (!category) return staticFarms;
  return staticFarms.filter(farm => farm.category === category);
};

export const searchFarms = (query) => {
  if (!query) return staticFarms;
  const lowerQuery = query.toLowerCase();
  return staticFarms.filter(farm => 
    farm.name.toLowerCase().includes(lowerQuery) ||
    farm.description.toLowerCase().includes(lowerQuery) ||
    farm.location.toLowerCase().includes(lowerQuery) ||
    farm.city.toLowerCase().includes(lowerQuery)
  );
};

export const getFeaturedFarms = () => {
  return staticFarms.filter(farm => farm.rating >= "4.5");
};

export const getCities = () => {
  return [...new Set(staticFarms.map(farm => farm.city))];
};

export const getCategories = () => {
  return [...new Set(staticFarms.map(farm => farm.category))];
};