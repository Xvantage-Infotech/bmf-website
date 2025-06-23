import { Link } from 'wouter';
import { Home, Leaf, Facebook, Instagram, Youtube, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { href: '/farms', label: 'Browse Farms' },
    { href: '/how-it-works', label: 'How it Works' },
    { href: '/owner/register', label: 'List Your Property' },
    { href: '/customers', label: 'Happy Customers' },
    { href: '/about', label: 'About Us' },
  ];

  const locations = [
    { href: '/farms/surat', label: 'Surat Farmhouses' },
    { href: '/farms/daman', label: 'Daman Resorts' },
    { href: '/farms/mumbai', label: 'Mumbai Villas' },
    { href: '/farms/pune', label: 'Pune Retreats' },
    { href: '/farms/vadodara', label: 'Vadodara Estates' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/bookmyfarm', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/book_my_farms', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/bookmyfarm', label: 'YouTube' },
    { icon: MessageCircle, href: 'https://wa.me/919277778778', label: 'WhatsApp' },
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <footer className="bg-neutral-900 text-white section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/app_logo.png" 
                alt="BookMyFarm Logo" 
                className="w-10 h-10"
              />
              <span className="text-xl font-bold">BookMyFarm</span>
            </div>
            <p className="text-neutral-400 mb-4 leading-relaxed">
              Discover premium farmhouses for your perfect getaway. Book memorable experiences in nature's lap.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Locations</h3>
            <ul className="space-y-2">
              {locations.map((location) => (
                <li key={location.href}>
                  <Link
                    href={location.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {location.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                <span className="text-neutral-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                <span className="text-neutral-400">info@bookmyfarm.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-400">
                  123 Farm Street, Surat, Gujarat 395001
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              © 2024 BookMyFarm. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
