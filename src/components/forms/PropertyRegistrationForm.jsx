"use client";
import { useEffect, useState } from "react";
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
import { fetchPropertyCategories } from "@/services/Farm/farm.service";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.token) {
      alert("Please log in to register your property.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitProperty(formData, user.token);

       show({
        title: "Property Submitted!",
        description: "We’ll review it and get back to you soon.",
      });

      setFormData({
        // Backend-required fields
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
        photos: [],

        // Frontend-only fields (not sent to backend)
        farmOwnerName: "",
        farmOwnerMobile: "",
        farmOwnerEmail: "",
        checkInTime: "",
        checkOutTime: "",
        kidsSwimmingPool: false,
        propertyRules: "",
      });

      setErrors({});
    } catch (error) {
      console.error("❌ Error submitting property:", error);
      alert(
        error?.message ||
          "There was an error submitting your application. Please try again."
      );
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

  const [formData, setFormData] = useState({
    // Backend-required fields
    name: "",
    size: "",
    facilities: [],
    swimming_pool_size: "",
    category_id: "",
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
    photos: [],

    // Extra frontend-only fields (not sent to backend)
    farmOwnerName: "",
    farmOwnerMobile: "",
    farmOwnerEmail: "",
    // checkInTime: "",
    // checkOutTime: "",
    checkInTime: [],
checkOutTime: [],

    kidsSwimmingPool: false,
    propertyRules: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
const [checkOutOpen, setCheckOutOpen] = useState(false);
const [categories, setCategories] = useState([]);

useEffect(() => {
  fetchPropertyCategories()
    .then(setCategories)
    .catch((err) => {
      console.error("Failed to load categories", err);
    });
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
  const removeFile = (index) => {
    const updatedFiles = formData.photos.filter((_, i) => i !== index);
    handleInputChange("photos", updatedFiles);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    // const requiredFields = [
    //   "farmOwnerName",
    //   "farmOwnerMobile",
    //   "farmOwnerEmail",
    //   "farmName",
    //   "city",
    //   "nearbyArea",
    //   "personLimit",
    //   "guestStayCapacityDay",
    //   "guestStayCapacityNight",
    //   "farmSizeSqYd",
    //   "extraPersonChargeWeekdays",
    //   "extraPersonChargeWeekends",
    //   "price12HourWeekday",
    //   "price24HourWeekday",
    //   "price12HourWeekend",
    //   "price24HourWeekend",
    //   "checkInTime",
    //   "checkOutTime",
    //   "caretakerName",
    //   "caretakerNumber",
    //   "farmAddress",
    //   "locationLink",
    //   "propertyRules",
    // ];
    const requiredFields = [
      "farmOwnerName", // frontend only
      "farmOwnerMobile", // frontend only
      "farmOwnerEmail", // frontend only
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
      "checkInTime", // frontend only
      "checkOutTime", // frontend only
      "care_taker_name",
      "care_taker_number",
      "address",
      "location_link",
      "propertyRules", // frontend only
    ];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = "This field is required";
      }
    });

    // Facilities validation
    // if (formData.farmFacilities.length === 0) {
    //   newErrors.farmFacilities = "Please select at least one facility";
    // }

    // // Photos validation
    // if (formData.propertyPhotos.length === 0) {
    //   newErrors.propertyPhotos = "Please upload at least one property photo";
    // }

    if (formData.facilities.length === 0) {
      newErrors.facilities = "Please select at least one facility";
    }

    if (formData.photos.length === 0) {
      newErrors.photos = "Please upload at least one property photo";
    }
if (formData.checkInTime.length === 0) {
  errors.checkInTime = "Please select at least one check-in time.";
}

if (formData.checkOutTime.length === 0) {
  errors.checkOutTime = "Please select at least one check-out time.";
}

    // Field-specific validation
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const InputField = ({
  //   name,
  //   label,
  //   type = "text",
  //   required = false,
  //   placeholder = "",
  //   note = "",
  // }) => (
  //   <div className="space-y-2">
  //     <Label htmlFor={name} className="flex items-center gap-1">
  //       {label}
  //       {required && <span className="text-red-500">*</span>}
  //       {note && (
  //         <span className="text-xs text-neutral-500 ml-2">({note})</span>
  //       )}
  //     </Label>
  //     <Input
  //       id={name}
  //       name={name}
  //       type={type}
  //       value={formData[name] ?? ""} // ✅ Safe fallback for undefined/null
  //       onChange={(e) => handleInputChange(name, e.target.value)}
  //       placeholder={placeholder}
  //       className={errors[name] ? "border-red-500" : ""}
  //     />
  //     {errors[name] && (
  //       <p className="text-sm text-red-500 flex items-center gap-1">
  //         <AlertCircle className="w-4 h-4" />
  //         {errors[name]}
  //       </p>
  //     )}
  //   </div>
  // );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Owner Information */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Farm Owner Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="farmOwnerName"
              label="Farm Owner Name"
              required
              placeholder="Enter full name"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
            <InputField
              name="farmOwnerMobile"
              label="Farm Owner Mobile Number"
              type="tel"
              required
              placeholder="10-digit mobile number"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
          </div>
          <InputField
            name="farmOwnerEmail"
            label="Farm Owner Email"
            type="email"
            required
            placeholder="owner@example.com"
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />
        </CardContent>
      </Card> */}

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputField
            name="name"
            label="Property Name"
            required
            placeholder="Enter property name"
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="city"
              label="City"
              required
              placeholder="Enter city"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
            <InputField
              name="near_by_area"
              label="Nearby Area"
              required
              placeholder="Enter nearby area/landmark"
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              validateField={validateField}
              setErrors={setErrors}
            />
          </div>

          <div className="space-y-2">
  <Label className="flex items-center gap-1">
    Property Category <span className="text-red-500">*</span>
  </Label>
  <Select
    value={formData.category_id}
    onValueChange={(value) => handleInputChange("category_id", value)}
  >
    <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
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
            required
            placeholder="Enter size in square yards"
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />
         <div className="space-y-2">
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
            required
            placeholder="https://maps.google.com/..."
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            validateField={validateField}
            setErrors={setErrors}
          />

        </CardContent>
      </Card>

        {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
         

          <div className="space-y-2">
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

       
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Property Rules <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.propertyRules}
              onChange={(e) =>
                handleInputChange("propertyRules", e.target.value)
              }
              placeholder="Enter property rules and regulations"
              rows={4}
              className={errors.propertyRules ? "border-red-500" : ""}
            />
            {errors.propertyRules && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.propertyRules}
              </p>
            )}
          </div>

           <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Property Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.propertyRules}
              onChange={(e) =>
                handleInputChange("propertyRules", e.target.value)
              }
              placeholder="Enter property rules and regulations"
              rows={4}
              className={errors.propertyRules ? "border-red-500" : ""}
            />
            {errors.propertyRules && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.propertyRules}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="swimming_pool_size"
              label="Swimming Pool Size"
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
                    name="kidsSwimmingPool"
                    checked={formData.kidsSwimmingPool === true}
                    onChange={() => handleInputChange("kidsSwimmingPool", true)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kidsSwimmingPool"
                    checked={formData.kidsSwimmingPool === false}
                    onChange={() =>
                      handleInputChange("kidsSwimmingPool", false)
                    }
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

      {/* Check-in/Check-out Times */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Check-in & Check-out Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Check-In Time <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.checkInTime}
                onValueChange={(value) =>
                  handleInputChange("checkInTime", value)
                }
              >
                <SelectTrigger
                  className={errors.checkInTime ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select check-in time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.checkInTime && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.checkInTime}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Check-Out Time <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.checkOutTime}
                onValueChange={(value) =>
                  handleInputChange("checkOutTime", value)
                }
              >
                <SelectTrigger
                  className={errors.checkOutTime ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select check-out time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.checkOutTime && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.checkOutTime}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card> */}


<Card>
        <CardHeader>
          <CardTitle>Check-in & Check-out Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
  <Label className="flex items-center gap-1">
    Check-In Time <span className="text-red-500">*</span>
  </Label>
<Select open={checkInOpen} onOpenChange={setCheckInOpen}>
  <SelectTrigger className={errors.checkInTime ? "border-red-500" : ""}>
    <SelectValue placeholder="Select check-in time">
      {formData.checkInTime.length > 0
        ? formData.checkInTime.join(", ")
        : "Select check-in time"}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {TIME_OPTIONS.map((time) => (
      <div
        key={time}
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleMultiSelect("checkInTime", time);
        }}
      >
        <input
          type="checkbox"
          checked={formData.checkInTime.includes(time)}
          readOnly
          disabled={
            !formData.checkInTime.includes(time) &&
            formData.checkInTime.length >= 2
          }
        />
        <label className="text-sm">{time}</label>
      </div>
    ))}
  </SelectContent>
