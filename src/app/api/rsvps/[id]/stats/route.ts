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
    
    let total_coming = 0;
    let total_not_coming = 0;
    let total_kids = 0;
    let total_adults = 0;
    
    rsvps.forEach((r: any) => {
      if (r.status === "yes") {
        total_coming++;
        total_kids += Number(r.kids_count) || 0;
        total_adults += Number(r.adults_count) || 0;
      } else {
        total_not_coming++;
      }
    });
    
    return NextResponse.json({
      total_responses: rsvps.length,
      total_coming,
      total_not_coming,
      total_kids,
      total_adults
    });
  } catch (error) {
    console.error('Failed to fetch RSVP stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
