"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { MY_PROPERTY_IMAGE_BASE_URL } from "@/lib/utils";

const statusMap = {
  0: { label: "Pending", color: "bg-gray-500" },
  1: { label: "Review", color: "bg-yellow-500" },
  2: { label: "In Review", color: "bg-blue-500" },
  3: { label: "Active", color: "bg-green-500" },
  4: { label: "Rejected", color: "bg-red-500" },
};

export default function MyPropertyCard({ property }) {
  const image =
    property.photos && property.photos.length > 0
      ? `${MY_PROPERTY_IMAGE_BASE_URL}/${property.photos[0]}`
      : "/placeholder.jpg";

  const status = statusMap[property.status] || {
    label: "Unknown",
    color: "bg-gray-400",
  };

  const location = `${property.getarea?.name || property.area_id}, ${property.getcity?.name || property.city_id}`;

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm transition hover:shadow-md">
      {/* Image (cover fit, no absolute) */}
      <div className="relative h-48 w-full bg-neutral-200 overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={property.name}
          className="w-full h-full object-cover transition-opacity duration-700"
          loading="lazy"
        />

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${status.color}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-neutral-900 truncate">
            {property.name}
          </h3>
          <span className="text-sm font-bold text-black">
            ₹{property.weekday_full_day_price}
          </span>
        </div>
        <p className="text-neutral-600 text-xs flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </p>
      </div>
    </div>
  );
}
