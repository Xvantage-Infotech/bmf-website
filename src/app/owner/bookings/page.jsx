"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import { getOwnerBookings } from "@/services/Owner/owner.service";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const farmId = 22;
  const startDate = "2025-07-01";
  const endDate = "2025-07-31";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    getOwnerBookings({ farmId, startDate, endDate, token })
      .then((data) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const bookedDates = bookings
    .filter((b) => b.status !== 0)
    .map((b) => new Date(b.check_in_date).getDate());

  const blockedDates = bookings
    .filter((b) => b.status === 0)
    .map((b) => new Date(b.check_in_date).getDate());

  return (
    <PublicPageLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Manage Your Booking</h1>

        {/* Static Header Farm */}
        <div className="flex items-center space-x-3">
          <Image
            src="/sample-farm.jpg"
            alt="Farm"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-base font-medium">Blue-Berry Farm</span>
          <ChevronRight className="ml-auto text-gray-400" />
        </div>

        {/* Month Selector */}
        <div className="flex justify-between items-center mt-4">
          <ChevronLeft className="cursor-pointer" />
          <h2 className="text-lg font-semibold">July 2025</h2>
          <ChevronRight className="cursor-pointer" />
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 text-center gap-y-2 text-sm">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="font-semibold text-gray-700">
              {d}
            </div>
          ))}

          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const isBlocked = blockedDates.includes(day);
            const isBooked = bookedDates.includes(day);

            return (
              <div
                key={day}
                className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto
                ${isBlocked ? "bg-green-500 text-white" : ""}
                ${isBooked ? "bg-red-400 text-white" : ""}
              `}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex space-x-6 text-sm mt-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Blocked</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span>Booked</span>
          </div>
        </div>

        {/* Booking Cards */}
        {!loading &&
          bookings.map((b, i) => {
            const farm = b.farm;
            const img = farm?.farm_images?.[0]?.image;
            const imageUrl = img
              ? `https://api.bookmyfarm.net/assets/images/farm_images/${img}`
              : "/sample-farm.jpg";

            return (
              <div
                key={i}
                className="rounded-xl border p-4 flex space-x-4 bg-white shadow"
              >
                <Image
                  src={imageUrl}
                  alt="Farm"
                  width={96}
                  height={96}
                  className="rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">
                      {farm.farm_alias_name}
                    </h3>
                    <div className="w-3 h-3 rounded-full bg-red-400 mt-1" />
                  </div>

                  <div className="text-sm mt-2 space-y-1 text-gray-700">
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      Check in:{" "}
                      <span className="ml-1 font-medium">
                        {new Date(b.check_in_date).toDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      Check out:{" "}
                      <span className="ml-1 font-medium">
                        {new Date(b.check_out_date).toDateString()}{" "}
                        {b.check_out_time?.slice(0, 5)}
                      </span>
                    </div>
                    <div>
                      Book by{" "}
                      <span className="font-medium text-black">
                        {b.description || "N/A"}
                      </span>
                    </div>
                    <div>
                      Number of Guests: <b>{b.no_of_guest || "-"}</b> — Total
                      Amount: <b>₹{b.total_price || "-"}</b>
                    </div>
                    {b.status === 0 && (
                      <div className="text-red-600 font-semibold">
                        Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </PublicPageLayout>
  );
}
