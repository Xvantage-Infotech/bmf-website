"use client";

import Link from "next/link";
import {
  Home,
  Leaf,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "/farms", label: "Browse Farms" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/owner/register", label: "List Your Property" },
    { href: "/customers", label: "Happy Customers" },
    { href: "/about", label: "About Us" },
  ];

  const locations = [
    { href: "/farms/surat", label: "Surat Farmhouses" },
    { href: "/farms/daman", label: "Daman Resorts" },
    { href: "/farms/mumbai", label: "Mumbai Villas" },
    { href: "/farms/pune", label: "Pune Retreats" },
    { href: "/farms/vadodara", label: "Vadodara Estates" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/bookmyfarm",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/book_my_farms",
      label: "Instagram",
    },
    { icon: Youtube, href: "https://youtube.com/bookmyfarm", label: "YouTube" },
    {
      icon: MessageCircle,
      href: "https://wa.me/919277778778",
      label: "WhatsApp",
    },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <img
              src="/bmflogofoot.svg"
              alt="BookMyFarm Logo"
              className="h-20 mb-4"
            />
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Discover premium farmhouses for your perfect getaway. Book
              memorable experiences in nature's lap.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-primary transition"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Locations</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              {locations.map((location) => (
                <li key={location.href}>
                  <Link
                    href={location.href}
                    className="hover:text-white transition"
                  >
                    {location.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-primary mr-3" />
                +91 9277778778
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-primary mr-3" />
                support@bookmyfarm.net
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-primary mr-3 mt-1" />
                <span>
                  Platinum Point, 319, Opp. CNG Pump, Sudama Chowk,
                  <br />
                  Mota Varachha, Surat, Gujarat
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-8 mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
            <p>© 2024 BookMyFarm. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="border-t border-neutral-800 pt-8 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <p className="text-neutral-300 text-sm md:text-base">
              Download{" "}
              <span className="font-semibold text-white">BookMyFarm</span> for
              exciting offers
            </p>
            <div className="flex gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.app.bookmyfarm&hl=en_IN"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/googleplay-img.svg"
                  alt="Google Play"
                  className="h-10 hover:scale-105 transition-transform"
                />
              </a>
              <a href="https://apps.apple.com/in/app/bookmyfarm-book-farmhouse/id6747479573" target="_blank" rel="noopener noreferrer">
                <img
                  src="/appstore-img.svg"
                  alt="App Store"
                  className="h-10 hover:scale-105 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
