"use client";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="text-4xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Personal information (name, email, phone number)</li>
                <li>Booking and payment information</li>
                <li>Property details and photos</li>
                <li>Usage data and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>To process bookings and payments</li>
                <li>To communicate about your reservations</li>
                <li>To improve our services</li>
                <li>To send marketing communications (with consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Data Security</h2>
              <p className="text-neutral-700 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Contact Us</h2>
              <p className="text-neutral-700">
                For privacy-related questions, contact us at privacy@bookmyfarm.com
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}