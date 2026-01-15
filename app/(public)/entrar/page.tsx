'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login, user, loading: authLoading, error: authError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Redirecionar para onde o usuário estava tentando ir
  const redirectTo = searchParams.get('redirect') || '/';

  // Se já estiver logado, redirecionar (apenas uma vez após carregamento)
  React.useEffect(() => {
    if (!authLoading && hasCheckedAuth === false) {
      setHasCheckedAuth(true);
      if (user) {
        router.push(redirectTo);
      }
    }
  }, [authLoading, user, redirectTo]);

  // Evita renderizar o formulário enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validações básicas no cliente
      if (!email.trim() || !password.trim()) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (!email.includes('@')) {
        throw new Error('Por favor, insira um email válido');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres');
      }

      await login(email.trim(), password);
      // Login bem-sucedido, o contexto já atualizou o estado
      // Redirecionar após login bem-sucedido
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
      setPassword(''); // Limpar senha por segurança
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Header />

      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <Container size="sm">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left Side - Info */}
            <div className="flex-1 hidden lg:flex flex-col justify-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4">Bem-vindo de volta</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Acesse sua conta e continue aprendendo com nossos produtos premium.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-black/10 text-black font-bold">✓</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Acesso Permanente</h3>
                    <p className="text-gray-600">Acesso vitalício ao conteúdo que você comprou</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-black/10 text-black font-bold">✓</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Atualizações Grátis</h3>
                    <p className="text-gray-600">Receba novas atualizações e bônus sem custo extra</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-black/10 text-black font-bold">✓</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Suporte Dedicado</h3>
                    <p className="text-gray-600">Equipe pronta para ajudá-lo em qualquer dúvida</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full max-w-md lg:flex-1">
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold">Entrar</h2>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">Acesse sua conta para continuar</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                        <div className="flex gap-2">
                          <span>⚠️</span>
                          <div>{error}</div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-900">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-900">
                        Senha
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Não tem uma conta?
                      </p>
                      <Link
                        href={`/criar-conta${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
                        className="w-full"
                      >
                        <Button variant="secondary" size="lg" className="w-full font-semibold">
                          Criar Conta Grátis
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Footer Text */}
              <p className="text-center text-xs text-gray-500 mt-6">
                Ao entrar, você concorda com nossos{' '}
                <Link href="#" className="text-black font-semibold hover:underline">
                  Termos de Serviço
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
