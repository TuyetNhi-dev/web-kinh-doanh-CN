import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    const [products] = await connection.query('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json(products);
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function POST(req) {
  const connection = await getConnection();
  try {
    const data = await req.json();
    const { name, description, price, category, image_url, stock_quantity } = data;

    const [result] = await connection.query(
      'INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image_url, stock_quantity]
    );

    return NextResponse.json({ id: result.insertId, message: 'Thêm sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi thêm sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function DELETE(req) {
  const connection = await getConnection();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

    await connection.query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
