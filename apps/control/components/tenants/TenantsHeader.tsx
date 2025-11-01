"use client";
import React, { useState } from "react";
import { Plus, Building2, Search } from "lucide-react";
import { NButton } from "@/components/ui";
import OrgCreateModal from "@/components/orgs/OrgCreateModal";

interface TenantsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function TenantsHeader({ searchQuery, onSearchChange }: TenantsHeaderProps) {
  const [open, setOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  return (
    <div className="sticky top-0 z-30">
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 mb-6 rounded-xl shadow-md"
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        <div className="flex items-center gap-3 flex-shrink-0">
          <Building2 size={28} className="text-[#D4AF37]" />
          <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Tenants</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Icon/Input */}
          <div className="flex items-center gap-2">
            {!searchExpanded && (
              <button
                onClick={() => setSearchExpanded(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Expandir busca"
              >
                <Search size={20} className="text-[#D4AF37]" />
              </button>
            )}
            {searchExpanded && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar por nome, slug ou plano..."
                  className="px-3 py-2 rounded-lg border-2 border-[#D4AF37] dark:border-[#4aede5] bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5] w-64"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchExpanded(false);
                    onSearchChange("");
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <NButton onClick={() => setOpen(true)} variant="primary" leftIcon={<Plus size={18} />}>
            <span className="hidden lg:inline">Novo Tenant</span>
            <span className="lg:hidden">Novo</span>
          </NButton>
        </div>
      </div>
      {open && <OrgCreateModal isOpen={open} onClose={() => setOpen(false)} />}
    </div>
  );
}

