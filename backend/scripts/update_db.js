require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function updateDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('--- Đang cập nhật Database ---');

        // Bổ sung các cột cho Flash Sale vào bảng products (nếu chưa có)
        try {
            await connection.execute('ALTER TABLE products ADD COLUMN is_flash_sale BOOLEAN DEFAULT FALSE');
            await connection.execute('ALTER TABLE products ADD COLUMN discount_percent INT DEFAULT 0');
            await connection.execute('ALTER TABLE products ADD COLUMN flash_sale_stock INT DEFAULT 0');
            console.log('✓ Đã cập nhật bảng products cho Flash Sale.');
        } catch (e) {
            console.log('! Một số cột Flash Sale có thể đã tồn tại.');
        }

        // Tạo bảng banners
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS banners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                image_url TEXT NOT NULL,
                title VARCHAR(255),
                subtitle VARCHAR(255),
                link VARCHAR(255),
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Đã tạo bảng banners.');

        // Tạo bảng home_promos (Bento Grid)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS home_promos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100),
                subtitle VARCHAR(255),
                image_url TEXT,
                link VARCHAR(255),
                gradient VARCHAR(255),
                button_text VARCHAR(50) DEFAULT 'XEM NGAY',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Đã tạo bảng home_promos.');

        // Seeding dữ liệu mẫu cho Banners (để không bị trống)
        const [banners] = await connection.query('SELECT count(*) as count FROM banners');
        if (banners[0].count === 0) {
            await connection.execute('INSERT INTO banners (image_url, title, subtitle) VALUES (?, ?, ?)', 
                ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5', 'MacBook Pro M3 Max', 'Sức mạnh phi thường cho chuyên nghiệp.']);
            await connection.execute('INSERT INTO banners (image_url, title, subtitle) VALUES (?, ?, ?)', 
                ['https://images.unsplash.com/photo-1616348436168-de43ad0db179', 'iPhone 15 Pro Max', 'Khung Titan siêu bền.']);
            console.log('✓ Đã thêm dữ liệu mẫu cho Banners.');
        }

        // Seeding dữ liệu mẫu cho home_promos (3 ô Bento)
        const [promos] = await connection.query('SELECT count(*) as count FROM home_promos');
        if (promos[0].count === 0) {
            await connection.execute('INSERT INTO home_promos (title, subtitle, gradient, button_text) VALUES (?, ?, ?, ?)', 
                ['iPhone 15 Pro', 'Thu cũ đổi mới - Giá cực tốt', 'linear-gradient(135deg, #111, #333)', 'CHI TIẾT']);
            await connection.execute('INSERT INTO home_promos (title, subtitle, gradient, button_text) VALUES (?, ?, ?, ?)', 
                ['Phụ Kiện Gaming', 'Giảm 200k khi mua combo', 'linear-gradient(135deg, #f57224, #ff8a44)', 'SĂN DEAL']);
            await connection.execute('INSERT INTO home_promos (title, subtitle, gradient, button_text) VALUES (?, ?, ?, ?)', 
                ['Apple Watch Ultra', 'Trả góp 0% lãi suất', 'linear-gradient(135deg, #444, #000)', 'XEM NGAY']);
            console.log('✓ Đã thêm dữ liệu mẫu cho Home Promos.');
        }

        console.log('--- Hoàn tất cập nhật Database ---');

    } catch (e) {
        console.error('Xảy ra lỗi khi cập nhật DB:', e);
    } finally {
        await connection.end();
    }
}

updateDB();
