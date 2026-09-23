import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

/** Lista las cuentas de Appwrite (creadas a mano en la consola) para el selector del panel admin. */
export async function listAppUsers(): Promise<AppUser[]> {
  const { users } = createAdminClient();
  const page = await users.list([Query.limit(100)]);
  return page.users.map((u) => ({ id: u.$id, name: u.name || u.email, email: u.email }));
}
