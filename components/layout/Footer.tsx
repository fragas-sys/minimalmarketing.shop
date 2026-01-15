import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent border-t border-gray-200 mt-20">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MM</span>
                </div>
                <span className="font-semibold">Minimal Marketing</span>
              </div>
              <p className="text-sm text-gray-600">
                Materiais digitais que facilitam a vida de quem trabalha na internet com marketing.
              </p>
            </div>

            {/* Produtos */}
            <div>
              <h3 className="font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#produtos" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Cursos Online
                  </Link>
                </li>
                <li>
                  <Link href="/#produtos" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/#produtos" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Prompts de IA
                  </Link>
                </li>
              </ul>
            </div>

            {/* Suporte */}
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#faq" className="text-sm text-gray-600 hover:text-black transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold mb-4">Redes Sociais</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} Minimal Marketing. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
