import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { FACILITY_OPTIONS, TIME_OPTIONS } from '@/constants/categories';

interface FormData {
  farmOwnerName: string;
  farmOwnerMobile: string;
  farmOwnerEmail: string;
  farmName: string;
  city: string;
  nearbyArea: string;
  personLimit: string;
  guestStayCapacityDay: string;
  guestStayCapacityNight: string;
  farmSizeSqYd: string;
  extraPersonChargeWeekdays: string;
  extraPersonChargeWeekends: string;
  price12HourWeekday: string;
  price24HourWeekday: string;
  price12HourWeekend: string;
  price24HourWeekend: string;
  checkInTime: string;
  checkOutTime: string;
  caretakerName: string;
  caretakerNumber: string;
  farmAddress: string;
  farmFacilities: string[];
  locationLink: string;
  propertyRules: string;
  swimmingPoolSize: string;
  kidsSwimmingPool: boolean;
  referralCode: string;
  propertyPhotos: File[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function PropertyRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    farmOwnerName: '',
    farmOwnerMobile: '',
    farmOwnerEmail: '',
    farmName: '',
    city: '',
    nearbyArea: '',
    personLimit: '',
    guestStayCapacityDay: '',
    guestStayCapacityNight: '',
    farmSizeSqYd: '',
    extraPersonChargeWeekdays: '',
    extraPersonChargeWeekends: '',
    price12HourWeekday: '',
    price24HourWeekday: '',
    price12HourWeekend: '',
    price24HourWeekend: '',
    checkInTime: '',
    checkOutTime: '',
    caretakerName: '',
    caretakerNumber: '',
    farmAddress: '',
    farmFacilities: [],
    locationLink: '',
    propertyRules: '',
    swimmingPoolSize: '',
    kidsSwimmingPool: false,
    referralCode: '',
    propertyPhotos: []
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string | boolean | string[] | File[]): string => {
    switch (name) {
      case 'farmOwnerMobile':
      case 'caretakerNumber':
        if (typeof value === 'string' && value && !/^\d{10}$/.test(value)) {
          return 'Please enter a valid 10-digit mobile number';
        }
        break;
      case 'farmOwnerEmail':
        if (typeof value === 'string' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'locationLink':
        if (typeof value === 'string' && value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL (starting with http:// or https://)';
        }
        break;
      case 'propertyPhotos':
        if (Array.isArray(value) && value.length === 0) {
          return 'Please upload at least one property photo';
        }
        if (Array.isArray(value) && value.length > 10) {
          return 'Maximum 10 photos allowed';
        }
        break;
    }
    return '';
  };

  const handleInputChange = (name: string, value: string | boolean | string[] | File[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validate field on change
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== newFiles.length) {
      setErrors(prev => ({ 
        ...prev, 
        propertyPhotos: 'Some files were rejected. Only images/videos under 10MB are allowed.' 
      }));
    }

    const updatedFiles = [...formData.propertyPhotos, ...validFiles].slice(0, 10);
    handleInputChange('propertyPhotos', updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = formData.propertyPhotos.filter((_, i) => i !== index);
    handleInputChange('propertyPhotos', updatedFiles);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Required field validation
    const requiredFields = [
      'farmOwnerName', 'farmOwnerMobile', 'farmOwnerEmail', 'farmName', 'city', 
      'nearbyArea', 'personLimit', 'guestStayCapacityDay', 'guestStayCapacityNight',
      'farmSizeSqYd', 'extraPersonChargeWeekdays', 'extraPersonChargeWeekends',
      'price12HourWeekday', 'price24HourWeekday', 'price12HourWeekend', 'price24HourWeekend',
      'checkInTime', 'checkOutTime', 'caretakerName', 'caretakerNumber', 'farmAddress',
      'locationLink', 'propertyRules'
    ];

    requiredFields.forEach(field => {
      const value = formData[field as keyof FormData];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'This field is required';
      }
    });

    // Facilities validation
    if (formData.farmFacilities.length === 0) {
      newErrors.farmFacilities = 'Please select at least one facility';
    }

    // Photos validation
    if (formData.propertyPhotos.length === 0) {
      newErrors.propertyPhotos = 'Please upload at least one property photo';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual form submission
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Property registration submitted successfully! We will review your application and contact you within 2-3 business days.');
      
      // Reset form
      setFormData({
        farmOwnerName: '',
        farmOwnerMobile: '',
        farmOwnerEmail: '',
        farmName: '',
        city: '',
        nearbyArea: '',
        personLimit: '',
        guestStayCapacityDay: '',
        guestStayCapacityNight: '',
        farmSizeSqYd: '',
        extraPersonChargeWeekdays: '',
        extraPersonChargeWeekends: '',
        price12HourWeekday: '',
        price24HourWeekday: '',
        price12HourWeekend: '',
        price24HourWeekend: '',
        checkInTime: '',
        checkOutTime: '',
        caretakerName: '',
        caretakerNumber: '',
        farmAddress: '',
        farmFacilities: [],
        locationLink: '',
        propertyRules: '',
        swimmingPoolSize: '',
        kidsSwimmingPool: false,
        referralCode: '',
        propertyPhotos: []
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
    name, 
    label, 
    type = 'text', 
    required = false, 
    placeholder = '',
    note = ''
  }: {
    name: keyof FormData;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    note?: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {note && <span className="text-xs text-neutral-500 ml-2">({note})</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={formData[name] as string}
        onChange={(e) => handleInputChange(name, e.target.value)}
        placeholder={placeholder}
        className={errors[name] ? 'border-red-500' : ''}
      />
      {errors[name] && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Owner Information */}
      <Card>
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
            />
            <InputField
              name="farmOwnerMobile"
              label="Farm Owner Mobile Number"
              type="tel"
              required
              placeholder="10-digit mobile number"
            />
          </div>
          <InputField
            name="farmOwnerEmail"
            label="Farm Owner Email"
            type="email"
            required
            placeholder="owner@example.com"
          />
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputField
            name="farmName"
            label="Farm Name"
            required
            placeholder="Enter property name"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="city"
              label="City"
              required
              placeholder="Enter city"
            />
            <InputField
              name="nearbyArea"
              label="Nearby Area"
              required
              placeholder="Enter nearby area/landmark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              name="personLimit"
              label="Person Limit"
              type="number"
              required
              note="extra charge applies"
              placeholder="Maximum guests"
            />
            <InputField
              name="guestStayCapacityDay"
              label="Guest Stay Capacity (Day)"
              type="number"
              required
              placeholder="Day capacity"
            />
            <InputField
              name="guestStayCapacityNight"
              label="Guest Stay Capacity (Night)"
              type="number"
              required
              placeholder="Night capacity"
            />
          </div>

          <InputField
            name="farmSizeSqYd"
            label="Farm Size in Sq yd"
            type="number"
            required
            placeholder="Enter size in square yards"
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
              name="extraPersonChargeWeekdays"
              label="Extra Person Charge on Weekdays"
              type="number"
              required
              placeholder="Amount in ₹"
            />
            <InputField
              name="extraPersonChargeWeekends"
              label="Extra Person Charge on Weekends"
              type="number"
              required
              placeholder="Amount in ₹"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Weekday Pricing</h4>
              <InputField
                name="price12HourWeekday"
                label="12-Hour Price Weekday"
                type="number"
                required
                placeholder="Amount in ₹"
              />
              <InputField
                name="price24HourWeekday"
                label="24-Hour Price Weekday"
                type="number"
                required
                placeholder="Amount in ₹"
              />
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Weekend Pricing</h4>
              <InputField
                name="price12HourWeekend"
                label="12-Hour Price Weekend"
                type="number"
                required
                placeholder="Amount in ₹"
              />
              <InputField
                name="price24HourWeekend"
                label="24-Hour Price Weekend"
                type="number"
                required
                placeholder="Amount in ₹"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in/Check-out Times */}
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
              <Select value={formData.checkInTime} onValueChange={(value) => handleInputChange('checkInTime', value)}>
                <SelectTrigger className={errors.checkInTime ? 'border-red-500' : ''}>
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
              <Select value={formData.checkOutTime} onValueChange={(value) => handleInputChange('checkOutTime', value)}>
                <SelectTrigger className={errors.checkOutTime ? 'border-red-500' : ''}>
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
      </Card>

      {/* Caretaker Information */}
      <Card>
        <CardHeader>
          <CardTitle>Caretaker Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="caretakerName"
              label="Caretaker Name"
              required
              placeholder="Enter caretaker name"
            />
            <InputField
              name="caretakerNumber"
              label="Caretaker Number"
              type="tel"
              required
              placeholder="10-digit mobile number"
            />
          </div>
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
              Farm Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.farmAddress}
              onChange={(e) => handleInputChange('farmAddress', e.target.value)}
              placeholder="Enter complete farm address"
              rows={3}
              className={errors.farmAddress ? 'border-red-500' : ''}
            />
            {errors.farmAddress && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.farmAddress}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Farm Facilities <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
              {FACILITY_OPTIONS.map((facility) => (
                <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData.farmFacilities.includes(facility)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange('farmFacilities', [...formData.farmFacilities, facility]);
                      } else {
                        handleInputChange('farmFacilities', formData.farmFacilities.filter(f => f !== facility));
                      }
                    }}
                  />
                  <span className="text-sm">{facility}</span>
                </label>
              ))}
            </div>
            {errors.farmFacilities && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.farmFacilities}
              </p>
            )}
          </div>

