'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ModuleEditorProps {
  module?: {
    id: string;
    title: string;
    description?: string;
    order: number;
  };
  onSave: (data: {
    title: string;
    description?: string;
    order: number;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export function ModuleEditor({ module, onSave, onCancel }: ModuleEditorProps) {
  const [title, setTitle] = useState(module?.title || '');
  const [description, setDescription] = useState(module?.description || '');

  const handleSave = () => {
    if (!title.trim()) {
      alert('O título do módulo é obrigatório');
      return;
    }
    onSave({
      title,
      description,
      order: module?.order ?? 0,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold mb-6">
        {module ? 'Editar Módulo' : 'Novo Módulo'}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Título do Módulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Módulo 1 - Fundamentos"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição opcional do módulo"
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="primary" size="md" onClick={handleSave}>
            {module ? 'Atualizar' : 'Criar'} Módulo
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
