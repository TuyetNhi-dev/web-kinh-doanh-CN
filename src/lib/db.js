import mysql from 'mysql2/promise';

<<<<<<< HEAD
const isLocal =
  !process.env.DB_HOST ||
  process.env.DB_HOST === "127.0.0.1" ||
  process.env.DB_HOST === "localhost";

=======
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
const dbConfig = {
  host: process.env.DB_HOST || 'mysql-14f8cc16-tnhi3756-70ea.d.aivencloud.com',
  port: process.env.DB_PORT || 24704,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
<<<<<<< HEAD
  ssl: isLocal
    ? undefined
    : {
        rejectUnauthorized: false,
      },
=======
  // Bật chế độ hỗ trợ chứng chỉ máy chủ (Aiven yêu cầu SSL)
  ssl: {
    rejectUnauthorized: false
  }
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
};

let pool;

export async function getConnection() {
  if (!pool) {
<<<<<<< HEAD
    if (typeof process.env.DB_PASSWORD === "undefined") {
      console.warn("DB_PASSWORD chưa được cấu hình. Nếu MySQL local không dùng mật khẩu, hãy để DB_PASSWORD trống hoặc bỏ dòng này.");
=======
    if (!process.env.DB_PASSWORD) {
        console.warn("Chưa cấu hình mật khẩu DB_PASSWORD trong file .env !!");
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
    }
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
<<<<<<< HEAD
      queueLimit: 0,
=======
      queueLimit: 0
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
    });
  }
  return pool.getConnection();
}
