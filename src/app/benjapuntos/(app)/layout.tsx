import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/appwrite/session";
import BenjapuntosNav from "@/components/benjapuntos/BenjapuntosNav";

export const dynamic = "force-dynamic";

export default async function BenjapuntosAppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getLoggedInUser();
  if (!user) redirect("/benjapuntos/login");
  return (
    <div className="bp">
      <header className="bp-head">
        <div className="wrap" style={{ maxWidth: "none" }}>
          <span className="wordmark">benjapuntos <span className="wink">;)</span></span>
          <BenjapuntosNav />
        </div>
      </header>
      <main className="bp-main">{children}</main>
    </div>
  );
}
