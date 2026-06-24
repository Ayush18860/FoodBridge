import { account, ID } from '@/lib/appwrite';

export async function signUp(name: string, email: string, password: string) {
  await account.create(ID.unique(), email, password, name);
  await account.createEmailPasswordSession(email, password);
  return account.get();
}

export async function signIn(email: string, password: string) {
  await account.createEmailPasswordSession(email, password);
  return account.get();
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function signOut() {
  try {
    await account.deleteSession('current');
  } catch {}
}