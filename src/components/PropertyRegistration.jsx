"use client";

import PropertyRegistrationForm from '@/components/forms/PropertyRegistrationForm';

export default function PropertyRegistration() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 section-padding">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
            List Your <span className="text-primary">Property</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Join our network of premium farmhouse owners and start earning from your property today
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Easy Registration</h3>
              <p className="text-sm text-neutral-600">Simple form to get started in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Property Verification</h3>
              <p className="text-sm text-neutral-600">We verify all properties for quality assurance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Start Earning</h3>
              <p className="text-sm text-neutral-600">Begin hosting guests and earning income</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Property Registration Form</h2>
            <p className="text-lg text-neutral-600">
              Please fill out all the required information to list your property on BookMyFarm
            </p>
          </div>

          <PropertyRegistrationForm />
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">What Happens Next?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Application Review</h3>
              <p className="text-sm text-neutral-600">
                Our team will review your application and property details within 2-3 business days
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Property Verification</h3>
              <p className="text-sm text-neutral-600">
                We'll schedule a visit to verify your property and take professional photos
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Go Live</h3>
              <p className="text-sm text-neutral-600">
                Once approved, your property will be listed and you can start receiving bookings
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}