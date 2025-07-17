"use client";

import { useEffect, useState } from "react";
import PublicPageLayout from "@/components/Layout/PublicPageLayout";
import { getAccessToken } from "@/hooks/cookies";
import { fetchFarmList } from "@/services/Farm/farm.service";
import {
  getOwnerBookings,
  getOwnerPayCalculation,
} from "@/services/Owner/owner.service"; // Import the function for API call

export default function FarmList() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [payCalculation, setPayCalculation] = useState(null); // State to store pay calculation data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = getAccessToken();

        if (!token) {
          throw new Error("No access token found");
        }

        const farmData = await fetchFarmList(token);
        setFarms(farmData.data);

        if (farmData.data && farmData.data.length > 0) {
          setSelectedFarm(farmData.data[0]);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
        setError("Failed to fetch farm data");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  // Fetch pay calculation when selected farm changes
  useEffect(() => {
    if (selectedFarm) {
      const fetchPayCalculation = async () => {
        const token = getAccessToken();
        if (!token) {
          console.error("No access token found");
          return;
        }

        try {
          const data = await getOwnerPayCalculation({
            farmId: selectedFarm.id,
            token,
          });
          setPayCalculation(data); // Set the pay calculation data
        } catch (error) {
          console.error("Error fetching pay calculation:", error);
        }
      };

      fetchPayCalculation();
    }
  }, [selectedFarm]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getAccessToken();

        if (!token) {
          throw new Error("No access token found");
        }

        const startDate = `${currentYear}-${currentMonth + 1}-01`;
        const endDate = `${currentYear}-${currentMonth + 1}-31`;

        const bookingsData = await getOwnerBookings({
          farmId: selectedFarm.id,
          startDate,
          endDate,
          token,
        });

        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch booking data");
      }
    };

    if (selectedFarm) {
      fetchBookings();
    }
  }, [selectedFarm, currentMonth, currentYear]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectFarm = (farm) => {
    setSelectedFarm(farm);
    setIsDropdownOpen(false);
    setSelectedDate(null);
  };

  // const handleSelectDate = (date) => {
  //   setSelectedDate(date);
  // };

  const getCalendarDays = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentYear, currentMonth + direction);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth());
  };

  const calendarDays = getCalendarDays(currentMonth, currentYear);

  const handleDateClass = (date) => {
    let isBooked = false;
    let isStart = false;
    let isEnd = false;
    let isMiddle = false;
    let color = "";

    for (let booking of bookings) {
      const checkInDate = new Date(booking.check_in_date);
      const checkOutDate = new Date(booking.check_out_date);

      // Normalize dates to midnight for comparison
      const normCheckIn = new Date(checkInDate.setHours(0, 0, 0, 0));
      const normCheckOut = new Date(checkOutDate.setHours(0, 0, 0, 0));
      const normDate = new Date(date.setHours(0, 0, 0, 0));

      if (normDate >= normCheckIn && normDate <= normCheckOut) {
        isBooked = true;

        // Set color based on owner_booked value
        color = booking.owner_booked === 1 ? "green" : "orange"; // Green if confirmed, orange if not

        if (normDate.getTime() === normCheckIn.getTime()) {
          isStart = true;
        } else if (normDate.getTime() === normCheckOut.getTime()) {
          isEnd = true;
        } else {
          isMiddle = true;
        }

        break;
      }
    }

    return { isBooked, isStart, isEnd, isMiddle, color };
  };

  if (loading) {
    // Show loading screen when data is being fetched
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <img
          src="/bmflogofoot.svg"
          alt="Book My Farm Logo"
          loading="eager"
          style={{ width: "350px", height: "350px" }}
          className="mb-4"
        />
        <p className="text-neutral-500 text-sm animate-pulse">
          Loading farms...
        </p>
      </div>
    );
  }

  return (
    <PublicPageLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Manage Your Booking</h1>

        {loading ? (
          <p className="text-gray-500">Loading farms...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {selectedFarm && (
              <div className="mt-6 p-4 bg-white rounded-xl shadow">
                {/* Farm Selector Dropdown integrated into the card */}
                <div className="relative mb-4">
                  <button
                    onClick={toggleDropdown}
                    className="w-full text-left bg-white border rounded-md p-2 shadow-md flex items-center justify-between"
                  >
                    <span className="font-semibold">
                      {selectedFarm.farm_alias_name}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute w-full mt-1 bg-white border rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
                      {farms.map((farm, i) => {
                        const imageUrl = farm.first_image
                          ? `https://api.bookmyfarm.net/assets/images/farm_images/${farm.first_image.image}`
                          : "/sample-farm.jpg";

                        return (
                          <li
                            key={i}
                            onClick={() => handleSelectFarm(farm)}
                            className="p-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-3"
                          >
                            <img
                              src={imageUrl}
                              alt={farm.farm_alias_name}
                              className="w-10 h-10 object-cover rounded-md"
                            />
                            <span>{farm.farm_alias_name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Farm Details */}
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow mb-4">
                  <img
                    src={
                      selectedFarm.first_image
                        ? `https://api.bookmyfarm.net/assets/images/farm_images/${selectedFarm.first_image.image}`
                        : "/sample-farm.jpg"
                    }
                    alt={selectedFarm.farm_alias_name}
                    className="rounded-xl object-cover w-16 h-16"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {selectedFarm.farm_alias_name}
                    </h3>
                  </div>
                </div>

                {/* Bookings and Transaction Section */}
                <div className="mt-6">
                  {/* Bookings Section */}
                  <div className="bg-white p-4 rounded-xl shadow mb-4">
                    <h4 className="font-semibold text-sm text-center py-2">
                      <span className="text-white bg-green-600 rounded-md px-4 inline-block min-w-[120px]">
                        Bookings
                      </span>
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-gray-700 mt-4 text-center">
                      <div className="flex flex-col items-center p-2">
                        <div className="text-sm sm:text-base">Total</div>
                        <div className="font-bold text-sm sm:text-base text-blue-600">
                          {payCalculation?.booking_total || 0}
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-2">
                        <div className="text-sm sm:text-base">Upcoming</div>
                        <div className="font-bold text-sm sm:text-base text-green-600">
                          {payCalculation?.booking_upcoming || 0}
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-2">
                        <div className="text-sm sm:text-base">Cancelled</div>
                        <div className="font-bold text-sm sm:text-base text-red-600">
                          {payCalculation?.booking_cancelled || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Section */}
                  <div className="bg-white p-4 rounded-xl shadow">
                    <h4 className="font-semibold text-sm text-center py-2">
                      <span className="text-white bg-orange-600 rounded-md px-4 inline-block min-w-[120px]">
                        Transaction
                      </span>
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-gray-700 mt-4 text-center">
                      <div className="flex flex-col items-center p-2">
                        <div className="text-sm sm:text-base">Total</div>
                        <div className="font-bold text-sm sm:text-base text-blue-600">
                          ₹{payCalculation?.transaction_total || 0}
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-2">
                        <div className="text-sm sm:text-base">Paid</div>
                        <div className="font-bold text-sm sm:text-base text-green-600">
                          ₹{payCalculation?.transaction_paid || 0}
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-2">
                        <div className="text-sm sm:text-base whitespace-nowrap">
                          Under Progress
                        </div>
                        <div className="font-bold text-sm sm:text-base text-orange-600">
                          ₹{payCalculation?.transaction_upcoming || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar view for selecting dates */}
                <div className="mt-6">
                  {/* Month Navigation */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => handleMonthChange(-1)}
                      className="text-lg"
                    >
                      {"<"}
                    </button>
                    <span className="text-lg font-medium">
                      {new Date(currentYear, currentMonth).toLocaleString(
                        "default",
                        {
                          month: "long",
                        }
                      )}{" "}
                      {currentYear}
                    </span>
                    <button
                      onClick={() => handleMonthChange(1)}
                      className="text-lg"
                    >
                      {">"}
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-0">
                    {/* Weekday headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day, i) => (
                        <div
                          key={i}
                          className="text-center font-medium py-2 text-sm"
                        >
                          {day}
                        </div>
                      )
                    )}

                    {/* Calendar days */}
                    {calendarDays.map((date, i) => {
                      const { isBooked, isStart, isEnd, isMiddle, color } =
                        handleDateClass(date);
                      const dayOfWeek = date.getDay();

                      return (
                        <div
                          key={i}
                          className="relative h-12 flex items-center justify-center"
                        >
                          <span className="z-10">{date.getDate()}</span>

                          {/* Booking indicator line */}
                          {isBooked && (
                            <div
                              className={`absolute bottom-0 h-1.5 
                        ${color === "green" ? "bg-green-500" : "bg-orange-500"}
                        ${
                          isMiddle || (isStart && dayOfWeek !== 0) || isEnd
                            ? "left-0 right-0"
                            : isStart
                            ? "left-1/2 right-0"
                            : "left-0 right-0"
                        }
                        ${isStart ? "rounded-l-full" : ""}
                        ${isEnd ? "rounded-r-full" : ""}`}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Indicators for Booked and Blocked (Left-Aligned Below Calendar) */}
                <div className="mt-4 flex justify-start text-sm text-gray-700 space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>Blocked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span>Booked</span>
                  </div>
                </div>

                {/* Booking Cards Section under Calendar */}
                <div className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bookings.map((booking, index) => {
                      // Function to convert 24-hour time format to 12-hour AM/PM format
                      const formatTime = (time) => {
                        const date = new Date(`1970-01-01T${time}Z`); // Convert the time string to a Date object
                        return date.toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                      };

                      return (
                        <div
                          key={index}
                          className="w-full bg-white rounded-xl shadow-md overflow-hidden p-6"
                        >
                          {/* Farm Name Header with Phone Call Icon after the farm name */}
                          <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-bold text-gray-800 w-full">
                              {booking.farm.farm_alias_name}{" "}
                              {/* Dynamic farm name */}
                            </h1>
                            {/* Phone Call Icon next to the farm name */}
                            <a
                              href={`tel:${booking.user.phone_number}`}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="Call farm"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6 cursor-pointer"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </a>
                          </div>

                          {/* Payment Status with rounded border under farm name */}
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 mb-4 border ${
                              booking.status === "Payment Success"
                                ? "text-green-600 border-green-200 bg-green-50"
                                : booking.status === "Payment Pending"
                                ? "text-orange-600 border-orange-200 bg-orange-50"
                                : "text-red-600 border-red-200 bg-red-50"
                            }`}
                          >
                            {booking.status === 1
                              ? "Payment Success"
                              : booking.status === 0
                              ? "Payment Pending"
                              : "Cancelled"}{" "}
                          </div>

                          {/* Booking Dates */}
                          <div className="flex justify-between mb-6">
                            <div>
                              <p className="text-sm text-gray-500">Check in</p>
                              <p className="font-medium">
                                {booking.check_in_date}{" "}
                                {formatTime(booking.check_in_time)}{" "}
                                {/* Format the check-in time */}
                              </p>{" "}
                              {/* Dynamic check-in date and time */}
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Check out</p>
                              <p className="font-medium">
                                {booking.check_out_date}{" "}
                                {formatTime(booking.check_out_time)}{" "}
                                {/* Format the check-out time */}
                              </p>{" "}
                              {/* Dynamic check-out date and time */}
                            </div>
                          </div>

                          <div className="border-t border-gray-200 my-4"></div>

                          {/* Booker Information */}
                          <div className="mb-4 bg-gray-50 rounded-lg p-4 space-y-3">
                            <div>
                              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Booked By
                              </h2>
                              <h3 className="text-lg font-bold text-gray-700 mt-1">
                                {booking.user.name}{" "}
                                {/* Dynamic booked by name */}
                              </h3>
                            </div>

                            {/* Guest/Total/Pending section with light borders */}
                            <div className="grid grid-cols-3 gap-0 bg-white rounded-md p-2 border border-gray-100">
                              <div className="text-center">
                                <p className="text-xs text-gray-500">
                                  No. of Guests
                                </p>
                                <p className="font-medium text-gray-800">
                                  {booking.no_of_guest}
                                </p>{" "}
                                {/* Dynamic number of guests */}
                              </div>
                              <div className="text-center border-l border-r border-gray-100">
                                <p className="text-xs text-gray-500">
                                  Total Amount
                                </p>
                                <p className="font-medium text-gray-800">
                                  {booking.total_price}{" "}
                                  {/* Dynamic total price without dollar sign */}
                                </p>{" "}
                                {/* Dynamic total price */}
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">
                                  Pending Amount
                                </p>
                                <p className="font-medium text-gray-800">
                                  {booking.status === "Payment Success"
                                    ? "0.00"
                                    : `${booking.pending_amount}`}{" "}
                                  {/* Dynamic pending amount without dollar sign */}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Cancel Booking Button with reduced top margin */}
                          <button className="w-full mt-4 py-2 px-4 bg-[#FF5858] text-white font-medium rounded-full hover:bg-[#E04E4E] transition-colors">
                            {booking.status === "Cancelled"
                              ? "Closed"
                              : "Cancel Booking"}{" "}
                            {/* Conditional text based on status */}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}
