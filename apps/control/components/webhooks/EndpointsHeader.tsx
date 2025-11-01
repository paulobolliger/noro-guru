"use client";
import React, { useState } from "react";
import { NButton } from "@/components/ui";
import { Plus, Webhook } from "lucide-react";
import WebhookEndpointModal from "@/components/webhooks/WebhookEndpointModal";

export default function EndpointsHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30">
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 mb-6 rounded-xl shadow-md"
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        <div className="flex items-center gap-3 flex-shrink-0">
          <Webhook size={28} className="text-[#D4AF37]" />
          <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Webhooks</h1>
        </div>
        <NButton onClick={() => setOpen(true)} variant="primary" leftIcon={<Plus size={18} />}>
          <span className="hidden lg:inline">Novo Webhook</span>
          <span className="lg:hidden">Novo</span>
        </NButton>
      </div>
      {open && <WebhookEndpointModal isOpen={open} onClose={() => setOpen(false)} />}
    </div>
  );
}

