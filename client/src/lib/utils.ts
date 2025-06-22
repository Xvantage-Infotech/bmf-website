import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice).replace('₹', '₹');
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDuration(duration: string): string {
  // Convert duration like "2:34" to readable format
  const [minutes, seconds] = duration.split(':');
  return `${minutes}:${seconds}`;
}

export function generateStars(rating: number): React.ReactElement[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      React.createElement('i', { 
        key: `full-${i}`, 
        className: "fas fa-star text-yellow-400" 
      })
    );
  }
  
  // Half star
  if (hasHalfStar) {
    stars.push(
      React.createElement('i', { 
        key: "half", 
        className: "fas fa-star-half-alt text-yellow-400" 
      })
    );
  }
  
  // Empty stars
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

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function calculateTotalPrice(
  pricePerNight: number,
  nights: number,
  serviceFeePercentage: number = 5,
  taxPercentage: number = 12
): {
  subtotal: number;
  serviceFee: number;
  tax: number;
  total: number;
} {
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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d\s\-()]{7,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function getImageUrl(imagePath: string): string {
  // Helper to construct full image URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `/images/${imagePath}`;
}

export function getVideoUrl(videoPath: string): string {
  // Helper to construct full video URLs
  if (videoPath.startsWith('http')) {
    return videoPath;
  }
  return `/videos/${videoPath}`;
}

export function shareOnSocial(platform: 'facebook' | 'twitter' | 'whatsapp', url: string, text?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text || '');
  
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
