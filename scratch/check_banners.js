require('dotenv').config();
const path = require('path');
const { getConnection } = require(path.join(process.cwd(), 'src/lib/db'));

async function checkBanners() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM banners');
    console.log('BANNERS:', JSON.stringify(rows, null, 2));
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}
checkBanners();
