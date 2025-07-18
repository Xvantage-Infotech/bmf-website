// // BookingForm.jsx
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Phone, MessageCircle } from "lucide-react";
// import { formatPrice, calculateTotalPrice, calculateNights } from "@/lib/utils";
// import ImprovedDatePicker from "./ImprovedDatePicker";
// import { useAuth } from "@/contexts/AuthContext";
// import AuthModal from "../auth/AuthModal";
// import { checkBookingAvailability } from "@/services/Farm/farm.service";
// import { useRouter } from "next/navigation";
// import { format } from "date-fns";
// import { getAccessToken } from "@/hooks/cookies";
// import { CheckCircle, XCircle } from "lucide-react";

// export default function BookingForm({ farm, className = "" }) {
//   const [checkIn, setCheckIn] = useState();
//   const [checkOut, setCheckOut] = useState();
//   const [checkInTime, setCheckInTime] = useState(
//   farm?.check_in_time?.[0] || ""
// );

// const [checkOutTime, setCheckOutTime] = useState(
//   farm?.check_out_time?.[1] || farm?.check_out_time?.[0] || ""
// );

//   const [adults, setAdults] = useState(2);
//   const [children, setChildren] = useState(0);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
//   const [finalPrice, setFinalPrice] = useState(null);

//   const [isBooked, setIsBooked] = useState(false);
//   const [bookingError, setBookingError] = useState("");

//   const [agreed, setAgreed] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   const { user } = useAuth();
//   const isLoggedIn = !!user?.token;

//   useEffect(() => {
//     // Reset availability state when user changes any date/time input
//     setIsBooked(false);
//     setHasCheckedAvailability(false);
//     setBookingError("");
//     setFinalPrice(null);
//   }, [checkIn, checkOut, checkInTime, checkOutTime]);

//   const convertTo24HourFormat = (timeStr) => {
//     if (!timeStr) return "00:00:00";

//     const [time, modifier] = timeStr.split(" ");
//     let [hours, minutes] = time.split(":").map(Number);

//     if (modifier === "PM" && hours !== 12) {
//       hours += 12;
//     } else if (modifier === "AM" && hours === 12) {
//       hours = 0;
//     }

//     const paddedHours = hours.toString().padStart(2, "0");
//     const paddedMinutes = minutes.toString().padStart(2, "0");

//     return `${paddedHours}:${paddedMinutes}:00`;
//   };

//   const isWeekend = (date) => {
//     const day = date.getDay(); // Sunday = 0, Saturday = 6
//     return day === 0 || day === 6;
//   };

//   const calculateDynamicTotalPrice = (
//     start,
//     end,
//     checkInTime,
//     checkOutTime
//   ) => {
//     if (!start || !end) return 0;

//     const prices = {
//       full_day_weekday: parseFloat(farm.full_day_price_weekday || 0),
//       half_day_weekday: parseFloat(farm.half_day_price_weekday || 0),
//       full_day_weekend: parseFloat(farm.full_day_price_weekend || 0),
//       half_day_weekend: parseFloat(farm.half_day_price_weekend || 0),
//     };

//     let total = 0;
//     const sameDay = start.toDateString() === end.toDateString();

//     if (sameDay) {
//       const isWeekendDay = isWeekend(start);
//       const isHalfDay =
//         checkOutTime?.includes("AM") ||
//         checkOutTime?.startsWith("1") ||
//         checkOutTime?.startsWith("2") ||
//         checkOutTime?.startsWith("3") ||
//         checkOutTime?.startsWith("4");

//       total += isHalfDay
//         ? isWeekendDay
//           ? prices.half_day_weekend
//           : prices.half_day_weekday
//         : isWeekendDay
//         ? prices.full_day_weekend
//         : prices.full_day_weekday;

//       return total;
//     }

//     // Multi-day booking logic
//     const curr = new Date(start);
//     while (curr < end) {
//       const isWeekendDay = isWeekend(curr);
//       const isLastDay = curr.toDateString() === new Date(end).toDateString();

//       if (!isLastDay) {
//         total += isWeekendDay
//           ? prices.full_day_weekend
//           : prices.full_day_weekday;
//       } else {
//         const isHalfDay =
//           checkOutTime?.includes("AM") ||
//           checkOutTime?.startsWith("1") ||
//           checkOutTime?.startsWith("2") ||
//           checkOutTime?.startsWith("3") ||
//           checkOutTime?.startsWith("4");

