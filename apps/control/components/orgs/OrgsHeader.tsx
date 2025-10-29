"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { NButton } from "@/components/ui";
import OrgCreateModal from "./OrgCreateModal";

export default function OrgsHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30 border-b border-default surface-header backdrop-blur supports-[backdrop-filter]:bg-black/20">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto px-4 md:px-6 py-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight">Clientes/Empresas (Control)</h1>
          <p className="text-sm text-muted">Cadastro das organizações (tenants) do sistema.</p>
        </div>
        <NButton onClick={() => setOpen(true)} variant="primary" leftIcon={<Plus size={18} />}>Novo Cliente/Empresa</NButton>
      </div>
      {open && <OrgCreateModal isOpen={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
