'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface MaterialEditorProps {
  material?: {
    id: string;
    type: 'video' | 'file';
    title: string;
    description?: string;
    videoUrl?: string;
    videoSource?: 'youtube' | 'vimeo' | 'hosted';
    fileUrl?: string;
    fileName?: string;
    thumbnail?: string;
    duration?: number;
    order: number;
  };
  onSave: (data: {
    type: 'video' | 'file';
    title: string;
    description?: string;
    videoUrl?: string;
    videoSource?: 'youtube' | 'vimeo' | 'hosted';
    fileUrl?: string;
    fileName?: string;
    thumbnail?: string;
    duration?: number;
    order: number;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export function MaterialEditor({ material, onSave, onCancel }: MaterialEditorProps) {
  const [type, setType] = useState<'video' | 'file'>(material?.type || 'video');
  const [title, setTitle] = useState(material?.title || '');
  const [description, setDescription] = useState(material?.description || '');
  const [videoUrl, setVideoUrl] = useState(material?.videoUrl || '');
  const [videoSource, setVideoSource] = useState<'youtube' | 'vimeo' | 'hosted'>(
    material?.videoSource || 'youtube'
  );
  const [fileUrl, setFileUrl] = useState(material?.fileUrl || '');
  const [fileName, setFileName] = useState(material?.fileName || '');
  const [thumbnail, setThumbnail] = useState(material?.thumbnail || '');
  const [duration, setDuration] = useState(material?.duration?.toString() || '');

  const handleSave = () => {
    onSave({
      type,
      title,
      description,
      videoUrl: type === 'video' ? videoUrl : undefined,
      videoSource: type === 'video' ? videoSource : undefined,
      fileUrl: type === 'file' ? fileUrl : undefined,
      fileName: type === 'file' ? fileName : undefined,
      thumbnail,
      duration: duration ? parseInt(duration) : undefined,
      order: material?.order || 0,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold mb-6">
        {material ? 'Editar Material' : 'Novo Material'}
      </h3>

      <div className="space-y-4">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <div className="flex gap-4">
            <button
              onClick={() => setType('video')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                type === 'video'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              Vídeo
            </button>
            <button
              onClick={() => setType('file')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                type === 'file'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              Arquivo
            </button>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Introdução ao curso"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do material"
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Campos específicos para vídeo */}
        {type === 'video' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Fonte do Vídeo</label>
              <select
                value={videoSource}
                onChange={(e) => setVideoSource(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="hosted">Hospedado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL do Vídeo</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duração (segundos)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3600"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </>
        )}

        {/* Campos específicos para arquivo */}
        {type === 'file' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">URL do Arquivo</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nome do Arquivo</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="documento.pdf"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </>
        )}

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-2">URL da Thumbnail</label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-4">
          <Button variant="primary" size="md" onClick={handleSave}>
            {material ? 'Atualizar' : 'Criar'} Material
          </Button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
