import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Menu, Home, Leaf } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useResponsive();

  const navigationItems = [
    { href: '/farms', label: 'Farms' },
    { href: '/reviews', label: 'Happy Customers' },
    { href: '/contact', label: 'Contact' },
  ];

  const Logo = () => (
    <Link href="/" className="flex items-center space-x-3">
      <img 
        src="/attached_assets/app_logo_1750582700060.png" 
        alt="BookMyFarm Logo" 
        className="w-12 h-12"
      />
      <span className="text-xl font-bold text-primary">BookMyFarm</span>
    </Link>
  );

  const SearchBar = ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder="Search by farm name, location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-4 pr-10 py-2 border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
    </div>
  );

  const Navigation = ({ className = '', mobile = false }: { className?: string; mobile?: boolean }) => (
    <nav className={className}>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            ${mobile ? 'block py-3 text-base' : 'inline-block'}
            text-neutral-600 hover:text-primary transition-colors
            ${location === item.href ? 'text-primary font-medium' : ''}
          `}
          onClick={() => mobile && setIsMenuOpen(false)}
        >
          {item.label}
        </Link>
      ))}
      {mobile && (
        <Button 
          className="w-full mt-4 bg-primary text-white hover:bg-primary/90"
          onClick={() => setIsMenuOpen(false)}
        >
          List Your Farm
        </Button>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Search Bar */}
          {!isMobile && (
            <SearchBar className="flex-1 max-w-2xl mx-8" />
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-6">
              <Navigation className="flex items-center space-x-6" />
              <Button className="bg-primary text-white hover:bg-primary/90 transition-colors">
                List Your Farm
              </Button>
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
                      <h4 className="font-semibold text-neutral-900">Popular Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Surat', 'Daman', 'Mumbai', 'Pune', 'Vadodara'].map((city) => (
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
    </header>
  );
}
