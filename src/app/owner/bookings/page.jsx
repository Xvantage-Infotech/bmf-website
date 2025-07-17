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
              </div>
            )}
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}
