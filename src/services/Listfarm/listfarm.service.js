import { api } from "@/axiosApi";

export const submitProperty = async (formData, token) => {
  try {
    const data = new FormData();

    // Required backend fields
    data.append("name", formData.name);
    data.append("size", formData.size);
    data.append("swimming_pool_size", formData.swimming_pool_size || "");
    data.append("care_taker_name", formData.care_taker_name);
    data.append("care_taker_number", formData.care_taker_number);
    data.append("person_limit", formData.person_limit);
    data.append("day_capacity", formData.day_capacity);
    data.append("night_capacity", formData.night_capacity);
    data.append("extra_person_charge", formData.extra_person_charge);
    data.append("weekday_half_day_price", formData.weekday_half_day_price);
    data.append("weekday_full_day_price", formData.weekday_full_day_price);
    data.append("weekend_half_day_price", formData.weekend_half_day_price);
    data.append("weekend_full_day_price", formData.weekend_full_day_price);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("near_by_area", formData.near_by_area);
    data.append("location_link", formData.location_link);
    data.append("referral_code", formData.referral_code || "");
    data.append( 
      "facilities",
      formData.facilities.map((f) => f.trim()).join(",")
    );

    // Photos
    formData.photos.forEach((file) => {
      data.append("photos[]", file);
    });

    const response = await api.post("/api/add_property", data, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ [submitProperty] Error:", error);
    throw error?.response?.data || error;
  }
};
