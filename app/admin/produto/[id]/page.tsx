'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ModuleEditor } from '@/components/admin/ModuleEditor';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useModules, Module, Material } from './hooks/useModules';
import { ModuleList } from './components/ModuleList';

export default function ProductEditPage() {
  const params = useParams();
  const productId = params.id as string;

  const {
    modules,
    isLoading,
    createModule,
    updateModule,
    deleteModule,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  } = useModules(productId);

  const [editingModule, setEditingModule] = useState<Module | undefined>();
  const [editingMaterial, setEditingMaterial] = useState<{ moduleId: string; material?: Material } | undefined>();
  const [showModuleEditor, setShowModuleEditor] = useState(false);

  const handleCreateModule = async (moduleData: { title: string; description?: string; order: number }) => {
    const success = await createModule(moduleData);
    if (success) setShowModuleEditor(false);
  };

  const handleUpdateModule = async (moduleId: string, moduleData: { title: string; description?: string; order: number }) => {
    const success = await updateModule(moduleId, moduleData);
    if (success) setEditingModule(undefined);
  };

  const handleCreateMaterial = async (materialData: any) => {
    if (!editingMaterial?.moduleId) return false;
    const success = await createMaterial(editingMaterial.moduleId, materialData);
    if (success) setEditingMaterial(undefined);
    return success;
  };

  const handleUpdateMaterial = async (materialId: string, materialData: any) => {
    const success = await updateMaterial(materialId, materialData);
    if (success) setEditingMaterial(undefined);
    return success;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12">
          <Container>
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-32 mx-auto"></div>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-12">
        <Container>
          <div className="mb-8">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black mb-4 inline-block transition-colors">
              ← Voltar para Admin
            </Link>
            <h1 className="text-4xl font-bold mb-2">Editar Módulos do Produto</h1>
            <p className="text-gray-600">Gerencie módulos e materiais deste produto</p>
          </div>

          {/* Botão criar módulo */}
          {!showModuleEditor && !editingModule && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowModuleEditor(true)}
              className="mb-8"
            >
              + Adicionar Módulo
            </Button>
          )}

          {/* Editor de novo módulo */}
          {showModuleEditor && (
            <div className="mb-8">
              <ModuleEditor
                onSave={handleCreateModule}
                onCancel={() => setShowModuleEditor(false)}
              />
            </div>
          )}

          {/* Editor de módulo existente */}
          {editingModule && (
            <div className="mb-8">
              <ModuleEditor
                module={editingModule}
                onSave={(data) => handleUpdateModule(editingModule.id, data)}
                onCancel={() => setEditingModule(undefined)}
              />
            </div>
          )}

          {/* Lista de módulos */}
          <ModuleList
            modules={modules}
            editingModule={editingModule}
            editingMaterial={editingMaterial}
            onEditModule={setEditingModule}
            onDeleteModule={deleteModule}
            onEditMaterial={(moduleId, material) => setEditingMaterial({ moduleId, material })}
            onDeleteMaterial={deleteMaterial}
            onCreateMaterial={handleCreateMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onCancelMaterialEdit={() => setEditingMaterial(undefined)}
          />

          {/* Empty state */}
          {modules.length === 0 && !showModuleEditor && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 text-lg">Nenhum módulo criado ainda</p>
              <Button
                variant="primary"
                onClick={() => setShowModuleEditor(true)}
              >
                Criar primeiro módulo
              </Button>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
