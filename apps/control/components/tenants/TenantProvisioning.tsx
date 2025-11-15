"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, NButton } from "@/components/ui";
import { Database, CheckCircle, AlertTriangle, Loader, Trash2 } from "lucide-react";

interface TenantProvisioningProps {
  tenantId: string;
  tenantSlug: string;
  schemaProvisioned: boolean;
  onUpdate: () => void;
}

export default function TenantProvisioning({
  tenantId,
  tenantSlug,
  schemaProvisioned,
  onUpdate,
}: TenantProvisioningProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleProvision = async () => {
    if (!confirm(`Tem certeza que deseja provisionar o schema para o tenant "${tenantSlug}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenantId}/provision`, {
        method: "POST",
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao provisionar schema");
      }

      setSuccess("Schema provisionado com sucesso!");
      setTimeout(() => {
        onUpdate();
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeprovision = async () => {
    if (
      !confirm(
        `⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nTem CERTEZA que deseja remover o schema "${tenantSlug}"?\n\nTODOS OS DADOS SERÃO PERDIDOS!`
      )
    ) {
      return;
    }

    const confirmation = prompt(
      `Para confirmar, digite o slug do tenant: "${tenantSlug}"`
    );

    if (confirmation !== tenantSlug) {
      alert("Slug incorreto. Operação cancelada.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenantId}/provision`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao remover schema");
      }

      setSuccess("Schema removido com sucesso!");
      setTimeout(() => {
        onUpdate();
        setSuccess(null);
      }, 2000);
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database size={24} className="text-[#D4AF37]" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Provisionamento de Schema
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gerenciar schema dedicado do tenant no banco de dados
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Atual */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {schemaProvisioned ? (
                    <>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Schema Provisionado
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Nome: <code className="font-mono">tenant_{tenantSlug}</code>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <AlertTriangle size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Schema Não Provisionado
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          O schema dedicado ainda não foi criado
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              {!schemaProvisioned ? (
                <>
                  <NButton
                    onClick={handleProvision}
                    variant="primary"
                    disabled={loading}
                    leftIcon={loading ? <Loader size={16} className="animate-spin" /> : <Database size={16} />}
                    className="w-full"
                  >
                    {loading ? "Provisionando..." : "Provisionar Schema"}
                  </NButton>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>O que será criado:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                      <li>Schema dedicado: <code>tenant_{tenantSlug}</code></li>
                      <li>Todas as tabelas do core (clientes, pedidos, orçamentos, etc.)</li>
                      <li>Políticas RLS configuradas</li>
                      <li>Dados iniciais de configuração</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      <strong>Schema ativo e operacional</strong>
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      O tenant pode acessar e utilizar todas as funcionalidades do sistema.
                    </p>
                  </div>

                  {/* Zona de Perigo */}
                  <div className="mt-6 pt-6 border-t-2 border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
                      ⚠️ Zona de Perigo
                    </h3>
                    <NButton
                      onClick={handleDeprovision}
                      variant="destructive"
                      disabled={loading}
                      leftIcon={<Trash2 size={16} />}
                      className="w-full"
                    >
                      Remover Schema (Irreversível)
                    </NButton>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      Esta ação removerá permanentemente todo o schema e dados do tenant.
                      Não há como desfazer!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
