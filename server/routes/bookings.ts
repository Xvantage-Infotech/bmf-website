import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Mock bookings data
let mockBookings = [
  {
    id: 1,
    farmId: 1,
    userId: 1,
    checkIn: new Date('2023-07-15'),
    checkOut: new Date('2023-07-20'),
    adults: 2,
    children: 1,
    totalPrice: 750.00,
    status: 'confirmed',
    createdAt: new Date('2023-06-10')
  },
  {
    id: 2,
    farmId: 2,
    userId: 1,
    checkIn: new Date('2023-08-05'),
    checkOut: new Date('2023-08-10'),
    adults: 2,
    children: 0,
    totalPrice: 600.00,
    status: 'pending',
    createdAt: new Date('2023-07-01')
  },
  {
    id: 3,
    farmId: 3,
    userId: 2,
    checkIn: new Date('2023-09-10'),
    checkOut: new Date('2023-09-15'),
    adults: 4,
    children: 2,
    totalPrice: 1000.00,
    status: 'confirmed',
    createdAt: new Date('2023-08-01')
  }
];

// Create a new booking
router.post('/', (req, res) => {
  try {
    const { farmId, userId, checkIn, checkOut, adults, children, totalPrice } = req.body;

    if (!farmId || !userId || !checkIn || !checkOut || !adults || !totalPrice) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    // Create new booking
    const newBooking = {
      id: mockBookings.length + 1,
      farmId,
      userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children: children || 0,
      totalPrice,
      status: 'pending',
      createdAt: new Date()
    };

    mockBookings.push(newBooking);

    return res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get bookings for a user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userBookings = mockBookings.filter(booking => booking.userId === userId);

    return res.status(200).json(userBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Cancel a booking
router.put('/:id/cancel', (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const bookingIndex = mockBookings.findIndex(booking => booking.id === bookingId);

    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status to cancelled
    mockBookings[bookingIndex] = {
      ...mockBookings[bookingIndex],
      status: 'cancelled'
    };

    return res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: mockBookings[bookingIndex]
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

export default router;