"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, NButton, NInput, NBadge } from "@/components/ui";
import { Plus, Trash2, CheckCircle, X, AlertTriangle, Globe } from "lucide-react";

type Domain = {
  id: string;
  domain: string;
  is_default: boolean;
  verified: boolean;
  created_at: string;
};

interface TenantDomainsProps {
  tenantId: string;
  domains: Domain[];
  onUpdate: () => void;
}

export default function TenantDomains({ tenantId, domains, onUpdate }: TenantDomainsProps) {
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState("");

  const handleAdd = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenantId}/domains`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain, is_default: false }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao adicionar domínio");
      }

      setSuccess("Domínio adicionado com sucesso!");
      setNewDomain("");
      setAdding(false);
      setTimeout(() => {
        onUpdate();
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (domainId: string, domainName: string) => {
    if (!confirm(`Tem certeza que deseja remover o domínio ${domainName}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenantId}/domains?domainId=${domainId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao remover domínio");
      }

      setSuccess("Domínio removido com sucesso!");
      setTimeout(() => {
        onUpdate();
        setSuccess(null);
      }, 1500);
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Domínios</h2>
            {!adding && (
              <NButton onClick={() => setAdding(true)} variant="primary" leftIcon={<Plus size={16} />}>
                Adicionar Domínio
              </NButton>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {adding && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-[#D4AF37]">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Novo Domínio</h3>
              <div className="flex gap-2">
                <NInput
                  placeholder="exemplo.com.br"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <NButton onClick={handleAdd} variant="primary" disabled={loading || !newDomain}>
                  Adicionar
                </NButton>
                <NButton
                  onClick={() => {
                    setAdding(false);
                    setNewDomain("");
                  }}
                  variant="secondary"
                  disabled={loading}
                  leftIcon={<X size={16} />}
                >
                  Cancelar
                </NButton>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Após adicionar, você precisará configurar o DNS do domínio para apontar para o servidor.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#D4AF37] dark:hover:border-[#4aede5] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-[#D4AF37]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {domain.domain}
                      </span>
                      {domain.is_default && (
                        <NBadge variant="default">Padrão</NBadge>
                      )}
                      {domain.verified ? (
                        <NBadge variant="success">Verificado</NBadge>
                      ) : (
                        <NBadge variant="warning">Não Verificado</NBadge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Adicionado em {new Date(domain.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!domain.is_default && (
                    <NButton
                      onClick={() => handleDelete(domain.id, domain.domain)}
                      variant="destructive"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                      disabled={loading}
                    >
                      Remover
                    </NButton>
                  )}
                </div>
              </div>
            ))}

            {domains.length === 0 && (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                Nenhum domínio cadastrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
