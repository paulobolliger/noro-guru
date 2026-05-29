'use server';

const message = 'Ação legada desativada: o modelo de dados legado deste recurso foi desativado.';

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
