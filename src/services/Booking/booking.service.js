import { api } from "@/axiosApi";

export const addBooking = async ({
  farm_id,
  transaction_id,
  check_in_date,
  check_in_time,
  check_out_date,
  check_out_time,
  no_of_guest,
  total_price,
}) => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await api.post(
    '/api/add_booking',
    {
      farm_id,
      transaction_id,
      check_in_date,
      check_in_time,
      check_out_date,
      check_out_time,
      no_of_guest,
      total_price,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};


export const getBookingList = async ({ status, page = '1', perPage = '10' }) => {
  const token = localStorage.getItem('accessToken'); // 🔐 Get token

  try {
    const response = await api.post(
      '/api/booking_list',
      {
        status,        // No hardcoded value, uses the status passed to the function
        page,
        per_page: perPage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching booking list:', error);
    return { status: 0, message: 'Error fetching booking list', data: [] };
  }
};



export const getBookingDetails = async (bookingId) => {
  const token = localStorage.getItem('accessToken'); 
  try {
    const response = await api.post(
      '/api/booking_details',
      { booking_id: bookingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    return response.data; // contains status and data
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return { status: 0, message: 'Failed to fetch details' };
  }
};


export const cancelBooking = async (bookingId) => {
   const token = localStorage.getItem('accessToken'); 
  try {
    const response = await api.post(
      '/api/cancel_booking', 
      { booking_id: bookingId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};