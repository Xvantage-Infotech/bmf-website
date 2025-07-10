"use client";
import { useEffect, useState } from "react";
import { getBookingDetails } from "@/services/Booking/booking.service";
import { cancelBooking } from "@/services/Booking/booking.service"; // Import the cancelBooking function
import { useParams, useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { FARM_IMAGE_BASE_URL } from "@/lib/utils";
import { useDialog } from "@/hooks/use-dialog";
import { getAccessToken } from "@/hooks/cookies";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter(); // useRouter hook to programmatically navigate
  const [details, setDetails] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const { show } = useDialog();

  useEffect(() => {
    const fetchData = async () => {
     const token = getAccessToken();
      if (!token) return;

      const res = await getBookingDetails(id, token);
      if (res.status === 1) {
        setDetails(res.data);
      }
    };

    fetchData();
  }, [id]);

  if (!details) return <p className="p-4">Loading...</p>;

  const farm = details.farm;
  const farmImage = farm.farm_images?.[0]?.image;
  const statusLabel =
    details.status === 1
      ? "Upcoming"
      : details.status === 0
      ? "Complete"
      : "Cancelled";
  const statusColor =
    details.status === 1
      ? "bg-blue-100 text-blue-600"
      : details.status === 0
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";

  const handleCancelBooking = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const res = await cancelBooking(id, token);
      if (res.status === 1) {
        setIsCancelled(true);
        show({
          title: "Booking Cancelled",
          description: "Booking has been cancelled successfully.",
        });
        router.push("/booking-confirmation"); // Navigate to booking confirmation page after success
      }
    } catch (error) {
      show({
        title: "Cancellation Failed",
        description: "Failed to cancel the booking. Please try again.",
      });
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-semibold">Booking Details</h1>

      {/* Farm Details */}
      <div className="bg-white shadow rounded-xl p-3 relative">
        {/* Status label */}
        <span
          className={`absolute top-2 right-2 text-xs px-3 py-1 rounded-full ${statusColor}`}
        >
          {statusLabel}
        </span>

        {/* Farm info */}
        <div className="flex gap-4">
          <img
            src={`${FARM_IMAGE_BASE_URL}/${farmImage}`}
            className="w-40 h-40 rounded-lg object-cover"
            alt="Farm"
          />
          <div className="flex-1">
            <p className="text-sm text-primary font-semibold mb-2">Farm</p>
            <h2 className="text-base font-bold text-neutral-900 mb-2">
              {farm.farm_alias_name}
            </h2>
            <a
              href={farm.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 flex items-center hover:underline text-sm"
            >
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              {farm.area.name}, {farm.city.name}
            </a>
          </div>
        </div>
      </div>

      {/* Booking Information */}
      <div className="bg-white shadow rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <p className="text-sm text-gray-500">Booking Name</p>
            <p className="text-lg font-semibold text-neutral-800">
              {details.user.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Number of Guests</p>
            <p className="text-lg font-semibold text-neutral-800">
              {details.no_of_guest}
            </p>
          </div>
        </div>

        {/* Check-in / Check-out */}
        <div className="grid grid-cols-2 gap-4 bg-neutral-50 rounded-md p-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Check-in</p>
            <p className="text-base font-semibold text-neutral-900">
              {new Date(details.check_in_date).toLocaleDateString("en-GB")}
            </p>
            <p className="text-xs text-gray-400">{details.check_in_time}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Check-out</p>
            <p className="text-base font-semibold text-neutral-900">
              {new Date(details.check_out_date).toLocaleDateString("en-GB")}
            </p>
            <p className="text-xs text-gray-400">{details.check_out_time}</p>
          </div>
        </div>
      </div>

      {/* Manage Booking Section */}
      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <p className="text-sm text-gray-600">Manage Booking</p>
        <button
          onClick={handleCancelBooking}
          className="w-full py-2 bg-red-100 rounded-md text-sm font-medium"
        >
          {isCancelled ? "Booking Cancelled" : " Cancel Booking"}
        </button>
      </div>

      {/* Payment Information */}
      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <p className="text-sm text-gray-600">Payment Information</p>
        <p className="text-base font-bold">₹{details.total_price}</p>
      </div>
    </div>
  );
}
