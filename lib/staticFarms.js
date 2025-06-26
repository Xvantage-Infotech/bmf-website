export const staticFarms = [
  {
    id: 1,
    name: "Green Valley Farm Resort",
    location: "Lonavala, Maharashtra",
    city: "Lonavala",
    state: "Maharashtra",
    price: 4500,
    rating: 4.8,
    reviews: 234,
    category: "farmhouse",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1520637836862-4d197d17c78a"
    ],
    amenities: ["Swimming Pool", "WiFi", "AC", "Garden", "Parking"],
    maxGuests: 8,
    bedrooms: 3,
    bathrooms: 2,
    description: "Beautiful farmhouse with modern amenities and scenic views",
    availability: true
  },
  {
    id: 2,
    name: "Sunrise Villa Estate",
    location: "Alibag, Maharashtra",
    city: "Alibag",
    state: "Maharashtra", 
    price: 6800,
    rating: 4.6,
    reviews: 167,
    category: "villa",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
    ],
    amenities: ["Private Beach", "Pool", "Chef", "WiFi", "Garden"],
    maxGuests: 12,
    bedrooms: 4,
    bathrooms: 3,
    description: "Luxury villa with private beach access and premium services",
    availability: true
  },
  {
    id: 3,
    name: "Mountain View Resort",
    location: "Mahabaleshwar, Maharashtra",
    city: "Mahabaleshwar",
    state: "Maharashtra",
    price: 3200,
    rating: 4.7,
    reviews: 189,
    category: "resort",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"
    ],
    amenities: ["Mountain View", "Trekking", "Bonfire", "WiFi", "Restaurant"],
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 2,
    description: "Serene resort nestled in the mountains with adventure activities",
    availability: true
  }
];

export const getFarmById = (id) => {
  return staticFarms.find(farm => farm.id === parseInt(id));
};

export const getFarmsByCity = (city) => {
  return staticFarms.filter(farm => 
    farm.city.toLowerCase().includes(city.toLowerCase())
  );
};

export const getFarmsByCategory = (category) => {
  return staticFarms.filter(farm => farm.category === category);
};

export const searchFarms = (query) => {
  return staticFarms.filter(farm =>
    farm.name.toLowerCase().includes(query.toLowerCase()) ||
    farm.location.toLowerCase().includes(query.toLowerCase()) ||
    farm.city.toLowerCase().includes(query.toLowerCase())
  );
};

export const getFeaturedFarms = () => {
  return staticFarms.filter(farm => farm.rating >= 4.5);
};

export const getCities = () => {
  return [...new Set(staticFarms.map(farm => farm.city))];
};

export const getCategories = () => {
  return [...new Set(staticFarms.map(farm => farm.category))];
};