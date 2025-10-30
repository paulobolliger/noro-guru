"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { NButton } from "@/components/ui";
import OrgCreateModal from "@/components/orgs/OrgCreateModal";

export default function TenantsHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30">
      <div
        className="flex items-center justify-between max-w-[1200px] mx-auto px-4 md:px-6 p-6 md:p-8 mb-6 rounded-xl shadow-md"
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37] tracking-tight">Tenants</h1>
          <p className="text-sm text-white">Gerencie as organizações (tenants) do sistema.</p>
        </div>
        <NButton onClick={() => setOpen(true)} variant="primary" leftIcon={<Plus size={18} />}>Novo Tenant</NButton>
      </div>
      {open && <OrgCreateModal isOpen={open} onClose={() => setOpen(false)} />}
    </div>
  );
}

