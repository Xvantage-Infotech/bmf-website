
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
    name: "Urban Oasis",
    description: "Experience luxury in the heart of Mumbai with our Urban Oasis farmhouse. This modern property combines city convenience with natural tranquility, featuring contemporary design and premium amenities.",
    location: "Vasai, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pricePerNight: "5200",
    bedrooms: 5,
    maxGuests: 16,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Modern Design", "Swimming Pool", "Gym", "WiFi", "Parking", 
      "City Access", "Premium Amenities", "Concierge Service", "Spa"
    ],
    category: "modern",
    rating: "4.5",
    reviewCount: 67,
    ownerId: 3,
    isActive: true,
    createdAt: new Date("2024-02-01T10:00:00Z"),
  },
  {
    id: 4,
    name: "Mountain Retreat",
    description: "Escape to our Mountain Retreat in Pune, offering breathtaking panoramic views and fresh mountain air. This scenic property is perfect for nature lovers and those seeking a peaceful getaway from city life.",
    location: "Lonavala Road, Pune",
    city: "Pune",
    state: "Maharashtra",
    pricePerNight: "4200",
    bedrooms: 4,
    maxGuests: 10,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Mountain Views", "Hiking Trails", "Bonfire Area", "WiFi", "Parking", 
      "Nature Walks", "Bird Watching", "Fresh Air", "Scenic Beauty"
    ],
    category: "modern",
    rating: "4.9",
    reviewCount: 23,
    ownerId: 4,
    isActive: true,
    createdAt: new Date("2024-02-10T10:00:00Z"),
  },
  {
    id: 5,
    name: "Royal Estate",
    description: "Experience royalty at our Royal Estate in Vadodara, featuring extensive grounds, luxury amenities, and regal architecture. This grand property is perfect for large gatherings and special celebrations.",
    location: "Makarpura, Vadodara",
    city: "Vadodara",
    state: "Gujarat",
    pricePerNight: "6000",
    bedrooms: 6,
    maxGuests: 20,
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Royal Architecture", "Extensive Grounds", "Grand Hall", "WiFi", "Parking", 
      "Event Space", "Catering Service", "Luxury Amenities", "Heritage Experience"
    ],
    category: "luxury",
    rating: "4.7",
    reviewCount: 41,
    ownerId: 5,
    isActive: true,
    createdAt: new Date("2024-02-15T10:00:00Z"),
  },
  {
    id: 6,
    name: "Rustic Cottage",
    description: "Discover the charm of countryside living at our Rustic Cottage in Surat. This cozy property offers authentic rural experiences with modern comforts, perfect for intimate gatherings and peaceful retreats.",
    location: "Bardoli, Surat",
    city: "Surat",
    state: "Gujarat",
    pricePerNight: "2200",
    bedrooms: 2,
    maxGuests: 6,
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Rustic Charm", "Garden", "Countryside Views", "WiFi", "Parking", 
      "Farm Experience", "Organic Food", "Peaceful Environment", "Nature Connection"
    ],
    category: "rustic",
    rating: "4.6",
    reviewCount: 29,
    ownerId: 6,
    isActive: true,
    createdAt: new Date("2024-02-20T10:00:00Z"),
  },
  {
    id: 7,
    name: "Eco Villa",
    description: "Stay at our environmentally conscious Eco Villa in Pune, featuring sustainable design and eco-friendly amenities. This contemporary property demonstrates how luxury and environmental responsibility can coexist.",
    location: "Hinjewadi, Pune",
    city: "Pune",
    state: "Maharashtra",
    pricePerNight: "3800",
    bedrooms: 3,
    maxGuests: 9,
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Eco-Friendly Design", "Solar Power", "Rainwater Harvesting", "WiFi", "Parking", 
      "Organic Garden", "Sustainable Living", "Green Technology", "Environmental Education"
    ],
    category: "modern",
    rating: "4.3",
    reviewCount: 55,
    ownerId: 7,
    isActive: true,
    createdAt: new Date("2024-03-01T10:00:00Z"),
  },
  {
    id: 8,
    name: "Family Paradise",
    description: "Create lasting memories at our Family Paradise in Mumbai, designed specifically for families with children. This property features safe play areas, entertainment facilities, and family-friendly amenities.",
    location: "Virar, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pricePerNight: "4500",
    bedrooms: 4,
    maxGuests: 14,
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    amenities: [
      "Kids Play Area", "Swimming Pool", "Game Room", "WiFi", "Parking", 
      "Family Entertainment", "Safe Environment", "Children Activities", "Baby Care"
    ],
    category: "family",
    rating: "4.8",
    reviewCount: 72,
    ownerId: 8,
    isActive: true,
    createdAt: new Date("2024-03-05T10:00:00Z"),
  }
];


export const getFarmById = (id) => {
  return staticFarms.find(farm => farm.id === id);
};

export const getFarmsByCity = (city) => {
  return staticFarms.filter(farm => farm.city.toLowerCase() === city.toLowerCase());
};

export const getFarmsByCategory = (category) => {
  return staticFarms.filter(farm => farm.category.toLowerCase() === category.toLowerCase());
};

export const searchFarms = (query) => {
  const searchTerm = query.toLowerCase();
  return staticFarms.filter(farm => 
    farm.name.toLowerCase().includes(searchTerm) ||
    farm.location.toLowerCase().includes(searchTerm) ||
    farm.city.toLowerCase().includes(searchTerm) ||
    farm.description.toLowerCase().includes(searchTerm)
  );
};

export const getFeaturedFarms = () => {
  return staticFarms.filter(farm => parseFloat(farm.rating) >= 4.5).slice(0, 3);
};

export const getCities = () => {
  return [...new Set(staticFarms.map(farm => farm.city))];
};

export const getCategories = () => {
  return [...new Set(staticFarms.map(farm => farm.category))];
};