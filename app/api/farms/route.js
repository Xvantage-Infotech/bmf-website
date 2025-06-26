import { NextResponse } from 'next/server';
import { staticFarms, getFarmsByCity, getFarmsByCategory, searchFarms } from '@/lib/staticFarms';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let farms = staticFarms;

    if (search) {
      farms = searchFarms(search);
    } else if (city) {
      farms = getFarmsByCity(city);
    } else if (category) {
      farms = getFarmsByCategory(category);
    }

    return NextResponse.json(farms);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch farms' },
      { status: 500 }
    );
  }
}