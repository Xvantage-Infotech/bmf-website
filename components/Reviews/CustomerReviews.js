'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Absolutely amazing experience at Green Valley Resort! The property was even better than the photos. Clean, spacious, and the staff was incredibly helpful. Perfect for our family reunion.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 2,
    name: "Rajesh Patel",
    location: "Ahmedabad",
    rating: 5,
    comment: "Heritage Villa exceeded all expectations. The traditional architecture combined with modern amenities was perfect. Great location and peaceful environment for a weekend getaway.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 3,
    name: "Anita Desai",
    location: "Pune",
    rating: 4,
    comment: "Riverside Retreat was fantastic! Beautiful views and great amenities. The kids loved the outdoor activities. Only minor issue was check-in timing, but overall excellent stay.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Delhi",
    rating: 5,
    comment: "Country Cottage provided an authentic rural experience. Fresh farm produce, peaceful surroundings, and friendly hosts made it memorable. Highly recommend for city dwellers!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: 5,
    name: "Meera Joshi",
    location: "Bangalore",
    rating: 5,
    comment: "Family Paradise lived up to its name! Three generations of our family stayed comfortably. Kid-friendly facilities and elderly-accessible features were thoughtfully designed.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  const nextReview = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= reviews.length ? 0 : prev + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, reviews.length - itemsPerView) : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read reviews from families who have experienced our farm stays
          </p>
        </div>

        <div className="relative">
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 leading-relaxed line-clamp-4">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevReview}
              disabled={currentIndex === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextReview}
              disabled={currentIndex + itemsPerView >= reviews.length}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(reviews.length / itemsPerView) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerView)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? 'bg-primary'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="mt-16 bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 text-white text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">4.8/5</div>
              <div className="text-green-100">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-green-100">Happy Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-green-100">Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}