import mysql from 'mysql2/promise';

const isLocal =
  !process.env.DB_HOST ||
  process.env.DB_HOST === "127.0.0.1" ||
  process.env.DB_HOST === "localhost";

const dbConfig = {
  host: process.env.DB_HOST || 'mysql-14f8cc16-tnhi3756-70ea.d.aivencloud.com',
  port: process.env.DB_PORT || 24704,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  ssl: isLocal
    ? undefined
    : {
        rejectUnauthorized: false,
      },
};

let pool;

export async function getConnection() {
  if (!pool) {
    if (typeof process.env.DB_PASSWORD === "undefined") {
      console.warn("DB_PASSWORD chưa được cấu hình. Nếu MySQL local không dùng mật khẩu, hãy để DB_PASSWORD trống hoặc bỏ dòng này.");
    }
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool.getConnection();
}
