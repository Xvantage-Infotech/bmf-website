"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { FACILITY_OPTIONS, TIME_OPTIONS } from "@/constants/categories";
import { submitProperty } from "@/services/Listfarm/listfarm.service";
import { useAuth } from "@/contexts/AuthContext";
import { useDialog } from "@/hooks/use-dialog";
import {
  fetchAreas,
  fetchCities,
  fetchPropertyCategories,
  fetchRulesAndPolicies,
} from "@/services/Farm/farm.service";

// ✅ Move this above the default export or in a separate file
const InputField = ({
  name,
  label,
  type = "text",
  required = false,
  placeholder = "",
  note = "",
  formData,
  errors,
  handleInputChange,
  validateField,
  setErrors,
  refs,
}) => {
  const handleBlur = () => {
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {note && (
          <span className="text-xs text-neutral-500 ml-2">({note})</span>
        )}
      </Label>
      <Input
        id={name}
        name={name}
        ref={(el) => (refs.current[name] = el)}
        type={type}
        value={formData[name] ?? ""}
        onChange={(e) => handleInputChange(name, e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={errors[name] ? "border-red-500" : ""}
      />
      {errors[name] && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );
};

export default function PropertyRegistrationForm() {
  const { user } = useAuth();
  const { show } = useDialog();
  const refs = useRef({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      console.warn("⚠️ Form validation failed");
      return;
    }

    if (!user?.token) {
      show({
        title: "Login Required",
        description: "Please log in to register your property.",
      });

      console.error("❌ No token found for user");
      return;
    }

    if (!user) {
      console.error("User is not available");
      return;
    }

    // Directly set user_id in formData
    const formDataWithUserId = { ...formData, user_id: user.id };
    setIsSubmitting(true);

    try {
      const response = await submitProperty(formDataWithUserId, user.token);

      show({
        title: "Property Submitted!",
        description: "We’ll review it and get back to you soon.",
      });

      setFormData({
        user_id: user.id, // Ensure user_id is correctly set here
        name: "",
        size: "",
        facilities: [],
        swimming_pool_size: "",
        care_taker_name: "",
        care_taker_number: "",
        person_limit: "",
        day_capacity: "",
        night_capacity: "",
        extra_person_charge: "",
        weekday_half_day_price: "",
        weekday_full_day_price: "",
        weekend_half_day_price: "",
        weekend_full_day_price: "",
        address: "",
        city: "",
        near_by_area: "",
        location_link: "",
        kids_swimming: false,
        referral_code: "",
        photos: [],
        house_rule_policy: "",
        category_id: "",
        description: "",
        check_in_time: [],
        check_out_time: [],

        // Document upload fields
        government_photo_id: null,
        bank_details_check_photo: [],
        property_agreement: null,

        // Not sent to backend
        farmOwnerName: "",
        farmOwnerMobile: "",
        farmOwnerEmail: "",
      });

      setErrors({});
    } catch (error) {
      console.error("❌ Error submitting property:", error);
      show({
        title: "Submission Error",
        description:
          error?.message ||
          "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const [formData, setFormData] = useState({
  //   farmOwnerName: "",
  //   farmOwnerMobile: "",
  //   farmOwnerEmail: "",
  //   farmName: "",
  //   city: "",
  //   nearbyArea: "",
  //   personLimit: "",
  //   guestStayCapacityDay: "",
  //   guestStayCapacityNight: "",
  //   farmSizeSqYd: "",
  //   extraPersonChargeWeekdays: "",
  //   extraPersonChargeWeekends: "",
  //   price12HourWeekday: "",
  //   price24HourWeekday: "",
  //   price12HourWeekend: "",
  //   price24HourWeekend: "",
  //   checkInTime: "",
  //   checkOutTime: "",
  //   caretakerName: "",
  //   caretakerNumber: "",
  //   farmAddress: "",
  //   farmFacilities: [],
  //   locationLink: "",
  //   propertyRules: "",
  //   swimmingPoolSize: "",
  //   kidsSwimmingPool: false,
  //   referralCode: "",
  //   propertyPhotos: [],
  // });

  const governmentIdRef = useRef(null);
  const bankDetailsRef = useRef(null);
  const propertyAgreementRef = useRef(null);

  const [rulesData, setRulesData] = useState({
    rules_and_policies: [],
    cancellation_policy: [],
    commission_policy: [],
  });
  const [agreed, setAgreed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetchRulesAndPolicies(token);

        setRulesData({
          rules_and_policies: res.rules || [],
          cancellation_policy: res.cancellation || [],
          commission_policy: res.commission || [],
        });
      } catch (err) {
        console.error("Failed to fetch rules:", err);
      }
    };

    fetchRules();
  }, []);

  const cleanParagraphs = (htmlString) =>
    htmlString
      .split("</p>")
      .map((p) => p.trim())
      .filter((p) => {
        const textContent = p.replace(/<[^>]*>?/gm, "").trim();
        return (
          textContent.length > 0 &&
          p !== "<p><br>" &&
          p !== "<p>&nbsp;" &&
          !p.toLowerCase().includes("<br>")
        );
      })
      .map((p, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: p + "</p>" }} />
      ));

  const [formData, setFormData] = useState({
    // Backend-required fields
    user_id: "",
    name: "",
    size: "",
    facilities: [],
    swimming_pool_size: "",
    care_taker_name: "",
    care_taker_number: "",
    person_limit: "",
    day_capacity: "",
    night_capacity: "",
    extra_person_charge: "",
    weekday_half_day_price: "",
    weekday_full_day_price: "",
    weekend_half_day_price: "",
    weekend_full_day_price: "",
    address: "",
    city: "",
    near_by_area: "",
    location_link: "",
    referral_code: "",
    house_rule_policy: "",
    description: "",
    category_id: "",
    kids_swimming: false,
    photos: [],

    // New document upload fields
    government_photo_id: null,
    bank_details_check_photo: [],
    property_agreement: null,

    // Extra frontend-only fields (not sent to backend)
    farmOwnerName: "",
    farmOwnerMobile: "",
    farmOwnerEmail: "",
    check_in_time: [],
    check_out_time: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);

  useEffect(() => {
    fetchPropertyCategories()
      .then(setCategories)
      .catch((err) => {
        console.error("Failed to load categories", err);
      });
  }, []);

  useEffect(() => {
    const loadLocationOptions = async () => {
      try {
        const cities = await fetchCities();
        const areas = await fetchAreas();
        setCityOptions(cities);
        setAreaOptions(areas);
      } catch (err) {
        console.error("Failed to load city/area options", err);
      }
    };

    loadLocationOptions();
  }, []);

  // const validateField = (name, value) => {
  //   switch (name) {
  //     case "farmOwnerMobile":
  //     case "caretakerNumber":
  //       if (typeof value === "string" && value && !/^\d{10}$/.test(value)) {
  //         return "Please enter a valid 10-digit mobile number";
  //       }
  //       break;
  //     case "farmOwnerEmail":
  //       if (
  //         typeof value === "string" &&
  //         value &&
  //         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  //       ) {
  //         return "Please enter a valid email address";
  //       }
  //       break;
  //     case "locationLink":
  //       if (
  //         typeof value === "string" &&
  //         value &&
  //         !/^https?:\/\/.+/.test(value)
  //       ) {
  //         return "Please enter a valid URL (starting with http:// or https://)";
  //       }
  //       break;
  //     case "propertyPhotos":
  //       if (Array.isArray(value) && value.length === 0) {
  //         return "Please upload at least one property photo";
  //       }
  //       if (Array.isArray(value) && value.length > 10) {
  //         return "Maximum 10 photos allowed";
  //       }
  //       break;
  //   }
  //   return "";
  // };

  const handleMultiFileUpload = (field, files, type = "image") => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      const isValidType =
        type === "image"
          ? file.type.startsWith("image/")
          : file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== newFiles.length) {
      setErrors((prev) => ({
        ...prev,
        [field]: `Some files were rejected. Only ${
          type === "image" ? "images" : "images/videos"
        } under 10MB are allowed.`,
      }));
    }

    const updatedFiles = [...formData[field], ...validFiles].slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      [field]: updatedFiles,
    }));

    // Clear error for this field if at least one valid file
    if (validFiles.length && errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleMultiSelect = (key, value) => {
    setFormData((prev) => {
      const selected = prev[key];
      if (selected.includes(value)) {
        return { ...prev, [key]: selected.filter((item) => item !== value) };
      } else if (selected.length < 2) {
        return { ...prev, [key]: [...selected, value] };
      }
      return prev; // max limit reached
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "farmOwnerMobile":
      case "care_taker_number":
        if (typeof value === "string" && value && !/^\d{10}$/.test(value)) {
          return "Please enter a valid 10-digit mobile number";
        }
        break;

      case "farmOwnerEmail":
        if (
          typeof value === "string" &&
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          return "Please enter a valid email address";
        }
        break;

      case "location_link":
        if (
          typeof value === "string" &&
          value &&
          !/^https?:\/\/.+/.test(value)
        ) {
          return "Please enter a valid URL (starting with http:// or https://)";
        }
        break;

      case "photos":
        if (Array.isArray(value) && value.length === 0) {
          return "Please upload at least one property photo";
        }
        if (Array.isArray(value) && value.length > 10) {
          return "Maximum 10 photos allowed";
        }
        break;
    }
    return "";
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // ✅ Validate field on change
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // const handleFileUpload = (files) => {
  //   if (!files) return;

  //   const newFiles = Array.from(files);
  //   const validFiles = newFiles.filter((file) => {
  //     const isValidType =
  //       file.type.startsWith("image/") || file.type.startsWith("video/");
  //     const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
  //     return isValidType && isValidSize;
  //   });

  //   if (validFiles.length !== newFiles.length) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       propertyPhotos:
  //         "Some files were rejected. Only images/videos under 10MB are allowed.",
  //     }));
  //   }

  //   const updatedFiles = [...formData.propertyPhotos, ...validFiles].slice(
  //     0,
  //     10
  //   );
  //   handleInputChange("propertyPhotos", updatedFiles);
  // };

  const handleFileUpload = (files) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== newFiles.length) {
      setErrors((prev) => ({
        ...prev,
        photos:
          "Some files were rejected. Only images/videos under 10MB are allowed.",
      }));
    }

    const updatedFiles = [...formData.photos, ...validFiles].slice(0, 10);
    handleInputChange("photos", updatedFiles);
  };

  // const removeFile = (index) => {
  //   const updatedFiles = formData.propertyPhotos.filter((_, i) => i !== index);
  //   handleInputChange("propertyPhotos", updatedFiles);
  // };
  // Generic removeFile for any field
  const removeFile = (field, index) => {
    setFormData((prev) => {
      const updatedFiles = prev[field].filter((_, i) => i !== index);
      return {
        ...prev,
        [field]: updatedFiles,
      };
    });
    // Optionally clear error for that field
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // const validateForm = () => {
  //   const newErrors = {};

  //   const requiredFields = [
  //     "name",
  //     "city",
  //     "near_by_area",
  //     "person_limit",
  //     "day_capacity",
  //     "night_capacity",
  //     "size",
  //     "extra_person_charge",
  //     "weekday_half_day_price",
  //     "weekday_full_day_price",
  //     "weekend_half_day_price",
  //     "weekend_full_day_price",
  //     "check_in_time", // frontend only
  //     "check_out_time", // frontend only
  //     "care_taker_name",
  //     "care_taker_number",
  //     "address",
  //     "location_link",
  //     "house_rule_policy",
  //     "description",
  //     "category_id",
  //     // New document upload fields
  //     "government_photo_id",
  //     "bank_details_check_photo",
  //     "property_agreement",
  //   ];

  //   requiredFields.forEach((field) => {
  //     const value = formData[field];
  //     if (!value || (typeof value === "string" && !value.trim())) {
  //       newErrors[field] = "This field is required";
  //     }
  //   });

  //   if (formData.facilities.length === 0) {
  //     newErrors.facilities = "Please select at least one facility";
  //   }
  //   if (formData.photos.length === 0) {
  //     newErrors.photos = "Please upload at least one property photo";
  //   }

  //   if (formData.check_in_time.length === 0) {
  //     newErrors.check_in_time = "Please select at least one check-in time.";
  //   }

  //   if (formData.check_out_time.length === 0) {
  //     newErrors.check_out_time = "Please select at least one check-out time.";
  //   }

  //   // Field-specific validation
  //   Object.entries(formData).forEach(([key, value]) => {
  //     const error = validateField(key, value);
  //     if (error) {
  //       newErrors[key] = error;
  //     }
  //   });
  //   console.log(newErrors);
  //   setErrors(newErrors);

  //   // ⬇️ Scroll to first error field
  //   const firstErrorField = Object.keys(newErrors)[0];
  //   if (firstErrorField) {
  //     const ref = refs.current[firstErrorField];
  //     if (ref) {
  //       ref.scrollIntoView({ behavior: "smooth", block: "center" });
  //     } else {
  //       // Fallback for 'Select' components if focusing doesn't work
  //       const selectElement = document.querySelector(`#${firstErrorField}`);
  //       if (selectElement) {
  //         selectElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //       }
  //     }
  //   }

  //   return Object.keys(newErrors).length === 0;
  // };
  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "name",
      "city",
      "near_by_area",
      "person_limit",
      "day_capacity",
      "night_capacity",
      "size",
      "extra_person_charge",
      "weekday_half_day_price",
      "weekday_full_day_price",
      "weekend_half_day_price",
      "weekend_full_day_price",
      "check_in_time",
      "check_out_time",
      "care_taker_name",
      "care_taker_number",
      "address",
      "location_link",
      "house_rule_policy",
      "description",
      "category_id",
      "government_photo_id",
      "bank_details_check_photo",
    ];

    // Validate required fields
    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = "This field is required";
      }
    });

    if (!formData.government_photo_id) {
      newErrors.government_photo_id = "Government Photo ID is required";
    }

    if (
      !Array.isArray(formData.bank_details_check_photo) ||
      formData.bank_details_check_photo.length === 0
    ) {
      newErrors.bank_details_check_photo = "Bank Cheque Photo is required";
    }

    // Additional validation for specific fields
    if (formData.facilities.length === 0) {
      newErrors.facilities = "Please select at least one facility";
    }

    if (formData.photos.length === 0) {
      newErrors.photos = "Please upload at least one property photo";
    }

    if (formData.check_in_time.length === 0) {
      newErrors.check_in_time = "Please select at least one check-in time.";
    }

    if (formData.check_out_time.length === 0) {
      newErrors.check_out_time = "Please select at least one check-out time.";
    }

    // Validate custom fields
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    // Scroll to the first error field
    const firstErrorField = Object.keys(newErrors)[0];

    if (firstErrorField) {
      const ref = refs.current[firstErrorField];

      if (ref) {
        // Scroll the field into view
        ref.scrollIntoView({ behavior: "smooth", block: "center" });

        // Handle special case for file inputs or selects
        if (
          firstErrorField === "bank_details_check_photo" ||
          firstErrorField === "government_photo_id" ||
          firstErrorField === "photos"
        ) {
          const fileInput = ref.querySelector("input[type='file']");
          if (fileInput) {
            fileInput.focus();
          }
        } else if (ref.classList.contains("select-trigger")) {
          ref.focus(); // For Select dropdown triggers
        } else {
          // For textareas or input fields
          const inputElement = ref.querySelector("input, textarea, select");
          if (inputElement) {
            inputElement.focus();
          }
        }
      }
    }

    // Return true if the form is valid (no errors)
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputField
            name="name"
            label="Property Name"
            refs={refs}
            required
            placeholder="Enter property name"
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City Dropdown */}
            <div
              className="space-y-2"
              ref={(el) => (refs.current["city"] = el)}
            >
              <Label className="flex items-center gap-1">
                City <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleInputChange("city", value)}
              >
                <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* Nearby Area Dropdown */}
            <div
              className="space-y-2"
              ref={(el) => (refs.current["near_by_area"] = el)}
            >
              <Label className="flex items-center gap-1">
                Nearby Area <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.near_by_area}
                onValueChange={(value) =>
                  handleInputChange("near_by_area", value)
                }
              >
                <SelectTrigger
                  className={errors.near_by_area ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select nearby area" />
                </SelectTrigger>
                <SelectContent>
                  {areaOptions.map((area) => (
                    <SelectItem key={area.id} value={String(area.id)}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.near_by_area && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.near_by_area}
                </p>
              )}
            </div>
          </div>

          <div
            className="space-y-2"
            ref={(el) => (refs.current["category_id"] = el)} // Correctly attaching the ref
          >
            <Label className="flex items-center gap-1">
              Property Category <span className="text-red-500">*</span>
            </Label>

            <Select
              value={formData.category_id}
              onValueChange={(value) => handleInputChange("category_id", value)}
            >
              <SelectTrigger
                className={errors.category_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.category_id && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.category_id}
              </p>
            )}
          </div>

          <InputField
            name="size"
            label="Property Size in Sqyd"
            type="number"
            refs={refs}
            required
            placeholder="Enter size in square yards"
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />
          <div
            className="space-y-2"
            ref={(el) => (refs.current["address"] = el)} // ✅ Added ref for scroll
          >
            <Label className="flex items-center gap-1">
              Property Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter complete farm address"
              rows={3}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.address}
              </p>
            )}
          </div>

          <InputField
            name="location_link"
            label="Location Link"
            type="url"
            refs={refs}
            required
            placeholder="https://maps.google.com/..."
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />

          {/* Government Photo ID */}
          <div
            className="space-y-2"
            ref={(el) => (refs.current["government_photo_id"] = el)}
          >
            <Label className="flex items-center gap-1">
              Upload Government Photo ID <span className="text-red-500">*</span>
              <span className="text-xs text-neutral-500 ml-2">
                (PDF, PNG, JPG – max 10 MB)
              </span>
            </Label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="government_photo_id"
                accept="image/*,.pdf"
                className="hidden"
                ref={governmentIdRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData((prev) => ({
                    ...prev,
                    government_photo_id: file,
                  }));
                  if (file && errors.government_photo_id) {
                    setErrors((prev) => ({
                      ...prev,
                      government_photo_id: undefined,
                    }));
                  }
                }}
              />
              <label htmlFor="government_photo_id" className="cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">Click to upload document</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Supported formats: PDF, PNG, JPG
                </p>
              </label>
            </div>
            {formData.government_photo_id && (
              <div className="mt-2">
                <div className="relative w-32 aspect-square rounded-lg overflow-hidden border">
                  {formData.government_photo_id.type?.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.government_photo_id)}
                      alt="Government ID"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-sm text-gray-500">
                      PDF File
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        government_photo_id: null,
                      }));
                      if (governmentIdRef.current) {
                        governmentIdRef.current.value = "";
                      }
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs mt-1 text-neutral-700 truncate">
                  {formData.government_photo_id.name}
                </p>
              </div>
            )}
            {errors.government_photo_id && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.government_photo_id}
              </p>
            )}
          </div>

          {/* Bank Details Check Photo (Multiple) */}
          <div
            className="space-y-2"
            ref={(el) => (refs.current["bank_details_check_photo"] = el)}
          >
            <Label className="flex items-center gap-1">
              Upload Bank Details / Cancelled Cheque{" "}
              <span className="text-red-500">*</span>
              <span className="text-xs text-neutral-500 ml-2">
                (PNG, JPG – max 10 MB each, up to 10 files)
              </span>
            </Label>

            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="bank_details_check_photo"
                accept="image/*"
                multiple
                ref={bankDetailsRef}
                className="hidden"
                onChange={(e) =>
                  handleMultiFileUpload(
                    "bank_details_check_photo",
                    e.target.files,
                    "image"
                  )
                }
              />
              <label
                htmlFor="bank_details_check_photo"
                className="cursor-pointer"
              >
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">Click to upload images</p>
                <p className="text-xs text-neutral-500 mt-1">
                  JPG, PNG up to 10MB each
                </p>
              </label>
            </div>

            {/* Preview selected files */}
            {Array.isArray(formData.bank_details_check_photo) &&
              formData.bank_details_check_photo.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.bank_details_check_photo.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center relative overflow-hidden border">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Bank Cheque"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeFile("bank_details_check_photo", index)
                          }
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs mt-1 text-neutral-700 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            {errors.bank_details_check_photo && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.bank_details_check_photo}
              </p>
            )}
          </div>

          {/* Property Agreement */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Upload Property Agreement <span className="text-red-500"></span>
              <span className="text-xs text-neutral-500 ml-2">
                (PDF, PNG, JPG – max 10 MB)
              </span>
            </Label>

            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="property_agreement"
                accept="image/*,.pdf"
                className="hidden"
                ref={propertyAgreementRef} // ✅ added ref
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    property_agreement: e.target.files[0],
                  }))
                }
              />
              <label htmlFor="property_agreement" className="cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">Click to upload agreement</p>
                <p className="text-xs text-neutral-500 mt-1">PDF, PNG, JPG</p>
              </label>
            </div>

            {formData.property_agreement && (
              <div className="mt-2">
                <div className="relative w-32 aspect-square rounded-lg overflow-hidden border">
                  {formData.property_agreement.type?.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.property_agreement)}
                      alt="Agreement"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-sm text-gray-500">
                      PDF File
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        property_agreement: null,
                      }));
                      if (propertyAgreementRef.current) {
                        propertyAgreementRef.current.value = ""; // ✅ reset input
                      }
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs mt-1 text-neutral-700 truncate">
                  {formData.property_agreement.name}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="space-y-2"
            ref={(el) => (refs.current["facilities"] = el)}
          >
            <Label className="flex items-center gap-1">
              Property Facilities <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
              {FACILITY_OPTIONS.map((facility) => (
                <label
                  key={facility}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={formData.facilities.includes(facility)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange("facilities", [
                          ...formData.facilities,
                          facility,
                        ]);
                      } else {
                        handleInputChange(
                          "facilities",
                          formData.facilities.filter((f) => f !== facility)
                        );
                      }
                    }}
                  />
                  <span className="text-sm">{facility}</span>
                </label>
              ))}
            </div>
            {errors.facilities && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.facilities}
              </p>
            )}
          </div>

          <div
            className="space-y-2"
            ref={(el) => (refs.current["house_rule_policy"] = el)}
          >
            <Label className="flex items-center gap-1">
              Property Rules <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.house_rule_policy}
              onChange={(e) =>
                handleInputChange("house_rule_policy", e.target.value)
              }
              placeholder="Enter property rules and regulations"
              rows={4}
              className={errors.house_rule_policy ? "border-red-500" : ""}
            />
            {errors.house_rule_policy && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.house_rule_policy}
              </p>
            )}
          </div>

          <div
            className="space-y-2"
            ref={(el) => (refs.current["description"] = el)}
          >
            <Label className="flex items-center gap-1">
              Property Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter property rules and regulations"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="swimming_pool_size"
              label="Swimming Pool Size"
              refs={refs}
              placeholder="e.g., 20x10 feet (optional)"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />

            <div className="space-y-2">
              <Label>Kids Swimming Pool Available?</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kids_swimming"
                    checked={formData.kids_swimming === true}
                    onChange={() => handleInputChange("kids_swimming", true)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kids_swimming"
                    checked={formData.kids_swimming === false}
                    onChange={() => handleInputChange("kids_swimming", false)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <InputField
            name="referral_code"
            label="Referral Code"
            placeholder="Enter referral code (optional)"
            refs={refs}
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="extra_person_charge"
              label="Extra Person Charge"
              type="number"
              refs={refs}
              required
              placeholder="Amount in ₹"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
            {/* <InputField
              name="extra_person_charge"
              label="Extra Person Charge on Weekends"
              type="number"
              required
              placeholder="Amount in ₹"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            /> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              name="person_limit"
              label="Person Limit"
              type="number"
              refs={refs}
              required
              note="After extra charge applicable"
              placeholder="Maximum guests"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
            <InputField
              name="day_capacity"
              label="Guest Stay Capacity (Day)"
              type="number"
              refs={refs}
              required
              placeholder="Day capacity"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
            <InputField
              name="night_capacity"
              label="Guest Stay Capacity (Night)"
              type="number"
              refs={refs}
              required
              placeholder="Night capacity"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Weekday Pricing</h4>
              <InputField
                name="weekday_half_day_price"
                label="12-Hour Price Weekday"
                type="number"
                refs={refs}
                required
                placeholder="Amount in ₹"
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                validateField={validateField}
                setErrors={setErrors}
              />
              <InputField
                name="weekday_full_day_price"
                label="24-Hour Price Weekday"
                type="number"
                refs={refs}
                required
                placeholder="Amount in ₹"
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                validateField={validateField}
                setErrors={setErrors}
              />
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Weekend Pricing</h4>
              <InputField
                name="weekend_half_day_price"
                label="12-Hour Price Weekend"
                type="number"
                refs={refs}
                required
                placeholder="Amount in ₹"
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                validateField={validateField}
                setErrors={setErrors}
              />
              <InputField
                name="weekend_full_day_price"
                label="24-Hour Price Weekend"
                type="number"
                refs={refs}
                required
                placeholder="Amount in ₹"
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                validateField={validateField}
                setErrors={setErrors}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check-in & Check-out Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            ref={(el) => (refs.current["check_in_time"] = el)}
          >
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Check-In Time <span className="text-red-500">*</span>
              </Label>
              <Select open={checkInOpen} onOpenChange={setCheckInOpen}>
                <SelectTrigger
                  className={errors.check_in_time ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={
                      formData.check_in_time.length > 0
                        ? formData.check_in_time.join(", ")
                        : "Select check-in time"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMultiSelect("check_in_time", time);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.check_in_time.includes(time)}
                        readOnly
                        disabled={
                          !formData.check_in_time.includes(time) &&
                          formData.check_in_time.length >= 2
                        }
                      />
                      <label className="text-sm">{time}</label>
                    </div>
                  ))}
                </SelectContent>
              </Select>

              {errors.check_in_time && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.check_in_time}
                </p>
              )}
            </div>

            <div
              className="space-y-2"
              ref={(el) => (refs.current["check_out_time"] = el)}
            >
              <Label className="flex items-center gap-1">
                Check-Out Time <span className="text-red-500">*</span>
              </Label>
              <Select open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                <SelectTrigger
                  className={errors.check_out_time ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={
                      formData.check_out_time.length > 0
                        ? formData.check_out_time.join(", ")
                        : "Select check-out time"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMultiSelect("check_out_time", time);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.check_out_time.includes(time)}
                        readOnly
                        disabled={
                          !formData.check_out_time.includes(time) &&
                          formData.check_out_time.length >= 2
                        }
                      />
                      <label className="text-sm">{time}</label>
                    </div>
                  ))}
                </SelectContent>
              </Select>

              {errors.check_out_time && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.check_out_time}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caretaker Information */}
      <Card>
        <CardHeader>
          <CardTitle>Caretaker Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="care_taker_name"
              label="Caretaker Name"
              required
              refs={refs}
              placeholder="Enter caretaker name"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
            <InputField
              name="care_taker_number"
              label="Caretaker Number"
              type="tel"
              refs={refs}
              required
              placeholder="10-digit mobile number"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Property Photos & Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="space-y-2"
            ref={(el) => (refs.current["photos"] = el)}
          >
            <Label className="flex items-center gap-1">
              Upload Property Photos <span className="text-red-500">*</span>
              <span className="text-xs text-neutral-500 ml-2">
                (up to 10 images/videos, max 10 MB each)
              </span>
            </Label>

            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <label htmlFor="photos" className="cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">
                  Click to upload photos and videos
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  PNG, JPG, MP4 up to 10MB each
                </p>
              </label>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.photos.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-neutral-400" />
                          <span className="text-xs text-neutral-500 mt-1">
                            Video
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile("photos", index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {errors.photos && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.photos}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="form-checkbox mt-1 text-green-600"
          />
          <span className="text-sm">
            Agree to the{" "}
            <button
              className="underline text-green-600 hover:text-green-700"
              onClick={() => setExpanded(!expanded)}
              type="button"
            >
              House & Cancellation Policy
            </button>
          </span>
        </div>

        {expanded && (
          <div className="mt-2 p-3 border rounded-lg bg-gray-50 text-sm text-gray-700 space-y-4 max-h-[300px] overflow-auto">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">
                Rules & Policies
              </h4>
              <div className="space-y-1">
                {rulesData.rules_and_policies.length > 0 &&
                  cleanParagraphs(rulesData.rules_and_policies[0])}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mt-4 mb-2 text-gray-800">
                Cancellation Policy
              </h4>
              <div className="space-y-1">
                {rulesData.cancellation_policy.length > 0 &&
                  cleanParagraphs(rulesData.cancellation_policy[0])}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mt-4 mb-2 text-gray-800">
                Commission Policy
              </h4>
              <div className="space-y-1">
                {rulesData.commission_policy.length > 0 &&
                  cleanParagraphs(rulesData.commission_policy[0])}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !agreed}
          className="bg-primary text-white hover:bg-primary/90 px-12"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Property Registration
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
