'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '@/services/Auth/auth.service';



export default function ProfileEditDialog({ isOpen, onClose }) {

  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [street, setStreet] = useState(user?.street || '');
  const [city, setCity] = useState(user?.city || '');
const [dob, setDob] = useState(user?.dob ? new Date(user.dob) : undefined);
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const [previewImage, setPreviewImage] = useState(user?.profileImage);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setStreet(user.street || '');
      setCity(user.city || '');
      setDob(user.dob ? new Date(user.dob) : undefined);
      setProfileImage(user.profileImage);
      setPreviewImage(user.profileImage);
    }
  }, [isOpen, user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;

        setPreviewImage(result);
        setProfileImage(result); // In a real app, you would upload this to a server
      };
      reader.readAsDataURL(file);
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("You must be logged in to update your profile.");
    return;
  }

const payload = {
  name,
  street,
  city: city,
  date_of_birth: dob ? dob.toISOString().split("T")[0] : null,
  profile_image: profileImage || null,
};

  try {
    // 🔄 Update user profile
    const res = await updateUserProfile(payload, token);
    const newToken = res?.data?.token;

    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    }

    const finalToken = newToken || token;

    // 🔁 Re-fetch latest user info
    const userRes = await getUserProfile(finalToken);
    const fullUser = userRes?.data;

    // ✅ Update context
updateUser({
  token: finalToken,
  name: fullUser?.name,
  street: fullUser?.street,
  city: fullUser?.city, // ← correct key
  dob: fullUser?.date_of_birth, // ← correct key
  profileImage: fullUser?.profile_image, // ← correct key
  email: fullUser?.email,
  phone_number: fullUser?.phone_number,
  isOwner: fullUser?.is_owner === 1,
});




    onClose();
  } catch (error) {
    console.error("❌ Profile update failed:", error);
    alert("Failed to update profile. Please try again later.");
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-2">
              {previewImage ? (
                <img 
                  src={previewImage} 
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
            <p className="text-sm text-muted-foreground">Click to change profile picture</p>
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
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}