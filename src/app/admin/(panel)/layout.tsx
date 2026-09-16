import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="adm">
      <header className="adm-head">
        <div className="wrap" style={{ maxWidth: "none" }}>
          <Link className="wordmark" href="/admin">benjamonsh <span className="wink">;)</span></Link>
          <span className="tagline">Panel</span>
          <AdminNav />
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
