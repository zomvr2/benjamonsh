import { appwriteConfigured } from "@/lib/appwrite/config";
import { getBalance, listAllOffers, listRecentEvents } from "@/lib/benjapuntos/data";
import { listAppUsers } from "@/lib/benjapuntos/users";
import BenjapuntosManager from "@/components/admin/BenjapuntosManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Benjapuntos" };

export default async function AdminBenjapuntos() {
  if (!appwriteConfigured()) {
    return (
      <main className="wrap adm-main">
        <h1 className="adm-title">Benjapuntos.</h1>
        <div className="notice notice--error">
          Falta configurar Appwrite. Agrega estas variables de entorno y reinicia:
          <ul>
            <li><code>APPWRITE_PROJECT_ID</code>: el ID del proyecto en Appwrite.</li>
            <li><code>APPWRITE_API_KEY</code>: la API key del servidor (scopes: databases.read, databases.write, users.read).</li>
            <li><code>APPWRITE_DATABASE_ID</code>, <code>APPWRITE_OFFERS_COLLECTION_ID</code>, <code>APPWRITE_POINTS_EVENTS_COLLECTION_ID</code>.</li>
          </ul>
        </div>
      </main>
    );
  }

  let error: string | undefined;
  let users: Awaited<ReturnType<typeof listAppUsers>> = [];
  let balances: Record<string, number> = {};
  let offers: Awaited<ReturnType<typeof listAllOffers>> = [];
  let events: Awaited<ReturnType<typeof listRecentEvents>> = [];
  try {
    [users, offers, events] = await Promise.all([listAppUsers(), listAllOffers(), listRecentEvents({ limit: 20 })]);
    const pairs = await Promise.all(users.map(async (u) => [u.id, await getBalance(u.id)] as const));
    balances = Object.fromEntries(pairs);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="wrap adm-main">
      <h1 className="adm-title">Benjapuntos.</h1>
      {error ? (
        <div className="notice notice--error">{error}</div>
      ) : (
        <BenjapuntosManager users={users} balances={balances} initialOffers={offers} initialEvents={events} />
      )}
    </main>
  );
}