//         total += isHalfDay
//           ? isWeekendDay
//             ? prices.half_day_weekend
//             : prices.half_day_weekday
//           : isWeekendDay
//           ? prices.full_day_weekend
//           : prices.full_day_weekday;
//       }

//       curr.setDate(curr.getDate() + 1);
//     }

//     return total;
//   };

//   const dynamicTotal =
//     checkIn && checkOut
//       ? calculateDynamicTotalPrice(
//           new Date(checkIn),
//           new Date(checkOut),
//           checkInTime,
//           checkOutTime
//         )
//       : 0;

//   const nights =
//     checkIn && checkOut
//       ? checkIn.toLocaleDateString() === checkOut.toLocaleDateString()
//         ? 1 // Same date, but different times (valid for 1 night)
//         : calculateNights(checkIn, checkOut)
//       : 0;

//   const pricePerNight = nights > 0 ? dynamicTotal / nights : 0;
//   const totalGuests = adults + children;
//   const isGuestLimitExceeded = totalGuests > farm.maxGuests;

//   const isCheckInBeforeCheckOut = () => {
//     if (checkIn && checkOut && checkInTime && checkOutTime) {
//       const checkInTime24 = convertTo24HourFormat(checkInTime);
//       const checkOutTime24 = convertTo24HourFormat(checkOutTime);

//       const checkInDateTime = new Date(
//         `${format(checkIn, "yyyy-MM-dd")}T${checkInTime24}`
//       );
//       const checkOutDateTime = new Date(
//         `${format(checkOut, "yyyy-MM-dd")}T${checkOutTime24}`
//       );

//       return checkOutDateTime > checkInDateTime;
//     }

//     return true;
//   };

//   const isBookingValid =
//     checkIn &&
//     checkOut &&
//     isCheckInBeforeCheckOut() &&
//     (nights > 0 ||
//       checkIn.toLocaleDateString() === checkOut.toLocaleDateString()) &&
//     !isGuestLimitExceeded;

//   const router = useRouter();

//   const handleBooking = async () => {
//     if (!isLoggedIn) {
//       setIsAuthModalOpen(true);
//       return;
//     }

//     if (!checkIn || !checkOut || isGuestLimitExceeded) return;

//     const token = getAccessToken();
//     if (!token) return;

//     const formatDate = (date) => {
//       return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
//     };

//     const payload = {
//       farm_id: String(farm.id),
//       start_date: formatDate(checkIn),
//       start_time: convertTo24HourFormat(checkInTime),
//       end_date: formatDate(checkOut),
//       end_time: convertTo24HourFormat(checkOutTime),
//       no_of_guest: String(adults + children),
//     };

//     try {
//       const res = await checkBookingAvailability(payload, token);
//       setHasCheckedAvailability(true);

//       if (typeof window !== "undefined" && typeof fbq === "function") {
//         fbq("trackCustom", "CheckAvailability", {
//           name: user?.name || "Guest",
//           phone: user?.phone || "N/A",
//           farmName: farm.name,
//           farmId: farm.id.toString(),
//         });
//       }

//       if (res?.status === 0) {
//         setIsBooked(false);
//         setBookingError("");
//         setFinalPrice(res.final_price);
//       } else {
//         setIsBooked(true);
//         setBookingError("This farm is already booked for the selected dates.");
//         setFinalPrice(null);
//       }
//     } catch (err) {
//       setIsBooked(false);
//       setBookingError(err.message || "Error checking availability.");
//     }
//   };

//   const increasePercentage = farm.increase_percentage || 0; // 👈 if 20%
//   const discountedPrice = finalPrice; // already comes from availability check

//   const handleConfirmBooking = () => {
//     if (!checkIn || !checkOut || !finalPrice) {
//       console.warn("Missing booking data");
//       return;
//     }

//     if (typeof window !== "undefined" && typeof fbq === "function") {
//       fbq("track", "Lead", {
//         name: user?.name || "Guest",
//         phone: user?.phone || "N/A",
//         farmName: farm.name,
//         farmId: farm.id.toString(),
//       });
//     }

