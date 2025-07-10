// ImprovedDatePicker.jsx
"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { formatDate, calculateNights, cn } from "@/lib/utils";

export default function ImprovedDatePicker({
  checkIn,
  checkOut,
  checkInTime,
  checkOutTime,
  onCheckInChange,
  onCheckOutChange,
  onCheckInTimeChange,
  onCheckOutTimeChange,
  checkInOptions = [],
  checkOutOptions = [],
  className = "",
}) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const getCurrentTime12Hr = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const today = new Date();

    // Set checkIn to today if not already set
    if (!checkIn) {
      onCheckInChange?.(today);
    }

    // Set checkOut to today initially if not already set
    if (!checkOut) {
      onCheckOutChange?.(today);
    }

    // Default check-in time
    if (!checkInTime) {
      const fallback = formattedCheckInOptions[0] || getCurrentTime12Hr();
      onCheckInTimeChange?.(fallback);
    }

    // Default check-out time
    if (!checkOutTime) {
      const fallback = formattedCheckOutOptions[0] || getCurrentTime12Hr();
      onCheckOutTimeChange?.(fallback);
    }
  }, []);

  const convert24To12Hour = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const formattedCheckInOptions = checkInOptions.map(convert24To12Hour);
  const formattedCheckOutOptions = checkOutOptions.map(convert24To12Hour);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

  const handleCheckInSelect = (date) => {
    if (!date) return;

    onCheckInChange?.(date);
    setIsCheckInOpen(false);

    // Set default check-in time
    if (!checkInTime && formattedCheckInOptions.length) {
      onCheckInTimeChange?.(formattedCheckInOptions[0]);
    }

    // Handle invalid checkOut
    if (checkOut && checkOut <= date) {
      onCheckOutChange(undefined);
      setTimeout(() => setIsCheckOutOpen(true), 200); // auto prompt for new checkout
    }

    // If no checkOut at all, auto open it
    if (!checkOut) {
      setTimeout(() => setIsCheckOutOpen(true), 200);
    }
  };

  const handleCheckOutSelect = (date) => {
    onCheckOutChange?.(date);
    setIsCheckOutOpen(false);
  };

  if (!checkOutTime && formattedCheckOutOptions.length) {
    onCheckOutTimeChange?.(formattedCheckOutOptions[0]);
  }

  const getMinCheckOutDate = () => {
    if (checkIn) {
      return checkIn; // Allow check-out to be the same day as check-in
    }
    return tomorrow; // Default to tomorrow if checkIn is not set
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-2 border-neutral-100 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Check-in
              </Label>
              <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2",
                      !checkIn && "text-neutral-500",
                      checkIn && "border-primary/20 bg-primary/5"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-neutral-500">
                        {checkIn ? "Selected" : "Select date"}
                      </span>
                      <span className="font-medium">
                        {checkIn ? formatDate(checkIn) : "Add date"}
                      </span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={handleCheckInSelect}
                    disabled={(date) =>
                      date.setHours(0, 0, 0, 0) <
                      new Date().setHours(0, 0, 0, 0)
                    }
                    initialFocus
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
              {checkIn && (
                <div className="mt-2">
                  <Label className="text-xs text-neutral-500">
                    Check-in Time
                  </Label>
                  <select
                    className="w-full mt-1 p-2 border rounded text-sm"
                    value={checkInTime}
                    onChange={(e) => onCheckInTimeChange?.(e.target.value)}
                  >
                    {formattedCheckInOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Check-out
              </Label>
              <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2",
                      !checkOut && "text-neutral-500",
                      checkOut && "border-primary/20 bg-primary/5",
                      !checkIn && "opacity-50"
                    )}
                    disabled={!checkIn}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-neutral-500">
                        {checkOut
                          ? "Selected"
                          : checkIn
                          ? "Select date"
                          : "Check-out"}
                      </span>
                      <span className="font-medium">
                        {checkOut ? formatDate(checkOut) : "Add date"}
                      </span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={handleCheckOutSelect}
                    disabled={(date) => date < getMinCheckOutDate()}
                    initialFocus
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
              {checkOut && (
                <div className="mt-2">
                  <Label className="text-xs text-neutral-500">
                    Check-out Time
                  </Label>
                  <select
                    className="w-full mt-1 p-2 border rounded text-sm"
                    value={checkOutTime}
                    onChange={(e) => onCheckOutTimeChange?.(e.target.value)}
                  >
                    {formattedCheckOutOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {checkIn && checkOut && nights > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-neutral-700">
                    Duration: {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-sm text-neutral-500 sm:text-right">
                  <span className="text-xs whitespace-nowrap">
                    {formatDate(checkIn)} → {formatDate(checkOut)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
