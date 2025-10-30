'use server';

import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/../../packages/lib/supabase/server';
import { InviteUserEmail } from '@/components/emails/InviteUserEmail';
import { CONTROL_PLANE_PERMISSIONS } from '@/../../packages/types/control-plane-users';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';
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
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  const { data: user } = await supabase
    .from('control_plane_users')
    .select('role, permissoes')
    .eq('id', session.user.id)
    .single();

  if (!user) return false;

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
  return user.permissoes.some((p: ControlPlanePermission) => p.id === permissionId);
}

export async function getControlPlaneUsers(): Promise<ControlPlaneUser[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('control_plane_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Erro ao buscar usuários');
  return data as ControlPlaneUser[];
}

export async function getUserActivities(userId?: string): Promise<UserActivity[]> {
  const supabase = await createServerSupabaseClient();
  const query = supabase
    .from('control_plane_user_activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (userId) {
    query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw new Error('Erro ao buscar atividades');
  return data as UserActivity[];
}

export async function updateUserRole(
  userId: string,
  newRole: ControlPlaneRole
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from('control_plane_users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;

    // Registrar atividade
    await supabase.from('control_plane_user_activities').insert({
      user_id: userId,
      tipo: 'usuario_alterado',
      descricao: `Role atualizada para ${newRole}`,
      metadata: { newRole }
    });

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
  }
}

export async function updateUserStatus(
  userId: string,
  newStatus: UserStatus
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from('control_plane_users')
      .update({ status: newStatus })
      .eq('id', userId);

    if (error) throw error;

    // Registrar atividade
    await supabase.from('control_plane_user_activities').insert({
      user_id: userId,
      tipo: 'usuario_alterado',
      descricao: `Status atualizado para ${newStatus}`,
      metadata: { newStatus }
    });

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
  }
}

export async function updateUserPermissions(
  userId: string,
  permissions: ControlPlanePermission[]
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from('control_plane_users')
      .update({ permissoes: permissions })
      .eq('id', userId);

    if (error) throw error;

    // Registrar atividade
    await supabase.from('control_plane_user_activities').insert({
      user_id: userId,
      tipo: 'permissao_alterada',
      descricao: `Permissões atualizadas`,
      metadata: { permissions }
    });

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
  }
}

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from('control_plane_users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

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
  }
}

export async function inviteUser(
  email: string,
  role: ControlPlaneRole = 'readonly'
): Promise<{ success: boolean; message: string }> {
  if (!await checkPermission('user:create')) {
    return { success: false, message: 'Sem permissão para convidar usuários' };
  }

  try {
    const supabase = await createServerSupabaseClient();
    
    // Gerar token de convite
    const inviteToken = nanoid(32);
    const inviteExpires = new Date();
    inviteExpires.setHours(inviteExpires.getHours() + 24);

    // Criar usuário pendente
    const { data: user, error: createError } = await supabase
      .from('control_plane_users')
      .insert({
        email,
        role,
        status: 'pendente',
        nome: null,
        two_factor_enabled: false,
        permissoes: [],
        metadata: {
          invite_token: inviteToken,
          invite_expires: inviteExpires.toISOString()
        }
      })
      .select()
      .single();

    if (createError) throw createError;

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
    await supabase.from('control_plane_user_activities').insert({
      user_id: user.id,
      tipo: 'usuario_criado',
      descricao: `Usuário convidado com role ${role}`,
      metadata: { email, role }
    });

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
  }
}