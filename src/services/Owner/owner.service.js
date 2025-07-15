export const getOwnerBookings = async ({ farmId, startDate, endDate, token }) => {
  try {
    const response = await api.post(
      "/api/owner_booking_list",
      {
        farm_id: farmId.toString(),
        start_date: startDate,
        end_date: endDate,
        // page: "1",
        // per_page: "10"
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    throw error;
  }
};
