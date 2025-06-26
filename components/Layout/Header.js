import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Search, User, Heart, MapPin } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BookMyFarm</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/farms" className="text-gray-700 hover:text-green-600 transition-colors">
              Farms
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">
              How It Works
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Saved
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              List Your Farm
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/farms" className="text-gray-700 hover:text-green-600 transition-colors">
                Farms
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">
                How It Works
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="ghost" size="sm" className="justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Saved
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  List Your Farm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}