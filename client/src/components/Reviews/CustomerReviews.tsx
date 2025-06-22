import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateStars } from '@/lib/utils';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

const staticReviews: Review[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Absolutely wonderful experience! The farmhouse was even better than the photos. Our family had an amazing time by the pool and the kids loved the outdoor space. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
  },
  {
    id: 2,
    name: 'Rajesh Patel',
    location: 'Surat',
    rating: 5,
    comment: 'Perfect venue for our corporate retreat. The facilities were top-notch and the peaceful environment helped our team bond really well. Will definitely book again!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
  },
  {
    id: 3,
    name: 'Meera Singh',
    location: 'Pune',
    rating: 4,
    comment: 'Beautiful property with excellent amenities. The location was convenient and the host was very responsive. Great value for money and a memorable weekend getaway.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
  }
];

export default function CustomerReviews() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">What Our Guests Say</h2>
          <p className="text-lg text-neutral-600">Read reviews from families who've created lasting memories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {staticReviews.map((review) => (
            <div key={review.id} className="bg-neutral-50 rounded-2xl p-6 animate-fade-in">
              <div className="flex mb-4">
                {generateStars(review.rating)}
              </div>
              <p className="text-neutral-700 italic mb-4 leading-relaxed">
                "{review.comment}"
              </p>
              <div className="flex items-center">
                <Avatar className="w-12 h-12 mr-3">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-neutral-900">{review.name}</p>
                  <p className="text-sm text-neutral-600">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
