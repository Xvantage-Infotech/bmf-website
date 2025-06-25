import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Mock farm data
const mockFarms = [
  {
    id: 1,
    name: 'Sunset Valley Farm',
    description: 'A beautiful farm with scenic views of the valley.',
    location: '123 Farm Road',
    city: 'Farmville',
    state: 'California',
    pricePerNight: 150.00,
    bedrooms: 3,
    maxGuests: 6,
    images: [
      '/images/farms/farm1-1.jpg',
      '/images/farms/farm1-2.jpg',
      '/images/farms/farm1-3.jpg'
    ],
    amenities: ['WiFi', 'Kitchen', 'Pool', 'Parking'],
    category: 'luxury',
    rating: 4.8,
    reviewCount: 24,
    ownerId: 1,
    isActive: true,
    createdAt: new Date('2023-01-15')
  },
  {
    id: 2,
    name: 'Heritage Homestead',
    description: 'Experience traditional farm life in this heritage property.',
    location: '456 Country Lane',
    city: 'Ruraltown',
    state: 'Vermont',
    pricePerNight: 120.00,
    bedrooms: 2,
    maxGuests: 4,
    images: [
      '/images/farms/farm2-1.jpg',
      '/images/farms/farm2-2.jpg'
    ],
    amenities: ['Fireplace', 'Garden', 'Farm animals', 'Hiking trails'],
    category: 'heritage',
    rating: 4.5,
    reviewCount: 18,
    ownerId: 2,
    isActive: true,
    createdAt: new Date('2023-02-20')
  },
  {
    id: 3,
    name: 'Modern Eco Farm',
    description: 'Sustainable living with modern amenities in a farm setting.',
    location: '789 Green Road',
    city: 'Ecoville',
    state: 'Oregon',
    pricePerNight: 200.00,
    bedrooms: 4,
    maxGuests: 8,
    images: [
      '/images/farms/farm3-1.jpg',
      '/images/farms/farm3-2.jpg',
      '/images/farms/farm3-3.jpg',
      '/images/farms/farm3-4.jpg'
    ],
    amenities: ['Solar power', 'Organic garden', 'EV charging', 'Smart home'],
    category: 'modern',
    rating: 4.9,
    reviewCount: 32,
    ownerId: 3,
    isActive: true,
    createdAt: new Date('2023-03-10')
  }
];

// Get all farms
router.get('/', (req, res) => {
  try {
    // Apply filters if provided
    let filteredFarms = [...mockFarms];
    
    const { category, minPrice, maxPrice, location } = req.query;
    
    if (category) {
      filteredFarms = filteredFarms.filter(farm => farm.category === category);
    }
    
    if (minPrice) {
      filteredFarms = filteredFarms.filter(farm => farm.pricePerNight >= Number(minPrice));
    }
    
    if (maxPrice) {
      filteredFarms = filteredFarms.filter(farm => farm.pricePerNight <= Number(maxPrice));
    }
    
    if (location) {
      const locationStr = String(location).toLowerCase();
      filteredFarms = filteredFarms.filter(farm => 
        farm.city.toLowerCase().includes(locationStr) || 
        farm.state.toLowerCase().includes(locationStr)
      );
    }
    
    return res.status(200).json(filteredFarms);
  } catch (error) {
    console.error('Error fetching farms:', error);
    return res.status(500).json({ message: 'Failed to fetch farms' });
  }
});

// Get farm by ID
router.get('/:id', (req, res) => {
  try {
    const farmId = parseInt(req.params.id);
    const farm = mockFarms.find(f => f.id === farmId);
    
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    
    return res.status(200).json(farm);
  } catch (error) {
    console.error('Error fetching farm:', error);
    return res.status(500).json({ message: 'Failed to fetch farm' });
  }
});

// Search farms
router.get('/search/:query', (req, res) => {
  try {
    const searchQuery = req.params.query.toLowerCase();
    
    const searchResults = mockFarms.filter(farm => 
      farm.name.toLowerCase().includes(searchQuery) ||
      farm.description.toLowerCase().includes(searchQuery) ||
      farm.location.toLowerCase().includes(searchQuery) ||
      farm.city.toLowerCase().includes(searchQuery) ||
      farm.state.toLowerCase().includes(searchQuery)
    );
    
    return res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching farms:', error);
    return res.status(500).json({ message: 'Failed to search farms' });
  }
});

export default router;