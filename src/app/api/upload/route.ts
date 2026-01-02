
import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const folder = data.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large. Max 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Helper function for Turkish character conversion
    const turkishToEnglish = (str: string) => {
      return str
        .replace(/ğ/g, 'g')
        .replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u')
        .replace(/Ü/g, 'U')
        .replace(/ş/g, 's')
        .replace(/Ş/g, 'S')
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'I')
        .replace(/ö/g, 'o')
        .replace(/Ö/g, 'O')
        .replace(/ç/g, 'c')
        .replace(/Ç/g, 'C');
    };

    const sanitizedOriginalName = turkishToEnglish(file.name)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-\._]/g, '');

    // Create unique filename
    const filename = `${Date.now()}-${sanitizedOriginalName}`;
    
    // Determine upload path in bucket
    let uploadPath = filename;
    if (folder) {
      // Sanitize folder path
      const safeFolder = folder.replace(/[^a-zA-Z0-9\-\_\/]/g, '');
      uploadPath = `${safeFolder}/${filename}`;
    }

    const { error } = await supabase
      .storage
      .from('uploads')
      .upload(uploadPath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('uploads')
      .getPublicUrl(uploadPath);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

