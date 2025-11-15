"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, NButton, NInput, NSelect, NBadge } from "@/components/ui";
import { User, Mail, Calendar, Plus, Trash2, CheckCircle, AlertTriangle, X } from "lucide-react";

type TenantUser = {
  role: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    raw_user_meta_data?: { name?: string };
  };
};

interface TenantUserManagementProps {
  tenantId: string;
  users: TenantUser[];
  onUpdate: () => void;
}

export default function TenantUserManagement({ tenantId, users, onUpdate }: TenantUserManagementProps) {
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "user" as "user" | "admin" | "super_admin",
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenantId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao adicionar usuário");
      }

      setSuccess("Usuário adicionado com sucesso!");
      setFormData({ email: "", name: "", role: "user" });
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

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja remover o acesso de ${userEmail} a este tenant?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/admin/tenants/${tenantId}/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao remover usuário");
      }

      setSuccess("Usuário removido com sucesso!");
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "error";
      case "admin":
        return "success";
      case "user":
        return "info";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "user":
        return "Usuário";
      default:
        return role;
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
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Usuários</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gerenciar usuários com acesso a este tenant
              </p>
            </div>
            {!adding && (
              <NButton onClick={() => setAdding(true)} variant="primary" leftIcon={<Plus size={16} />}>
                Adicionar Usuário
              </NButton>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Formulário de Adicionar */}
          {adding && (
            <form onSubmit={handleAddUser} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-[#D4AF37]">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Novo Usuário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <NInput
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome *
                  </label>
                  <NInput
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Função
                  </label>
                  <NSelect
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    disabled={loading}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </NSelect>
                </div>
              </div>
              <div className="flex gap-2">
                <NButton type="submit" variant="primary" disabled={loading}>
                  {loading ? "Adicionando..." : "Adicionar"}
                </NButton>
                <NButton
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setFormData({ email: "", name: "", role: "user" });
                  }}
                  variant="secondary"
                  disabled={loading}
                  leftIcon={<X size={16} />}
                >
                  Cancelar
                </NButton>
              </div>
            </form>
          )}

          {/* Lista de Usuários */}
          <div className="space-y-3">
            {users.map((userRole, index) => (
              <div
                key={`${userRole.user.id}-${index}`}
                className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#D4AF37] dark:hover:border-[#4aede5] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#4aede5] flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {userRole.user.raw_user_meta_data?.name || "Sem nome"}
                      </span>
                      <NBadge variant={getRoleBadgeVariant(userRole.role)}>
                        {getRoleLabel(userRole.role)}
                      </NBadge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Mail size={14} />
                        <span>{userRole.user.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={14} />
                        <span>
                          Adicionado em {new Date(userRole.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <NButton
                  onClick={() => handleRemoveUser(userRole.user.id, userRole.user.email)}
                  variant="destructive"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  disabled={loading}
                >
                  Remover
                </NButton>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                Nenhum usuário associado a este tenant
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
