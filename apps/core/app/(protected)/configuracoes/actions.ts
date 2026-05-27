'use server';

const message = 'Ação legada desativada: não há collection Appwrite oficial para este recurso.';

export async function inviteUserAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updateUserRoleAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function deleteUserAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function saveSecretAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
