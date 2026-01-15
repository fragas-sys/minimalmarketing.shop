'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MM</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">Minimal Marketing</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#produtos"
              className="text-sm text-gray-700 hover:text-black transition-colors"
            >
              Produtos
            </Link>
            <Link
              href="/#sobre"
              className="text-sm text-gray-700 hover:text-black transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/#faq"
              className="text-sm text-gray-700 hover:text-black transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart Icon */}
            <Link href="/carrinho">
              <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
              {user ? (
                <>
                  <Link href="/minha-conta">
                    <Button variant="outline" size="sm">
                      Conta
                    </Button>
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin">
                      <Button variant="secondary" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/entrar">
                    <Button variant="outline" size="sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/criar-conta">
                    <Button variant="primary" size="sm" className="whitespace-nowrap">
                      Criar Conta
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 py-4">
            <nav className="space-y-3 mb-4">
              <Link
                href="/#produtos"
                className="block text-sm text-gray-700 hover:text-black transition-colors px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link
                href="/#sobre"
                className="block text-sm text-gray-700 hover:text-black transition-colors px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/#faq"
                className="block text-sm text-gray-700 hover:text-black transition-colors px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 px-4">
              {user ? (
                <>
                  <Link href="/minha-conta" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Minha Conta
                    </Button>
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full justify-center">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-center"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/entrar" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/criar-conta" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full justify-center">
                      Criar Conta
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
