import { Star, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const staticReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    date: "2 weeks ago",
    farmName: "Green Valley Farm Resort",
    review: "Absolutely amazing experience! The farm was pristine, the hosts were incredibly welcoming, and the organic food was delicious. Perfect weekend getaway from the city.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Pune",
    rating: 5,
    date: "1 month ago",
    farmName: "Sunrise Villa Estate",
    review: "The villa exceeded all expectations. Private beach access, excellent amenities, and breathtaking sunrise views. My family loved every moment of our stay.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Anita Desai",
    location: "Delhi",
    rating: 4,
    date: "3 weeks ago",
    farmName: "Mountain View Resort",
    review: "Beautiful mountain setting with great trekking opportunities. The staff was helpful and the property was well-maintained. Highly recommend for nature lovers.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

export default function CustomerReviews() {
  const averageRating = staticReviews.reduce((sum, review) => sum + review.rating, 0) / staticReviews.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What Our Guests Say
        </h2>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-6 h-6 ${star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xl font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
          <span className="text-gray-600">({staticReviews.length} reviews)</span>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real experiences from families who've enjoyed our premium farm stays
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staticReviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-600">{review.location}</p>
                </div>
              </div>
              <Quote className="w-6 h-6 text-green-600 opacity-50" />
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>

            <Badge variant="secondary" className="mb-3 text-xs">
              {review.farmName}
            </Badge>

            <p className="text-gray-700 leading-relaxed">
              "{review.review}"
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
          <p className="text-gray-700">Happy Families</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
          <p className="text-gray-700">Average Rating</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
          <p className="text-gray-700">Premium Properties</p>
        </div>
      </div>
    </div>
  );
}