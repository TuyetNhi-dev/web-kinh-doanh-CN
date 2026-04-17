import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'shop-settings.json');

async function ensureSettingsFile() {
  try {
    await fs.mkdir(path.dirname(settingsPath), { recursive: true });
    await fs.access(settingsPath);
  } catch {
    await fs.writeFile(settingsPath, JSON.stringify({ name: 'HBN TechStore', email: '', phone: '' }, null, 2), 'utf8');
  }
}

export async function GET() {
  await ensureSettingsFile();
  try {
    const file = await fs.readFile(settingsPath, 'utf8');
    return NextResponse.json(JSON.parse(file));
  } catch (error) {
    console.error('Lỗi đọc cài đặt:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(req) {
  const data = await req.json();
  await ensureSettingsFile();
  try {
    await fs.writeFile(settingsPath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ message: 'Lưu cài đặt thành công' });
  } catch (error) {
    console.error('Lỗi lưu cài đặt:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
