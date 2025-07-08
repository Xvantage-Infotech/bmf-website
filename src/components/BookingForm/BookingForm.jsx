// BookingForm.jsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageCircle } from "lucide-react";
import { formatPrice, calculateTotalPrice, calculateNights } from "@/lib/utils";
import ImprovedDatePicker from "./ImprovedDatePicker";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "../auth/AuthModal";
import { checkBookingAvailability } from "@/services/Farm/farm.service";
import { useRouter } from "next/navigation";
import { formatDate } from "date-fns";
import { format } from "date-fns";

export default function BookingForm({ farm, className = "" }) {
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [checkInTime, setCheckInTime] = useState();
  const [checkOutTime, setCheckOutTime] = useState();

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [finalPrice, setFinalPrice] = useState(null);

  const [isBooked, setIsBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const { user } = useAuth();
  const isLoggedIn = !!user?.token;

  useEffect(() => {
    // Reset availability state when user changes any date/time input
    setIsBooked(false);
    setHasCheckedAvailability(false);
    setBookingError("");
    setFinalPrice(null);
  }, [checkIn, checkOut, checkInTime, checkOutTime]);

  const convertTo24HourFormat = (timeStr) => {
    if (!timeStr) return "00:00:00";

    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:00`;
  };

  const isWeekend = (date) => {
    const day = date.getDay(); // Sunday = 0, Saturday = 6
    return day === 0 || day === 6;
  };

  const calculateDynamicTotalPrice = (
    start,
    end,
    checkInTime,
    checkOutTime
  ) => {
    if (!start || !end) return 0;

    const prices = {
      full_day_weekday: parseFloat(farm.full_day_price_weekday || 0),
      half_day_weekday: parseFloat(farm.half_day_price_weekday || 0),
      full_day_weekend: parseFloat(farm.full_day_price_weekend || 0),
      half_day_weekend: parseFloat(farm.half_day_price_weekend || 0),
    };

    let total = 0;
    const curr = new Date(start);

    while (curr < end) {
      const isWeekendDay = isWeekend(curr);
      const isLastDay = curr.toDateString() === new Date(end).toDateString();

      // Full day for all days before last
      if (!isLastDay) {
        total += isWeekendDay
          ? prices.full_day_weekend
          : prices.full_day_weekday;
      } else {
        // Last day is treated as half day if end time is before 5PM
        const isHalfDay =
          checkOutTime?.includes("AM") ||
          checkOutTime?.startsWith("1") ||
          checkOutTime?.startsWith("2") ||
          checkOutTime?.startsWith("3") ||
          checkOutTime?.startsWith("4");

        if (isHalfDay) {
          total += isWeekendDay
            ? prices.half_day_weekend
            : prices.half_day_weekday;
        } else {
          total += isWeekendDay
            ? prices.full_day_weekend
            : prices.full_day_weekday;
        }
      }

      curr.setDate(curr.getDate() + 1);
    }

    return total;
  };

  const dynamicTotal =
    checkIn && checkOut
      ? calculateDynamicTotalPrice(
          new Date(checkIn),
          new Date(checkOut),
          checkInTime,
          checkOutTime
        )
      : 0;

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const pricePerNight = nights > 0 ? dynamicTotal / nights : 0;
  const totalGuests = adults + children;
  const isGuestLimitExceeded = totalGuests > farm.maxGuests;
  const isBookingValid =
    checkIn && checkOut && nights > 0 && !isGuestLimitExceeded;

  const router = useRouter();

  const handleBooking = async () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!checkIn || !checkOut || isGuestLimitExceeded) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const formatDate = (date) => {
      return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };

    const payload = {
      farm_id: String(farm.id),
      start_date: formatDate(checkIn),
      start_time: convertTo24HourFormat(checkInTime),
      end_date: formatDate(checkOut),
      end_time: convertTo24HourFormat(checkOutTime),
      no_of_guest: String(adults + children),
    };

    try {
      const res = await checkBookingAvailability(payload, token);
      setHasCheckedAvailability(true);

      if (res?.status === 0) {
        setIsBooked(false);
        setBookingError("");
        setFinalPrice(res.final_price);
      } else {
        setIsBooked(true);
        setBookingError("This farm is already booked for the selected dates.");
        setFinalPrice(null);
      }
    } catch (err) {
      setIsBooked(false);
      setBookingError(err.message || "Error checking availability.");
    }
  };
  const increasePercentage = farm.increase_percentage || 0; // 👈 if 20%
  const discountedPrice = finalPrice; // already comes from availability check

  const handleConfirmBooking = () => {
    if (!checkIn || !checkOut || !finalPrice) {
      console.warn("Missing booking data");
      return;
    }

    router.push(
      "/booking-pay?" +
        new URLSearchParams({
          farmId: String(farm.id),
          name: user?.name || "Guest",
          guest: totalGuests,
          checkIn: format(new Date(checkIn), "yyyy-MM-dd"),
          checkOut: format(new Date(checkOut), "yyyy-MM-dd"),
          checkInTime,
          checkOutTime,
          price: discountedPrice.toString(), // 👈 finalPrice is already discounted
          increase_percentage: increasePercentage.toString(), // 👈 pass this too
          farmName: farm.farm_alias_name,
          farmLocation: farm.location_link,
          rating: farm.rating || "0",
          areaCity: `${farm.area?.name || ""}, ${farm.city?.name || ""}`,
          image: farm.farm_images?.[0]?.image || "",
          houseCancellationPolicy: farm.house_cancellation_policy || "",
        }).toString()
    );
  };

  const extraGuests =
    totalGuests > farm.person_limit ? totalGuests - farm.person_limit : 0;

  const extraGuestCharge = extraGuests * (farm.person_price_weekday || 0);

  return (
    // <div className={`sticky top-8 ${className}`}>
    <div className={`sticky top-8 w-full max-w-md ${className}`}>
      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">
          Book Your Stay
        </h3>

        <div className="space-y-6">
          {/* Date Selection */}
          <ImprovedDatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            checkInTime={checkInTime}
            checkOutTime={checkOutTime}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onCheckInTimeChange={setCheckInTime}
            onCheckOutTimeChange={setCheckOutTime}
            checkInOptions={farm.check_in_time}
            checkOutOptions={farm.check_out_time}
          />

          {/* Guest Selection */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-2">
                Total Booking Person
              </Label>
              <input
                type="number"
                min={1}
                value={adults}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1) {
                    setAdults(val);
                  } else if (e.target.value === "") {
                    setAdults(""); // Allow temporary empty state for manual typing
                  } else {
                    setAdults(1); // Prevent negative or 0
                  }
                }}
                onBlur={() => {
                  // Ensure value is reset to 1 if user leaves input empty or invalid
                  if (!adults || adults < 1) setAdults(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-2">Children</Label>
              <Select value={children.toString()} onValueChange={(value) => setChildren(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 25 }, (_, i) => i).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Child' : 'Children'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Guest Limit Warning */}

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              {farm.person_limit} Person above will charges ₹
              {farm.person_price_weekday} per person.
            </p>
          </div>

          {/* Pricing Breakdown */}
          {nights > 0 && (
            <div className="bg-white rounded-lg p-4 border border-neutral-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {checkIn.toLocaleDateString()} to{" "}
                  {checkOut.toLocaleDateString()}
                </span>
                <span>{formatPrice(finalPrice ?? dynamicTotal)}</span>{" "}
                {/* 👈 updated */}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(finalPrice ?? dynamicTotal)}</span>{" "}
                {/* 👈 updated */}
              </div>
            </div>
          )}

          {/* Booking Button */}
          <Button
            onClick={
              hasCheckedAvailability ? handleConfirmBooking : handleBooking
            }
            disabled={!isBookingValid || isBooked}
            className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            size="lg"
          >
            {!checkIn || !checkOut
              ? "Select Dates"
              : isGuestLimitExceeded
              ? "Too Many Guests"
              : isBooked
              ? "Booked"
              : hasCheckedAvailability
              ? "Book Now"
              : "Check Availability"}
          </Button>

          {bookingError && (
            <p className="text-sm text-red-600 text-center mt-2">
              {bookingError}
            </p>
          )}

          <p className="text-xs text-neutral-600 text-center">
            You won't be charged yet
          </p>
        </div>

        {/* Contact Options */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-3">Need Help?</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open("tel:+919277778778", "_self")}
            >
              <Phone className="w-4 h-4 mr-3" />
              Call us: +91 9277778778
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() =>
                window.open("https://wa.me/919277778778", "_blank")
              }
            >
              <MessageCircle className="w-4 h-4 mr-3" />
              WhatsApp Support
            </Button>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
