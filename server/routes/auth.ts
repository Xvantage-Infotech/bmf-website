import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Mock OTP storage (in a real app, this would be in a database with expiration)
const otpStore: Record<string, { otp: string; expiry: number }> = {};

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to phone number
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate a new OTP
    const otp = generateOTP();
    
    // Store OTP with 10-minute expiry
    otpStore[phoneNumber] = {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // In a real app, you would send the OTP via SMS here
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    return res.status(200).json({ 
      message: 'OTP sent successfully',
      // For development, return the OTP in the response
      // In production, remove this
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP and login/signup
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    // Check if OTP exists and is valid
    const storedOTP = otpStore[phoneNumber];
    if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear the OTP after successful verification
    delete otpStore[phoneNumber];

    // Check if user exists
    let user = await storage.getUserByMobileNumber(phoneNumber);

    // If user doesn't exist, create a new one
    if (!user) {
      user = {
        id: Date.now(),
        name: '',
        mobileNumber: phoneNumber,
      };
      await storage.createUser(user);
    }

    return res.status(200).json({ 
      message: 'OTP verified successfully', 
      user 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Signup/update user
router.post('/signup', async (req, res) => {
  try {
    const { name, mobileNumber, email } = req.body;

    if (!name || !mobileNumber) {
      return res.status(400).json({ message: 'Name and mobile number are required' });
    }

    // Check if user exists
    let user = await storage.getUserByMobileNumber(mobileNumber);

    if (user) {
      // Update existing user
      user = {
        ...user,
        name,
        email: email || user.email,
      };
      await storage.updateUser(user);
    } else {
      // Create new user
      user = {
        id: Date.now(),
        name,
        mobileNumber,
        email,
      };
      await storage.createUser(user);
    }

    return res.status(200).json({ 
      message: 'User created/updated successfully', 
      user 
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return res.status(500).json({ message: 'Failed to create/update user' });
  }
});

// Update user profile
router.post('/update-profile', async (req, res) => {
  try {
    const { userId, name, email, address, location, dateOfBirth, profileImage, firebaseUid } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get existing user
    let user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user = {
      ...user,
      name: name || user.name,
      email: email || user.email,
      address: address || user.address,
      location: location || user.location,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      profileImage: profileImage || user.profileImage,
      firebaseUid: firebaseUid || user.firebaseUid
    };

    await storage.updateUser(user);

    return res.status(200).json({ 
      message: 'Profile updated successfully', 
      user 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;