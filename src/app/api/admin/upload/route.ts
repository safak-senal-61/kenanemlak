import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import s3Client from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma'

async function saveUploadedFile(buffer: Buffer, originalName: string, propertyId: string): Promise<string> {
  const parts = originalName.split('.');
  const rawExt = parts.length > 1 ? parts.pop() || '' : '';
  
  // Sanitize extension (remove non-alphanumeric chars)
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'bin';
  
  const fileName = `${propertyId}/${randomUUID()}.${ext}`;
  const bucketName = process.env.DO_SPACES_BUCKET;

  if (!bucketName) {
    throw new Error('DO_SPACES_BUCKET env variable is not set');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ACL: 'public-read',
    ContentType: `image/${ext}`,
  });

  await s3Client.send(command);

  const region = process.env.DO_SPACES_REGION || 'fra1';
  const publicUrl = `https://${bucketName}.${region}.digitaloceanspaces.com/${fileName}`;

  return publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.adminId) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin bulunamadı' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan büyük olamaz' },
        { status: 400 }
      );
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Emlak ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const fileUrl = await saveUploadedFile(buffer, file.name, propertyId);

    // Save to database
    const propertyPhoto = await prisma.propertyPhoto.create({
      data: {
        propertyId,
        url: fileUrl
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: propertyPhoto.id,
        url: fileUrl
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Emlak ID\'si gerekli' },
        { status: 400 }
      );
    }

    const photos = await prisma.propertyPhoto.findMany({
      where: { propertyId },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: photos
    });

  } catch (error) {
    console.error('Get photos error:', error);
    return NextResponse.json(
      { error: 'Fotoğraflar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}