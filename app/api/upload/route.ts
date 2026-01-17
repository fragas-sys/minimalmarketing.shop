import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { put } from '@vercel/blob';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('uploadType') as 'video' | 'file';

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = uploadType === 'video' ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    if (uploadType === 'video') {
      return await handleVideoUpload(file);
    } else {
      return await handleFileUpload(file);
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer upload' },
      { status: 500 }
    );
  }
}

async function handleVideoUpload(file: File) {
  try {
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with optimizations
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'course-videos',
          // Video optimizations for mobile
          transformation: [
            {
              quality: 'auto:good', // Automatic quality optimization
              fetch_format: 'auto', // Best format for the browser (WebM, MP4)
            },
          ],
          // Enable adaptive bitrate streaming
          eager: [
            {
              streaming_profile: 'hd',
              format: 'm3u8', // HLS format for adaptive streaming
            },
          ],
          eager_async: true,
          // Generate thumbnail automatically
          eager_notification_url: undefined, // We'll use the default thumbnail
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // Extract video metadata
    const duration = result.duration; // in seconds
    const thumbnail = result.secure_url.replace(/\.[^.]+$/, '.jpg'); // Cloudinary auto-generates thumbnails

    return NextResponse.json({
      url: result.secure_url,
      metadata: {
        duration: Math.round(duration),
        thumbnail: thumbnail,
        fileSize: file.size,
        fileName: file.name,
        format: result.format,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Erro ao fazer upload do vídeo: ${error.message}`);
  }
}

async function handleFileUpload(file: File) {
  try {
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
      },
    });
  } catch (error: any) {
    console.error('Vercel Blob upload error:', error);
    throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
  }
}

// Increase body size limit for video uploads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