          <InputField
            name="locationLink"
            label="Location Link"
            type="url"
            required
            placeholder="https://maps.google.com/..."
          />

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Property Rules <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.propertyRules}
              onChange={(e) => handleInputChange('propertyRules', e.target.value)}
              placeholder="Enter property rules and regulations"
              rows={4}
              className={errors.propertyRules ? 'border-red-500' : ''}
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
              name="swimmingPoolSize"
              label="Swimming Pool Size"
              placeholder="e.g., 20x10 feet (optional)"
            />
            
            <div className="space-y-2">
              <Label>Kids Swimming Pool Available?</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kidsSwimmingPool"
                    checked={formData.kidsSwimmingPool === true}
                    onChange={() => handleInputChange('kidsSwimmingPool', true)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kidsSwimmingPool"
                    checked={formData.kidsSwimmingPool === false}
                    onChange={() => handleInputChange('kidsSwimmingPool', false)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <InputField
            name="referralCode"
            label="Referral Code"
            placeholder="Enter referral code (optional)"
          />
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
              <span className="text-xs text-neutral-500 ml-2">(up to 10 images/videos, max 10 MB each)</span>
            </Label>
            
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="propertyPhotos"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <label htmlFor="propertyPhotos" className="cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">Click to upload photos and videos</p>
                <p className="text-xs text-neutral-500 mt-1">PNG, JPG, MP4 up to 10MB each</p>
              </label>
            </div>

            {formData.propertyPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.propertyPhotos.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-neutral-400" />
                          <span className="text-xs text-neutral-500 mt-1">Video</span>
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
                    <p className="text-xs text-neutral-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}

            {errors.propertyPhotos && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.propertyPhotos}
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