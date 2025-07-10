"use client";

import React, { useEffect, useState } from "react";
import MyPropertyCard from "@/components/MyPropertyCard/MyPropertyCard";
import { getPropertyList } from "@/services/Listfarm/listfarm.service";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/hooks/cookies";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";

export default function MyPropertyPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const data = await getPropertyList(token);
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch property list", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <img
          src="/bmflogofoot.svg"
          alt="Book My Farm Logo"
          className="w-40 h-40 md:w-60 md:h-60 animate-pulse mb-6"
        />
        <p className="text-neutral-500 text-sm animate-pulse">
          Loading your properties...
        </p>
      </div>
    );
  }

  return (
    <PublicPageLayout>
      <section id="my-property-list" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                My Properties
              </h2>
              <p className="text-neutral-600">
                Manage your listed farmhouses and view their current status
              </p>
              {properties.length > 0 && (
                <p className="text-sm text-neutral-500 mt-1">
                  {properties.length} property
                  {properties.length !== 1 ? "ies" : ""}
                </p>
              )}
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <MyPropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No properties found
              </h3>
              <p className="text-neutral-600 mb-6">
                You haven’t listed any properties yet.
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          )}
        </div>
      </section>
    </PublicPageLayout>
  );
}
