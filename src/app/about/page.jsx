"use client";

import PublicPageLayout from "@/components/Layout/PublicPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function About() {
    const  router = useRouter();
  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-white">
        <section className="section-padding bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-7xl mx-auto container-padding text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
              About <span className="text-primary">BookMyFarm</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Your gateway to unforgettable farm stays, family getaways, and nature retreats across India.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="max-w-6xl mx-auto container-padding grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Who We Are
              </h2>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                BookMyFarm is a platform built to connect people with the best farmhouses and nature retreats around. Whether it's a weekend escape, a birthday celebration, or a corporate retreat — we make it seamless to discover, book, and enjoy verified farm experiences.
              </p>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                With real-time availability, secure payments, curated listings, and customer support, we ensure your rural getaway is as smooth as any premium vacation.
              </p>
              <Button size="lg" className="mt-4" onClick={() => router.push("/")}>
                Explore Farmhouses
              </Button>
            </div>

            <div>
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-neutral-900">
                    Our Mission
                  </h3>
                  <p className="text-neutral-700">
                    To redefine short rural getaways by making farmhouse booking as simple as booking a hotel – trustworthy, modern, and beautiful.
                  </p>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    Why Choose Us?
                  </h3>
                  <ul className="list-disc pl-5 text-neutral-700 space-y-2">
                    <li>Verified farm properties with real photos</li>
                    <li>Flexible booking and easy cancellations</li>
                    <li>24/7 customer support</li>
                    <li>Great prices for large groups & families</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 section-padding">
          <div className="max-w-6xl mx-auto container-padding text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Join the Farm Stay Revolution
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto mb-6">
              Thousands of happy guests have already found peace, privacy, and fun at our partner farms.
            </p>
            <Button size="lg" onClick={() => router.push("/contact")}>
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
