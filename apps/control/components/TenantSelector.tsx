// apps/control/components/TenantSelector.tsx
// Seletor de tenant com dropdown elegante e feedback visual

"use client";

import { useState, useTransition } from "react";
import { Building2, Check, ChevronDown } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  role?: string;
}

interface TenantSelectorProps {
  tenants: Tenant[];
  activeTenantId: string | null;
  onTenantChange: (formData: FormData) => Promise<void>;
}

export function TenantSelector({ 
  tenants, 
  activeTenantId,
  onTenantChange 
}: TenantSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const activeTenant = tenants.find(t => t.id === activeTenantId);

  const handleTenantChange = (tenantId: string) => {
    setIsOpen(false);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('tenant_id', tenantId);
      await onTenantChange(formData);
    });
  };

  if (tenants.length === 0) return null;

  // Se só tem um tenant, mostra apenas o nome
  if (tenants.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{tenants[0].name}</span>
        <span className="text-xs text-muted-foreground">({tenants[0].slug})</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center gap-2 px-3 py-2 text-sm
          border border-border rounded-lg
          hover:bg-accent/50 transition-colors
          ${isPending ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
      >
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col items-start">
          <span className="font-medium">{activeTenant?.name || 'Selecione tenant'}</span>
          {activeTenant && (
            <span className="text-xs text-muted-foreground">{activeTenant.slug}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-72 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="p-2 border-b border-border">
              <p className="text-xs text-muted-foreground px-2">Selecione o tenant</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {tenants.map((tenant) => {
                const isActive = tenant.id === activeTenantId;
                
                return (
                  <button
                    key={tenant.id}
                    onClick={() => handleTenantChange(tenant.id)}
                    disabled={isPending}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5
                      hover:bg-accent/50 transition-colors
                      ${isActive ? 'bg-accent' : ''}
                      ${isPending ? 'opacity-50 cursor-wait' : ''}
                    `}
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{tenant.name}</span>
                        {tenant.role && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary capitalize">
                            {tenant.role}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">{tenant.slug}</span>
                    </div>
                    
                    {isActive && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
