'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client-only Profiles component
const Profiles = dynamic(() => import('@/components/Profiles/profiles'), { ssr: false });

export default function ProfilePage() {
  return <Profiles />;
}
    