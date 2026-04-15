"use client";

import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCallback } from "react";
import {
  LayoutDashboard,
  PenSquare,
  Rocket,
  LogOut,
  Zap,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Cloud,
  CloudUpload,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import { useDeployConfig } from "@/hooks/use-deploy-config";
import type { PortfolioConfig } from "@/types/portfolio";

/* ── Streamlined 3-step nav ─────────────────────────────────── */
const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Your stats at a glance",
  },
  {
    href: "/dashboard/editor",
    label: "Build",
    icon: PenSquare,
    description: "Edit content & template",
    badge: "Step 1",
  },
  {
    href: "/dashboard/launch",
    label: "Launch",
    icon: Rocket,
    description: "Preview & download site",
    badge: "Step 2",
  },
];

/* ── Status pill ─────────────────────────────────────────────── */
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
    <div className="flex items-center gap-4 text-[10px] font-label uppercase tracking-wider">
      {saveStatus === "saving" && (
        <span className="flex items-center gap-1.5 text-[#c1c6d7]">
          <Loader2 className="w-3 h-3 animate-spin" /> Saving…
        </span>
      )}
      {saveStatus === "saved" && (
        <span className="flex items-center gap-1.5 text-[#4edea3]">
          <CheckCircle2 className="w-3 h-3" /> Saved
        </span>
      )}
      {saveStatus === "error" && (
        <span className="flex items-center gap-1.5 text-[#ffb4ab]">
          <AlertCircle className="w-3 h-3" /> Save failed
        </span>
      )}
      {isDirty && saveStatus === "idle" && (
        <span className="flex items-center gap-1.5 text-amber-400">
          <Cloud className="w-3 h-3" /> Unsaved
        </span>
      )}
      {!isDirty && saveStatus === "idle" && lastSaved && (
        <span className="text-[#8b90a0]">Saved {fmt(lastSaved)}</span>
      )}

      {(deployStatus === "deploying" ||
        deployStatus === "success" ||
        deployStatus === "error") && (
        <span className="text-[#414754]">|</span>
      )}

      {deployStatus === "deploying" && (
        <span className="flex items-center gap-1.5 text-[#aec6ff]">
          <CloudUpload className="w-3 h-3 animate-pulse" /> Deploying…
        </span>
      )}
      {deployStatus === "success" && (
        <span className="flex items-center gap-1.5 text-[#4edea3]">
          <CloudUpload className="w-3 h-3" /> Deployed!
        </span>
      )}
      {deployStatus === "error" && (
        <span className="flex items-center gap-1.5 text-[#ffb4ab]">
          <AlertCircle className="w-3 h-3" /> Deploy failed
        </span>
      )}
      {deployConfig.autoDeployEnabled && lastDeployed && deployStatus === "idle" && (
        <span className="text-[#8b90a0]">Deployed {fmt(lastDeployed)}</span>
      )}
      {deployConfig.autoDeployEnabled && (
        <span className="flex items-center gap-1 bg-[#aec6ff]/10 text-[#aec6ff] border border-[#aec6ff]/20 px-2 py-0.5 rounded-full">
          <Zap className="w-2.5 h-2.5" /> Auto-deploy ON
        </span>
      )}
    </div>
  );
}

/* ── Main shell ──────────────────────────────────────────────── */
export function DashboardShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { deployConfig, triggerAutoDeploy, deployStatus, lastDeployed } =
    useDeployConfig();

  const onSaved = useCallback(
    (config: PortfolioConfig) => {
      triggerAutoDeploy(config);
    },
    [triggerAutoDeploy]
  );

  const { saveStatus, isDirty, lastSaved } = usePortfolioConfig(onSaved);

  const activeItem = navItems.find((n) =>
    n.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(n.href)
  );

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-[#e5e2e1] overflow-hidden">
      {/* ── Sidebar ───────────────────────────────── */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-[#414754]/15 bg-[#0e0e0e]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#414754]/15">
          <Link href="/">
            <div className="font-headline font-black text-lg tracking-tighter text-[#e5e2e1]">
              GitFolio Engine
            </div>
            <div className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mt-0.5">
              Developer Workspace
            </div>
          </Link>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {/* Workflow label */}
          <p className="font-label text-[9px] uppercase tracking-widest text-[#8b90a0]/60 px-3 mb-3">
            Workflow
          </p>

          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-[#1c1b1b] text-[#aec6ff]"
                    : "text-[#e5e2e1]/50 hover:bg-[#1c1b1b]/60 hover:text-[#e5e2e1]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-[#aec6ff]" : "group-hover:text-[#aec6ff]"
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[9px] font-label uppercase tracking-wider px-1.5 py-0.5 rounded-full border",
                      isActive
                        ? "text-[#aec6ff] border-[#aec6ff]/30 bg-[#aec6ff]/10"
                        : "text-[#8b90a0]/60 border-[#414754]/30"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-3 space-y-0.5 border-t border-[#414754]/15">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#e5e2e1]/40 hover:bg-[#1c1b1b]/60 hover:text-[#e5e2e1] transition-all group"
          >
            <BookOpen className="w-4 h-4 shrink-0 group-hover:text-[#aec6ff] transition-colors" />
            Docs
          </a>
        </div>

        {/* User */}
        <div className="px-3 pb-3 border-t border-[#414754]/15 pt-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c1b1b]/50 transition-colors">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarImage src={session.avatarUrl} />
              <AvatarFallback className="text-xs bg-[#2a2a2a] text-[#c1c6d7]">
                {session.githubUsername?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-[#e5e2e1]">
                {session.githubUsername}
              </p>
              <p className="text-[9px] font-label text-[#8b90a0] uppercase tracking-wider">
                GitHub
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign out"
              className="w-6 h-6 flex items-center justify-center rounded text-[#8b90a0] hover:text-[#ffb4ab] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="h-10 border-b border-[#414754]/15 px-6 flex items-center justify-between bg-[#131313]/80 backdrop-blur-sm shrink-0">
          <div className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
            {activeItem?.label ?? "Dashboard"}
          </div>
          <StatusBar
            saveStatus={saveStatus}
            isDirty={isDirty}
            lastSaved={lastSaved}
            deployStatus={deployStatus}
            deployConfig={deployConfig}
            lastDeployed={lastDeployed}
          />
        </div>

        {/* Page */}
        <main className="flex-1 overflow-auto scrollbar-thin">
          <div className="p-8 pb-12">{children}</div>
        </main>
      </div>

      {/* ── Global status bar ─────────────────────── */}
      <div className="status-bar">
        <div className="flex items-center gap-1.5 text-[#4edea3] font-label uppercase text-[10px] tracking-widest">
          <Zap className="w-3 h-3" />
          API Limit: 4982/5000
        </div>
        <div className="flex items-center gap-1.5 text-[#e5e2e1]/30 font-label uppercase text-[10px] tracking-widest">
          <span>↺</span>
          Sync: Operational
        </div>
      </div>
    </div>
  );
}
