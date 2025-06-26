import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price) {
  if (typeof price === 'string') {
    price = parseFloat(price)
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDuration(duration) {
  // Convert duration like "2-3 hours" to user-friendly format
  return duration
}

export function calculateNights(checkIn, checkOut) {
  const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
}

export function calculateTotalPrice(pricePerNight, checkIn, checkOut, guests = 2) {
  const nights = calculateNights(checkIn, checkOut)
  const basePrice = pricePerNight * nights
  
  // Add guest surcharge if more than 2 guests
  const guestSurcharge = guests > 2 ? (guests - 2) * 500 * nights : 0
  
  return basePrice + guestSurcharge
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function debounce(func, wait, immediate) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d\s\-\(\)]{8,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function getImageUrl(imagePath) {
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  return `/images/${imagePath}`
}

export function getVideoUrl(videoPath) {
  if (videoPath.startsWith('http')) {
    return videoPath
  }
  return `/videos/${videoPath}`
}

export function shareOnSocial(platform, url, text = '') {
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
  }
  
  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }
}