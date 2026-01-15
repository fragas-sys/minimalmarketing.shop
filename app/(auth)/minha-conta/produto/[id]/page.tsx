'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Material {
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
}

interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  materials: Material[];
}

export default function ProductMembersPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/entrar?redirect=/minha-conta/produto/${productId}`);
      return;
    }

    // VALIDAÇÃO BACKEND DE ACESSO ANTES DE CARREGAR MÓDULOS
    verifyAccess();
  }, [isAuthenticated, productId]);

  const verifyAccess = async () => {
    try {
      setIsLoading(true);
      setAccessError(null);

      // 1. VALIDAR ACESSO AO PRODUTO NO BACKEND
      const accessResponse = await fetch(`/api/products/${productId}/access`);

      if (!accessResponse.ok) {
        // Erro de autenticação (401) ou outro erro do servidor
        console.error('Erro ao verificar acesso:', accessResponse.status);
        router.push('/minha-conta?error=access_check_failed');
        return;
      }

      const accessData = await accessResponse.json();

      // 2. VERIFICAR SE TEM ACESSO VÁLIDO
      if (!accessData.hasAccess) {
        console.log(`Acesso negado ao produto ${productId}:`, accessData.reason);

        const errorMessages: Record<string, string> = {
          not_purchased: 'not_purchased',
          expired: 'expired',
          inactive: 'inactive',
        };

        const errorParam = errorMessages[accessData.reason] || 'no_access';
        router.push(`/minha-conta?error=${errorParam}`);
        return;
      }

      // 3. SE TEM ACESSO, CARREGAR MÓDULOS
      console.log(`Acesso válido ao produto ${productId}, carregando módulos...`);
      await loadModules();
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setAccessError('Erro ao verificar acesso ao produto');
      router.push('/minha-conta?error=access_check_failed');
    }
  };

  const loadModules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productId}/modules`);
      if (response.ok) {
        const data = await response.json();
        setModules(data.sort((a: Module, b: Module) => a.order - b.order));
        if (data.length > 0 && data[0].materials?.length > 0) {
          setSelectedMaterial(data[0].materials[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderVideoPlayer = (material: Material) => {
    if (!material.videoUrl) return null;

    if (material.videoSource === 'youtube') {
      const videoId = material.videoUrl.includes('youtube.com')
        ? new URL(material.videoUrl).searchParams.get('v')
        : material.videoUrl.split('/').pop();
      
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={material.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (material.videoSource === 'vimeo') {
      const videoId = material.videoUrl.split('/').pop();
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      );
    }

    if (material.videoSource === 'hosted') {
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
          <video
            controls
            className="w-full h-full"
            poster={material.thumbnail}
          >
            <source src={material.videoUrl} type="video/mp4" />
          </video>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12">
          <Container>
            <div className="text-center">Carregando módulos...</div>
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
          {/* Header */}
          <Link href="/minha-conta" className="text-sm text-gray-600 hover:text-black mb-4 inline-block">
            ← Voltar para Minha Conta
          </Link>

          {/* Layout com sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Módulos */}
            <div className="lg:col-span-1">
              <div className="bg-accent rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Módulos</h2>

                {modules.length === 0 ? (
                  <p className="text-gray-600 text-sm">Nenhum módulo disponível</p>
                ) : (
                  <div className="space-y-3">
                    {modules.map((module) => (
                      <div key={module.id}>
                        <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
                          <h3 className="font-semibold text-sm">{module.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {module.materials.length} material{module.materials.length !== 1 ? 'is' : ''}
                          </p>
                        </div>

                        {/* Materiais */}
                        <div className="ml-4 space-y-1 mt-2">
                          {module.materials
                            .sort((a, b) => a.order - b.order)
                            .map((material) => (
                              <button
                                key={material.id}
                                onClick={() => setSelectedMaterial(material)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                                  selectedMaterial?.id === material.id
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{material.type === 'video' ? '🎥' : '📄'}</span>
                                  <span className="truncate">{material.title}</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="lg:col-span-3">
              {selectedMaterial ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold mb-2">{selectedMaterial.title}</h2>
                  {selectedMaterial.description && (
                    <p className="text-gray-600 mb-8">{selectedMaterial.description}</p>
                  )}

                  {/* Vídeo */}
                  {selectedMaterial.type === 'video' && renderVideoPlayer(selectedMaterial)}

                  {/* Arquivo */}
                  {selectedMaterial.type === 'file' && (
                    <div className="bg-accent rounded-2xl p-8 mb-8 text-center">
                      <div className="text-6xl mb-4">📄</div>
                      <h3 className="text-xl font-bold mb-2">{selectedMaterial.fileName || selectedMaterial.title}</h3>
                      <a
                        href={selectedMaterial.fileUrl}
                        download
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  )}

                  {/* Info */}
                  <div className="bg-accent rounded-2xl p-6 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-semibold capitalize">
                        {selectedMaterial.type === 'video' ? 'Aula em Vídeo' : 'Arquivo para Download'}
                      </p>
                    </div>
                    {selectedMaterial.type === 'video' && selectedMaterial.duration && (
                      <div>
                        <p className="text-sm text-gray-600">Duração</p>
                        <p className="font-semibold">
                          {Math.floor(selectedMaterial.duration / 60)} min
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : modules.length > 0 ? (
                <div className="bg-accent rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h2 className="text-2xl font-bold mb-2">Selecione um material</h2>
                  <p className="text-gray-600">
                    Escolha um módulo e material da barra lateral para começar
                  </p>
                </div>
              ) : (
                <div className="bg-accent rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">🔒</div>
                  <h2 className="text-2xl font-bold mb-2">Nenhum módulo disponível</h2>
                  <p className="text-gray-600">
                    Os módulos deste produto ainda não foram criados
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
