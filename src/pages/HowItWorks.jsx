"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, CreditCard, MapPin, Star, Shield } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Search,
    title: 'Search & Discover',
    description: 'Browse through our curated collection of premium farmhouses. Use filters to find properties that match your preferences for location, amenities, and group size.',
    features: ['Advanced search filters', 'High-quality photos', 'Virtual tours', 'Guest reviews']
  },
  {
    step: 2,
    icon: Calendar,
    title: 'Select Dates & Book',
    description: 'Choose your check-in and check-out dates, specify the number of guests, and proceed with your booking. Our calendar shows real-time availability.',
    features: ['Real-time availability', 'Instant booking', 'Flexible dates', 'Group bookings']
  },
  {
    step: 3,
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Complete your booking with our secure payment system. We accept multiple payment methods and provide instant confirmation with detailed booking information.',
    features: ['Secure payments', 'Multiple payment options', 'Instant confirmation', 'Digital receipts']
  }
];

const benefits = [
  {
    icon: Shield,
    title: 'Verified Properties',
    description: 'All our farmhouses are personally verified by our team to ensure quality and authenticity.'
  },
  {
    icon: Star,
    title: '24/7 Support',
    description: 'Our customer support team is available round the clock to assist you with any queries.'
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    description: 'Carefully selected properties in scenic locations with easy accessibility and local attractions.'
  }
];

const faqs = [
  {
    question: 'How do I know if a property is available?',
    answer: 'Our booking system shows real-time availability. Simply select your dates to see available properties.'
  },
  {
    question: 'What happens after I book?',
    answer: 'You will receive an instant confirmation email with booking details, property information, and host contact details.'
  },
  {
    question: 'Can I modify my booking?',
    answer: 'Yes, you can modify your booking based on availability and the property\'s cancellation policy.'
  },
  {
    question: 'What if I face issues during my stay?',
    answer: 'Our 24/7 support team is always available to help resolve any issues during your stay.'
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 section-padding">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
            How <span className="text-primary">BookMyFarm</span> Works
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Booking your perfect farmhouse getaway is simple and straightforward. Follow these three easy steps to create unforgettable memories.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <Badge 
                        variant="default" 
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white"
                      >
                        {step.step}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{step.title}</h3>
                    <p className="text-neutral-600 mb-6 leading-relaxed">{step.description}</p>
                    
                    <div className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center text-sm text-neutral-700">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-l-primary border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-neutral-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Choose BookMyFarm?</h2>
            <p className="text-lg text-neutral-600">Experience the difference with our premium service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-neutral-600">Get answers to common questions about booking with us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-neutral-900 mb-3">{faq.question}</h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
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
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Browse our collection of premium farmhouses and book your perfect getaway today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              <a href="/" className="flex items-center">
                Browse Properties
              </a>
            </Button>
            <Button size="lg" variant="outline">
              <a href="/contact" className="flex items-center">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}