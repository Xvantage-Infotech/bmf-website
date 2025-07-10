"use client";

import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateStars } from "@/lib/utils";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";

const customerReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment:
      "Absolutely wonderful experience! The farmhouse was even better than the photos. Our family had an amazing time by the pool and the kids loved the outdoor space. The host was incredibly responsive and helpful throughout our stay.",
    avatar: "/img_1.jpg",
    farmName: "Green Valley Resort",
    stayDuration: "3 nights",
    verified: true,
  },
  {
    id: 2,
    name: "Rajesh Patel",
    location: "Surat",
    rating: 5,
    comment:
      "Perfect venue for our corporate retreat. The facilities were top-notch and the peaceful environment helped our team bond really well. The conference room was well-equipped and the catering service was excellent.",
    avatar: "/img_2.jpg",
    farmName: "Heritage Villa",
    stayDuration: "2 nights",
    verified: true,
  },
  {
    id: 3,
    name: "Meera Singh",
    location: "Pune",
    rating: 4,
    comment:
      "Beautiful property with excellent amenities. The location was convenient and the host was very responsive. Great value for money and a memorable weekend getaway. The pool area was particularly impressive.",
    avatar: "/img_3.jpg",
    farmName: "Mountain Retreat",
    stayDuration: "2 nights",
    verified: true,
  },
  {
    id: 4,
    name: "Arjun Mehta",
    location: "Delhi",
    rating: 5,
    comment:
      "An unforgettable family vacation! The kids had a blast in the swimming pool while we adults enjoyed the peaceful garden area. The kitchen was fully equipped, making it easy to prepare meals. Highly recommend for families!",
    avatar: "/img_4.jpg",
    farmName: "Royal Estate",
    stayDuration: "4 nights",
    verified: true,
  },
  {
    id: 5,
    name: "Kavya Reddy",
    location: "Bangalore",
    rating: 5,
    comment:
      "Exceeded all expectations! The farmhouse was immaculate, the grounds were beautifully maintained, and the views were spectacular. Perfect for a romantic getaway. The host went above and beyond to ensure our comfort.",
    avatar: "/img_6.jpg",
    farmName: "Eco Villa",
    stayDuration: "3 nights",
    verified: true,
  },
  {
    id: 6,
    name: "Vikram Joshi",
    location: "Ahmedabad",
    rating: 4,
    comment:
      "Great property for large groups. We celebrated my birthday here with 15 friends and everyone had an amazing time. The barbecue area was perfect for our evening gatherings. Would definitely book again!",
    avatar: "/img_5.jpg",
    farmName: "Family Paradise",
    stayDuration: "2 nights",
    verified: true,
  },
];

const stats = [
  { label: "Happy Customers", value: "2,500+", icon: "😊" },
  { label: "Five Star Reviews", value: "1,800+", icon: "⭐" },
  { label: "Properties Booked", value: "5,000+", icon: "🏡" },
  { label: "Cities Covered", value: "25+", icon: "🌆" },
];

export default function HappyCustomers() {
  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 section-padding">
          <div className="max-w-7xl mx-auto container-padding text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
              Our <span className="text-primary">Happy Customers</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
              Discover what our guests are saying about their memorable
              experiences at our premium farmhouses
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Guest Reviews
              </h2>
              <p className="text-lg text-neutral-600">
                Real experiences from real guests
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customerReviews.map((review) => (
                <Card key={review.id} className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-neutral-900">
                            {review.name}
                          </h4>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">
                          {review.location}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-2">
                            {generateStars(review.rating)}
                          </div>
                          <span className="text-xs text-neutral-500">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Quote className="w-6 h-6 text-primary/20 mb-2" />
                      <p className="text-neutral-700 leading-relaxed text-sm">
                        "{review.comment}"
                      </p>
                    </div>

                    <div className="border-t border-neutral-100 pt-4">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Stayed at {review.farmName}</span>
                        <span>{review.stayDuration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary/5">
          <div className="max-w-4xl mx-auto text-center container-padding">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Ready to Create Your Own Memory?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Join thousands of satisfied guests who have experienced the magic
              of our farmhouses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Properties
              </a>
              <a
                href="/contact"
                className="border border-neutral-300 text-neutral-700 px-8 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
