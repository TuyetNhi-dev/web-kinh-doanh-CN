import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ message: 'API Xác thực ngõ ra (Auth)' });
}

export async function POST(request) {
  return NextResponse.json({ message: 'API Xử lý Login/Register' });
}
