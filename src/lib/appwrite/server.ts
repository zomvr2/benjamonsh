import { Client, Account, Databases, Users } from "node-appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } from "./config";

/** Cliente privilegiado (API key): para toda lectura/escritura de datos y para crear sesiones de login. */
export function createAdminClient() {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID!).setKey(APPWRITE_API_KEY!);
  return { client, account: new Account(client), databases: new Databases(client), users: new Users(client) };
}

/** Cliente acotado a una sesión: solo para verificar identidad (account.get()) o cerrar sesión. */
export function createSessionClient(secret: string) {
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID!).setSession(secret);
  return { client, account: new Account(client) };
}
