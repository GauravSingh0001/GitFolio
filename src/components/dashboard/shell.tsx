"use client";

import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCallback } from "react";
import {
  LayoutDashboard,
  FolderGit2,
  Eye,
  Settings,
  Rocket,
  LogOut,
  Zap,
  ChevronRight,
  PenSquare,
  Palette,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Cloud,
  CloudUpload,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import { useDeployConfig } from "@/hooks/use-deploy-config";
import type { PortfolioConfig } from "@/types/portfolio";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/editor", label: "Editor", icon: PenSquare },
  { href: "/dashboard/templates", label: "Templates", icon: Palette },
  { href: "/dashboard/projects", label: "Projects", icon: FolderGit2 },
  { href: "/dashboard/preview", label: "Preview", icon: Eye },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/deploy", label: "Deploy", icon: Rocket },
];

/** Compact status pill shown in the top bar */
function StatusBar({
  saveStatus,
  isDirty,
  lastSaved,
  deployStatus,
  deployConfig,
  lastDeployed,
}: {
  saveStatus: string;
  isDirty: boolean;
  lastSaved: Date | null;
  deployStatus: string;
  deployConfig: { autoDeployEnabled: boolean };
  lastDeployed: Date | null;
}) {
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center gap-4 text-xs">
      {/* Save status */}
      {saveStatus === "saving" && (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Saving…
        </span>
      )}
      {saveStatus === "saved" && (
        <span className="flex items-center gap-1.5 text-emerald-500">
          <CheckCircle2 className="w-3 h-3" />
          Saved
        </span>
      )}
      {saveStatus === "error" && (
        <span className="flex items-center gap-1.5 text-destructive">
          <AlertCircle className="w-3 h-3" />
          Save failed
        </span>
      )}
      {isDirty && saveStatus === "idle" && (
        <span className="flex items-center gap-1.5 text-amber-500">
          <Cloud className="w-3 h-3" />
          Unsaved
        </span>
      )}
      {!isDirty && saveStatus === "idle" && lastSaved && (
        <span className="text-muted-foreground/50">
          Saved {fmt(lastSaved)}
        </span>
      )}

      {/* Divider — only when deploy status is visible */}
      {(deployStatus !== "idle" || (deployConfig.autoDeployEnabled && lastDeployed)) && (
        <span className="text-border">|</span>
      )}

      {/* Deploy status */}
      {deployStatus === "deploying" && (
        <span className="flex items-center gap-1.5 text-blue-400">
          <CloudUpload className="w-3 h-3 animate-pulse" />
          Deploying…
        </span>
      )}
      {deployStatus === "success" && (
        <span className="flex items-center gap-1.5 text-emerald-500">
          <CloudUpload className="w-3 h-3" />
          Deployed!
        </span>
      )}
      {deployStatus === "error" && (
        <span className="flex items-center gap-1.5 text-destructive">
          <AlertCircle className="w-3 h-3" />
          Deploy failed
        </span>
      )}
      {deployConfig.autoDeployEnabled && lastDeployed && deployStatus === "idle" && (
        <span className="text-muted-foreground/50">
          Deployed {fmt(lastDeployed)}
        </span>
      )}

      {/* Auto-deploy badge */}
      {deployConfig.autoDeployEnabled && (
        <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-medium">
          <Zap className="w-2.5 h-2.5" />
          Auto-deploy ON
        </span>
      )}
    </div>
  );
}

export function DashboardShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Wire deploy hook first so we can pass triggerAutoDeploy as the save callback
  const {
    deployConfig,
    triggerAutoDeploy,
    deployStatus,
    lastDeployed,
  } = useDeployConfig();

  // Pass triggerAutoDeploy as onSaved → auto-deploys 3s after each successful save
  const onSaved = useCallback(
    (config: PortfolioConfig) => {
      triggerAutoDeploy(config);
    },
    [triggerAutoDeploy]
  );

  const { saveStatus, isDirty, lastSaved } = usePortfolioConfig(onSaved);

  return (
    <div className="flex h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-border/50 flex flex-col bg-card/30 shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-blue-500/25 transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">GitFolio</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            // Special badge for Deploy when auto-deploy is on
            const showBadge =
              item.href === "/dashboard/deploy" && deployConfig.autoDeployEnabled;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {showBadge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
                {isActive && (
                  <ChevronRight className="w-3 h-3 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={session.avatarUrl} />
              <AvatarFallback className="text-xs">
                {session.githubUsername?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.githubUsername}</p>
              <p className="text-xs text-muted-foreground">GitHub</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="h-10 border-b border-border/50 px-6 flex items-center justify-end bg-background/80 backdrop-blur-sm shrink-0">
          <StatusBar
            saveStatus={saveStatus}
            isDirty={isDirty}
            lastSaved={lastSaved}
            deployStatus={deployStatus}
            deployConfig={deployConfig}
            lastDeployed={lastDeployed}
          />
        </div>

        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
