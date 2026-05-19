export function formatFieldName(field: string): string {
  if (!field) return '';
  
  const labels: Record<string, string> = {
    title: 'Título',
    description: 'Descrição',
    content: 'Conteúdo',
    image: 'Imagem',
    tags: 'Tags',
    meta_title: 'Meta Título',
    meta_description: 'Meta Descrição',
    og_image: 'Imagem OpenGraph',
    og_title: 'Título OpenGraph',
    og_description: 'Descrição OpenGraph',
    slug: 'Slug',
    category: 'Categoria',
    author: 'Autor',
    date: 'Data',
  };

  return labels[field] || field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
}

type ValidationLevel = 'success' | 'warning' | 'error';

type ValidationBucket = {
  status: ValidationLevel;
  missing: string[];
};

type ValidationResult = {
  seo: ValidationBucket;
  openGraph: ValidationBucket;
  otherFields: ValidationBucket;
  canPublish: boolean;
  missingCount: number;
};

function buildValidation(content: Record<string, any>): ValidationResult {
  const seoRequired = ['meta_title', 'meta_description'];
  const ogRequired = ['og_title', 'og_description', 'og_image'];

  const seoMissing = seoRequired.filter((field) => !content?.[field]);
  const openGraphMissing = ogRequired.filter((field) => !content?.[field]);

  const allMissing = [...seoMissing, ...openGraphMissing];

  return {
    seo: {
      status: seoMissing.length === 0 ? 'success' : 'warning',
      missing: seoMissing,
    },
    openGraph: {
      status: openGraphMissing.length === 0 ? 'success' : 'warning',
      missing: openGraphMissing,
    },
    otherFields: {
      status: 'success',
      missing: [],
    },
    canPublish: allMissing.length === 0,
    missingCount: allMissing.length,
  };
}

export function validateRoteiro(content: Record<string, any>) {
  return buildValidation(content || {});
}

export function validateBlogPost(content: Record<string, any>) {
  return buildValidation(content || {});
}

export function getStatusColor(status: any): 'green' | 'yellow' | 'red' {
  const normalized = typeof status === 'string' ? status : status?.status;

  if (normalized === 'success' || normalized === 'complete') {
    return 'green';
  }

  if (normalized === 'warning') {
    return 'yellow';
  }

  return 'red';
}

export function getStatusEmoji(status: any): string {
  const color = getStatusColor(status);

  if (color === 'green') {
    return '✅';
  }

  if (color === 'yellow') {
    return '⚠️';
  }

  return '❌';
}
