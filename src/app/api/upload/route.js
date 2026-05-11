import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file ngẫu nhiên để tránh trùng lặp
    const fileExtension = file.name.split(".").pop();
    const fileName = `${crypto.randomBytes(16).toString("hex")}.${fileExtension}`;
    
    // Đường dẫn lưu file
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, fileName);

    // Đảm bảo thư mục tồn tại (phòng hờ)
    await mkdir(uploadDir, { recursive: true });

    // Lưu file
    await writeFile(filePath, buffer);

    // Trả về URL của file vừa upload
    return NextResponse.json({ 
      url: `/uploads/${fileName}`,
      message: "Upload thành công" 
    });
  } catch (error) {
    console.error("Lỗi upload file:", error);
    return NextResponse.json({ error: "Lỗi upload server" }, { status: 500 });
  }
}
