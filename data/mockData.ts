import {
  Product,
  ProductType,
  ProductCategory,
  User,
  UserRole,
  Order,
  OrderStatus,
} from '@/types';

// Produtos Mock
export const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'copywriting-estrategico',
    name: 'Copywriting Estratégico',
    description: 'Curso completo de copywriting estratégico com técnicas avançadas de persuasão e conversão. Aprenda a escrever textos que vendem e transformam leitores em clientes.',
    shortDescription: 'Domine a arte da escrita persuasiva e converta mais',
    price: 4900, // R$ 49,00
    originalPrice: 9900, // R$ 99,00
    type: ProductType.COURSE,
    category: ProductCategory.COPYWRITING,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    badge: 'best-seller',
    soldCount: 1247,
    features: [
      '20 aulas em vídeo',
      'Certificado de conclusão',
      'Exercícios práticos',
      'Suporte por e-mail',
      'Acesso por 1 ano',
    ],
    highlights: [
      'Técnicas usadas por grandes marcas',
      'Aprenda a criar headlines irresistíveis',
      'Gatilhos mentais comprovados',
      'Casos reais de sucesso',
    ],
    benefits: [
      'Aumente suas conversões em até 300%',
      'Escreva textos que vendem mesmo dormindo',
      'Domine a psicologia da persuasão',
      'Aplique em qualquer nicho de mercado',
      'Crie copy para redes sociais, e-mails e landing pages',
    ],
    deliverables: [
      {
        id: 'd1',
        name: 'Módulo 1: Fundamentos',
        type: 'video',
        description: '5 vídeo-aulas sobre fundamentos de copywriting',
      },
      {
        id: 'd2',
        name: 'Módulo 2: Técnicas Avançadas',
        type: 'video',
        description: '8 vídeo-aulas sobre técnicas avançadas',
      },
      {
        id: 'd3',
        name: 'Módulo 3: Casos Práticos',
        type: 'video',
        description: '7 vídeo-aulas com casos práticos',
      },
      {
        id: 'd4',
        name: 'Workbook Completo',
        type: 'file',
        description: 'PDF com 50 páginas de exercícios',
        fileSize: '5.2 MB',
      },
    ],
    faqs: [
      {
        question: 'Preciso ter experiência prévia?',
        answer: 'Não! O curso foi desenhado para iniciantes e também para quem já tem experiência e quer se aprofundar.',
      },
      {
        question: 'Quanto tempo tenho para concluir?',
        answer: 'Você tem 1 ano de acesso completo e pode fazer no seu ritmo.',
      },
      {
        question: 'Serve para qualquer nicho?',
        answer: 'Sim! As técnicas funcionam em qualquer mercado: infoprodutos, e-commerce, serviços, etc.',
      },
    ],
    isActive: true,
    accessDuration: 365,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    slug: '50-templates-email-marketing',
    name: '50 Templates de E-mail Marketing',
    description: 'Coleção com 50 templates profissionais de e-mail marketing prontos para usar. Personalizáveis e otimizados para conversão.',
    shortDescription: 'Templates profissionais prontos para suas campanhas',
    price: 2900, // R$ 29,00
    type: ProductType.TEMPLATES,
    category: ProductCategory.EMAIL_MARKETING,
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&q=80',
    badge: 'popular',
    soldCount: 892,
    features: [
      '50 templates prontos',
      'Formatos HTML e Figma',
      'Responsivos',
      'Personalizáveis',
      'Atualizações gratuitas',
    ],
    highlights: [
      'Copy já otimizada para conversão',
      'Design profissional e moderno',
      'Compatível com todas as plataformas',
      'Editável em minutos',
    ],
    benefits: [
      'Economize horas de trabalho',
      'Aumente sua taxa de abertura',
      'Melhore suas conversões',
      'Impressione seus clientes',
      'Use em projetos ilimitados',
    ],
    deliverables: [
      {
        id: 'd5',
        name: 'Templates HTML',
        type: 'file',
        description: 'Arquivos HTML prontos para importar',
        fileSize: '12 MB',
      },
      {
        id: 'd6',
        name: 'Arquivos Figma',
        type: 'file',
        description: 'Projeto completo no Figma para edição',
        fileSize: '8 MB',
      },
      {
        id: 'd7',
        name: 'Guia de Uso',
        type: 'file',
        description: 'PDF com instruções de uso',
        fileSize: '2 MB',
      },
    ],
    faqs: [
      {
        question: 'Posso usar em projetos comerciais?',
        answer: 'Sim! Use em quantos projetos quiser, sem limitações.',
      },
      {
        question: 'É fácil de personalizar?',
        answer: 'Muito fácil! Mesmo sem conhecimento técnico você consegue editar cores, textos e imagens.',
      },
    ],
    isActive: true,
    accessDuration: 365,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    slug: '100-prompts-ia-copywriting',
    name: '100 Prompts de IA para Copywriting',
    description: 'Biblioteca com 100 prompts testados e otimizados para criar textos de vendas, anúncios, e-mails e conteúdo para redes sociais usando IA.',
    shortDescription: '100 prompts testados para criar textos que vendem',
    price: 1500, // R$ 15,00
    type: ProductType.AI_PROMPTS,
    category: ProductCategory.COPYWRITING,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    badge: 'new',
    soldCount: 634,
    features: [
      '100 prompts testados',
      'Categorias organizadas',
      'Exemplos de uso',
      'Guia de boas práticas',
      'Atualizações mensais',
    ],
    highlights: [
      'Compatível com ChatGPT, Claude e Gemini',
      'Gere copy em segundos',
      'Testado e aprovado por copywriters',
      'Prompts otimizados para vendas',
    ],
    benefits: [
      'Nunca mais fique sem ideias',
      'Crie copy profissional em minutos',
      'Economize em redatores',
      'Teste variações infinitas',
      'Acelere sua produção de conteúdo',
    ],
    deliverables: [
      {
        id: 'd8',
        name: 'Biblioteca de Prompts',
        type: 'file',
        description: 'Planilha com todos os prompts organizados',
        fileSize: '1.5 MB',
      },
      {
        id: 'd9',
        name: 'Guia de Uso',
        type: 'file',
        description: 'PDF com melhores práticas',
        fileSize: '3 MB',
      },
    ],
    faqs: [
      {
        question: 'Funciona com qual IA?',
        answer: 'Funciona com ChatGPT, Claude, Gemini e qualquer outra IA de linguagem.',
      },
      {
        question: 'Vou receber atualizações?',
        answer: 'Sim! Todo mês adicionamos novos prompts gratuitamente.',
      },
    ],
    isActive: true,
    accessDuration: 365,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '4',
    slug: 'social-media-templates-pack',
    name: 'Social Media Templates Pack',
    description: 'Pack completo com templates para Instagram, Facebook, LinkedIn e Twitter. Mais de 200 designs prontos para editar.',
    shortDescription: '+200 templates para redes sociais',
    price: 3900, // R$ 39,00
    originalPrice: 7900,
    type: ProductType.TEMPLATES,
    category: ProductCategory.SOCIAL_MEDIA,
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    badge: 'popular',
    soldCount: 1523,
    features: [
      '200+ templates',
      'Formatos Canva e Figma',
      'Todas as redes sociais',
      'Guia de uso',
      'Atualizações trimestrais',
    ],
    highlights: [
      'Feed harmônico e profissional',
      'Paletas de cores prontas',
      'Stories, posts e reels',
      'Carrosséis editáveis',
    ],
    benefits: [
      'Poste todos os dias sem esforço',
      'Mantenha consistência visual',
      'Aumente seu engajamento',
      'Economize com designer',
      'Use em todos os seus clientes',
    ],
    deliverables: [
      {
        id: 'd10',
        name: 'Templates Canva',
        type: 'link',
        description: 'Link para templates no Canva',
        url: 'https://canva.com/templates',
      },
      {
        id: 'd11',
        name: 'Arquivos Figma',
        type: 'file',
        description: 'Projeto completo no Figma',
        fileSize: '25 MB',
      },
    ],
    faqs: [
      {
        question: 'Preciso de assinatura do Canva Pro?',
        answer: 'Não! Todos os templates funcionam na versão gratuita do Canva.',
      },
      {
        question: 'Posso vender posts criados com esses templates?',
        answer: 'Sim! Use para vender para seus clientes sem problemas.',
      },
    ],
    isActive: true,
    accessDuration: 365,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '5',
    slug: 'estrategia-conteudo-360',
    name: 'Estratégia de Conteúdo 360°',
    description: 'Curso prático sobre como criar uma estratégia de conteúdo completa para sua marca ou cliente.',
    shortDescription: 'Crie estratégias de conteúdo que geram resultados',
    price: 4500, // R$ 45,00
    originalPrice: 8900,
    type: ProductType.COURSE,
    category: ProductCategory.STRATEGY,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    soldCount: 743,
    features: [
      '15 aulas práticas',
      'Templates inclusos',
      'Certificado',
      'Comunidade exclusiva',
      'Casos reais',
    ],
    highlights: [
      'Metodologia validada',
      'Do planejamento à execução',
      'Multi-canal e multi-formato',
      'ROI mensurável',
    ],
    benefits: [
      'Planeje 3 meses em 1 dia',
      'Nunca mais fique sem conteúdo',
      'Aumente seu alcance orgânico',
      'Gere leads qualificados',
      'Construa autoridade na sua área',
    ],
    deliverables: [
      {
        id: 'd12',
        name: 'Aulas em Vídeo',
        type: 'video',
        description: '15 aulas sobre estratégia de conteúdo',
      },
      {
        id: 'd13',
        name: 'Templates de Planejamento',
        type: 'file',
        description: 'Planilhas e templates para planejar seu conteúdo',
        fileSize: '8 MB',
      },
    ],
    faqs: [
      {
        question: 'Serve para qual tipo de negócio?',
        answer: 'Serve para qualquer tipo de negócio: infoprodutos, e-commerce, serviços, B2B, B2C.',
      },
      {
        question: 'Preciso de equipe?',
        answer: 'Não! O curso ensina a executar sozinho ou com equipe pequena.',
      },
    ],
    isActive: true,
    accessDuration: 365,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '6',
    slug: 'prompts-ia-design',
    name: 'Prompts de IA para Design',
    description: 'Coleção de prompts otimizados para gerar designs, ilustrações e elementos visuais com IA.',
    shortDescription: 'Crie designs incríveis com IA',
    price: 1900, // R$ 19,00
    type: ProductType.AI_PROMPTS,
    category: ProductCategory.DESIGN,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    badge: 'new',
    soldCount: 421,
    features: [
      '80 prompts para design',
      'Exemplos visuais',
      'Guia de estilos',
      'Atualizações mensais',
    ],
    highlights: [
      'Midjourney, DALL-E e Stable Diffusion',
      'Estilos variados',
      'Imagens comerciais',
      'Resultados consistentes',
    ],
    benefits: [
      'Crie artes únicas em segundos',
      'Economize em banco de imagens',
      'Teste variações infinitas',
      'Desenvolva seu estilo visual',
      'Use em projetos comerciais',
    ],
    deliverables: [
      {
        id: 'd14',
        name: 'Biblioteca de Prompts',
        type: 'file',
        description: 'PDF com todos os prompts',
        fileSize: '10 MB',
      },
    ],
    faqs: [
      {
        question: 'Funciona com qual IA?',
        answer: 'Midjourney, DALL-E 3, Stable Diffusion e outras IAs de imagem.',
      },
      {
        question: 'Posso usar as imagens comercialmente?',
        answer: 'Sim, desde que você tenha os direitos de uso da IA que estiver usando.',
      },
    ],
    isActive: true,
    accessDuration: 365,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

