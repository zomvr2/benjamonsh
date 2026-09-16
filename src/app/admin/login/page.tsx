import { redirect } from "next/navigation";
import { authConfigured, isAdmin } from "@/lib/admin/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  if (await isAdmin()) redirect(safeNext);
  return (
    <main className="login">
      <div className="login-art" aria-hidden="true">
        <span className="wink">;)</span>
        <h1>Escribe.<br />Publica.<br />Listo.</h1>
      </div>
      <div className="login-form">
        <span className="wordmark">benjamonsh <span className="wink">;)</span></span>
        <div className="strip" style={{ marginBottom: "1.5rem" }}><span>Panel del blog</span><span>Privado</span></div>
        {authConfigured() ? (
          <LoginForm next={safeNext} />
        ) : (
          <div className="notice notice--error">
            Falta configurar el acceso. Agrega estas variables de entorno y reinicia:
            <ul>
              <li><code>ADMIN_PASSWORD</code>: tu contraseña del panel.</li>
              <li><code>ADMIN_SECRET</code>: una cadena aleatoria larga para firmar la sesión.</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
