"use client";

import { useState } from "react";
// import { Link, useLocation } from 'wouter';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import LiveSearchBar from "@/components/common/LiveSearchBar";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Heart, Home } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isMobile } = useResponsive();
  const { user, isAuthenticated, logout, authInitialized } = useAuth();
  const router = useRouter();

  // if (!authInitialized) return null; // or a skeleton if you want
  const isLoggedIn = !!user?.token;

  const navigationItems = [
    { href: "/", label: "Farms" },
    { href: "/customers", label: "Happy Customers" },
    { href: "/contact", label: "Contact" },
    { href: "/owner/register", label: "List Your Farm" },
  ];

  const Logo = () => (
    <Link href="/" className="flex items-center space-x-3">
      {/* <img 
        src="/app_logo.png" 
        alt="BookMyFarm Logo" 
        className="w-12 h-12"
      />
      <span className="text-xl font-bold text-primary">BookMyFarm</span> */}
      <span className="flex items-center space-x-3">
        <img src="/app_logo.png" alt="BookMyFarm Logo" className="w-12 h-12" />
        <span className="text-xl font-bold text-primary">BookMyFarm</span>
      </span>
    </Link>
  );

  const SearchBar = ({ className = "" }) => (
    <LiveSearchBar
      className={className}
      placeholder="Search by farm name, location..."
    />
  );

  const Navigation = ({ className = "", mobile = false }) => (
    <nav className={className}>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            ${mobile ? "block py-3 text-base" : "inline-block"}
            text-neutral-600 hover:text-primary transition-colors
            ${pathname === item.href ? "text-primary font-medium" : ""}
          `}
          onClick={() => mobile && setIsMenuOpen(false)}
        >
          {item.label}
        </Link>
      ))}
      {mobile &&
        (isAuthenticated ? (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="h-8 w-8">
                {user?.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/profile");
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/profile");
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
             <Button
              variant="outline"
              className="w-full justify-start"
              onClick={async () => {
                await logout();
                setIsMenuOpen(false);
                router.push("/"); // ✅ Redirect after logout
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>LogOut</span>
            </Button>

            </div>
          </div>
        ) : (
          <Button
            className="w-full mt-4 bg-primary text-white hover:bg-primary/90"
            onClick={() => {
              setIsMenuOpen(false);
              setIsAuthModalOpen(true);
            }}
          >
            Login
          </Button>
        ))}
    </nav>
  );

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Search Bar */}
          {!isMobile && <SearchBar className="flex-1 max-w-2xl mx-8" />}

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-6">
              <Navigation className="flex items-center space-x-6" />

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-white flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      {/* <span className="text-sm font-medium">User</span> */}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/saved")}>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/myproperty")}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      My Property
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/booking-confirmation")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Bookings
                    </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      router.push("/"); // ✅ Redirect after logout
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className="bg-primary text-white hover:bg-primary/90 transition-colors"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Login/Sign Up
                </Button>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6 text-neutral-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <SearchBar />
                  <Navigation mobile />
                  <div className="pt-6 border-t border-neutral-200">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-neutral-900">
                        Popular Locations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Surat",
                          "Daman",
                          "Navsari",
                          "Saputara",
                          "Vadodara",
                        ].map((city) => (
                          <Button
                            key={city}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {city}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Mobile Search Bar */}
        {isMobile && (
          <div className="pb-4">
            <SearchBar />
          </div>
        )}
      </div>
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
