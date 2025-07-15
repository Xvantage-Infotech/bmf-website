"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function PropertyDetailDialog({ open, onClose, property }) {
  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property.name}</DialogTitle>
          <DialogDescription>View property details</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <p className="text-xs font-medium text-neutral-500 mb-1">Address</p>
            <p className="text-sm font-semibold text-neutral-800">
              {property.address}, {property.getarea?.name}, {property.getcity?.name}
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-1">Weekday Price</p>
              <p className="text-sm font-semibold">₹{property.weekday_full_day_price}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-1">Weekend Price</p>
              <p className="text-sm font-semibold">₹{property.weekend_full_day_price}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-1">Check-in</p>
              <p className="text-sm font-semibold">{property.check_in_time}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-1">Check-out</p>
              <p className="text-sm font-semibold">{property.check_out_time}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <p className="text-xs font-medium text-neutral-500 mb-1">Swimming Pool Size</p>
            <p className="text-sm font-semibold">{property.swimming_pool_size}</p>
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <p className="text-xs font-medium text-neutral-500 mb-1">Facilities</p>
            <p className="text-sm font-semibold">{property.facilities}</p>
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <p className="text-xs font-medium text-neutral-500 mb-1">House Rules</p>
            <p className="text-sm font-semibold">{property.house_rule_policy}</p>
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <p className="text-xs font-medium text-neutral-500 mb-1">Care Taker</p>
            <p className="text-sm font-semibold">
              {property.care_taker_name} ({property.care_taker_number})
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <p className="text-xs font-medium text-neutral-500 mb-1">Map</p>
            <a
              href={property.location_link}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-blue-600 underline"
            >
              Open in Maps
            </a>
          </div>

          {property.photos?.length > 0 && (
            <div className="rounded-lg border p-4 bg-white shadow-sm">
              <p className="text-xs font-medium text-neutral-500 mb-2">Photos</p>
              <div className="grid grid-cols-2 gap-3">
                {property.photos.map((img, i) => (
                  <img
                    key={i}
                    src={`https://api.bookmyfarm.net/${img}`}
                    alt={`Property image ${i + 1}`}
                    className="w-full h-40 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
