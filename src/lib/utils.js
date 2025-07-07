import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice).replace('₹', '₹');
}

export function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDuration(duration) {
  const [minutes, seconds] = duration.split(':');
  return `${minutes}:${seconds}`;
}

export function generateStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      React.createElement('i', {
        key: `full-${i}`,
        className: "fas fa-star text-yellow-400"
      })
    );
  }

  if (hasHalfStar) {
    stars.push(
      React.createElement('i', {
        key: "half",
        className: "fas fa-star-half-alt text-yellow-400"
      })
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      React.createElement('i', {
        key: `empty-${i}`,
        className: "far fa-star text-yellow-400"
      })
    );
  }

  return stars;
}

export function calculateNights(checkIn, checkOut) {
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function calculateTotalPrice(
  pricePerNight,
  nights,
  serviceFeePercentage = 5,
  taxPercentage = 12
) {
  const subtotal = pricePerNight * nights;
  const serviceFee = subtotal * (serviceFeePercentage / 100);
  const tax = (subtotal + serviceFee) * (taxPercentage / 100);
  const total = subtotal + serviceFee + tax;
  
  return {
    subtotal,
    serviceFee,
    tax,
    total,
  };
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function debounce(func, wait) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;

  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d\s\-()]{7,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function getImageUrl(imagePath) {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `/images/${imagePath}`;
}

export function getVideoUrl(videoPath) {
  if (videoPath.startsWith('http')) {
    return videoPath;
  }
  return `/videos/${videoPath}`;
}

export function shareOnSocial(platform, url, text = '') {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  let shareUrl = '';

  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}



// utils/constants.ts
export const FARM_IMAGE_BASE_URL = "https://api.bookmyfarm.net/assets/images/farm_images";

export const AMENITY_ICON_BASE_URL = "https://api.bookmyfarm.net/assets/images/amenity-icons";
export const USER_PROFILE_IMAGE_BASE_URL = "https://api.bookmyfarm.net/assets/images/user_profiles";
