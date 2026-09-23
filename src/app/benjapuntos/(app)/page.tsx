import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { getBalance, listActiveOffers, listRecentEvents } from "@/lib/benjapuntos/data";
import Dashboard from "@/components/benjapuntos/Dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mis puntos" };

export default async function BenjapuntosHome() {
  const user = await getLoggedInUser();
  if (!user) redirect("/benjapuntos/login");
  const [balance, offers, events] = await Promise.all([
    getBalance(user.$id),
    listActiveOffers(),
    listRecentEvents({ userId: user.$id, limit: 10 }),
  ]);
  return <Dashboard name={user.name} balance={balance} offers={offers} events={events} />;
}
