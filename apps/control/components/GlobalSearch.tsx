'use client';

import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // TODO: Implement search functionality
    }
  };

  return (
    <div className="relative">
      {!isOpen ? (
        // Collapsed: Just the icon
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:text-white hover:bg-indigo-600 transition-colors"
          aria-label="Buscar"
        >
          <Search size={18} />
        </button>
      ) : (
        // Expanded: Search input
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="h-9 w-64 rounded-lg border border-gray-300 bg-white pl-9 pr-9 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              onBlur={() => {
                // Close if empty after a short delay
                setTimeout(() => {
                  if (!query.trim()) {
                    handleClose();
                  }
                }, 150);
              }}
            />
            {query && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
