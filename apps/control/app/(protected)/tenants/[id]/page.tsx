"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardHeader, CardContent, NButton, NBadge } from "@/components/ui";
import { ArrowLeft, Building2, Globe, Users, Activity, AlertCircle, BarChart3, Database, Settings } from "lucide-react";
import TenantOverview from "@/components/tenants/TenantOverview";
import TenantStats from "@/components/tenants/TenantStats";
import TenantDomains from "@/components/tenants/TenantDomains";
import TenantUserManagement from "@/components/tenants/TenantUserManagement";
import TenantEvents from "@/components/tenants/TenantEvents";
import TenantProvisioning from "@/components/tenants/TenantProvisioning";
import TenantSettings from "@/components/tenants/TenantSettings";

type TenantDetails = {
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
    billing_email: string;
    notes?: string;
    created_at: string;
    updated_at?: string;
  };
  domains: Array<{
    id: string;
    domain: string;
    is_default: boolean;
    verified: boolean;
    created_at: string;
  }>;
  users: Array<{
    role: string;
    created_at: string;
    user: {
      id: string;
      email: string;
      raw_user_meta_data?: { name?: string };
    };
  }>;
  events: Array<{
    id: string;
    type: string;
    message: string;
    data?: any;
    created_at: string;
  }>;
};

export default function TenantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;

  const [details, setDetails] = useState<TenantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "overview" | "domains" | "users" | "provisioning" | "settings" | "events">("dashboard");

  useEffect(() => {
    loadDetails();
  }, [tenantId]);

  async function loadDetails() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/tenants/${tenantId}`);
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao carregar detalhes");
      }
      const data = await res.json();
      setDetails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
        </div>
      </PageContainer>
    );
  }

  if (error || !details) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle size={20} />
              <span>{error || "Tenant não encontrado"}</span>
            </div>
            <NButton onClick={() => router.push("/tenants")} className="mt-4">
              Voltar
            </NButton>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const { tenant, domains, users, events } = details;

  return (
    <PageContainer>
      {/* Header */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 mb-6 rounded-xl shadow-md"
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/tenants")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} className="text-[#D4AF37]" />
          </button>
          <Building2 size={28} className="text-[#D4AF37]" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">
              {tenant.name}
            </h1>
            <p className="text-sm text-gray-300">
              {tenant.slug}.noro.guru
            </p>
          </div>
          <NBadge
            variant={
              tenant.status === "active"
                ? "success"
                : tenant.status === "suspended"
                ? "warning"
                : "default"
            }
          >
            {tenant.status}
          </NBadge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "dashboard"
              ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={18} />
            <span>Painel</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            <span>Informações</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("domains")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "domains"
              ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe size={18} />
            <span>Domínios ({domains.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "users"
              ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>Usuários ({users.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("provisioning")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "provisioning"
              ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Database size={18} />
            <span>Provisionamento</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "settings"
              ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} />
            <span>Configurações</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "events"
              ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity size={18} />
            <span>Eventos</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "dashboard" && (
          <TenantStats tenantId={tenant.id} tenantSlug={tenant.slug} />
        )}
        {activeTab === "overview" && (
          <TenantOverview tenant={tenant} onUpdate={loadDetails} />
        )}
        {activeTab === "domains" && (
          <TenantDomains tenantId={tenant.id} domains={domains} onUpdate={loadDetails} />
        )}
        {activeTab === "users" && (
          <TenantUserManagement tenantId={tenant.id} users={users} onUpdate={loadDetails} />
        )}
        {activeTab === "provisioning" && (
          <TenantProvisioning
            tenantId={tenant.id}
            tenantSlug={tenant.slug}
            schemaProvisioned={false}
            onUpdate={loadDetails}
          />
        )}
        {activeTab === "settings" && (
          <TenantSettings tenantId={tenant.id} tenantName={tenant.name} />
        )}
        {activeTab === "events" && (
          <TenantEvents events={events} />
        )}
      </div>
    </PageContainer>
  );
}
