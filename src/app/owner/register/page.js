// app/property-registration/page.jsx
"use client";

import dynamic from 'next/dynamic';

const PropertyRegistration = dynamic(() => import('@/components/PropertyRegistration'), { ssr: false });

export default function PropertyRegistrationPage() {
  return <PropertyRegistration />;
}
