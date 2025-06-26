import Link from 'next/link';
import { Home, Search, Heart, User } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

export default function MobileBottomNav() {
  const { isMobile } = useResponsive();
  
  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Heart, label: 'Saved', href: '/saved' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}