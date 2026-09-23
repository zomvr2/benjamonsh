import { redirect } from "next/navigation";
import { appwriteConfigured } from "@/lib/appwrite/config";
import { getLoggedInUser } from "@/lib/appwrite/session";
import LoginForm from "@/components/benjapuntos/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar" };

export default async function BenjapuntosLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/benjapuntos") && !next.startsWith("//") ? next : "/benjapuntos";
  if (await getLoggedInUser()) redirect(safeNext);
  return (
    <main className="bp-login">
      <div className="bp-login-card">
        <span className="wordmark">benjapuntos <span className="wink">;)</span></span>
        <div className="strip" style={{ marginBottom: "1.5rem" }}><span>Tus puntos</span><span>Privado</span></div>
        {appwriteConfigured() ? (
          <LoginForm next={safeNext} />
        ) : (
          <div className="notice notice--error">
            Falta configurar el acceso. Agrega estas variables de entorno y reinicia:
            <ul>
              <li><code>APPWRITE_PROJECT_ID</code>: el ID del proyecto en Appwrite.</li>
              <li><code>APPWRITE_API_KEY</code>: la API key del servidor.</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
