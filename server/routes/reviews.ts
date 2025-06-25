import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Mock reviews data
let mockReviews = [
  {
    id: 1,
    farmId: 1,
    userId: 2,
    rating: 5,
    comment: 'Amazing experience! The farm was beautiful and the hosts were very welcoming.',
    createdAt: new Date('2023-07-25')
  },
  {
    id: 2,
    farmId: 1,
    userId: 3,
    rating: 4,
    comment: 'Great place to stay. Very peaceful and relaxing.',
    createdAt: new Date('2023-08-05')
  },
  {
    id: 3,
    farmId: 2,
    userId: 1,
    rating: 5,
    comment: 'Loved the heritage feel of this farm. Will definitely come back!',
    createdAt: new Date('2023-08-15')
  },
  {
    id: 4,
    farmId: 3,
    userId: 2,
    rating: 4,
    comment: 'The eco-friendly features were impressive. Very modern and comfortable.',
    createdAt: new Date('2023-09-01')
  }
];

// Get reviews for a farm
router.get('/farm/:farmId', (req, res) => {
  try {
    const farmId = parseInt(req.params.farmId);
    const farmReviews = mockReviews.filter(review => review.farmId === farmId);

    return res.status(200).json(farmReviews);
  } catch (error) {
    console.error('Error fetching farm reviews:', error);
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Create a new review
router.post('/', (req, res) => {
  try {
    const { farmId, userId, rating, comment } = req.body;

    if (!farmId || !userId || !rating) {
      return res.status(400).json({ message: 'Missing required review information' });
    }

    // Create new review
    const newReview = {
      id: mockReviews.length + 1,
      farmId,
      userId,
      rating,
      comment,
      createdAt: new Date()
    };

    mockReviews.push(newReview);

    // Update farm rating (in a real app, this would update the farm's average rating)
    // For now, we'll just return the new review

    return res.status(201).json({
      message: 'Review created successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Failed to create review' });
  }
});

export default router;