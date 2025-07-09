"use client";

import { useState } from "react";
import emailjs from "emailjs-com";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const { show } = useDialog();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_8lfomk4", // 🔁 Replace with your actual Service ID
        "template_zxhhmyx", // Template ID (keep same if named like in your screenshot)
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        "wvwJX6k0s712hImO9" // 🔁 Replace with your actual Public Key from EmailJS
      );

      show({
        title: "Success",
        description: "Message sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      show({
        title: "Message Failed",
        description: "Failed to send message. Please try again later.",
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 9277778778"],
      description: "Call us for immediate assistance",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@bookmyfarm.net"],
      description: "Send us an email anytime",
    },
    {
      icon: MapPin,
      title: "Office",
      details: [
        "Platinum point, 319, opp. CNG Pump, Sudama Chowk, Mota Varachha, Surat, Gujarat",
      ],
      description: "Visit our main office",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Mon - Fri: 9:00 AM - 7:00 PM",
        "Sat - Sun: 10:00 AM - 6:00 PM",
      ],
      description: "We are here to help",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 section-padding">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Have questions? We're here to help you find the perfect farmhouse
            for your next getaway
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-neutral-900">
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          placeholder="+91 9277778778"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) =>
                            handleChange("subject", e.target.value)
                          }
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleChange("message", e.target.value)
                        }
                        placeholder="Tell us more about your requirements..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-primary/90"
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Contact Information
                </h2>
                <p className="text-neutral-600 mb-8">
                  We're always here to help you find the perfect farmhouse
                  experience. Reach out to us through any of the channels below.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">
                            {info.title}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-2">
                            {info.description}
                          </p>
                          {info.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className="text-neutral-800 font-medium"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Quick Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 justify-start"
                    onClick={() => window.open("tel:+919277778778", "_self")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start"
                    onClick={() =>
                      window.open("https://wa.me/919277778778", "_blank")
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral-50">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do I book a farmhouse?",
                answer:
                  'Simply browse our properties, select your dates, and click "Book Now" to start the reservation process.',
              },
              {
                question: "What is included in the price?",
                answer:
                  "All our properties include basic amenities, maintenance, and 24/7 support. Additional services may vary by property.",
              },
              {
                question: "Can I cancel my booking?",
                answer:
                  "Yes, cancellation policies vary by property. Please check the specific cancellation terms during booking.",
              },
              {
                question: "Are pets allowed?",
                answer:
                  'Pet policies vary by property. Look for the "Pet Friendly" tag or contact us for specific requirements.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-neutral-600 text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
