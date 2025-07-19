// ImprovedDatePicker.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { formatDate, calculateNights, cn } from "@/lib/utils";
import { check } from "drizzle-orm/gel-core";

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
  isLoggedIn = false,
}) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const didMountRef = useRef(false);

  const convert24To12Hour = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const formattedCheckInOptions = checkInOptions.map(convert24To12Hour);
  const formattedCheckOutOptions = checkOutOptions.map(convert24To12Hour);

  useEffect(() => {
    if (didMountRef.current) return;

    didMountRef.current = true;

    if (!isLoggedIn) return;
    if (!checkInOptions.length || !checkOutOptions.length) return;

    const today = new Date();

    if (!checkIn) {
      onCheckInChange?.(today);
    }

    if (!checkOut) {
      onCheckOutChange?.(today);
    }

    // ✅ Don't auto-select any time
    if (!checkInTime) {
      onCheckInTimeChange?.(""); // or undefined, depending on your state shape
    }

    if (!checkOutTime) {
      onCheckOutTimeChange?.(""); // or undefined
    }
  }, [isLoggedIn, checkInOptions, checkOutOptions]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

  const handleCheckInSelect = (date) => {
    if (!date) return;

    onCheckInChange?.(date);
    onCheckInTimeChange?.(""); // reset time
    setIsCheckInOpen(false);

    if (checkOut && checkOut <= date) {
      onCheckOutChange(undefined);
      setTimeout(() => setIsCheckOutOpen(true), 200);
    }

    if (!checkOut) {
      setTimeout(() => setIsCheckOutOpen(true), 200);
    }
  };

  const handleCheckOutSelect = (date) => {
    onCheckOutChange?.(date);
    setIsCheckOutOpen(false);
  };

  // if (!checkOutTime && formattedCheckOutOptions.length) {
  //   onCheckOutTimeChange?.(formattedCheckOutOptions[0]);
  // }

  const getMinCheckOutDate = () => {
    if (checkIn) {
      return checkIn; // Allow check-out to be the same day as check-in
    }
    return tomorrow; // Default to tomorrow if checkIn is not set
  };

  const isInvalidTime = () => {
    if (!checkInTime || !checkOutTime) return false;

    const parse = (t) => {
      const [time, period] = t.split(" ");
      let [hour, minute] = time.split(":").map(Number);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour * 60 + minute;
    };

    const checkInDateObj = new Date(checkIn);
    const checkOutDateObj = new Date(checkOut);

    // Case 1: If the check-out date is earlier than check-in date, it's invalid
    if (checkOutDateObj < checkInDateObj) {
      return true;
    }

    // Case 2: If the check-in and check-out dates are the same, compare times
    if (checkInDateObj.getTime() === checkOutDateObj.getTime()) {
      return parse(checkOutTime) <= parse(checkInTime);
    }

    // Case 3: If the check-out date is later than the check-in date, we don't compare times.
    // The check-out is valid as long as it's on a later date.
    return false;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-2 border-neutral-100 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 min-[376px]:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Check-in <span className="text-red-500">*</span>
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
                    Check-in Time <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    value={checkInTime}
                    onValueChange={onCheckInTimeChange}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {formattedCheckInOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Check-out <span className="text-red-500">*</span>
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
                    Check-out Time <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={checkOutTime}
                    onValueChange={onCheckOutTimeChange}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full mt-1",
                        isInvalidTime() && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {formattedCheckOutOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalidTime() && (
                    <p className="text-xs text-red-500 mt-1">
                      Check-out time must be after check-in time.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {checkIn && checkOut && nights > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-1">
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-neutral-700">
                    Duration: {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-sm text-neutral-500 sm:text-right text-left break-words">
                  <span className="text-xs block sm:inline">
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