//     router.push(
//       "/booking-pay?" +
//         new URLSearchParams({
//           farmId: String(farm.id),
//           name: user?.name || "Guest",
//           guest: totalGuests,
//           checkIn: format(new Date(checkIn), "yyyy-MM-dd"),
//           checkOut: format(new Date(checkOut), "yyyy-MM-dd"),
//           checkInTime,
//           checkOutTime,
//           price: discountedPrice.toString(), // 👈 finalPrice is already discounted
//           increase_percentage: increasePercentage.toString(), // 👈 pass this too
//           farmName: farm.farm_alias_name,
//           farmLocation: farm.location_link,
//           rating: farm.rating || "0",
//           areaCity: `${farm.area?.name || ""}, ${farm.city?.name || ""}`,
//           image: farm.farm_images?.[0]?.image || "",
//           houseCancellationPolicy: farm.house_cancellation_policy || "",
//         }).toString()
//     );
//   };

//   const extraGuests =
//     totalGuests > farm.person_limit ? totalGuests - farm.person_limit : 0;

//   const extraGuestCharge = extraGuests * (farm.person_price_weekday || 0);

//   const isHalfDayBooking = () => {
//     if (!checkIn || !checkOut || !checkInTime || !checkOutTime) return false;

//     const sameDay = checkIn.toDateString() === checkOut.toDateString();
//     if (!sameDay) return false;

//     const checkInDateTime = new Date(
//       `${format(checkIn, "yyyy-MM-dd")}T${convertTo24HourFormat(checkInTime)}`
//     );
//     const checkOutDateTime = new Date(
//       `${format(checkOut, "yyyy-MM-dd")}T${convertTo24HourFormat(checkOutTime)}`
//     );

//     const durationInMs = checkOutDateTime - checkInDateTime;
//     const durationInHours = durationInMs / (1000 * 60 * 60);

//     return durationInHours <= 12;
//   };

//   const getFullDayPrice = () => {
//     const isWeekendDay = isWeekend(checkIn || new Date());
//     return isWeekendDay
//       ? parseFloat(farm.full_day_price_weekend || 0)
//       : parseFloat(farm.full_day_price_weekday || 0);
//   };

//   const handleWhatsAppClick = () => {
//     if (!farm) return;

//     const name = farm.farm_alias_name || farm.name;
//     const message = `Hello, I am interested to book this Property: ${name} - https://bookmyfarm.net/farm/${farm.id}`;

//     const encodedMessage = encodeURIComponent(message).replace(/\+/g, "%20");

//     const url = `https://wa.me/919277778778?text=${encodedMessage}`;

//     // Some mobile browsers block new tab if not directly triggered by user event
//     window.open(url, "_blank");
//   };

//   const handleWhatsAppManualBooking = () => {
//     if (!farm) return;

//     const name = farm.farm_alias_name || farm.name;
//     const checkInDate = checkIn
//       ? format(new Date(checkIn), "yyyy-MM-dd")
//       : "N/A";
//     const checkOutDate = checkOut
//       ? format(new Date(checkOut), "yyyy-MM-dd")
//       : "N/A";
//     const guests = adults + children;

//     const message =
//       `Hello, I'm interested in booking the following property:\n\n` +
//       `🏡 Name: ${name}\n📍 Link: https://bookmyfarm.net/farm/${farm.id}\n` +
//       `📅 Dates: ${checkInDate} to ${checkOutDate}\n🕒 Time: ${
//         checkInTime || "N/A"
//       } to ${checkOutTime || "N/A"}\n` +
//       `👥 Guests: ${guests}`;

//     const encodedMessage = encodeURIComponent(message);
//     const url = `https://wa.me/919277778778?text=${encodedMessage}`;

//     window.open(url, "_blank");
//   };

//   return (
//     // <div className={`sticky top-8 ${className}`}>
//     <div className={`sticky top-8 w-full max-w-md ${className}`}>
//       <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
//         <h3 className="text-xl font-bold text-neutral-900 mb-6">
//           Book Your Stay
//         </h3>

