import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { customAlphabet } from 'nanoid';

// Use a custom alphabet that is URL friendly and short
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const id = nanoid();
    
    // Store in Redis with TTL of 60 days (60 * 24 * 60 * 60 = 5184000 seconds)
    await redis.set(`invite:${id}`, JSON.stringify(data), 'EX', 5184000);
    
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Failed to shorten link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const data = await redis.get(`invite:${id}`);
    
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Failed to fetch link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
