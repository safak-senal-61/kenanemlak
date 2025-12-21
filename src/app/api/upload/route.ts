
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const folder = data.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    
    // Determine upload directory
    let uploadDir = path.join(process.cwd(), 'public/uploads');
    let urlPrefix = '/uploads';

    if (folder) {
      // Sanitize folder path to prevent directory traversal
      const safeFolder = folder.replace(/[^a-zA-Z0-9\-\_\/]/g, '');
      uploadDir = path.join(uploadDir, safeFolder);
      urlPrefix = `/uploads/${safeFolder}`;
    }
    
    if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `${urlPrefix}/${filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

