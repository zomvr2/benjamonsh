import { getStorage } from "@/lib/admin/storage";

export interface PanelEnv {
  mode: "github" | "local" | "error";
  label: string;
  repoUrl?: string;
  deployHook: boolean;
  cron: boolean;
  error?: string;
}

export function panelEnv(): PanelEnv {
  const deployHook = Boolean(process.env.VERCEL_DEPLOY_HOOK_URL);
  const cron = Boolean(process.env.CRON_SECRET);
  try {
    const s = getStorage();
    const repo = process.env.GITHUB_REPO || "zomvr2/benjamonsh";
    return { mode: s.mode, label: s.label, repoUrl: s.mode === "github" ? `https://github.com/${repo}` : undefined, deployHook, cron };
  } catch (e) {
    return { mode: "error", label: "Sin configurar", deployHook, cron, error: e instanceof Error ? e.message : String(e) };
  }
}