//         <div className="space-y-6">
//           {/* Date Selection */}
//           <ImprovedDatePicker
//             checkIn={checkIn}
//             checkOut={checkOut}
//             checkInTime={checkInTime}
//             checkOutTime={checkOutTime}
//             onCheckInChange={setCheckIn}
//             onCheckOutChange={setCheckOut}
//             onCheckInTimeChange={setCheckInTime}
//             onCheckOutTimeChange={setCheckOutTime}
//             checkInOptions={farm.check_in_time}
//             checkOutOptions={farm.check_out_time}
//           />

//           {/* Guest Selection */}
//           <div className="grid grid-cols-1 gap-3">
//             <div>
//               <Label className="block text-sm font-medium text-neutral-700 mb-2">
//                 Total Booking Person
//               </Label>
//               <input
//                 type="number"
//                 min={1}
//                 value={adults}
//                 onChange={(e) => {
//                   const val = parseInt(e.target.value);
//                   if (!isNaN(val) && val >= 1) {
//                     setAdults(val);
//                   } else if (e.target.value === "") {
//                     setAdults(""); // Allow temporary empty state for manual typing
//                   } else {
//                     setAdults(1); // Prevent negative or 0
//                   }
//                 }}
//                 onBlur={() => {
//                   // Ensure value is reset to 1 if user leaves input empty or invalid
//                   if (!adults || adults < 1) setAdults(1);
//                 }}
//                 className="w-full px-3 py-2 border rounded-md text-sm"
//               />
//             </div>

//             {/* <div>
//               <Label className="block text-sm font-medium text-neutral-700 mb-2">Children</Label>
//               <Select value={children.toString()} onValueChange={(value) => setChildren(parseInt(value))}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Array.from({ length: 25 }, (_, i) => i).map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} {num === 1 ? 'Child' : 'Children'}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div> */}
//           </div>

//           {/* Guest Limit Warning */}

//           <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//             <p className="text-sm text-red-600">
//               {farm.person_limit} Person above will charges ₹
//               {farm.person_price_weekday} per person.
//             </p>
//           </div>

//           {/* Pricing Breakdown */}
//           {nights > 0 && (
//             <div className="bg-white rounded-lg p-4 border border-neutral-200 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>
//                   {checkIn.toLocaleDateString()} to{" "}
//                   {checkOut.toLocaleDateString()}
//                 </span>
//                 <div className="text-right">
//                   <span className="font-medium text-green-600">
//                     {formatPrice(finalPrice ?? dynamicTotal)}
//                   </span>
//                 </div>
//               </div>
//               <Separator />
//               <div className="flex justify-between font-semibold">
//                 <span>Total</span>
//                 <span className="text-green-600">
//                   {formatPrice(finalPrice ?? dynamicTotal)}
//                 </span>
//               </div>
//             </div>
//           )}

//           {farm.is_enable === 1 ? (
//             <>
//               {/* Agreement Checkbox with Toggleable Rules View */}
//               <div className="mb-6">
//                 {/* Checkbox and label */}
//                 <div className="flex items-start gap-3">
//                   <input
//                     type="checkbox"
//                     checked={agreed}
//                     onChange={(e) => setAgreed(e.target.checked)}
//                     className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                   />
//                   <span className="text-sm text-neutral-800 leading-snug">
//                     I agree to the{" "}
//                     <span className="text-green-600 font-medium">
//                       House Rules
//                     </span>
//                   </span>
//                 </div>

