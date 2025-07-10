"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn, USER_PROFILE_IMAGE_BASE_URL } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
} from "@/services/Auth/auth.service";
import { useDialog } from "@/hooks/use-dialog";

export default function ProfileEditDialog({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const { show } = useDialog();

  const [name, setName] = useState(user?.name || "");
  const [street, setStreet] = useState(user?.street || "");
  const [email, setEmail] = useState(user?.email || "");
  const [city, setCity] = useState(user?.city || "");
  const [dob, setDob] = useState(
    user?.date_of_birth ? new Date(user.date_of_birth) : undefined
  );

  const [profile_image, setProfile_image] = useState(user?.profile_image);
  const [previewImage, setPreviewImage] = useState(user?.profileImage);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || "");
      setStreet(user.street || "");
      setEmail(user.email || "");
      setCity(user.city || "");
      setDob(
        user.date_of_birth &&
          typeof user.date_of_birth === "string" &&
          !isNaN(Date.parse(user.date_of_birth))
          ? new Date(user.date_of_birth)
          : undefined
      );

      setProfile_image(user.profile_image);
      setPreviewImage(user.profile_image);
    }
  }, [isOpen, user]);
  console.log("🧪 user.dob from API:", user?.dob);
  
useEffect(() => {
  window.scrollTo(0, 0); // Instant jump to top, no animation
}, []);

  const isValidDate = (d) => {
    const parsed = new Date(d);
    return parsed instanceof Date && !isNaN(parsed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      show({
        title: "Login Required",
        description: "You must be logged in to update your profile.",
      });

      return;
    }

    const payload = {
      name,
      email,
      street,
      city,
      date_of_birth: dob ? dob.toISOString().split("T")[0] : "",
      profile_image: previewImage, // will be a File if new image selected
    };
    console.log("🚀 ~ handleSubmit ~ payload:", payload);

    try {
      const res = await updateUserProfile(payload, token);
      const newToken = res?.data?.token;
      if (newToken) localStorage.setItem("accessToken", newToken);

      // refetch user
      const userRes = await getUserProfile(newToken || token);
      updateUser(userRes?.data);
      onClose();
    } catch (err) {
      console.error("❌ Failed to update profile", err);
      show({
        title: "Update Failed",
        description: "Please try again.",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(file); // for upload
      const reader = new FileReader();
      reader.onloadend = () => setProfile_image(reader.result); // just for preview
      reader.readAsDataURL(file);
    }
  };

  let imageUrl = null;

  if (previewImage instanceof File) {
    // create a temporary preview URL for image file
    imageUrl = URL.createObjectURL(previewImage);
  } else if (
    typeof previewImage === "string" &&
    previewImage.startsWith("data:")
  ) {
    imageUrl = previewImage; // base64 preview
  } else if (profile_image) {
    imageUrl = `${USER_PROFILE_IMAGE_BASE_URL}/${profile_image}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-2">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-primary">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
              >
                <Upload size={16} />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Click to change profile picture
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Location</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Address</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Your Address"
            />
          </div>

          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dob && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={setDob}
                  captionLayout="dropdown"
                  fromYear={1950}
                  toYear={new Date().getFullYear()}
                  defaultMonth={dob || new Date(2000, 0, 1)}
                  disabled={(date) => date > new Date()}
                  classNames={{
                    caption_dropdowns: "flex gap-1  pt-3 pb-2",
                    dropdown:
                      "h-8 rounded-md border border-input bg-background px-1 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
                    caption_label: "hidden", // hide the default caption if needed
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
