export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return null;
}

export async function signInWithEmailPassword(email: string, password: string): Promise<void> {
  void email;
  void password;
  throw new Error('Auth legado desativado. Logto será integrado na próxima fase.');
}

export async function signOut(): Promise<void> {
  return;
}

export async function createEmailPasswordAccount(
  email: string,
  password: string,
  name: string,
): Promise<AuthUser> {
  void email;
  void password;
  void name;
  throw new Error('Cadastro legado desativado. Logto será integrado na próxima fase.');
}
