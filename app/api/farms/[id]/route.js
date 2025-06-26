import { NextResponse } from 'next/server';
import { getFarmById } from '@/lib/staticFarms';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const farm = getFarmById(id);

    if (!farm) {
      return NextResponse.json(
        { error: 'Farm not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(farm);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch farm' },
      { status: 500 }
    );
  }
}