//                 {/* Always-visible House Rules */}
//                 {farm?.farm_rules && (
//                   <div className="mt-4 rounded-xl bg-gray-100 border border-gray-200 p-5 max-h-[320px] overflow-auto shadow-sm space-y-6">
//                     {/* Allowed Rules */}
//                     <div>
//                       <div className="flex items-center gap-2 mb-2 text-green-700">
//                         <CheckCircle className="w-5 h-5" />
//                         <h4 className="text-sm font-semibold uppercase tracking-wide">
//                           Allowed
//                         </h4>
//                       </div>
//                       <ul className="space-y-2 pl-1">
//                         {farm.farm_rules.allow_rule_names?.map((rule, i) => (
//                           <li
//                             key={`allow-${i}`}
//                             className="flex items-start gap-2 text-sm text-green-800"
//                           >
//                             <CheckCircle className="w-4 h-4 mt-1 text-green-500 shrink-0" />
//                             <span>{rule}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* Not Allowed Rules */}
//                     <div>
//                       <div className="flex items-center gap-2 mb-2 text-red-700">
//                         <XCircle className="w-5 h-5" />
//                         <h4 className="text-sm font-semibold uppercase tracking-wide">
//                           Not Allowed
//                         </h4>
//                       </div>
//                       <ul className="space-y-2 pl-1">
//                         {farm.farm_rules.not_allow_rule_names?.map(
//                           (rule, i) => (
//                             <li
//                               key={`not-allow-${i}`}
//                               className="flex items-start gap-2 text-sm text-red-700"
//                             >
//                               <XCircle className="w-4 h-4 mt-1 text-red-500 shrink-0" />
//                               <span>{rule}</span>
//                             </li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Booking Button */}
//               <Button
//                 onClick={
//                   hasCheckedAvailability ? handleConfirmBooking : handleBooking
//                 }
//                 disabled={!isBookingValid || isBooked || !agreed}
//                 className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
//                 size="lg"
//               >
//                 {!checkIn || !checkOut
//                   ? "Select Dates"
//                   : isGuestLimitExceeded
//                   ? "Too Many Guests"
//                   : isBooked
//                   ? "Booked"
//                   : hasCheckedAvailability
//                   ? "Book Now"
//                   : "Check Availability"}
//               </Button>

//               {bookingError && (
//                 <p className="text-sm text-red-600 text-center mt-2">
//                   {bookingError}
//                 </p>
//               )}

//               <p className="text-xs text-neutral-600 text-center">
//                 You won't be charged yet
//               </p>
//             </>
//           ) : (
//             <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4">
//               Booking for this property is currently handled manually.{" "}
//               <button
//                 onClick={handleWhatsAppManualBooking}
//                 className="underline font-medium text-green-600 hover:text-green-700 ml-1"
//               >
//                 Contact us on WhatsApp
//               </button>{" "}
//               to make your reservation.
//             </div>
//           )}
//         </div>

//         {/* Contact Options */}
//         <div className="mt-6 pt-6 border-t border-neutral-200">
//           <h4 className="font-semibold text-neutral-900 mb-3">Need Help?</h4>
//           <div className="space-y-2">
//             <Button
//               variant="outline"
//               className="w-full justify-start"
//               onClick={() => window.open("tel:+919277778778", "_self")}
//             >
//               <Phone className="w-4 h-4 mr-3" />
//               <span className="hide-call-label">Call us: </span>+91 9277778778
//             </Button>

//             <Button
//               variant="outline"
//               className="w-full justify-start"
//               onClick={handleWhatsAppClick}
//             >
//               <MessageCircle className="w-4 h-4 mr-3" />
//               WhatsApp Support
//             </Button>
//           </div>
//         </div>
//       </div>
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => setIsAuthModalOpen(false)}
//       />
//     </div>
//   );
// }

// BookingForm.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageCircle } from "lucide-react";
import { formatPrice, calculateTotalPrice, calculateNights } from "@/lib/utils";
import ImprovedDatePicker from "./ImprovedDatePicker";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "../auth/AuthModal";
import { checkBookingAvailability } from "@/services/Farm/farm.service";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getAccessToken } from "@/hooks/cookies";
import { CheckCircle, XCircle } from "lucide-react";

