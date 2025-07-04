'use client';


import { AuthProvider } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

const Profiles = dynamic(() => import('@/components/Profiles/profiles'), { ssr: false });

export default function ProfilePage() {
  return (
    <AuthProvider>
      <Profiles />
    </AuthProvider>
  );
}

    