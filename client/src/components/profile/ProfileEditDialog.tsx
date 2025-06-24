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

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileEditDialog({ isOpen, onClose }: ProfileEditDialogProps) {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [location, setLocation] = useState(user?.location || '');
  const [dob, setDob] = useState<Date | undefined>(user?.dob ? new Date(user.dob) : undefined);
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profileImage);
  const [previewImage, setPreviewImage] = useState<string | undefined>(user?.profileImage);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setAddress(user.address || '');
      setLocation(user.location || '');
      setDob(user.dob ? new Date(user.dob) : undefined);
      setProfileImage(user.profileImage);
      setPreviewImage(user.profileImage);
    }
  }, [isOpen, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setProfileImage(result); // In a real app, you would upload this to a server
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile
    updateUser({
      name,
      address,
      location,
      dob: dob ? dob.toISOString().split('T')[0] : undefined, // Format as YYYY-MM-DD
      profileImage
    });
    
    onClose();
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
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="City, State"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
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
                  initialFocus
                  disabled={(date) => date > new Date()}
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