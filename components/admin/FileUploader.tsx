'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete: (url: string, metadata?: {
    fileName?: string;
    fileSize?: number;
    duration?: number;
    thumbnail?: string;
  }) => void;
  uploadType: 'video' | 'file';
  currentUrl?: string;
  label?: string;
}

export function FileUploader({
  accept,
  maxSize = 100,
  onUploadComplete,
  uploadType,
  currentUrl,
  label = 'Upload',
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSize) {
        throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadType', uploadType);

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      // Handle completion
      const uploadPromise = new Promise<{
        url: string;
        metadata?: any;
      }>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error(xhr.responseText || 'Upload falhou'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Erro de rede durante upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelado'));
        });
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

      const result = await uploadPromise;

      // Set preview
      if (uploadType === 'video' && result.metadata?.thumbnail) {
        setPreview(result.metadata.thumbnail);
      } else if (uploadType === 'file') {
        setPreview(result.url);
      }

      // Callback with result
      onUploadComplete(result.url, result.metadata);

      setProgress(100);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  }, [maxSize, uploadType, onUploadComplete]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      {/* Preview */}
      {preview && !uploading && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {uploadType === 'video' ? (
            <img
              src={preview}
              alt="Video thumbnail"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="p-4 flex items-center gap-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Arquivo carregado
                </p>
                <p className="text-xs text-gray-500 truncate">{preview}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {!uploading ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Arraste e solte ou clique para selecionar
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {uploadType === 'video'
                  ? 'Vídeos: MP4, WebM, MOV (máx. 100MB)'
                  : 'Arquivos: PDF, ZIP, etc (máx. 50MB)'}
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <svg
                className="animate-spin mx-auto h-12 w-12 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm text-gray-600">Fazendo upload... {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
