// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   Calendar,
//   MapPin,
//   Users,
//   Download,
//   Share2,
//   Home
// } from 'lucide-react';
// import { getBookingList } from '@/services/Booking/booking.service';
// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import { FARM_IMAGE_BASE_URL } from '@/lib/utils';

// export default function BookingConfirmation() {
//   const [bookings, setBookings] = useState([]);
//   const [statusFilter, setStatusFilter] = useState(1); // Default to 'Upcoming'
//   const [loading, setLoading] = useState(false); // Add loading state
//   const { user } = useAuth();
//   const router = useRouter();

//   const statusTabs = [
//     { label: 'Upcoming', value: 1 },
//     { label: 'Complete', value: 0 },
//     { label: 'Cancelled', value: 2 },
//   ];

//   // Fetch bookings based on the selected status filter
//   const fetchBookings = async (status) => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       console.error('No access token found');
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log('Fetching bookings with status:', status);
//       const response = await getBookingList({
//         status, // Pass the dynamic status to the API call
//         page: '1',
//         perPage: '10',
//         token,
//       });

//       console.log('API Response:', response);

//       if (response?.status === 1 && response.data?.length > 0) {
//         const formatted = response.data.map((b) => {
//           const farm = b.farm;
//           const checkIn = new Date(b.check_in_date);
//           const checkOut = new Date(b.check_out_date);

//           // Handle booking status directly (either from API response or fallback logic)
//           const bookingStatus = b.status === 2
//             ? 'Cancelled'
//             : checkOut < new Date() 
//             ? 'Completed' 
//             : 'Upcoming';

//           return {
//             id: b.id,
//             farmName: farm.farm_alias_name || farm.name,
//             location_link: farm.location_link,
//             checkIn,
//             checkOut,
//             guests: b.no_of_guest,
//             areaCity: `${farm.area?.name || ''}, ${farm.city?.name || ''}`,
//             totalAmount: b.total_price || 0,
//             bookingDate: new Date().toISOString(),
//             status: bookingStatus, // Use the booking status here
//             farmImage: farm.farm_images?.length
//               ? `${FARM_IMAGE_BASE_URL}/${farm.farm_images[0].image}`
//               : '/placeholder.jpg',
//           };
//         });

//         setBookings(formatted);
//       } else {
//         setBookings([]); // Set to empty array if no bookings are found
//       }
//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       setBookings([]); // Handle error by clearing bookings
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch bookings when statusFilter changes
//   useEffect(() => {
//     console.log('useEffect triggered with statusFilter:', statusFilter);
//     fetchBookings(statusFilter);
//   }, [statusFilter]);

//   // Handle status tab change
//   const handleStatusChange = (status) => {
//     console.log('Selected status:', status);
//     setStatusFilter(status); // Update statusFilter to trigger fetch
//   };

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       <section className="section-padding">
//         {/* <div className="max-w-4xl mx-auto container-padding"> */}
//         <div className="w-full max-w-7xl mx-auto container-padding">

//           <CardTitle className="mb-5">Booking Summary</CardTitle>

//           <div className="flex gap-4 mb-6">
//             {statusTabs.map((tab) => (
//               <button
//                 key={tab.value}
//                 onClick={() => handleStatusChange(tab.value)}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
//                   statusFilter === tab.value
//                     ? 'bg-primary text-white'
//                     : 'bg-white text-neutral-600 border-neutral-300'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

    

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//   {loading ? (
//     <p className="text-center col-span-full p-6">Loading booking details...</p>
//   ) : bookings.length === 0 ? (
//     <p className="text-center col-span-full p-6">
//       {statusFilter === 2
//         ? 'No cancelled bookings found.'
//         : 'No bookings available for the selected status.'}
//     </p>
//   ) : (
//     bookings.map((booking) => (
//       <Card
//         key={booking.id}
//         className="cursor-pointer hover:shadow-md transition-shadow"
//         onClick={() => {
//           if (statusFilter !== 2) {
//             router.push(`/booking-details/${booking.id}`);
//           }
//         }}
//       >
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <Badge
//               className={
//                 statusFilter === 2
//                   ? 'bg-red-100 text-red-800'
//                   : booking.status === 'Cancelled'
//                   ? 'bg-red-100 text-red-800'
//                   : booking.status === 'Completed'
//                   ? 'bg-blue-100 text-blue-800'
//                   : 'bg-green-100 text-green-800'
//               }
//             >
//               {statusFilter === 2
//                 ? 'Cancelled'
//                 : booking.status === 'Cancelled'
//                 ? 'Cancelled'
//                 : booking.status === 'Completed'
//                 ? 'Completed'
//                 : 'Confirmed'}
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center gap-4">
//             <img
//               src={booking.farmImage}
//               alt={`${booking.farmName} image`}
//               className="w-32 h-32 object-cover rounded-lg"
//             />
//             <div className="flex-1 space-y-2">
//               <div className="text-xl font-semibold text-neutral-900">{booking.farmName}</div>
//               <a
//                 href={booking.location_link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-neutral-600 flex items-center hover:underline text-sm"
//               >
//                 <MapPin className="w-4 h-4 mr-2 text-primary" />
//                 {booking.areaCity}
//               </a>
//               <div className="grid grid-cols-2 gap-4 pt-2">
//                 <div>
//                   <div className="text-sm text-neutral-500">Booking ID</div>
//                   <div className="font-mono font-semibold text-lg">{booking.id}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-neutral-500">Booking Date</div>
//                   <div className="font-medium">
//                     {new Date(booking.bookingDate).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
//             <div className="text-center">
//               <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
//               <div className="text-xs text-neutral-500">Check-in</div>
//               <div className="font-medium">
//                 {new Date(booking.checkIn).toLocaleDateString()}
//               </div>
//             </div>
//             <div className="text-center">
//               <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
//               <div className="text-xs text-neutral-500">Check-out</div>
//               <div className="font-medium">
//                 {new Date(booking.checkOut).toLocaleDateString()}
//               </div>
//             </div>
//             <div className="text-center">
//               <Users className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
//               <div className="text-xs text-neutral-500">Guests</div>
//               <div className="font-medium">{booking.guests}</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     ))
//   )}
// </div>

