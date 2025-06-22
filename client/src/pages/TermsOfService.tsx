export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="text-4xl font-bold text-neutral-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-700 mb-4">
                By accessing and using BookMyFarm's services, you accept and agree to be bound by these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Booking and Payments</h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>All bookings are subject to property availability</li>
                <li>Payment is required to confirm your reservation</li>
                <li>Cancellation policies vary by property</li>
                <li>Additional charges may apply for extra services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. Property Owners</h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>All property information must be accurate and up-to-date</li>
                <li>Properties must meet our quality standards</li>
                <li>Owners are responsible for guest safety and satisfaction</li>
                <li>Commission fees apply to all bookings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Guest Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Respect property rules and regulations</li>
                <li>Report any damages or issues immediately</li>
                <li>Provide accurate guest count and information</li>
                <li>Follow check-in and check-out procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-neutral-700 mb-4">
                BookMyFarm acts as a platform connecting guests and property owners. We are not liable for property conditions, guest behavior, or disputes between parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Contact Information</h2>
              <p className="text-neutral-700">
                For questions about these terms, please contact us at legal@bookmyfarm.com
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}