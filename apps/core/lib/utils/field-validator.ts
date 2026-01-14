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
