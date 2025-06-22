import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, User } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { isMobile } = useResponsive();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/saved', icon: Heart, label: 'Saved' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center py-3 px-2 transition-colors
                ${isActive 
                  ? 'text-primary' 
                  : 'text-neutral-400 hover:text-neutral-600'
                }
              `}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