// Usuários Mock
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'u2',
    name: 'Admin User',
    email: 'admin@minimalmarketing.com',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Pedidos Mock
export const mockOrders: Order[] = [
  {
    id: 'o1',
    userId: 'u1',
    productId: '1',
    product: mockProducts[0],
    amount: 4900,
    status: OrderStatus.COMPLETED,
    purchaseDate: new Date('2024-02-01'),
    expiryDate: new Date('2025-02-01'),
  },
  {
    id: 'o2',
    userId: 'u1',
    productId: '3',
    product: mockProducts[2],
    amount: 1500,
    status: OrderStatus.COMPLETED,
    purchaseDate: new Date('2024-02-15'),
    expiryDate: new Date('2025-02-15'),
  },
  {
    id: 'o3',
    userId: 'u1',
    productId: '4',
    product: mockProducts[3],
    amount: 3900,
    status: OrderStatus.COMPLETED,
    purchaseDate: new Date('2024-03-01'),
    expiryDate: new Date('2025-03-01'),
  },
  {
    id: 'o4',
    userId: 'u2',
    productId: '1',
    product: mockProducts[0],
    amount: 4900,
    status: OrderStatus.COMPLETED,
    purchaseDate: new Date('2024-01-15'),
    expiryDate: new Date('2025-01-15'),
  },
  {
    id: 'o5',
    userId: 'u2',
    productId: '5',
    product: mockProducts[4],
    amount: 4500,
    status: OrderStatus.COMPLETED,
    purchaseDate: new Date('2024-02-20'),
    expiryDate: new Date('2025-02-20'),
  },
];

// Função para obter usuário atual (mock)
export function getCurrentUser(): User | null {
  // Simula um usuário logado como admin para demonstração
  // Para testar como cliente, mude o índice para 0
  return mockUsers[1]; // Admin user
}

// Função para obter pedidos do usuário
export function getUserOrders(userId: string): Order[] {
  return mockOrders.filter(order => order.userId === userId);
}

// Função para obter produto por slug
export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(product => product.slug === slug);
}
