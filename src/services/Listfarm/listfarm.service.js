import { api } from "@/axiosApi";

export const submitProperty = async (formData, token) => {
  try {
    const data = new FormData();

    // Append user_id and other form data
    data.append("user_id", formData.user_id);
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
    data.append("house_rule_policy", formData.house_rule_policy);
    data.append("description", formData.description);
    data.append("kids_swimming", formData.kids_swimming ? "1" : "0"); // Send as "1" or "0"
    data.append("category_id", formData.category_id);

    // Facilities (comma-separated)
    data.append(
      "facilities",
      formData.facilities.map((f) => f.trim()).join(",")
    );

    // Time arrays - required field name: check_in_time[] and check_out_time[]
    formData.check_in_time.forEach((time) =>
      data.append("check_in_time[]", time)
    );
    formData.check_out_time.forEach((time) =>
      data.append("check_out_time[]", time)
    );

    // Photos
    formData.photos.forEach((file) => {
      data.append("photos[]", file);
    });

    // Document uploads
    if (formData.government_photo_id) {
      data.append("government_photo_id", formData.government_photo_id);
    }
    if (formData.bank_details_check_photo) {
      data.append(
        "bank_details_check_photo",
        formData.bank_details_check_photo
      );
    }
    if (formData.property_agreement) {
      data.append("property_agreement", formData.property_agreement);
    }

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

export const getPropertyList = async (token) => {
  try {
    const response = await api.get("/api/property_list", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("[getPropertyList] Error:", error?.response?.data || error);
    return [];
  }
};
