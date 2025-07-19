"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import Script from "next/script";
import {
  createRazorpayOrder,
  updatePaymentStatus,
  verifyPaymentSignature,
} from "@/services/Payment/payment.service";
import { useAuth } from "@/contexts/AuthContext";
import { addBooking } from "@/services/Booking/booking.service";
import { FARM_IMAGE_BASE_URL } from "@/lib/utils";
import { useDialog } from "@/hooks/use-dialog";
import { getAccessToken } from "@/hooks/cookies";
import PublicPageLayout from "../Layout/PublicPageLayout";
import ImprovedDatePicker from "../BookingForm/ImprovedDatePicker";
import {
  checkBookingAvailability,
  fetchFarmById,
} from "@/services/Farm/farm.service";
import { Button } from "@/components/ui/button";

export default function BookingPay() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const farmId = searchParams.get("farmId");
  const bookingName = searchParams.get("name");
  const guest = searchParams.get("guest");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const checkInTime = searchParams.get("checkInTime");
  const checkOutTime = searchParams.get("checkOutTime");
  const price = searchParams.get("price");
  const farmName = searchParams.get("farmName");
  const farmLocation = searchParams.get("farmLocation");
  const areaCity = searchParams.get("areaCity");
  const rating = searchParams.get("rating") || "0";
  const housePolicy = searchParams.get("houseCancellationPolicy");
  const [showPolicy, setShowPolicy] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [isAvailable, setIsAvailable] = useState(false); // If you want
  const discountedPrice = parseFloat(price || "0"); // The final price after discount
  const [currentPrice, setCurrentPrice] = useState(discountedPrice);
  const [editMode, setEditMode] = useState(false);

  // Initialize with params or fallback to empty
  const [checkInLocal, setCheckInLocal] = useState(checkIn || "");
  const [checkOutLocal, setCheckOutLocal] = useState(checkOut || "");
  const [checkInTimeLocal, setCheckInTimeLocal] = useState(checkInTime || "");
  const [checkOutTimeLocal, setCheckOutTimeLocal] = useState(
    checkOutTime || ""
  );
  const [guestLocal, setGuestLocal] = useState(guest || 1);
  const [farm, setFarm] = useState(null);
  const [increasePercentage, setIncreasePercentage] = useState(0);

  const { show } = useDialog();

  useEffect(() => {
    const loadFarm = async () => {
      try {
        const data = await fetchFarmById(farmId);
        console.log(data);
        setFarm(data);
        setIncreasePercentage(Number(data?.increase_percentage || 0));
      } catch (error) {
        console.error("Error loading farm data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFarm();
  }, [farmId]);

  function calculateOriginalPrice(finalPrice, percent) {
    if (!finalPrice || !percent || percent === 0) return finalPrice;
    return Math.round(finalPrice / (1 - percent / 100));
  }

  // Simulate page loading with useEffect
  useEffect(() => {
    // Simulate a loading period (replace with real data fetch if necessary)
    setTimeout(() => {
      setLoading(false); // Set loading to false when the page is ready
    }, 1000); // Adjust this timeout to the actual loading time if needed
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Instant jump to top, no animation
  }, []);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      typeof window.fbq === "function"
    ) {
      const farmId = searchParams.get("farmId");
      const farmName = searchParams.get("farmName");
      const name = searchParams.get("name");
      const guest = searchParams.get("guest");
      const checkIn = searchParams.get("checkIn");
      const checkOut = searchParams.get("checkOut");
      const price = searchParams.get("price");
      const areaCity = searchParams.get("areaCity");
      const rating = searchParams.get("rating");
      const phone = user?.phone_number;
      const email = user?.email;

      window.fbq("track", "Lead", {
        content_name: farmName,
        content_ids: [farmId],
        content_type: "product",
        value: parseFloat(price || "0"),
        currency: "INR",
        guests: guest,
        checkIn,
        checkOut,
        areaCity,
        rating,
        booking_name: name,
        phone_number: phone,
        email,
      });
    }
    // use .toString() for reliable dependency re-run
  }, [searchParams.toString(), user?.email, user?.phone_number]);

  function convertTo24Hour(timeStr) {
    if (!timeStr || timeStr.toLowerCase() === "undefined") return null;

    const [time, modifier] = timeStr.split(" "); // e.g. ["7:00", "AM"]
    if (!time || !modifier) return null;

    let [hours, minutes] = time.split(":");
    if (!hours || !minutes) return null;

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (modifier.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    }

    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`;
  }

  // const increasePercentage = parseFloat(
  //   searchParams.get("increase_percentage") || "0"
  // ); // The discount percentage

  // Calculate the original price before the discount was applied
  const originalPrice = calculateOriginalPrice(
    currentPrice,
    increasePercentage
  );
  const hasDiscount = increasePercentage > 0 && originalPrice > currentPrice;

  // console.log(`Original Price: ₹${originalPrice.toLocaleString("en-IN")}`);

  const router = useRouter();

  const handlePayNow = async () => {
    if (!agreedToPolicy) {
      show({
        title: "Policy Agreement Required",
        description: "Please agree to the House & Cancellation Policy first.",
      });

      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      show({
        title: "Login Required",
        description: "Login required to proceed.",
      });

      return;
    }

    try {
      const { status, data } = await createRazorpayOrder({
        farmId: String(farmId),
        amount: currentPrice,
      });
      // console.log("Order Response:", data);

      if (status !== 1 || !data.order_id) {
        show({
          title: "Order Failed",
          description: "Order creation failed.",
        });

        return;
      }

      // Get Razorpay key based on environment
      // const razorpayKey =
      //   window.location.hostname === 'localhost'
      //     ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_LOCAL
      //     : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_PRODUCTION;

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_PRODUCTION;

      if (typeof window.Razorpay === "undefined") {
        show({
          title: "Razorpay Not Loaded",
          description: "Razorpay SDK not loaded. Please refresh.",
        });

        return;
      }

      const options = {
        key: razorpayKey,
        amount: Math.round(currentPrice * 100),
        currency: "INR",
        name: "Book My Farm",
        description: "Farm Booking",
        order_id: data.order_id,

        // ✅ On Payment Success
        handler: async (response) => {
          try {
            const result = await verifyPaymentSignature({
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            if (result.status === 1) {
              const transactionId = result.data?.id;

              const formattedCheckInTime = convertTo24Hour(checkInTime);
              const formattedCheckOutTime = convertTo24Hour(checkOutTime);

              const bookingResponse = await addBooking({
                farm_id: farmId,
                transaction_id: String(transactionId),
                check_in_date: checkIn,
                check_in_time: formattedCheckInTime,
                check_out_date: checkOut,
                check_out_time: formattedCheckOutTime,
                no_of_guest: guest,
                total_price: String(currentPrice),
              });

              // console.log("🚀 ~ handler: ~ bookingResponse:", bookingResponse);

              if (bookingResponse.status === 1) {
                const bookingId = bookingResponse.data?.id;

                if (bookingId) {
                  router.push(`/booking-confirmation?bookingId=${bookingId}`);
                } else {
                  console.warn("Booking response missing ID:", bookingResponse);
                  router.push(`/booking-confirmation`);
                }
              } else {
                show({
                  title: "Booking Failed",
                  description: "Payment succeeded, but your booking failed.",
                });
              }
            } else {
              show({
                title: "Payment Failed",
                description: "Payment verification failed.",
              });
            }
          } catch (error) {
            console.error("Error in payment handler:", error);
            show({
              title: "Verification Error",
              description: "Something went wrong during verification.",
            });
          }
        },

        prefill: {
          name: bookingName || user?.name || "Guest",
          email: user?.email || "fallback@example.com",
          contact: user?.phone_number?.replace("+91", "") || "9999999999",
        },

        theme: {
          color: "#17AE7D",
        },

        // ❌ On Cancel
        modal: {
          ondismiss: async () => {
            try {
              await updatePaymentStatus({
                order_id: data.order_id,
                status: "Cancel",
              });
              // console.log("Payment cancelled");
            } catch (err) {
              console.error("Cancel status error:", err);
            }
          },
        },
      };

      // ❌ On Failure (attach listener after rzp object is created)
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async () => {
        try {
          await updatePaymentStatus({
            order_id: data.order_id,
            status: "Fail",
          });
          show({
            title: "Payment Failed",
            description: "Payment failed.",
          });
        } catch (err) {
          console.error("Fail status error:", err);
        }
      });

      rzp.open();

      // console.log("🚀 ~ handlePayNow ~ options.prefill:", options.prefill);
      // console.log("Using Razorpay key:", razorpayKey);
      // console.log("🚀 ~ handlePayNow ~ options.order_id:", options.order_id);
    } catch (error) {
      console.error("Payment error:", error.response?.data || error);
      show({
        title: "Payment Error",
        description: "Something went wrong. Try again.",
      });
    }
  };

  const toDateString = (date) => {
    if (!date) return "";
    if (typeof date === "string" && date.length === 10) return date; // already formatted
    const d = new Date(date);
    // Pad month & date
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  };

  const handleCheckAvailability = async () => {
    setAvailabilityError("");
    setHasCheckedAvailability(false);

    // Payload for availability check
    const payload = {
      farm_id: String(farmId),
      start_date: toDateString(checkInLocal),
      start_time: checkInTimeLocal,
      end_date: toDateString(checkOutLocal),
      end_time: checkOutTimeLocal,
      no_of_guest: String(guestLocal),
    };

    try {
      const res = await checkBookingAvailability(payload);
      console.log("API response:", res);

      if (res?.status === 0) {
        setHasCheckedAvailability(true);
        setIsAvailable(true);
        setAvailabilityError("");
        setEditMode(false);

        if (Number.isFinite(res.final_price)) {
          setCurrentPrice(res.final_price);
        }
      } else {
        setHasCheckedAvailability(true);
        setIsAvailable(false);
        setAvailabilityError(
          res?.message || "Not available for selected dates."
        );
      }
    } catch (err) {
      setHasCheckedAvailability(true);
      setIsAvailable(false);
      setAvailabilityError(
        err?.response?.data?.message ||
          err?.message ||
          "Error checking availability."
      );
    }
  };

  const handleFieldEdit = (fieldSetter) => (val) => {
    fieldSetter(val);
    setHasCheckedAvailability(false);
    setAvailabilityError("");
    setIsAvailable(false);
  };

  const parseDate = (val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val))
      return new Date(val);
    return undefined;
  };

  const checkInDateObj = parseDate(checkInLocal);
  const checkOutDateObj = parseDate(checkOutLocal);

  const isBookingDurationInvalid =
    !!availabilityError &&
    availabilityError.includes("Invalid booking duration");

  const isCheckInBeforeCheckOut = () => {
    if (
      checkInDateObj &&
      checkOutDateObj &&
      checkInTimeLocal &&
      checkOutTimeLocal
    ) {
      const toDateTime = (date, time) => {
        if (!date || !time) return null;
        // time in "hh:mm AM/PM"
        const [timePart, period] = time.split(" ");
        let [hour, min] = timePart.split(":").map(Number);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return new Date(
          `${date.toISOString().slice(0, 10)}T${hour
            .toString()
            .padStart(2, "0")}:${min.toString().padStart(2, "0")}:00`
        );
      };
      const checkInDT = toDateTime(checkInDateObj, checkInTimeLocal);
      const checkOutDT = toDateTime(checkOutDateObj, checkOutTimeLocal);
      return checkOutDT > checkInDT;
    }
    return true;
  };

  const isBookingValid =
    checkInDateObj &&
    checkOutDateObj &&
    checkInTimeLocal &&
    checkOutTimeLocal &&
    isCheckInBeforeCheckOut() &&
    !isBookingDurationInvalid &&
    (checkOutDateObj > checkInDateObj ||
      checkInDateObj.toDateString() === checkOutDateObj.toDateString());

  const resetAvailability = () => {
    setHasCheckedAvailability(false); // Or your availability checked state
    setIsAvailable(false); // Or your isAvailable state if you have one
    setAvailabilityError(""); // Reset any error messages
  };

  // Example: for full state management, these setters must exist in your component

  const image = searchParams.get("image");
  const imageUrl = `${FARM_IMAGE_BASE_URL}/${image}`;

  return (
    <PublicPageLayout>
      {loading ? (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
          <img
            src="/bmflogofoot.svg"
            alt="Book My Farm Logo"
            className="w-40 h-40 md:w-60 md:h-60 animate-pulse mb-6"
          />
          <p className="text-neutral-500 text-sm animate-pulse">
            Loading your saved farms...
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto p-4 mb-16">
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
          <div className="flex bg-white shadow rounded-xl overflow-hidden mb-4">
            <img
              src={imageUrl}
              alt={farmName}
              className="w-48 h-40 object-cover"
            />
            <div className="flex flex-col justify-between p-3 flex-1">
              <div>
                <h2 className="text-sm font-semibold text-green-700 mb-2">
                  Farm
                </h2>
                <h1 className="text-base font-bold leading-tight mb-2">
                  {farmName}
                </h1>
                <a
                  href={farmLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-gray-500 hover:text-green-700 transition"
                >
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {areaCity}
                </a>
              </div>
              <div className="flex items-center text-xs text-yellow-600">
                Reviews <span className="ml-1">{rating}(0)</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl p-3 mb-4">
            <p>
              <strong>Booking Name:</strong> {bookingName}
            </p>
          </div>

          <div className="flex justify-end mb-2">
            {!editMode && (
              <button
                className="text-xs px-2 py-1 bg-gray-100 border rounded hover:bg-gray-200"
                onClick={() => setEditMode(true)}
                type="button"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg mb-4 relative">
            {editMode ? (
              <>
                <div className="col-span-3">
                  <ImprovedDatePicker
                    checkIn={checkInDateObj}
                    checkOut={checkOutDateObj}
                    checkInTime={checkInTimeLocal}
                    checkOutTime={checkOutTimeLocal}
                    onCheckInChange={(date) => {
                      setCheckInLocal(date);
                      resetAvailability();
                      // If checkout is before new checkin, reset checkout
                      if (
                        checkOutLocal &&
                        new Date(date) >= new Date(checkOutLocal)
                      ) {
                        setCheckOutLocal("");
                        setCheckOutTimeLocal("");
                      }
                    }}
                    onCheckOutChange={(date) => {
                      // If no check-in or check-out before check-in, don't allow
                      if (
                        !checkInDateObj ||
                        (date && new Date(date) < new Date(checkInDateObj))
                      ) {
                        setCheckOutLocal("");
                        setCheckOutTimeLocal("");
                        show({
                          title: "Invalid Date Selection",
                          description:
                            "Checkout date cannot be before check-in date.",
                        });
                        return;
                      }
                      setCheckOutLocal(date);
                      resetAvailability();
                    }}
                    onCheckInTimeChange={(time) => {
                      setCheckInTimeLocal(time);
                      resetAvailability();
                    }}
                    onCheckOutTimeChange={(time) => {
                      setCheckOutTimeLocal(time);
                      resetAvailability();
                    }}
                    checkInOptions={farm?.check_in_time || []}
                    checkOutOptions={farm?.check_out_time || []}
                  />

                  {/* Guest input, keep same rules */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Total Booking Person
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={guestLocal === 0 ? "" : guestLocal} // show blank if 0 (or keep guestLocal as string)
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow user to erase input to empty string
                        if (val === "") {
                          setGuestLocal(""); // let the user clear the input
                        } else {
                          const num = parseInt(val, 10);
                          setGuestLocal(isNaN(num) ? "" : num);
                        }
                        resetAvailability();
                      }}
                      onBlur={() => {
                        // If input is blank or less than 1, reset to 1
                        if (!guestLocal || guestLocal < 1) setGuestLocal(1);
                      }}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Your original 3-column static view */}
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                  <div className="text-xs text-neutral-500">Check-in</div>
                  <div className="font-medium">
                    {checkInLocal
                      ? typeof checkInLocal === "string"
                        ? checkInLocal
                        : checkInLocal.toLocaleDateString("en-GB")
                      : ""}
                  </div>

                  <p className="text-xs text-gray-400">{checkInTimeLocal}</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                  <div className="text-xs text-neutral-500">Check-out</div>
                  <div className="font-medium">
                    {checkOutLocal
                      ? typeof checkOutLocal === "string"
                        ? checkOutLocal
                        : checkOutLocal.toLocaleDateString("en-GB")
                      : ""}
                  </div>
                  <p className="text-xs text-gray-400">{checkOutTimeLocal}</p>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                  <div className="text-xs text-neutral-500">Guests</div>
                  <div className="font-medium">{guestLocal}</div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
            {hasDiscount && (
              <span className="text-gray-500 line-through text-sm">
                ₹
                {originalPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            )}
            <span className="text-green-700 font-bold text-xl">
              ₹
              {currentPrice.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="form-checkbox mt-1 text-green-600"
              />
              <span className="text-sm">
                Agree to the{" "}
                <button
                  className="underline text-green-600 hover:text-green-700"
                  onClick={() => setShowPolicy(!showPolicy)}
                  type="button"
                >
                  House & Cancellation Policy
                </button>
              </span>
            </div>

            {showPolicy && housePolicy && (
              <div
                className="mt-2 p-3 border rounded-lg bg-gray-50 text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: housePolicy }}
              />
            )}
          </div>

          {/* {editMode && hasCheckedAvailability && (
            <div
              className={`mb-3 text-sm font-medium ${
                isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAvailable
                ? "Farm is available for your selection."
                : availabilityError}
            </div>
          )} */}

          {editMode ? (
            <Button
              onClick={handleCheckAvailability}
              disabled={loading || !isBookingValid}
              className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              Check Availability
            </Button>
          ) : (
            <button
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
              onClick={handlePayNow}
              disabled={loading || !hasCheckedAvailability || !isAvailable}
            >
              Pay Now
            </button>
          )}
        </div>
      )}
    </PublicPageLayout>
  );
}
