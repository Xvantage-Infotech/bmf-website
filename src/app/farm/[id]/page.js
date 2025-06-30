'use client';

import dynamic from 'next/dynamic';

const FarmDetail = dynamic(() => import('@/pages/FarmDetail'), { ssr: false });

export default function FarmDetailsPage() {
  return <FarmDetail />;
}
