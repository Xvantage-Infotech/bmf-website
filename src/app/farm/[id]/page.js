'use client';

import _dynamic from 'next/dynamic'; // ✅ Renamed to _dynamic

export const dynamic = 'force-dynamic'; // ✅ No conflict now
const FarmDetail = _dynamic(() => import('@/components/Farm/FarmDetail'), { ssr: false });



export default function FarmDetailsPage() {
  return <FarmDetail />;
}
