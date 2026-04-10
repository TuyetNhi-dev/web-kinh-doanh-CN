import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ message: 'Danh sách sản phẩm từ DB' });
}

export async function POST(request) {
  return NextResponse.json({ message: 'Thêm sản phẩm mới' });
}