export default function BookingForm({ farm, className = "" }) {
  const today = new Date();
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(today);

  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [hasChangedGuestCount, setHasChangedGuestCount] = useState(false);
  const [finalPrice, setFinalPrice] = useState(null);

  const [isBooked, setIsBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [agreed, setAgreed] = useState(false);
  const didMountRef = useRef(false);

  const { user } = useAuth();
  const isLoggedIn = !!user?.token;

  useEffect(() => {
    console.log("⏱ useEffect running", didMountRef.current, isLoggedIn);

    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (isLoggedIn) {
      setIsBooked(false);
      setHasCheckedAvailability(false);
      setBookingError("");
      setFinalPrice(null);
    }
  }, [checkIn, checkOut, checkInTime, checkOutTime, isLoggedIn]);

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
    const sameDay = start.toDateString() === end.toDateString();

    if (sameDay) {
      const isWeekendDay = isWeekend(start);
      const isHalfDay =
        checkOutTime?.includes("AM") ||
        checkOutTime?.startsWith("1") ||
        checkOutTime?.startsWith("2") ||
        checkOutTime?.startsWith("3") ||
        checkOutTime?.startsWith("4");

      total += isHalfDay
        ? isWeekendDay
          ? prices.half_day_weekend
          : prices.half_day_weekday
        : isWeekendDay
        ? prices.full_day_weekend
        : prices.full_day_weekday;

      return total;
    }

    // Multi-day booking logic
    const curr = new Date(start);
    while (curr < end) {
      const isWeekendDay = isWeekend(curr);
      const isLastDay = curr.toDateString() === new Date(end).toDateString();

      if (!isLastDay) {
        total += isWeekendDay
          ? prices.full_day_weekend
          : prices.full_day_weekday;
      } else {
        const isHalfDay =
          checkOutTime?.includes("AM") ||
          checkOutTime?.startsWith("1") ||
          checkOutTime?.startsWith("2") ||
          checkOutTime?.startsWith("3") ||
          checkOutTime?.startsWith("4");

        total += isHalfDay
          ? isWeekendDay
            ? prices.half_day_weekend
            : prices.half_day_weekday
          : isWeekendDay
          ? prices.full_day_weekend
          : prices.full_day_weekday;
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

  const nights =
    checkIn && checkOut
      ? checkIn.toLocaleDateString() === checkOut.toLocaleDateString()
        ? 1 // Same date, but different times (valid for 1 night)
        : calculateNights(checkIn, checkOut)
      : 0;

  const pricePerNight = nights > 0 ? dynamicTotal / nights : 0;
  const totalGuests = adults + children;
  const isGuestLimitExceeded = totalGuests > farm.maxGuests;

  const isCheckInBeforeCheckOut = () => {
    if (checkIn && checkOut && checkInTime && checkOutTime) {
      const checkInTime24 = convertTo24HourFormat(checkInTime);
      const checkOutTime24 = convertTo24HourFormat(checkOutTime);

      const checkInDateTime = new Date(
        `${format(checkIn, "yyyy-MM-dd")}T${checkInTime24}`
      );
      const checkOutDateTime = new Date(
        `${format(checkOut, "yyyy-MM-dd")}T${checkOutTime24}`
      );

      return checkOutDateTime > checkInDateTime;
    }

    return true;
  };

  const isBookingValid =
    checkIn &&
    checkOut &&
    checkInTime &&
    checkOutTime &&
    isCheckInBeforeCheckOut() && // ✅ this is the key part
    (nights > 0 ||
      checkIn.toLocaleDateString() === checkOut.toLocaleDateString()) &&
    !isGuestLimitExceeded;

  const router = useRouter();

  const handleBooking = async () => {
    console.log("Starting handleBooking", {
      isLoggedIn,
      checkIn,
      checkOut,
      checkInTime,
      checkOutTime,
      adults,
      children,
    });

    if (!isLoggedIn) {
      console.log("User not logged in, opening auth modal");
      setIsAuthModalOpen(true);
      return;
    }

    if (!isCheckInBeforeCheckOut()) {
      setBookingError("");
      return;
    }

    if (!checkIn || !checkOut || isGuestLimitExceeded) {
      console.log("Missing dates or guest limit exceeded", {
        checkIn,
        checkOut,
        isGuestLimitExceeded,
      });
      return;
    }

    const token = getAccessToken();
    if (!token) {
      console.log("No access token found");
      return;
    }

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

    console.log("Sending availability check payload:", payload);

    try {
      // Reset states before checking availability
      setBookingError("");
      setIsBooked(false);
      setHasCheckedAvailability(true);
      setFinalPrice(null); // Reset price while checking

      const res = await checkBookingAvailability(payload, token);
      console.log("Availability check response:", res);

      // Facebook Pixel tracking
      if (typeof window !== "undefined" && typeof fbq === "function") {
        fbq("trackCustom", "CheckAvailability", {
          name: user?.name || "Guest",
          phone: user?.phone || "N/A",
          farmName: farm.name,
          farmId: farm.id.toString(),
        });
      }

      if (res?.status === 0) {
        console.log("Farm available, setting final price:", res.final_price);
        setIsBooked(false);
        setBookingError("");
        setFinalPrice(res.final_price);
        setHasChangedGuestCount(false); // Reset guest count change flag

        // Show success message
        setBookingError("");
      } else {
        console.log("Farm already booked");
        setIsBooked(true);
        setBookingError("This farm is already booked for the selected dates.");
        setFinalPrice(null);
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setIsBooked(false);
      setBookingError(
        err.response?.data?.message ||
          err.message ||
          "Error checking availability. Please try again."
      );
      setFinalPrice(null);
      setHasCheckedAvailability(false);
    }
  };

  const increasePercentage = farm.increase_percentage || 0; // 👈 if 20%
  const discountedPrice = finalPrice; // already comes from availability check

  const handleConfirmBooking = () => {
    if (!checkIn || !checkOut || !finalPrice) {
      console.warn("Missing booking data");
      return;
    }

   // ✅ Add inside your handleConfirmBooking() or useEffect
if (typeof window !== 'undefined' && typeof fbq === 'function' && user) {
  const phone = user.phone_number?.replace(/\D/g, '')
  const [firstName = '', lastName = ''] = (user.name || '').split(' ')
  const email = user.email?.toLowerCase()

  fbq('trackCustom', 'Booking-Pay', {
    content_name: farm?.name,
    content_ids: [farm?.id],
    content_type: 'product',
    currency: 'INR',
    value: finalPrice || 0,
    booking_name: user.name,
    phone_number: phone,
    email: email,
    fn: firstName,
    ln: lastName,
  })
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

  const isHalfDayBooking = () => {
    if (!checkIn || !checkOut || !checkInTime || !checkOutTime) return false;

    const sameDay = checkIn.toDateString() === checkOut.toDateString();
    if (!sameDay) return false;

    const checkInDateTime = new Date(
      `${format(checkIn, "yyyy-MM-dd")}T${convertTo24HourFormat(checkInTime)}`
    );
    const checkOutDateTime = new Date(
      `${format(checkOut, "yyyy-MM-dd")}T${convertTo24HourFormat(checkOutTime)}`
    );

    const durationInMs = checkOutDateTime - checkInDateTime;
    const durationInHours = durationInMs / (1000 * 60 * 60);

    return durationInHours <= 12;
  };

  const getFullDayPrice = () => {
    const isWeekendDay = isWeekend(checkIn || new Date());
    return isWeekendDay
      ? parseFloat(farm.full_day_price_weekend || 0)
      : parseFloat(farm.full_day_price_weekday || 0);
  };

  const handleWhatsAppClick = () => {
    if (!farm) return;

    const name = farm.farm_alias_name || farm.name;
    const message = `Hello, I am interested to book this Property: ${name} - https://bookmyfarm.net/farm/${farm.id}`;

    const encodedMessage = encodeURIComponent(message).replace(/\+/g, "%20");

    const url = `https://wa.me/919277778778?text=${encodedMessage}`;

    // Some mobile browsers block new tab if not directly triggered by user event
    window.open(url, "_blank");
  };

  const handleWhatsAppManualBooking = () => {
    if (!farm) return;

    const name = farm.farm_alias_name || farm.name;
    const checkInDate = checkIn
      ? format(new Date(checkIn), "yyyy-MM-dd")
      : "N/A";
    const checkOutDate = checkOut
      ? format(new Date(checkOut), "yyyy-MM-dd")
      : "N/A";
    const guests = adults + children;

    const message =
      `Hello, I'm interested in booking the following property:\n\n` +
      `🏡 Name: ${name}\n📍 Link: https://bookmyfarm.net/farm/${farm.id}\n` +
      `📅 Dates: ${checkInDate} to ${checkOutDate}\n🕒 Time: ${
        checkInTime || "N/A"
      } to ${checkOutTime || "N/A"}\n` +
      `👥 Guests: ${guests}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/919277778778?text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  const handleGuestCountChange = (e) => {
    if (!didMountRef.current || !isLoggedIn) return setIsAuthModalOpen(true);

    setHasChangedGuestCount(true); // Track the guest count change
    setHasCheckedAvailability(false); // Reset availability check when guest count changes

    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      setAdults(val);
    } else if (e.target.value === "") {
      setAdults("");
    } else {
      setAdults(1);
    }
  };

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
            onCheckInChange={(val) => {
              if (!didMountRef.current) return;
              if (!isLoggedIn) return setIsAuthModalOpen(true);
              setCheckIn(val);
            }}
            onCheckOutChange={(val) => {
              if (!didMountRef.current) return;
              if (!isLoggedIn) return setIsAuthModalOpen(true);
              setCheckOut(val);
            }}
            onCheckInTimeChange={(val) => {
              if (!didMountRef.current) return;
              if (!isLoggedIn) return setIsAuthModalOpen(true);
              setCheckInTime(val);
            }}
            onCheckOutTimeChange={(val) => {
              if (!didMountRef.current) return;
              if (!isLoggedIn) return setIsAuthModalOpen(true);
              setCheckOutTime(val);
            }}
            checkInOptions={farm.check_in_time}
            checkOutOptions={farm.check_out_time}
            isLoggedIn={isLoggedIn}
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
                onFocus={() => {
                  if (!didMountRef.current || isLoggedIn) return;
                  setIsAuthModalOpen(true);
                }}
                onChange={(e) => {
                  if (!didMountRef.current || !isLoggedIn)
                    return setIsAuthModalOpen(true);

                  setHasChangedGuestCount(true); // Track the guest count change
                  setHasCheckedAvailability(false); // Reset availability check
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1) {
                    setAdults(val);
                  } else if (e.target.value === "") {
                    setAdults("");
                  } else {
                    setAdults(1);
                  }
                }}
                onBlur={() => {
                  if (!adults || adults < 1) setAdults(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
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
                <div className="text-right">
                  <span className="font-medium text-green-600">
                    {formatPrice(finalPrice ?? dynamicTotal)}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-green-600">
                  {formatPrice(finalPrice ?? dynamicTotal)}
                </span>
              </div>
            </div>
          )}

          {farm.is_enable === 1 ? (
            <>
              {/* Agreement Checkbox with Toggleable Rules View */}
              <div className="mb-6">
                {/* Checkbox and label */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      if (!didMountRef.current || isLoggedIn) {
                        setAgreed(e.target.checked);
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />

                  <span className="text-sm text-neutral-800 leading-snug">
                    I agree to the{" "}
                    <span className="text-green-600 font-medium">
                      House Rules
                    </span>
                  </span>
                </div>

                {/* Always-visible House Rules */}
                {farm?.farm_rules && (
                  <div className="mt-4 rounded-xl bg-gray-100 border border-gray-200 p-5 max-h-[320px] overflow-auto shadow-sm space-y-2">
                    {[
                      ...(farm.farm_rules.allow_rule_names || []).map(
                        (rule) => ({
                          rule,
                          type: "allow",
                        })
                      ),
                      ...(farm.farm_rules.not_allow_rule_names || []).map(
                        (rule) => ({
                          rule,
                          type: "deny",
                        })
                      ),
                    ].map(({ rule, type }, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {type === "allow" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={
                            type === "allow" ? "text-green-800" : "text-red-700"
                          }
                        >
                          {rule}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Button */}
              <Button
                onClick={() => {
                  console.log("Button clicked", {
                    hasCheckedAvailability,
                    finalPrice,
                    bookingError,
                    isBooked,
                  });
                  if (
                    hasCheckedAvailability &&
                    finalPrice &&
                    !isBooked &&
                    !bookingError.includes("already booked")
                  ) {
                    handleConfirmBooking();
                  } else {
                    handleBooking();
                  }
                }}
                disabled={!isBookingValid || isBooked || !agreed}
                className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                size="lg"
              >
                {!checkIn || !checkOut
                  ? "Select Dates"
                  : isGuestLimitExceeded
                  ? "Too Many Guests"
                  : isBooked
                  ? "Booked"
                  : hasCheckedAvailability &&
                    finalPrice &&
                    !isBooked &&
                    !bookingError.includes("already booked")
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
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4">
              Booking for this property is currently handled manually.{" "}
              <button
                onClick={handleWhatsAppManualBooking}
                className="underline font-medium text-green-600 hover:text-green-700 ml-1"
              >
                Contact us on WhatsApp
              </button>{" "}
              to make your reservation.
            </div>
          )}
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
              <span className="hide-call-label">Call us: </span>+91 9277778778
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleWhatsAppClick}
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
