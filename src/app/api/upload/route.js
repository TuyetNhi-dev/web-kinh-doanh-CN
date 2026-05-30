export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

// Map of allowed MIME types to their magic byte signatures and canonical extensions.
// Checking magic bytes (not the filename/Content-Type header) prevents spoofing.
const ALLOWED_TYPES = {
  "image/jpeg": { magic: [[0xFF, 0xD8, 0xFF]], ext: "jpg" },
  "image/png":  { magic: [[0x89, 0x50, 0x4E, 0x47]], ext: "png" },
  "image/webp": { magic: [[0x52, 0x49, 0x46, 0x46]], ext: "webp" }, // RIFF....WEBP
};

function detectMimeType(buffer) {
  for (const [mime, { magic }] of Object.entries(ALLOWED_TYPES)) {
    for (const signature of magic) {
      if (signature.every((byte, i) => buffer[i] === byte)) {
        // Extra check for WebP: bytes 8-11 must be "WEBP"
        if (mime === "image/webp") {
          const marker = buffer.slice(8, 12).toString("ascii");
          if (marker !== "WEBP") continue;
        }
        return mime;
      }
    }
  }
  return null;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate MIME type via magic bytes — reject anything that isn't JPEG/PNG/WebP
    const detectedMime = detectMimeType(buffer);
    if (!detectedMime) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận file ảnh JPEG, PNG hoặc WebP." },
        { status: 400 }
      );
    }

    // Use the canonical extension derived from magic bytes, not the uploaded filename
    const ext = ALLOWED_TYPES[detectedMime].ext;
    const fileName = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
    
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
