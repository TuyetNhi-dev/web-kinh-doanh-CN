import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
<<<<<<< HEAD
    const [products] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json(products);
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server', details: error.message }, { status: 500 });
=======
    const [products] = await connection.query('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json(products);
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
  } finally {
    connection.release();
  }
}

export async function POST(req) {
  const connection = await getConnection();
  try {
    const data = await req.json();
    const { name, description, price, category, image_url, stock_quantity } = data;

<<<<<<< HEAD
    // Validation
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Tên sản phẩm và giá bán là bắt buộc' },
        { status: 400 }
      );
    }

    console.log('📝 Thêm sản phẩm:', { name, price, category, stock_quantity });

    const [result] = await connection.execute(
      'INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || '', price, category || 'Khác', image_url || '', stock_quantity || 0]
    );

    console.log('✅ Sản phẩm được thêm với ID:', result.insertId);

    return NextResponse.json({ 
      id: result.insertId, 
      message: 'Thêm sản phẩm thành công' 
    });
  } catch (error) {
    console.error('❌ Lỗi thêm sản phẩm admin:', error);
    return NextResponse.json(
      { error: 'Lỗi server', details: error.message }, 
      { status: 500 }
    );
=======
    const [result] = await connection.query(
      'INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image_url, stock_quantity]
    );

    return NextResponse.json({ id: result.insertId, message: 'Thêm sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi thêm sản phẩm admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
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

<<<<<<< HEAD
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
=======
    await connection.query('DELETE FROM products WHERE id = ?', [id]);
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267

    return NextResponse.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm admin:', error);
<<<<<<< HEAD
    return NextResponse.json({ error: 'Lỗi server', details: error.message }, { status: 500 });
=======
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
  } finally {
    connection.release();
  }
}
