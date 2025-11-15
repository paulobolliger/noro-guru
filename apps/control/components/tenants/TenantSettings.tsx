"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, NButton, NInput, NBadge } from "@/components/ui";
import { Settings, CheckCircle, AlertTriangle, Save } from "lucide-react";

interface TenantSettingsProps {
  tenantId: string;
  tenantName: string;
}

type Settings = {
  max_users?: number;
  max_clients?: number;
  max_storage_mb?: number;
  features_enabled?: {
    ai_generation?: boolean;
    email_notifications?: boolean;
    whatsapp_integration?: boolean;
    payments?: boolean;
  };
  custom_branding?: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
};

export default function TenantSettings({ tenantId, tenantName }: TenantSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    max_users: 10,
    max_clients: 1000,
    max_storage_mb: 1024,
    features_enabled: {
      ai_generation: true,
      email_notifications: true,
      whatsapp_integration: false,
      payments: true,
    },
    custom_branding: {
      logo_url: "",
      primary_color: "#D4AF37",
      secondary_color: "#4aede5",
    },
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenantId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao salvar configurações");
      }

      setSuccess("Configurações salvas com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* Limites */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-[#D4AF37]" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Limites e Quotas
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Defina limites de uso para este tenant
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Máximo de Usuários
              </label>
              <NInput
                type="number"
                value={settings.max_users}
                onChange={(e) => setSettings({ ...settings, max_users: Number(e.target.value) })}
                min={1}
                disabled={loading}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Número máximo de usuários permitidos
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Máximo de Clientes
              </label>
              <NInput
                type="number"
                value={settings.max_clients}
                onChange={(e) => setSettings({ ...settings, max_clients: Number(e.target.value) })}
                min={1}
                disabled={loading}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Número máximo de clientes cadastrados
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Armazenamento (MB)
              </label>
              <NInput
                type="number"
                value={settings.max_storage_mb}
                onChange={(e) => setSettings({ ...settings, max_storage_mb: Number(e.target.value) })}
                min={100}
                step={100}
                disabled={loading}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Espaço máximo para arquivos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Funcionalidades Habilitadas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Controle quais recursos o tenant pode utilizar
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { key: "ai_generation", label: "Geração de Conteúdo com IA", description: "Roteiros e artigos gerados por GPT" },
              { key: "email_notifications", label: "Notificações por Email", description: "Envio de emails transacionais" },
              { key: "whatsapp_integration", label: "Integração WhatsApp", description: "Envio de mensagens via WhatsApp" },
              { key: "payments", label: "Processamento de Pagamentos", description: "PIX, cartão de crédito via Stripe" },
            ].map((feature) => (
              <div
                key={feature.key}
                className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {feature.label}
                    </p>
                    <NBadge variant={settings.features_enabled?.[feature.key as keyof typeof settings.features_enabled] ? "success" : "warning"}>
                      {settings.features_enabled?.[feature.key as keyof typeof settings.features_enabled] ? "Ativo" : "Inativo"}
                    </NBadge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.features_enabled?.[feature.key as keyof typeof settings.features_enabled] || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        features_enabled: {
                          ...settings.features_enabled,
                          [feature.key]: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4aede5]/30 dark:peer-focus:ring-[#4aede5]/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4aede5]"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Personalização Visual
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Customize a aparência da aplicação do tenant
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL do Logo
              </label>
              <NInput
                placeholder="https://exemplo.com/logo.png"
                value={settings.custom_branding?.logo_url || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    custom_branding: {
                      ...settings.custom_branding,
                      logo_url: e.target.value,
                    },
                  })
                }
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Primária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.custom_branding?.primary_color || "#D4AF37"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      custom_branding: {
                        ...settings.custom_branding,
                        primary_color: e.target.value,
                      },
                    })
                  }
                  className="h-10 w-20 rounded border-2 border-gray-300 dark:border-gray-600"
                  disabled={loading}
                />
                <NInput
                  value={settings.custom_branding?.primary_color || "#D4AF37"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      custom_branding: {
                        ...settings.custom_branding,
                        primary_color: e.target.value,
                      },
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.custom_branding?.secondary_color || "#4aede5"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      custom_branding: {
                        ...settings.custom_branding,
                        secondary_color: e.target.value,
                      },
                    })
                  }
                  className="h-10 w-20 rounded border-2 border-gray-300 dark:border-gray-600"
                  disabled={loading}
                />
                <NInput
                  value={settings.custom_branding?.secondary_color || "#4aede5"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      custom_branding: {
                        ...settings.custom_branding,
                        secondary_color: e.target.value,
                      },
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salvar */}
      <div className="flex justify-end">
        <NButton
          onClick={handleSave}
          variant="primary"
          leftIcon={<Save size={16} />}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Configurações"}
        </NButton>
      </div>
    </div>
  );
}
