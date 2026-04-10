import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'mysql-14f8cc16-tnhi3756-70ea.d.aivencloud.com',
  port: process.env.DB_PORT || 24704,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  // Bật chế độ hỗ trợ chứng chỉ máy chủ (Aiven yêu cầu SSL)
  ssl: {
    rejectUnauthorized: false
  }
};

let pool;

export async function getConnection() {
  if (!pool) {
    if (!process.env.DB_PASSWORD) {
        console.warn("Chưa cấu hình mật khẩu DB_PASSWORD trong file .env !!");
    }
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool.getConnection();
}
