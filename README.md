# Minimal Marketing

Uma plataforma minimalista de venda de produtos digitais para profissionais de marketing.

## 🎯 Sobre o Projeto

Minimal Marketing é uma loja online especializada em materiais digitais como cursos, templates e prompts de IA, desenvolvida com foco em design minimalista inspirado na estética da Apple.

### Características Principais

- **Design Minimalista**: Interface clean, branco/preto, pixel perfect
- **Curadoria Própria**: Todos os produtos são criados pela equipe
- **Consumer-First**: Experiência focada no usuário
- **Preços Justos**: Todos os produtos entre R$ 15-49
- **Acesso por 1 ano**: Todos os produtos incluem acesso por 12 meses

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React** - Biblioteca de UI

## 📁 Estrutura do Projeto

```
minimalmarketing/
├── app/                      # Next.js App Router
│   ├── (public)/            # Rotas públicas (landing page)
│   ├── (auth)/              # Rotas autenticadas (área do cliente)
│   ├── admin/               # Dashboard administrativo
│   ├── globals.css          # Estilos globais
│   └── layout.tsx           # Layout raiz
├── components/              # Componentes React
│   ├── ui/                  # Componentes de UI reutilizáveis
│   └── layout/              # Componentes de layout
├── data/                    # Dados mock
├── lib/                     # Utilitários e helpers
├── types/                   # Definições de tipos TypeScript
└── public/                  # Arquivos estáticos
```

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. As dependências já foram instaladas. Se precisar reinstalar:
```bash
npm install
```

2. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o navegador em [http://localhost:3000](http://localhost:3000)

## 📄 Páginas Disponíveis

### Nível Free (Público)
- **Landing Page** (`/`) - Página principal com listagem de produtos
  - Hero section
  - Catálogo de produtos
  - Seção "Sobre"
  - FAQ
  - CTA

### Nível Cliente (Autenticado)
- **Minha Conta** (`/minha-conta`) - Dashboard do cliente
  - Estatísticas pessoais
  - Lista de compras
  - Status de acesso aos produtos

- **Detalhes do Produto** (`/minha-conta/produto/[id]`) - Acesso ao conteúdo comprado
  - Informações do produto
  - Status de acesso
  - Download de entregáveis

### Nível Admin
- **Dashboard Admin** (`/admin`) - Painel administrativo
  - Estatísticas de vendas
  - Receita total
  - Produtos mais vendidos
  - Vendas recentes
  - Gestão de produtos

## 🎨 Sistema de Design

O sistema de design segue princípios minimalistas da Apple:

- **Cores**: Predominantemente branco e preto
- **Tipografia**: -apple-system, BlinkMacSystemFont, Segoe UI
- **Espaçamento**: Consistente e generoso
- **Bordas**: Arredondadas (rounded-xl, rounded-2xl)
- **Animações**: Suaves e sutis

### Componentes Base

- `Button` - Botões com variantes (primary, secondary, outline)
- `Card` - Cards para conteúdo
- `Container` - Container responsivo
- `ProductCard` - Card específico para produtos

## 📦 Produtos Disponíveis (Mock)

1. **Copywriting Estratégico** - R$ 49,00 (Curso)
2. **50 Templates de E-mail Marketing** - R$ 29,00 (Templates)
3. **100 Prompts de IA para Copywriting** - R$ 15,00 (Prompts de IA)
4. **Social Media Templates Pack** - R$ 39,00 (Templates)
5. **Estratégia de Conteúdo 360°** - R$ 45,00 (Curso)
6. **Prompts de IA para Design** - R$ 19,00 (Prompts de IA)

## 🔐 Níveis de Usuário (Mock)

No momento, o projeto usa dados mock. Para testar diferentes níveis:

- **Free**: Qualquer visitante não logado
- **Cliente**: Visualizar `/minha-conta` (simulado com usuário mock)
- **Admin**: Visualizar `/admin` (necessário alterar role do usuário mock)

## 🎯 Público-Alvo

- Profissionais de marketing
- Copywriters
- Designers
- Criadores de conteúdo
- Social medias
- Infoprodutores
- Experts
- Gestores de tráfego

## 🚧 Próximos Passos

Esta é uma versão de validação de frontend. Para produção, será necessário:

- [ ] Integrar backend real (API)
- [ ] Sistema de autenticação
- [ ] Gateway de pagamento
- [ ] Upload de arquivos
- [ ] Sistema de gestão de produtos
- [ ] Envio de e-mails transacionais
- [ ] Analytics e tracking
- [ ] SEO otimizado

## 📝 Notas Técnicas

- **Responsividade**: Totalmente responsivo (mobile-first)
- **Acessibilidade**: Componentes acessíveis
- **Performance**: Otimizado com Next.js
- **SEO**: Meta tags configuradas

## 📄 Licença

Propriedade de Minimal Marketing. Todos os direitos reservados.
