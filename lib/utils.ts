// Formatar valor em centavos para Real brasileiro
export function formatCurrency(valueInCents: number): string {
  const valueInReais = valueInCents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInReais);
}

// Formatar data para padrão brasileiro
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

// Calcular data de expiração
export function calculateExpiryDate(purchaseDate: Date | string, durationInDays: number): Date {
  const dateObj = typeof purchaseDate === 'string' ? new Date(purchaseDate) : purchaseDate;
  const expiryDate = new Date(dateObj);
  expiryDate.setDate(expiryDate.getDate() + durationInDays);
  return expiryDate;
}

// Verificar se o acesso ainda está válido
export function isAccessValid(expiryDate: Date | string): boolean {
  const dateObj = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  return new Date() < dateObj;
}

// Dias restantes de acesso
export function daysRemaining(expiryDate: Date | string): number {
  const dateObj = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const diff = dateObj.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

// Tradução de categorias
export function translateCategory(category: string): string {
  const translations: Record<string, string> = {
    copywriting: 'Copywriting',
    design: 'Design',
    content: 'Conteúdo',
    social_media: 'Social Media',
    traffic: 'Tráfego',
    seo: 'SEO',
    email_marketing: 'E-mail Marketing',
    strategy: 'Estratégia',
  };
  return translations[category] || category;
}

// Tradução de tipos de produto
export function translateProductType(type: string): string {
  const translations: Record<string, string> = {
    course: 'Curso Online',
    templates: 'Templates',
    ai_prompts: 'Prompts de IA',
  };
  return translations[type] || type;
}
