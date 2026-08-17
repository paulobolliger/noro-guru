'use server';

import { Resend } from 'resend';
import { createDatabaseClient } from '@noro/db';
import { InviteUserEmail } from '@/components/emails/InviteUserEmail';
import { CONTROL_PLANE_PERMISSIONS } from '@/../../packages/types/control-plane-users';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';
import { getServerSession, getSessionClaims } from '@/lib/session';
import type { 
  ControlPlaneUser, 
  ControlPlaneRole, 
  UserStatus, 
  UserActivity, 
  ControlPlanePermission 
} from '@/../../packages/types/control-plane-users';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper para verificar permissões
async function checkPermission(permissionId: string): Promise<boolean> {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;
  
  if (!userId) {
    redirect('/login');
  }

  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT role, permissoes 
      FROM platform.users
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) return false;
    const user = rows[0];

    // Super admin tem todas as permissões
    if (user.role === 'super_admin') return true;

    // Verificar permissão específica
    const permission = CONTROL_PLANE_PERMISSIONS.find(p => p.id === permissionId);
    if (!permission) return false;

    // Verificar se a role do usuário tem acesso a esta permissão
    if (permission.requer_role && !permission.requer_role.includes(user.role)) {
      return false;
    }

    // Verificar se o usuário tem a permissão específica
    const userPerms = Array.isArray(user.permissoes) ? user.permissoes : [];
    return userPerms.some((p: ControlPlanePermission) => p.id === permissionId);
  } finally {
    await close();
  }
}

export async function getControlPlaneUsers(): Promise<ControlPlaneUser[]> {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT * 
      FROM platform.users
      ORDER BY created_at DESC
    `;
    return rows as unknown as ControlPlaneUser[];
  } finally {
    await close();
  }
}

export async function getUserActivities(userId?: string): Promise<UserActivity[]> {
  const { client, close } = createDatabaseClient();
  try {
    let rows;
    if (userId) {
      rows = await client`
        SELECT * 
        FROM platform.user_activities
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 100
      `;
    } else {
      rows = await client`
        SELECT * 
        FROM platform.user_activities
        ORDER BY created_at DESC
        LIMIT 100
      `;
    }
    return rows as unknown as UserActivity[];
  } finally {
    await close();
  }
}

export async function updateUserRole(
  userId: string,
  newRole: ControlPlaneRole
): Promise<{ success: boolean; message: string }> {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE platform.users
      SET role = ${newRole}
      WHERE id = ${userId}
    `;

    // Registrar atividade
    await client`
      INSERT INTO platform.user_activities (user_id, tipo, descricao, metadata)
      VALUES (${userId}, 'usuario_alterado', ${`Role atualizada para ${newRole}`}, ${client.json({ newRole })})
    `;

    return {
      success: true,
      message: 'Role atualizada com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao atualizar role:', error);
    return {
      success: false,
      message: error.message || 'Erro ao atualizar role'
    };
  } finally {
    await close();
  }
}

export async function updateUserStatus(
  userId: string,
  newStatus: UserStatus
): Promise<{ success: boolean; message: string }> {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE platform.users
      SET status = ${newStatus}
      WHERE id = ${userId}
    `;

    // Registrar atividade
    await client`
      INSERT INTO platform.user_activities (user_id, tipo, descricao, metadata)
      VALUES (${userId}, 'usuario_alterado', ${`Status atualizado para ${newStatus}`}, ${client.json({ newStatus })})
    `;

    return {
      success: true,
      message: 'Status atualizado com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);
    return {
      success: false,
      message: error.message || 'Erro ao atualizar status'
    };
  } finally {
    await close();
  }
}

export async function updateUserPermissions(
  userId: string,
  permissions: ControlPlanePermission[]
): Promise<{ success: boolean; message: string }> {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE platform.users
      SET permissoes = ${client.json(permissions as any)}
      WHERE id = ${userId}
    `;

    // Registrar atividade
    await client`
      INSERT INTO platform.user_activities (user_id, tipo, descricao, metadata)
      VALUES (${userId}, 'permissao_alterada', 'Permissões atualizadas', ${client.json({ permissions } as any)})
    `;

    return {
      success: true,
      message: 'Permissões atualizadas com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao atualizar permissões:', error);
    return {
      success: false,
      message: error.message || 'Erro ao atualizar permissões'
    };
  } finally {
    await close();
  }
}

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; message: string }> {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      DELETE FROM platform.users
      WHERE id = ${userId}
    `;

    return {
      success: true,
      message: 'Usuário removido com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao remover usuário:', error);
    return {
      success: false,
      message: error.message || 'Erro ao remover usuário'
    };
  } finally {
    await close();
  }
}

export async function inviteUser(
  email: string,
  role: ControlPlaneRole = 'readonly'
): Promise<{ success: boolean; message: string }> {
  if (!await checkPermission('user:create')) {
    return { success: false, message: 'Sem permissão para convidar usuários' };
  }

  const { client, close } = createDatabaseClient();
  try {
    // Gerar token de convite
    const inviteToken = nanoid(32);
    const inviteExpires = new Date();
    inviteExpires.setHours(inviteExpires.getHours() + 24);

    // Criar usuário pendente
    const rows = await client`
      INSERT INTO platform.users (email, role, status, nome, two_factor_enabled, permissoes, metadata)
      VALUES (${email}, ${role}, 'pendente', NULL, FALSE, ${client.json([])}, ${client.json({ invite_token: inviteToken, invite_expires: inviteExpires.toISOString() })})
      RETURNING *
    `;

    if (!rows || rows.length === 0) throw new Error('Falha ao criar usuário pendente');
    const user = rows[0];

    // Construir link de convite
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/convite?token=${inviteToken}`;

    // Enviar email
    await resend.emails.send({
      from: 'Control Plane <noreply@noroguru.com>',
      to: email,
      subject: 'Convite para o Control Plane da Noro Guru',
      react: InviteUserEmail({
        userEmail: email,
        inviteToken,
        inviteLink,
        role: role.replace('_', ' ').toUpperCase()
      }) as React.ReactElement
    });

    // Registrar atividade
    await client`
      INSERT INTO platform.user_activities (user_id, tipo, descricao, metadata)
      VALUES (${user.id}, 'usuario_criado', ${`Usuário convidado com role ${role}`}, ${client.json({ email, role })})
    `;

    return {
      success: true,
      message: 'Convite enviado com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao enviar convite:', error);
    return {
      success: false,
      message: error.message || 'Erro ao enviar convite'
    };
  } finally {
    await close();
  }
}