</Select>

  {errors.checkInTime && (
    <p className="text-sm text-red-500 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {errors.checkInTime}
    </p>
  )}
</div>


           <div className="space-y-2">
  <Label className="flex items-center gap-1">
    Check-Out Time <span className="text-red-500">*</span>
  </Label>
 <Select open={checkOutOpen} onOpenChange={setCheckOutOpen}>
  <SelectTrigger className={errors.checkOutTime ? "border-red-500" : ""}>
    <SelectValue placeholder="Select check-out time">
      {formData.checkOutTime.length > 0
        ? formData.checkOutTime.join(", ")
        : "Select check-out time"}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {TIME_OPTIONS.map((time) => (
      <div
        key={time}
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleMultiSelect("checkOutTime", time);
        }}
      >
        <input
          type="checkbox"
          checked={formData.checkOutTime.includes(time)}
          readOnly
          disabled={
            !formData.checkOutTime.includes(time) &&
            formData.checkOutTime.length >= 2
          }
        />
        <label className="text-sm">{time}</label>
      </div>
    ))}
  </SelectContent>
</Select>

  {errors.checkOutTime && (
    <p className="text-sm text-red-500 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {errors.checkOutTime}
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
          <div className="space-y-2">
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
                        onClick={() => removeFile(index)}
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

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
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
