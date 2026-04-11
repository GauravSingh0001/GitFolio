"use client";

import { useState, useEffect } from "react";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import { useDeployConfig } from "@/hooks/use-deploy-config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Download,
  Rocket,
  CheckCircle2,
  ExternalLink,
  Copy,
  Loader2,
  AlertCircle,
  Key,
  ShieldCheck,
  ShieldX,
  ChevronDown,
  ChevronUp,
  Zap,
  GitBranch,
  RefreshCw,
  Settings2,
  History,
} from "lucide-react";
import { TEMPLATE_DEFINITIONS } from "@/types/portfolio";

type ScopeStatus = "checking" | "ok" | "missing" | "error";

export default function DeployPage() {
  const { config, isReady } = usePortfolioConfig();
  const {
    deployConfig,
    updateDeployConfig,
    deploy,
    deployStatus,
    lastDeployed,
    lastResult,
    deployError,
    isConfigured,
  } = useDeployConfig();

  // ── Local form state ──
  const [patInput, setPatInput] = useState(deployConfig.pat);
  const [showPat, setShowPat] = useState(false);
  const [showPatHelp, setShowPatHelp] = useState(false);
  const [repoInput, setRepoInput] = useState(deployConfig.repoName);
  const [scopeStatus, setScopeStatus] = useState<ScopeStatus>("checking");
  const [scopes, setScopes] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);

  const activeTmpl = TEMPLATE_DEFINITIONS.find(
    (t) => t.id === config?.settings?.activeTemplate
  );

  // ── Scope check ──
  useEffect(() => {
    if (isConfigured) {
      setScopeStatus("ok");
      return;
    }
    setScopeStatus("checking");
    fetch("/api/github/check-scope")
      .then((r) => r.json())
      .then((d: { hasRepo?: boolean; scopes?: string[]; error?: string }) => {
        if (d.error) { setScopeStatus("error"); return; }
        setScopes(d.scopes ?? []);
        setScopeStatus(d.hasRepo ? "ok" : "missing");
      })
      .catch(() => setScopeStatus("error"));
  }, [isConfigured]);

  // ── Save PAT + repo ──
  const handleSaveConfig = () => {
    const trimmedPat = patInput.trim();
    const trimmedRepo = repoInput.trim() || "portfolio";
    updateDeployConfig({ pat: trimmedPat, repoName: trimmedRepo });
    if (trimmedPat) setScopeStatus("ok");
  };

  const handleClearPat = () => {
    setPatInput("");
    updateDeployConfig({ pat: "", autoDeployEnabled: false });
    setScopeStatus("checking");
  };

  // ── Manual Deploy Now ──
  const handleDeployNow = async () => {
    if (!config) return;
    // Ensure latest repo name is saved before deploying
    updateDeployConfig({ repoName: repoInput.trim() || "portfolio" });
    await deploy(config);
  };

  // ── Download ZIP ──
  const handleDownload = async () => {
    if (!config) return;
    setDownloading(true);
    setDlError(null);
    try {
      const genRes = await fetch("/api/portfolio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const genResult = await genRes.json();
      if (!genRes.ok) throw new Error(genResult.error || "Generation failed");

      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const file of genResult.files as { path: string; content: string }[]) {
        zip.file(file.path, file.content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(config.profile.displayName || "portfolio")
        .replace(/\s+/g, "-")
        .toLowerCase()}-portfolio.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDlError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="space-y-4 max-w-3xl animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-48 bg-muted rounded-xl" />
        <div className="h-48 bg-muted rounded-xl" />
      </div>
    );
  }

  const canDeploy = isConfigured && config;
  const isDeploying = deployStatus === "deploying";

  return (
    <div className="space-y-7 max-w-3xl">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Deploy
            {deployConfig.autoDeployEnabled && (
              <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1">
                <Zap className="w-3 h-3" />
                Auto-deploy ON
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Publishing with{" "}
            <span className="font-semibold" style={{ color: activeTmpl?.accentColor }}>
              {activeTmpl?.name ?? config?.settings?.activeTemplate}
            </span>{" "}
            template.
          </p>
        </div>
        {lastDeployed && (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0 mt-1">
            <History className="w-3.5 h-3.5" />
            Last deployed:{" "}
            {lastDeployed.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {/* ── Success banner ── */}
      {deployStatus === "success" && lastResult && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="pt-5 pb-5 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="font-bold text-emerald-500">Deployed successfully! 🚀</p>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground w-20">Repository:</span>
                <a
                  href={lastResult.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  {lastResult.repoUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {lastResult.branch && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20">Branch:</span>
                  <code className="flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded font-mono">
                    <GitBranch className="w-3 h-3" />
                    {lastResult.branch}
                  </code>
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground w-20">Live URL:</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                  {lastResult.pagesUrl}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => navigator.clipboard.writeText(lastResult.pagesUrl)}
                  title="Copy URL"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">
                Enable GitHub Pages (one-time):
              </p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>
                  Open repo → <strong>Settings → Pages</strong>
                </li>
                <li>
                  Source: <strong>Deploy from a branch</strong> →{" "}
                  <strong>{lastResult.branch ?? "main"}</strong> →{" "}
                  <strong>/ (root)</strong> → <strong>Save</strong>
                </li>
                <li>
                  Wait ~60s then visit{" "}
                  <a
                    href={lastResult.pagesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {lastResult.pagesUrl}
                  </a>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Error banner ── */}
      {(deployStatus === "error" || dlError) && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-destructive text-sm mb-1">
                {dlError ? "Download failed" : "Deploy failed"}
              </p>
              <p className="text-sm text-destructive/80 font-mono break-words leading-relaxed">
                {dlError ?? deployError}
              </p>
              {(deployError?.includes("403") || deployError?.includes("scope")) && (
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Make sure your PAT has the{" "}
                  <code className="bg-muted px-1 rounded">repo</code> scope.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── SETUP: PAT + Repo + Automation ── */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings2 className="w-4 h-4" />
            Deployment Configuration
          </CardTitle>
          <CardDescription className="text-xs">
            Set up once — then deploy with one click or automatically on every save.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission status */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
            {isConfigured ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : scopeStatus === "ok" ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : scopeStatus === "checking" ? (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />
            ) : (
              <ShieldX className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <div className="flex-1 text-xs">
              {isConfigured ? (
                <span className="text-emerald-500 font-medium">
                  Personal Access Token active — push ready ✓
                </span>
              ) : scopeStatus === "ok" ? (
                <span className="text-emerald-500 font-medium">
                  OAuth token has repo scope ✓{" "}
                  <span className="text-muted-foreground font-normal">
                    ({scopes.join(", ")})
                  </span>
                </span>
              ) : scopeStatus === "checking" ? (
                <span className="text-muted-foreground">
                  Checking GitHub permissions…
                </span>
              ) : (
                <span className="text-amber-500 font-medium">
                  OAuth token missing <code className="bg-muted px-1 rounded">repo</code> scope — add a PAT below.
                </span>
              )}
            </div>
          </div>

          {/* Repo name */}
          <div className="space-y-1.5">
            <Label htmlFor="repoName" className="text-sm">
              Repository Name
            </Label>
            <Input
              id="repoName"
              value={repoInput}
              onChange={(e) =>
                setRepoInput(e.target.value.replace(/\s+/g, "-").toLowerCase())
              }
              placeholder="portfolio"
              className="max-w-xs font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Pushes to{" "}
              <code className="bg-muted px-1 rounded">
                github.com/&lt;you&gt;/{repoInput || "portfolio"}
              </code>
            </p>
          </div>

          {/* PAT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Personal Access Token
              </Label>
              <button
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                onClick={() => setShowPatHelp(!showPatHelp)}
                type="button"
              >
                How to create one
                {showPatHelp ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>

            {showPatHelp && (
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground border border-border/50 space-y-1.5">
                <p className="font-semibold text-foreground">
                  Create a GitHub PAT in 30 seconds:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Open{" "}
                    <a
                      href="https://github.com/settings/tokens/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      github.com/settings/tokens/new ↗
                    </a>
                  </li>
                  <li>
                    Note: <code className="bg-muted px-1 rounded">GitFolio Deploy</code>
                  </li>
                  <li>
                    Expiration: <strong>90 days</strong>
                  </li>
                  <li>
                    ✅ Check the <code className="bg-muted font-mono px-1 rounded">repo</code> scope
                  </li>
                  <li>
                    Click <strong>Generate token</strong> → paste below
                  </li>
                </ol>
                <p className="text-amber-500/80 text-[11px] mt-1">
                  ⚠️ Token is stored in your browser only — never sent to GitFolio servers.
                </p>
              </div>
            )}

            {deployConfig.pat ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 border border-border/50 rounded-md px-3 py-2 text-xs font-mono text-muted-foreground">
                  ghp_••••••••••••••••••••••••••••••••••••
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs gap-1.5 text-destructive hover:text-destructive"
                  onClick={handleClearPat}
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPat ? "text" : "password"}
                    value={patInput}
                    onChange={(e) => setPatInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="font-mono text-xs pr-14"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveConfig()}
                  />
                  <button
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPat(!showPat)}
                    type="button"
                  >
                    {showPat ? "hide" : "show"}
                  </button>
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveConfig}
                  disabled={!patInput.trim()}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          {/* Save repo name (if PAT already saved) */}
          {deployConfig.pat && repoInput !== deployConfig.repoName && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveConfig}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save repo name
            </Button>
          )}

          <Separator />

          {/* ── Auto-deploy toggle ── */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Auto-deploy on save</span>
                {deployConfig.autoDeployEnabled && (
                  <Badge className="text-[10px] bg-blue-500/15 text-blue-400 border-blue-500/25 px-1.5 py-0">
                    LIVE
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                Automatically push to GitHub ~3s after each save.
                {!isConfigured && " Requires a PAT."}
              </p>
            </div>
            <Switch
              checked={deployConfig.autoDeployEnabled}
              onCheckedChange={(checked) => {
                updateDeployConfig({ autoDeployEnabled: checked });
              }}
              disabled={!isConfigured}
              aria-label="Toggle auto-deploy"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Action buttons ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Deploy Now */}
        <Card className="border-border/50 bg-card/50 hover:border-blue-500/30 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Rocket className="w-5 h-5" />
              Deploy Now
            </CardTitle>
            <CardDescription className="text-xs">
              Immediately generate and push your portfolio to GitHub.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">Free hosting</Badge>
              <Badge variant="secondary" className="text-xs">GitHub Pages</Badge>
              <Badge variant="secondary" className="text-xs">Custom domain</Badge>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleDeployNow}
              disabled={isDeploying || !canDeploy}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deploying…
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  {lastDeployed ? "Re-deploy" : "Deploy"}
                </>
              )}
            </Button>
            {!canDeploy && (
              <p className="text-xs text-center text-muted-foreground">
                Configure your PAT above first
              </p>
            )}
          </CardContent>
        </Card>

        {/* Download ZIP */}
        <Card className="border-border/50 bg-card/50 hover:border-purple-500/30 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="w-5 h-5" />
              Download ZIP
            </CardTitle>
            <CardDescription className="text-xs">
              Download portfolio as static HTML — deploy anywhere (Netlify, Vercel, etc.).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">No permissions</Badge>
              <Badge variant="secondary" className="text-xs">Any host</Badge>
              <Badge variant="secondary" className="text-xs">Offline backup</Badge>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleDownload}
              disabled={downloading || !config}
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download ZIP
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── What's deployed ── */}
      <div className="rounded-lg border border-border/40 bg-muted/20 p-4 space-y-2">
        <p className="text-sm font-medium text-foreground/80">Portfolio summary:</p>
        <ul className="space-y-1 text-muted-foreground text-xs list-disc list-inside">
          <li>
            Template:{" "}
            <strong className="text-foreground">
              {activeTmpl?.name ?? config?.settings?.activeTemplate}
            </strong>
          </li>
          <li>{config?.projects.length ?? 0} projects</li>
          <li>{config?.skills.length ?? 0} skills</li>
          <li>{config?.experience.length ?? 0} experience entries</li>
        </ul>
        <p className="text-xs text-muted-foreground pt-0.5">
          ✏️ Edit in the{" "}
          <a
            href="/dashboard/editor"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Editor
          </a>
          .{" "}
          {deployConfig.autoDeployEnabled
            ? "Changes auto-save and auto-deploy."
            : "Changes auto-save."}
        </p>
      </div>
    </div>
  );
}
