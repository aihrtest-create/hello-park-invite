import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const rawRsvps = await redis.lrange(`rsvps:${id}`, 0, -1);
    const rsvps = rawRsvps.map(item => JSON.parse(item));
    
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('Failed to fetch RSVPs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
