"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { TEMPLATE_DEFINITIONS } from "@/types/portfolio";
import type { TemplateId } from "@/types/portfolio";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const { config, patch, save, isSaving } = usePortfolioConfig();

  const activeTemplate = config?.settings?.activeTemplate ?? "minimalist";

  const handleSelect = async (id: TemplateId) => {
    if (!config) return;
    patch("settings", { ...config.settings, activeTemplate: id });
    await save();
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
            Dashboard · Templates
          </span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl tracking-tight text-[#e5e2e1]">
          Choose Template
        </h1>
        <p className="text-[#8b90a0] mt-1 text-sm">
          Pick the design that best fits your role. You can switch anytime without losing data.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {TEMPLATE_DEFINITIONS.map((tmpl, i) => {
          const isActive = activeTemplate === tmpl.id;
          return (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              onClick={() => handleSelect(tmpl.id as TemplateId)}
              className={cn(
                "group relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
                isActive
                  ? "border-[#aec6ff]/50 shadow-[0_0_20px_rgba(174,198,255,0.12)]"
                  : "border-[#414754]/20 hover:border-[#414754]/50"
              )}
            >
              {/* Preview swatch */}
              <div
                className="h-44 flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: tmpl.bgColor }}
              >
                {/* Dot grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${tmpl.accentColor} 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />
                {/* Mock layout */}
                <div className="relative z-10 w-4/5 space-y-2">
                  <div className="h-2 rounded-full w-1/2 opacity-80" style={{ background: tmpl.textColor }} />
                  <div className="h-1.5 rounded-full w-3/4 opacity-40" style={{ background: tmpl.textColor }} />
                  <div className="flex gap-1.5 mt-1">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-8 rounded flex-1 opacity-30"
                        style={{ background: n === 1 ? tmpl.accentColor : tmpl.textColor }}
                      />
                    ))}
                  </div>
                  <div className="h-1 rounded-full w-full opacity-20 mt-2" style={{ background: tmpl.textColor }} />
                </div>

                {/* Accent dot */}
                <div
                  className="absolute bottom-3 right-3 w-3 h-3 rounded-full opacity-80"
                  style={{ background: tmpl.accentColor }}
                />

                {/* Active check */}
                {isActive && (
                  <div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: tmpl.accentColor }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              {/* Info panel */}
              <div className="p-5 bg-[#1c1b1b]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-headline font-bold text-sm text-[#e5e2e1]">
                    {tmpl.name}
                  </h3>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-[#aec6ff]/10 border border-[#aec6ff]/20 font-label text-[10px] uppercase tracking-wider text-[#aec6ff]">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-label uppercase tracking-wider text-[#8b90a0] mb-2">
                  {tmpl.role}
                </p>
                <p className="text-xs text-[#8b90a0] mb-3 leading-relaxed">
                  {tmpl.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tmpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] border border-[#414754]/30 rounded-full px-2 py-0.5 text-[#8b90a0] font-label uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              {!isActive && (
                <div className="absolute inset-0 bg-[#aec6ff]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-[#aec6ff] text-[#002e6b] text-xs font-headline font-bold px-4 py-2 rounded-lg shadow-lg">
                    Use this template
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Save action */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={save}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#aec6ff] to-[#0070f3] text-[#002e6b] font-headline font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/15 hover:shadow-blue-500/30 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Selection"
          )}
        </button>
        <p className="text-xs text-[#8b90a0]">
          Your template preference is saved automatically when you click a card.
        </p>
      </div>
    </div>
  );
}
