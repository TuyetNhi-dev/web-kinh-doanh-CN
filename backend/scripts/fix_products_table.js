const fs = require('fs');
const path = require('path');

// Load .env
if (!process.env.DB_HOST) {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && !key.startsWith('#')) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const mysql = require('mysql2/promise');

async function fixProductsTable() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const connection = await pool.getConnection();

    console.log('🔍 Kiểm tra cấu trúc bảng products...\n');
    const [columns] = await connection.execute("DESCRIBE products");
    
    console.log('📋 Hiện tại các cột:');
    const columnNames = [];
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
      columnNames.push(col.Field);
    });

    // Check if price column exists
    if (!columnNames.includes('price')) {
      console.log('\n⚠️ Cột "price" bị thiếu! Đang thêm...');
      await connection.execute("ALTER TABLE products ADD COLUMN price DECIMAL(15, 2) NOT NULL DEFAULT 0");
      console.log('✅ Đã thêm cột price');
    }

    if (!columnNames.includes('category')) {
      console.log('\n⚠️ Cột "category" bị thiếu! Đang thêm...');
      await connection.execute("ALTER TABLE products ADD COLUMN category VARCHAR(50)");
      console.log('✅ Đã thêm cột category');
    }

    if (!columnNames.includes('image_url')) {
      console.log('\n⚠️ Cột "image_url" bị thiếu! Đang thêm...');
      await connection.execute("ALTER TABLE products ADD COLUMN image_url VARCHAR(255)");
      console.log('✅ Đã thêm cột image_url');
    }

    if (!columnNames.includes('stock_quantity')) {
      console.log('\n⚠️ Cột "stock_quantity" bị thiếu! Đang thêm...');
      await connection.execute("ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0");
      console.log('✅ Đã thêm cột stock_quantity');
    }

    console.log('\n✅ Cấu trúc bảng đã được sửa hoàn tất!');

    connection.release();
    pool.end();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

fixProductsTable();
