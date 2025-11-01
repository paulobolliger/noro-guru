// components/GlobalSearch.tsx
// Wrapper do SearchInput integrado com a API de busca

'use client';

import { SearchInput } from './ui/SearchInput';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'lead' | 'cliente' | 'pedido' | 'orcamento';
  href: string;
  metadata?: string;
}

export default function GlobalSearch() {
  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        console.error('Search API error:', response.status);
        return [];
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  return (
    <SearchInput
      placeholder="Buscar leads, clientes, pedidos... (/)"
      onSearch={handleSearch}
    />
  );
}
