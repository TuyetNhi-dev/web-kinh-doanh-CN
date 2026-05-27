const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  });

  console.log('Connected to DB. Running migration...');

  // Create payments table
  await conn.execute(
    "CREATE TABLE IF NOT EXISTS payments (" +
    "  id              INT           AUTO_INCREMENT PRIMARY KEY," +
    "  order_id        INT           NOT NULL," +
    "  amount          DECIMAL(15,2) NOT NULL," +
    "  method          VARCHAR(50)   NOT NULL DEFAULT 'vnpay'," +
    "  status          ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending'," +
    "  transaction_id  VARCHAR(100)  DEFAULT NULL," +
    "  bank_code       VARCHAR(20)   DEFAULT NULL," +
    "  pay_date        VARCHAR(30)   DEFAULT NULL," +
    "  response_code   VARCHAR(10)   DEFAULT NULL," +
    "  secure_hash     VARCHAR(256)  DEFAULT NULL," +
    "  raw_data        TEXT          DEFAULT NULL," +
    "  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP," +
    "  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
  );
  console.log('payments table: OK');

  // Add indexes safely
  try {
    await conn.execute("ALTER TABLE payments ADD UNIQUE KEY uq_order_method (order_id, method)");
    console.log('Index uq_order_method: ADDED');
  } catch(e) {
    console.log('Index uq_order_method: ALREADY EXISTS');
  }

  try {
    await conn.execute("ALTER TABLE payments ADD INDEX idx_order_id (order_id)");
    console.log('Index idx_order_id: ADDED');
  } catch(e) {
    console.log('Index idx_order_id: ALREADY EXISTS');
  }

  // Add payment_info to orders if missing
  try {
    await conn.execute("ALTER TABLE orders ADD COLUMN payment_info JSON DEFAULT NULL");
    console.log('orders.payment_info column: ADDED');
  } catch(e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('orders.payment_info column: ALREADY EXISTS');
    } else {
      throw e;
    }
  }

  await conn.end();
  console.log('\nMigration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
