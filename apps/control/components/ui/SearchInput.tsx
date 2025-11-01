// components/ui/SearchInput.tsx
'use client';

import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'lead' | 'cliente' | 'pedido' | 'orcamento' | 'tenant' | 'user' | 'domain' | 'page';
  href: string;
  metadata?: string;
}

interface SearchInputProps {
  placeholder?: string;
  recentSearches?: string[];
  onSearch?: (query: string) => Promise<SearchResult[]>;
}

export function SearchInput({ 
  placeholder = 'Buscar... (pressione / para focar)', 
  recentSearches = [],
  onSearch 
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isTyping(e.target as HTMLElement)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (onSearch) {
        setLoading(true);
        try {
          const searchResults = await onSearch(query);
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && results[focusedIndex]) {
          handleSelect(results[focusedIndex]);
        }
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            topbar-search h-10 rounded-lg text-sm transition-all duration-200 ease-in-out
            focus-visible:outline-none
            ${isOpen || query ? 'w-80 pl-10 pr-10' : 'w-10 pl-2 cursor-pointer'}
          `}
        />
        <Search
          className="topbar-icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          size={18}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown com resultados */}
      {isOpen && (query || recentSearches.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-96 noro-card p-2 max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          ) : query && results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors
                    ${focusedIndex === index ? 'bg-accent/10 border-l-2 border-accent' : 'hover:bg-surface-alt'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${getTypeColor(result.type)}
                    `}>
                      <span className="text-xs font-semibold uppercase">
                        {getTypeIcon(result.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-primary truncate">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-xs text-muted truncate">{result.subtitle}</div>
                      )}
                    </div>
                    {result.metadata && (
                      <div className="flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(result.metadata)}`}>
                          {result.metadata}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query && !loading ? (
            <div className="text-center py-8 text-sm text-muted">
              Nenhum resultado encontrado para "{query}"
            </div>
          ) : recentSearches.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted uppercase">
                <Clock size={12} />
                Buscas recentes
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(search)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-alt transition-colors text-sm text-primary"
                >
                  {search}
                </button>
              ))}
            </div>
          ) : null}

          {/* Dicas de atalhos */}
          <div className="border-t border-default mt-2 pt-2 px-3 py-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Pressione <kbd className="px-1.5 py-0.5 rounded bg-surface-alt font-mono">/</kbd> para buscar</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-surface-alt font-mono">↑↓</kbd> navegar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isTyping(element: HTMLElement) {
  const tag = element.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || element.isContentEditable;
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    lead: 'LD',
    cliente: 'CL',
    pedido: 'PD',
    orcamento: 'OR',
    tenant: 'TN',
    user: 'US',
    domain: 'DM',
    page: 'PG'
  };
  return icons[type] || 'XX';
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    lead: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    cliente: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    pedido: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orcamento: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    tenant: 'bg-accent/10 text-[#0FA89A] dark:text-[#1DD3C0]',
    user: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    domain: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    page: 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
  };
  return colors[type] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
}

function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  const colors: Record<string, string> = {
    // Leads
    novo: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    contato: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    qualificado: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    proposta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    negociacao: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    ganho: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    perdido: 'bg-red-500/10 text-red-600 dark:text-red-400',
    // Clientes
    pessoa_fisica: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    pessoa_juridica: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    // Pedidos/Orçamentos
    rascunho: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    enviado: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    aprovado: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rejeitado: 'bg-red-500/10 text-red-600 dark:text-red-400',
    concluido: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    cancelado: 'bg-red-500/10 text-red-600 dark:text-red-400'
  };
  return colors[statusLower] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
}

