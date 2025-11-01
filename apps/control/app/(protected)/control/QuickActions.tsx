// app/(protected)/control/QuickActions.tsx
"use client";
import Link from "next/link";
import { 
  Building2, 
  Globe, 
  Key, 
  CreditCard, 
  Webhook, 
  FileText,
  Plus,
  ArrowRight
} from "lucide-react";

const actions = [
  { 
    title: "Tenants", 
    desc: "Gerencie organizações e membros", 
    href: "/tenants",
    icon: Building2,
    color: "from-purple-500/10 to-purple-500/5",
    borderColor: "border-purple-500/20 hover:border-purple-500/40",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/20",
  },
  { 
    title: "Domínios", 
    desc: "Configure domínios e subdomínios", 
    href: "/domains",
    icon: Globe,
    color: "from-blue-500/10 to-blue-500/5",
    borderColor: "border-blue-500/20 hover:border-blue-500/40",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/20",
  },
  { 
    title: "API Keys", 
    desc: "Crie e revogue chaves de acesso", 
    href: "/api-keys",
    icon: Key,
    color: "from-[#4aede5]/10 to-[#4aede5]/5",
    borderColor: "border-[#4aede5]/20 hover:border-[#4aede5]/40",
    iconColor: "text-[#4aede5]",
    iconBg: "bg-[#4aede5]/20",
  },
  { 
    title: "Billing", 
    desc: "Planos e assinaturas", 
    href: "/billing",
    icon: CreditCard,
    color: "from-[#D4AF37]/10 to-[#D4AF37]/5",
    borderColor: "border-[#D4AF37]/20 hover:border-[#D4AF37]/40",
    iconColor: "text-[#D4AF37]",
    iconBg: "bg-[#D4AF37]/20",
  },
  { 
    title: "Webhooks", 
    desc: "Monitore eventos e integrações", 
    href: "/webhooks",
    icon: Webhook,
    color: "from-emerald-500/10 to-emerald-500/5",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/20",
  },
  { 
    title: "Auditoria", 
    desc: "Logs e ações administrativas", 
    href: "#",
    icon: FileText,
    color: "from-slate-500/10 to-slate-500/5",
    borderColor: "border-slate-500/20 hover:border-slate-500/40",
    iconColor: "text-slate-400",
    iconBg: "bg-slate-500/20",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <p className="text-sm text-description">Acesso rápido às principais funcionalidades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group relative bg-gradient-to-br ${action.color} rounded-xl p-6 border ${action.borderColor} transition-all hover:scale-[1.02] overflow-hidden`}
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${action.iconColor} opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all`} />
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-1">{action.title}</h4>
                <p className="text-sm text-description">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
