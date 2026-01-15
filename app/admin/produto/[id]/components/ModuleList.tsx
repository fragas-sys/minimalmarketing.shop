import React from 'react';
import { MaterialEditor } from '@/components/admin/MaterialEditor';
import { Module, Material } from '../hooks/useModules';

interface ModuleListProps {
  modules: Module[];
  editingModule: Module | undefined;
  editingMaterial: { moduleId: string; material?: Material } | undefined;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onEditMaterial: (moduleId: string, material?: Material) => void;
  onDeleteMaterial: (materialId: string) => void;
  onCreateMaterial: (data: any) => Promise<boolean>;
  onUpdateMaterial: (materialId: string, data: any) => Promise<boolean>;
  onCancelMaterialEdit: () => void;
}

export function ModuleList({
  modules,
  editingModule,
  editingMaterial,
  onEditModule,
  onDeleteModule,
  onEditMaterial,
  onDeleteMaterial,
  onCreateMaterial,
  onUpdateMaterial,
  onCancelMaterialEdit,
}: ModuleListProps) {
  if (modules.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {modules.map((module) => (
        <div key={module.id} className="bg-accent rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{module.title}</h2>
              {module.description && (
                <p className="text-gray-600 mt-1">{module.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEditModule(module)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => onDeleteModule(module.id)}
                className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>

          {/* Materiais do módulo */}
          <div className="space-y-4 mb-6">
            {module.materials && module.materials.length > 0 ? (
              module.materials
                .sort((a, b) => a.order - b.order)
                .map((material) => (
                  <div
                    key={material.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded">
                          {material.type === 'video' ? '🎥 Vídeo' : '📄 Arquivo'}
                        </span>
                        <h4 className="font-semibold">{material.title}</h4>
                      </div>
                      {material.description && (
                        <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditMaterial(module.id, material)}
                        className="px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteMaterial(material.id)}
                        className="px-3 py-1 text-sm bg-danger text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 italic">Nenhum material neste módulo</p>
            )}
          </div>

          {/* Editor de material */}
          {editingMaterial?.moduleId === module.id && editingMaterial?.material && (
            <MaterialEditor
              material={editingMaterial.material}
              onSave={async (data) => {
                const success = await onUpdateMaterial(editingMaterial.material!.id, data);
                if (success) onCancelMaterialEdit();
              }}
              onCancel={onCancelMaterialEdit}
            />
          )}

          {/* Botão adicionar material */}
          {(!editingMaterial ||
            (editingMaterial?.moduleId !== module.id && editingMaterial?.material)) && (
            <button
              onClick={() => onEditMaterial(module.id)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              + Adicionar Material
            </button>
          )}

          {/* Novo material */}
          {editingMaterial?.moduleId === module.id && !editingMaterial?.material && (
            <MaterialEditor
              onSave={async (data) => {
                const success = await onCreateMaterial(data);
                if (success) onCancelMaterialEdit();
              }}
              onCancel={onCancelMaterialEdit}
            />
          )}
        </div>
      ))}
    </div>
  );
}
