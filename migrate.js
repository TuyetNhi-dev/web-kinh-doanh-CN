require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('🔄 Running migrations...');

  // 1. Add phone & address columns to users
  try {
    await connection.execute(`ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL`);
    console.log('✅ Added column: users.phone');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  Column users.phone already exists');
    else console.error('❌ Error adding phone:', e.message);
  }

  try {
    await connection.execute(`ALTER TABLE users ADD COLUMN address TEXT DEFAULT NULL`);
    console.log('✅ Added column: users.address');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  Column users.address already exists');
    else console.error('❌ Error adding address:', e.message);
  }

  // 2. Create reviews table
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        rating TINYINT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_review (product_id, user_id)
      )
    `);
    console.log('✅ Created table: reviews');
  } catch (e) {
    console.error('❌ Error creating reviews:', e.message);
  }

  // 3. Create password_resets table
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created table: password_resets');
  } catch (e) {
    console.error('❌ Error creating password_resets:', e.message);
  }

  // 4. Add shipping info columns to orders if missing
  try {
    await connection.execute(`ALTER TABLE orders ADD COLUMN shipping_name VARCHAR(255) DEFAULT NULL`);
    console.log('✅ Added column: orders.shipping_name');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  Column orders.shipping_name already exists');
    else console.error('❌ Error:', e.message);
  }

  try {
    await connection.execute(`ALTER TABLE orders ADD COLUMN shipping_phone VARCHAR(20) DEFAULT NULL`);
    console.log('✅ Added column: orders.shipping_phone');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  Column orders.shipping_phone already exists');
    else console.error('❌ Error:', e.message);
  }

  try {
    await connection.execute(`ALTER TABLE orders ADD COLUMN shipping_address TEXT DEFAULT NULL`);
    console.log('✅ Added column: orders.shipping_address');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  Column orders.shipping_address already exists');
    else console.error('❌ Error:', e.message);
  }

  try {
    await connection.execute(`ALTER TABLE orders ADD COLUMN payment_method VARCHAR(20) DEFAULT 'cod'`);
    console.log('✅ Added column: orders.payment_method');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  Column orders.payment_method already exists');
    else console.error('❌ Error:', e.message);
  }

  try {
    await connection.execute(`ALTER TABLE orders ADD COLUMN payment_info JSON DEFAULT NULL`);
    console.log('✅ Added column: orders.payment_info');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  Column orders.payment_info already exists');
    else console.error('❌ Error:', e.message);
  }

  // 5. Create notifications table
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        type        ENUM('order', 'promo', 'system') NOT NULL DEFAULT 'order',
        title       VARCHAR(255) NOT NULL,
        content     TEXT,
        is_read     BOOLEAN NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_is_read (is_read)
      )
    `);
    console.log('✅ Created table: notifications');
  } catch (e) {
    console.error('❌ Error creating notifications:', e.message);
  }

  console.log('\n🎉 Migration completed!');
  await connection.end();
}

migrate().catch(console.error);
