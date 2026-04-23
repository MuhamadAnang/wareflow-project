// server/books/book-upload.helper.ts
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveBookImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${timestamp}-${safeName}`;

  const uploadDir = path.join(process.cwd(), "public/uploads/books");

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return `/uploads/books/${filename}`;
}