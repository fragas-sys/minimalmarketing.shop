import { useState, useEffect } from 'react';

export interface Module {
  id: string;
  productId: string;
  title: string;
  description?: string;
  order: number;
  materials: Material[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  moduleId: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export function useModules(productId: string) {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadModules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productId}/modules`);
      if (!response.ok) throw new Error('Erro ao carregar módulos');
      const data = await response.json();
      setModules(data.sort((a: Module, b: Module) => a.order - b.order));
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, [productId]);

  const createModule = async (moduleData: { title: string; description?: string; order: number }) => {
    try {
      const response = await fetch(`/api/products/${productId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData),
      });
      if (!response.ok) throw new Error('Erro ao criar módulo');
      await loadModules();
      return true;
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      alert('Erro ao criar módulo');
      return false;
    }
  };

  const updateModule = async (moduleId: string, moduleData: { title: string; description?: string; order: number }) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData),
      });
      if (!response.ok) throw new Error('Erro ao atualizar módulo');
      await loadModules();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error);
      alert('Erro ao atualizar módulo');
      return false;
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Tem certeza que deseja deletar este módulo?')) return false;
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar módulo');
      await loadModules();
      return true;
    } catch (error) {
      console.error('Erro ao deletar módulo:', error);
      alert('Erro ao deletar módulo');
      return false;
    }
  };

  const createMaterial = async (moduleId: string, materialData: any) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData),
      });
      if (!response.ok) throw new Error('Erro ao criar material');
      await loadModules();
      return true;
    } catch (error) {
      console.error('Erro ao criar material:', error);
      alert('Erro ao criar material');
      return false;
    }
  };

  const updateMaterial = async (materialId: string, materialData: any) => {
    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData),
      });
      if (!response.ok) throw new Error('Erro ao atualizar material');
      await loadModules();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      alert('Erro ao atualizar material');
      return false;
    }
  };

  const deleteMaterial = async (materialId: string) => {
    if (!confirm('Tem certeza que deseja deletar este material?')) return false;
    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar material');
      await loadModules();
      return true;
    } catch (error) {
      console.error('Erro ao deletar material:', error);
      alert('Erro ao deletar material');
      return false;
    }
  };

  return {
    modules,
    isLoading,
    loadModules,
    createModule,
    updateModule,
    deleteModule,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  };
}
