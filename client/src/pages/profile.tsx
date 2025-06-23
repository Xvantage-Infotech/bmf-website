import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Profile() {
  // Mock user data
  const user = {
    name: 'John Doe',
    phone: '+91 98765 43210',
    dob: '1990-01-01',
    address: '123 Farm Street, Surat, Gujarat',
    location: 'Surat, Gujarat',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    isOwner: false, // Change to true to show owner dashboard button
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6 mb-8">
        <img
          src={user.image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary"
        />
        <h2 className="text-xl font-bold mb-1">{user.name}</h2>
        <p className="text-neutral-600 mb-2">{user.location}</p>
        <div className="w-full text-left space-y-2 mt-4">
          <div><span className="font-medium">Phone:</span> {user.phone}</div>
          <div><span className="font-medium">DOB:</span> {user.dob}</div>
          <div><span className="font-medium">Address:</span> {user.address}</div>
        </div>
      </div>

      {/* Partner with Us Section */}
      <div className="bg-primary/5 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold mb-2 text-primary">Partner with Us</h3>
        <p className="text-neutral-700 mb-4">List your property and start earning, or manage your existing listings.</p>
        {user.isOwner ? (
          <Link href="/OwnerDashboard">
            <Button className="w-full bg-primary text-white hover:bg-primary/90">Go to Owner Dashboard</Button>
          </Link>
        ) : (
          <Link href="/owner/register">
            <Button className="w-full bg-primary text-white hover:bg-primary/90">Register Your Farm</Button>
          </Link>
        )}
      </div>
    </div>
  );
} 