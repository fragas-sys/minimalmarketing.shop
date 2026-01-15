import { db } from '@/lib/db';
import { productMaterials } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function GET(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const materials = await db
      .select()
      .from(productMaterials)
      .where(eq(productMaterials.moduleId, params.moduleId));

    return NextResponse.json(materials);
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar materiais' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const body = await req.json();
    const {
      type, // 'video' | 'file'
      title,
      description,
      videoUrl,
      videoSource,
      fileUrl,
      fileName,
      fileSize,
      thumbnail,
      duration,
      order,
    } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'type e title são obrigatórios' },
        { status: 400 }
      );
    }

    const newMaterial = {
      id: nanoid(),
      moduleId: params.moduleId,
      type,
      title,
      description: description || null,
      videoUrl: videoUrl || null,
      videoSource: videoSource || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      thumbnail: thumbnail || null,
      duration: duration || null,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(productMaterials).values(newMaterial);

    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar material:', error);
    return NextResponse.json(
      { error: 'Erro ao criar material' },
      { status: 500 }
    );
  }
}
