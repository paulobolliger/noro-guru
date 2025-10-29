"use client";
import React, { useState } from "react";
import { NButton } from "@/components/ui";
import { Plus } from "lucide-react";
import WebhookEndpointModal from "@/components/webhooks/WebhookEndpointModal";

export default function EndpointsHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <NButton onClick={() => setOpen(true)} variant="primary" leftIcon={<Plus className="w-4 h-4"/>}>Novo Webhook</NButton>
      {open && <WebhookEndpointModal isOpen={open} onClose={() => setOpen(false)} />}
    </div>
  );
}

