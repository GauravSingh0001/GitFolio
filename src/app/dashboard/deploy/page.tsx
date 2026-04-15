"use client";

import { useState } from "react";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import {
  Download,
  Loader2,
  AlertCircle,
  Package,
  CheckCircle2,
  FileCode2,
  Globe,
  Layers,
} from "lucide-react";
import { TEMPLATE_DEFINITIONS } from "@/types/portfolio";

export default function DeployPage() {
  const { config, isReady } = usePortfolioConfig();
  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);
  const [dlSuccess, setDlSuccess] = useState(false);

  const activeTmpl = TEMPLATE_DEFINITIONS.find(
    (t) => t.id === config?.settings?.activeTemplate
  );

  const handleDownload = async () => {
    if (!config) return;
    setDownloading(true);
    setDlError(null);
    setDlSuccess(false);
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
      setDlSuccess(true);
      setTimeout(() => setDlSuccess(false), 4000);
    } catch (err) {
      setDlError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="space-y-5 max-w-2xl animate-pulse">
        <div className="h-8 w-48 bg-[#1c1b1b] rounded-lg" />
        <div className="h-36 bg-[#1c1b1b] rounded-xl" />
        <div className="h-36 bg-[#1c1b1b] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-2xl">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
            Deploy
          </span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl tracking-tight text-[#e5e2e1]">
          Download Portfolio
        </h1>
        <p className="text-[#8b90a0] mt-1 text-sm">
          Generate and download your static HTML portfolio using the{" "}
          <span
            className="font-semibold"
            style={{ color: activeTmpl?.accentColor ?? "#aec6ff" }}
          >
            {activeTmpl?.name ?? config?.settings?.activeTemplate ?? "selected"}
          </span>{" "}
          template.
        </p>
      </div>

      {/* ── Error banner ── */}
      {dlError && (
        <div className="flex items-start gap-3 p-4 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-[#ffb4ab] mt-0.5 shrink-0" />
          <div>
            <p className="font-headline font-bold text-[#ffb4ab] text-sm mb-1">
              Download failed
            </p>
            <p className="text-sm text-[#ffb4ab]/70 font-mono break-words leading-relaxed">
              {dlError}
            </p>
          </div>
        </div>
      )}

      {/* ── Success banner ── */}
      {dlSuccess && (
        <div className="flex items-center gap-3 p-4 bg-[#4edea3]/10 border border-[#4edea3]/20 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-[#4edea3] shrink-0" />
          <p className="font-headline font-bold text-[#4edea3] text-sm">
            Portfolio downloaded successfully!
          </p>
        </div>
      )}

      {/* ── Download Card ── */}
      <div className="bg-[#1c1b1b] border border-[#414754]/20 rounded-xl overflow-hidden hover:border-[#414754]/40 transition-colors">
        {/* Card header */}
        <div className="px-6 py-5 border-b border-[#414754]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#aec6ff]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#aec6ff]" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-[#e5e2e1]">
                Download as ZIP
              </h2>
              <p className="text-xs text-[#8b90a0]">
                Static HTML — deploy anywhere (Netlify, Vercel, GitHub Pages)
              </p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="px-6 py-4 flex gap-2 flex-wrap border-b border-[#414754]/10">
          {["No permissions required", "Any host", "Offline backup"].map((b) => (
            <span
              key={b}
              className="px-3 py-1 rounded-full bg-[#201f1f] border border-[#414754]/20 text-[10px] font-label uppercase tracking-wider text-[#8b90a0]"
            >
              {b}
            </span>
          ))}
        </div>

        {/* Action */}
        <div className="px-6 py-5">
          <button
            onClick={handleDownload}
            disabled={downloading || !config}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#aec6ff] to-[#0070f3] text-[#002e6b] font-headline font-bold py-3 rounded-lg shadow-lg shadow-blue-500/15 hover:shadow-blue-500/30 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating build…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download ZIP
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── What's included ── */}
      <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6 space-y-4">
        <h3 className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
          Portfolio Summary
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: Layers,
              label: "Template",
              value: activeTmpl?.name ?? config?.settings?.activeTemplate ?? "—",
              color: activeTmpl?.accentColor ?? "#aec6ff",
            },
            {
              icon: FileCode2,
              label: "Projects",
              value: `${config?.projects.length ?? 0} included`,
              color: "#4edea3",
            },
            {
              icon: Globe,
              label: "Skills",
              value: `${config?.skills.length ?? 0} listed`,
              color: "#aec6ff",
            },
            {
              icon: FileCode2,
              label: "Experience",
              value: `${config?.experience.length ?? 0} entries`,
              color: "#b9c8de",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 bg-[#201f1f] rounded-lg"
            >
              <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
              <div className="min-w-0">
                <p className="font-label text-[10px] uppercase tracking-wider text-[#8b90a0]">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-[#e5e2e1] truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#8b90a0]">
          ✏️ Edit in the{" "}
          <a
            href="/dashboard/editor"
            className="text-[#aec6ff] underline underline-offset-4 hover:text-[#aec6ff]/70 transition-colors"
          >
            Editor
          </a>
          . Changes automatically save to your workspace.
        </p>
      </div>
    </div>
  );
}
