import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqData = [
  {
    category: 'Booking',
    questions: [
      {
        question: 'How do I book a farmhouse?',
        answer: 'Simply browse our properties, select your preferred dates, choose the number of guests, and click "Book Now". You\'ll be guided through the secure payment process to confirm your reservation.'
      },
      {
        question: 'Can I modify my booking?',
        answer: 'Yes, you can modify your booking based on availability and the property\'s modification policy. Contact our support team or check your booking details in your account.'
      },
      {
        question: 'What happens if I need to cancel?',
        answer: 'Cancellation policies vary by property. Most properties offer free cancellation up to 24-48 hours before check-in. Check the specific cancellation policy during booking.'
      }
    ]
  },
  {
    category: 'Payments',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our encrypted payment gateway.'
      },
      {
        question: 'When will I be charged?',
        answer: 'Payment is typically charged immediately upon booking confirmation. Some properties may offer pay-at-property options, which will be clearly indicated during booking.'
      },
      {
        question: 'Are there any additional fees?',
        answer: 'The price shown includes base accommodation. Additional fees may apply for extra guests, pets, or special services. All fees are clearly displayed before payment.'
      }
    ]
  },
  {
    category: 'Property',
    questions: [
      {
        question: 'What amenities are included?',
        answer: 'Each property listing includes a detailed amenities section. Common amenities include swimming pools, kitchens, parking, WiFi, and garden areas. Check individual listings for specific details.'
      },
      {
        question: 'Are pets allowed?',
        answer: 'Pet policies vary by property. Look for the "Pet Friendly" tag on listings or contact the property owner directly. Additional pet fees may apply.'
      },
      {
        question: 'Is food included in the booking?',
        answer: 'Most properties have fully equipped kitchens for self-catering. Some properties offer catering services for an additional fee. Check the property amenities and contact the owner for meal arrangements.'
      }
    ]
  },
  {
    category: 'Support',
    questions: [
      {
        question: 'What if I face issues during my stay?',
        answer: 'Our 24/7 customer support team is available to help resolve any issues. You can reach us through phone, WhatsApp, or the support chat in your booking confirmation.'
      },
      {
        question: 'How do I contact the property owner?',
        answer: 'Property owner contact details are provided in your booking confirmation email. You can also message them through our platform for any specific requirements.'
      },
      {
        question: 'What if the property doesn\'t match the listing?',
        answer: 'If the property significantly differs from the listing, contact our support team immediately. We\'ll work to resolve the issue and ensure you have a satisfactory stay.'
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 section-padding">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find answers to common questions about booking, payments, and our services
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          {faqData.map((category, categoryIndex) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">{category.category}</h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems.includes(itemId);
                  
                  return (
                    <Card key={itemId} className="overflow-hidden">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full text-left p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                        >
                          <h3 className="font-semibold text-neutral-900 pr-4">
                            {faq.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        <div className={cn(
                          "overflow-hidden transition-all duration-200",
                          isOpen ? "max-h-96" : "max-h-0"
                        )}>
                          <div className="px-6 pb-6">
                            <p className="text-neutral-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-neutral-50">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Our support team is here to help you with any additional questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank"
              rel="noopener noreferrer"
              className="border border-neutral-300 text-neutral-700 px-8 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}