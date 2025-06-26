export const staticVideos = [
  {
    id: 1,
    farmId: 1,
    title: "Pool Villa Tour",
    description: "Take a virtual tour of our luxury pool villa featuring modern amenities and beautiful outdoor spaces",
    videoUrl: "/01.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    duration: "2:34",
    category: "tour",
    createdAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: 2,
    farmId: 2,
    title: "Amenities Tour",
    description: "Explore the comprehensive amenities and facilities available at our heritage farmhouse",
    videoUrl: "02.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    duration: "1:47",
    category: "amenities",
    createdAt: new Date("2024-01-20T10:00:00Z"),
  },
  {
    id: 3,
    farmId: 3,
    title: "Activities Showcase",
    description: "Discover the exciting activities and recreational facilities available for guests of all ages",
    videoUrl: "03.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    duration: "3:12",
    category: "activities",
    createdAt: new Date("2024-02-01T10:00:00Z"),
  },
  {
    id: 4,
    farmId: 4,
    title: "Mountain Views",
    description: "Experience the breathtaking mountain views and natural beauty surrounding our retreat",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    duration: "2:18",
    category: "tour",
    createdAt: new Date("2024-02-10T10:00:00Z"),
  },
  {
    id: 5,
    farmId: 5,
    title: "Royal Estate Experience",
    description: "Step into luxury with our royal estate featuring grand architecture and premium facilities",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    duration: "4:25",
    category: "tour",
    createdAt: new Date("2024-02-15T10:00:00Z"),
  },
  {
    id: 6,
    farmId: 6,
    title: "Rustic Charm",
    description: "Enjoy the authentic countryside experience with traditional farming activities and rural charm",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    duration: "1:56",
    category: "activities",
    createdAt: new Date("2024-02-20T10:00:00Z"),
  }
];

export const getVideosByFarm = (farmId) => {
  return staticVideos.filter(video => video.farmId === farmId);
};

export const getVideosByCategory = (category) => {
  return staticVideos.filter(video => video.category.toLowerCase() === category.toLowerCase());
};

export const getFeaturedVideos = () => {
  return staticVideos.slice(0, 3);
};
