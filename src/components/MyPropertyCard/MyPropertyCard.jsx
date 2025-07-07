"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const statusMap = {
  0: { label: "Pending", color: "bg-gray-500" },
  1: { label: "Review", color: "bg-yellow-500" },
  2: { label: "In Review", color: "bg-blue-500" },
  3: { label: "Active", color: "bg-green-500" },
  4: { label: "Rejected", color: "bg-red-500" },
};

export default function MyPropertyCard({ property }) {
  const image = property.photos?.[0]
    ? `https://api.bookmyfarm.net/${property.photos[0]}`
    : "/placeholder.jpg";

  const status = statusMap[property.status] || { label: "Unknown", color: "bg-gray-400" };

  return (
    <div className="rounded-xl bg-white shadow-md overflow-hidden border">
      {/* Image */}
      <div className="relative aspect-video w-full">
        <Image
          src={image}
          alt={property.name}
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black truncate">
            {property.name}
          </h3>
          <span className="text-sm font-bold text-black">
            ₹{property.size}
          </span>
        </div>

        <div className="text-xs text-gray-500 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {property.near_by_area}, {property.city}
        </div>
      </div>
    </div>
  );
}
