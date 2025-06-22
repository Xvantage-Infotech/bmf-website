import { useState } from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Home, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';
import { staticFarms } from '@/data/staticFarms';
import { formatPrice } from '@/lib/utils';

// Mock owner data - in real app this would come from API
const mockOwnerFarms = staticFarms.slice(0, 3);

function DashboardOverview() {
  const totalEarnings = mockOwnerFarms.reduce((sum, farm) => sum + parseFloat(farm.pricePerNight) * 10, 0);
  const totalBookings = mockOwnerFarms.reduce((sum, farm) => sum + farm.reviewCount, 0);
  const avgRating = mockOwnerFarms.reduce((sum, farm) => sum + parseFloat(farm.rating), 0) / mockOwnerFarms.length;

  const stats = [
    {
      title: 'Total Earnings',
      value: formatPrice(totalEarnings),
      icon: DollarSign,
      change: '+12% from last month',
      color: 'text-green-600'
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      icon: Calendar,
      change: '+8% from last month',
      color: 'text-blue-600'
    },
    {
      title: 'Average Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      change: '+0.2 from last month',
      color: 'text-yellow-600'
    },
    {
      title: 'Active Listings',
      value: mockOwnerFarms.length.toString(),
      icon: Home,
      change: '+1 new listing',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's an overview of your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-xs text-neutral-500 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Family Getaway</p>
                    <p className="text-sm text-neutral-600">Green Valley Resort • 3 nights</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">₹10,500</p>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Confirmed
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FarmListings() {
  const [showAddFarm, setShowAddFarm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Listings</h1>
          <p className="text-neutral-600">Manage your farmhouse properties</p>
        </div>
        <Dialog open={showAddFarm} onOpenChange={setShowAddFarm}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Farm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Farm</DialogTitle>
            </DialogHeader>
            <AddFarmForm onClose={() => setShowAddFarm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockOwnerFarms.map((farm) => (
          <Card key={farm.id} className="overflow-hidden">
            <div className="relative h-48">
              <img 
                src={farm.images[0]} 
                alt={farm.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-primary text-white">
                {farm.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{farm.name}</h3>
              <p className="text-neutral-600 text-sm mb-3">{farm.location}</p>
              
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {farm.maxGuests} guests
                </span>
                <span className="font-medium text-primary">
                  {formatPrice(farm.pricePerNight)}/night
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{farm.rating} ({farm.reviewCount})</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddFarmForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    state: '',
    pricePerNight: '',
    bedrooms: '',
    maxGuests: '',
    category: '',
    amenities: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    onClose();
  };

  const amenityOptions = [
    'Private Swimming Pool', 'Air Conditioning', 'Free WiFi', 'Parking',
    'Kitchen', 'BBQ Grill', 'Garden', 'Security', 'Housekeeping', '24/7 Support'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Farm Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="heritage">Heritage</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="rustic">Rustic</SelectItem>
              <SelectItem value="family">Family</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price per Night (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.pricePerNight}
            onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="guests">Max Guests</Label>
          <Input
            id="guests"
            type="number"
            value={formData.maxGuests}
            onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {amenityOptions.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                  } else {
                    setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                  }
                }}
                className="rounded border-neutral-300"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
          Add Farm
        </Button>
      </div>
    </form>
  );
}

function Sidebar() {
  const [location] = useLocation();
  
  const menuItems = [
    { href: '/owner', label: 'Dashboard', icon: BarChart3 },
    { href: '/owner/listings', label: 'My Listings', icon: Home },
    { href: '/owner/bookings', label: 'Bookings', icon: Calendar },
    { href: '/owner/settings', label: 'Settings', icon: Settings },
    { href: '/owner/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-neutral-200 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-neutral-900">Owner Dashboard</h2>
        <p className="text-sm text-neutral-600">Manage your properties</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location === item.href || (item.href === '/owner' && location === '/owner');
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
                }
              `}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function OwnerDashboard() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <Switch>
          <Route path="/owner" component={DashboardOverview} />
          <Route path="/owner/listings" component={FarmListings} />
          <Route path="/owner/bookings" component={() => (
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>
              <p className="text-neutral-600 mt-2">Booking management coming soon...</p>
            </div>
          )} />
          <Route path="/owner/settings" component={() => (
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
              <p className="text-neutral-600 mt-2">Account settings coming soon...</p>
            </div>
          )} />
          <Route path="/owner/help" component={() => (
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-neutral-900">Help & Support</h1>
              <p className="text-neutral-600 mt-2">Help documentation coming soon...</p>
            </div>
          )} />
        </Switch>
      </div>
    </div>
  );
}