//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { getBookingList } from "@/services/Booking/booking.service";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FARM_IMAGE_BASE_URL } from "@/lib/utils";
import { getAccessToken } from "@/hooks/cookies";

export default function BookingConfirmation() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const statusTabs = [
    { label: "Upcoming", value: 1 },
    { label: "Complete", value: 0 },
    { label: "Cancelled", value: 2 },
  ];

  const fetchBookings = async (status) => {
    const token = getAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await getBookingList({
        status,
        page: "1",
        perPage: "10",
        token,
      });

      if (response?.status === 1 && response.data?.length > 0) {
        const formatted = response.data.map((b) => {
          const farm = b.farm;
          const checkIn = new Date(b.check_in_date);
          const checkOut = new Date(b.check_out_date);
          const bookingStatus =
            b.status === 2
              ? "Cancelled"
              : checkOut < new Date()
              ? "Completed"
              : "Upcoming";

          return {
            id: b.id,
            farmName: farm.farm_alias_name || farm.name,
            location_link: farm.location_link,
            checkIn,
            checkOut,
            guests: b.no_of_guest,
            areaCity: `${farm.area?.name || ""}, ${farm.city?.name || ""}`,
            totalAmount: b.total_price || 0,
            bookingDate: new Date().toISOString(),
            status: bookingStatus,
            farmImage: farm.farm_images?.length
              ? `${FARM_IMAGE_BASE_URL}/${farm.farm_images[0].image}`
              : "/placeholder.jpg",
          };
        });

        setBookings(formatted);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(statusFilter);
  }, [statusFilter]);

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {loading ? (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
          <img
            src="/bmflogofoot.svg"
            alt="Book My Farm Logo"
            className="w-40 h-40 md:w-60 md:h-60 animate-pulse mb-4"
          />
          <p className="text-neutral-500 text-sm animate-pulse">
            Loading booking details...
          </p>
        </div>
      ) : (
        <section className="section-padding">
          <div className="w-full max-w-7xl mx-auto container-padding">
            <CardTitle className="mb-5">Booking Summary</CardTitle>

            <div className="flex gap-4 mb-6">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleStatusChange(tab.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                    statusFilter === tab.value
                      ? "bg-primary text-white"
                      : "bg-white text-neutral-600 border-neutral-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.length === 0 ? (
                <p className="text-center col-span-full p-6">
                  {statusFilter === 2
                    ? "No cancelled bookings found."
                    : "No bookings available for the selected status."}
                </p>
              ) : (
                bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      if (statusFilter !== 2) {
                        router.push(`/booking-details/${booking.id}`);
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            booking.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : booking.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={booking.farmImage}
                          alt={`${booking.farmName} image`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="text-xl font-semibold text-neutral-900">
                            {booking.farmName}
                          </div>
                          <a
                            href={booking.location_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-600 flex items-center hover:underline text-sm"
                          >
                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                            {booking.areaCity}
                          </a>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <div className="text-sm text-neutral-500">
                                Booking ID
                              </div>
                              <div className="font-mono font-semibold text-lg">
                                {booking.id}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-neutral-500">
                                Booking Date
                              </div>
                              <div className="font-medium">
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                        <div className="text-center">
                          <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                          <div className="text-xs text-neutral-500">
                            Check-in
                          </div>
                          <div className="font-medium">
                            {new Date(
                              booking.checkIn
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <Calendar className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                          <div className="text-xs text-neutral-500">
                            Check-out
                          </div>
                          <div className="font-medium">
                            {new Date(
                              booking.checkOut
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <Users className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                          <div className="text-xs text-neutral-500">
                            Guests
                          </div>
                          <div className="font-medium">{booking.guests}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}