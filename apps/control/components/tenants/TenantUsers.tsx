"use client";
import { Card, CardHeader, CardContent, NBadge } from "@/components/ui";
import { User, Mail, Calendar } from "lucide-react";

type TenantUser = {
  role: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    raw_user_meta_data?: { name?: string };
  };
};

interface TenantUsersProps {
  tenantId: string;
  users: TenantUser[];
  onUpdate: () => void;
}

export default function TenantUsers({ tenantId, users, onUpdate }: TenantUsersProps) {
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
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Usuários</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Usuários com acesso a este tenant
        </p>
      </CardHeader>
      <CardContent>
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
  );
}
