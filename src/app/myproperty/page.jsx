"use client";

import React, { useEffect, useState } from "react";
import MyPropertyCard from "@/components/MyPropertyCard/MyPropertyCard";
import { getPropertyList } from "@/services/Listfarm/listfarm.service";

export default function MyPropertyPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("accessToken"); // ✅ read token here
      console.log("📦 Access token:", token);

      if (!token) return;

      try {
        const data = await getPropertyList(token);
        console.log("🌿 MyProperty data:", data);
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch property list", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Property</h1>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-muted-foreground">You haven’t listed any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {properties.map((property) => (
            <MyPropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
