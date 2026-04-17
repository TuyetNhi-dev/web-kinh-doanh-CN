import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req, { params }) {
  const connection = await getConnection();
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

    const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Lỗi lấy sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PUT(req, { params }) {
  const connection = await getConnection();
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

    const data = await req.json();
    const { name, description, price, category, image_url, stock_quantity } = data;

    await connection.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock_quantity = ? WHERE id = ?',
      [name, description, price, category, image_url, stock_quantity, id]
    );

    return NextResponse.json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
