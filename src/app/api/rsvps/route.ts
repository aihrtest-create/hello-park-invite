import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { event_id } = payload;
    
    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 });
    }
    
    const key = `rsvps:${event_id}`;
    
    await redis.rpush(key, JSON.stringify(payload));
    // Reset TTL to 60 days
    await redis.expire(key, 5184000);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save RSVP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
