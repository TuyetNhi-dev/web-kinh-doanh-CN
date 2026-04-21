const fs = require('fs');
const path = require('path');

// Load .env file FIRST, before importing db.js
if (!process.env.DB_HOST) {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && !key.startsWith('#')) {
        process.env[key.trim()] = value.trim();
      }
    });
    console.log('✓ Loaded .env file');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
  } catch (e) {
    console.error('Could not load .env:', e.message);
  }
}

// NOW import modules that depend on env variables
const bcrypt = require('bcryptjs');
const { getConnection } = require('./src/lib/db');

async function createAdmin() {
  const email = 'admin@techstore.com';
  const password = 'Admin@123456';
  const fullName = 'Admin TechStore';

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✓ Hashed password:', hashedPassword);

    const connection = await getConnection();
    
    // First, check table structure
    console.log('\n🔍 Checking users table structure...');
    try {
      const [columns] = await connection.execute('DESC users');
      console.log('Columns in users table:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
    } catch (e) {
      console.log('Could not describe table:', e.message);
    }

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('\n✓ Admin account already exists with email:', email);
      // Try to update with password field
      try {
        await connection.execute(
          'UPDATE users SET password = ?, role = ? WHERE email = ?',
          [hashedPassword, 'admin', email]
        );
      } catch (e) {
        // Try with password_hash if password doesn't exist
        await connection.execute(
          'UPDATE users SET password_hash = ?, role = ? WHERE email = ?',
          [hashedPassword, 'admin', email]
        );
      }
      console.log('✓ Updated admin account');
    } else {
      // Create new - try password first, then password_hash
      try {
        await connection.execute(
          'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, fullName, 'admin']
        );
      } catch (e) {
        console.log('password column not found, trying password_hash...');
        await connection.execute(
          'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, fullName, 'admin']
        );
      }
      console.log('✓ Admin account created!');
    }

    console.log('\n📧 Email:', email);
    console.log('🔐 Password:', password);
    console.log('\n✓ Bạn có thể đăng nhập admin panel bây giờ!');

    connection.release();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

createAdmin();
