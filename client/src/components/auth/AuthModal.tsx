import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useAuth();
  
  const loginForm = useForm({
    defaultValues: {
      mobileNumber: '',
      otp: ''
    }
  });

  const signupForm = useForm({
    defaultValues: {
      name: '',
      mobileNumber: '',
      otp: ''
    }
  });

  const handleSendOtp = (mobileNumber: string) => {
    // In a real app, this would call an API to send OTP
    console.log('Sending OTP to', mobileNumber);
    setIsOtpSent(true);
  };

  const handleLogin = (values: any) => {
    // In a real app, this would verify OTP and log the user in
    console.log('Login with', values);
    
    // Mock login - in a real app, this would come from an API
    login({
      id: '1',
      name: 'User', // In a real app, this would come from the backend
      mobileNumber: values.mobileNumber
    });
    
    onClose();
  };

  const handleSignup = (values: any) => {
    // In a real app, this would verify OTP and create a new account
    console.log('Signup with', values);
    
    // Mock signup - in a real app, this would come from an API
    login({
      id: '1',
      name: values.name,
      mobileNumber: values.mobileNumber
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Log In or Sign Up
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 py-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-mobile">Enter your Mobile Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                      <span className="text-sm">+91</span>
                    </div>
                    <Input 
                      id="login-mobile"
                      type="tel" 
                      placeholder="Mobile Number" 
                      className="rounded-l-none"
                      {...loginForm.register('mobileNumber')}
                    />
                  </div>
                </div>
                
                {isOtpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="login-otp">Enter OTP</Label>
                      <Input 
                        id="login-otp" 
                        type="text" 
                        placeholder="Enter OTP" 
                        {...loginForm.register('otp')}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
                      Login
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => handleSendOtp(loginForm.getValues('mobileNumber'))}
                  >
                    Get OTP
                  </Button>
                )}
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4 py-4">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input 
                    id="signup-name" 
                    type="text" 
                    placeholder="Your Name" 
                    {...signupForm.register('name')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-mobile">Mobile Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                      <span className="text-sm">+91</span>
                    </div>
                    <Input 
                      id="signup-mobile" 
                      type="tel" 
                      placeholder="Mobile Number" 
                      className="rounded-l-none"
                      {...signupForm.register('mobileNumber')}
                    />
                  </div>
                </div>
                
                {isOtpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-otp">Enter OTP</Label>
                      <Input 
                        id="signup-otp" 
                        type="text" 
                        placeholder="Enter OTP" 
                        {...signupForm.register('otp')}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
                      Create Account
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => handleSendOtp(signupForm.getValues('mobileNumber'))}
                  >
                    Get OTP
                  </Button>
                )}
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          By clicking, I accept the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </div>
      </DialogContent>
    </Dialog>
  );
}