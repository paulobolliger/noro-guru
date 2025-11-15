"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, NButton, NInput, NTextarea, NSelect } from "@/components/ui";
import { Edit2, Save, X, AlertTriangle, CheckCircle } from "lucide-react";

type Tenant = {
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

interface TenantOverviewProps {
  tenant: Tenant;
  onUpdate: () => void;
}

export default function TenantOverview({ tenant, onUpdate }: TenantOverviewProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: tenant.name,
    plan: tenant.plan,
    billing_email: tenant.billing_email,
    notes: tenant.notes || "",
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao atualizar");
      }

      setSuccess("Tenant atualizado com sucesso!");
      setEditing(false);
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

  const handleSuspend = async (suspend: boolean) => {
    if (!confirm(`Tem certeza que deseja ${suspend ? "suspender" : "reativar"} este tenant?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenant.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspend }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao atualizar status");
      }

      setSuccess(suspend ? "Tenant suspenso com sucesso!" : "Tenant reativado com sucesso!");
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Informações do Tenant</h2>
            {!editing ? (
              <NButton onClick={() => setEditing(true)} variant="secondary" leftIcon={<Edit2 size={16} />}>
                Editar
              </NButton>
            ) : (
              <div className="flex gap-2">
                <NButton
                  onClick={handleSave}
                  variant="primary"
                  leftIcon={<Save size={16} />}
                  disabled={loading}
                >
                  Salvar
                </NButton>
                <NButton
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: tenant.name,
                      plan: tenant.plan,
                      billing_email: tenant.billing_email,
                      notes: tenant.notes || "",
                    });
                  }}
                  variant="secondary"
                  leftIcon={<X size={16} />}
                  disabled={loading}
                >
                  Cancelar
                </NButton>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome
              </label>
              {editing ? (
                <NInput
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{tenant.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug
              </label>
              <p className="text-gray-900 dark:text-white">{tenant.slug}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plano
              </label>
              {editing ? (
                <NSelect
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  disabled={loading}
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </NSelect>
              ) : (
                <p className="text-gray-900 dark:text-white capitalize">{tenant.plan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email de Cobrança
              </label>
              {editing ? (
                <NInput
                  type="email"
                  value={formData.billing_email}
                  onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                  disabled={loading}
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{tenant.billing_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Criado em
              </label>
              <p className="text-gray-900 dark:text-white">
                {new Date(tenant.created_at).toLocaleString()}
              </p>
            </div>

            {tenant.updated_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Atualizado em
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(tenant.updated_at).toLocaleString()}
                </p>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas
              </label>
              {editing ? (
                <NTextarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  disabled={loading}
                />
              ) : (
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {tenant.notes || "Nenhuma nota"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suspend/Activate */}
      {!editing && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ações</h2>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {tenant.status === "active" ? (
                <NButton
                  onClick={() => handleSuspend(true)}
                  variant="destructive"
                  disabled={loading}
                  leftIcon={<AlertTriangle size={16} />}
                >
                  Suspender Tenant
                </NButton>
              ) : (
                <NButton
                  onClick={() => handleSuspend(false)}
                  variant="primary"
                  disabled={loading}
                  leftIcon={<CheckCircle size={16} />}
                >
                  Reativar Tenant
                </NButton>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {tenant.status === "active"
                ? "Suspender o tenant impedirá o acesso de todos os usuários."
                : "Reativar o tenant permitirá o acesso novamente."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
