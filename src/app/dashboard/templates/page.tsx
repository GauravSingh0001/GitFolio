"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { TEMPLATE_DEFINITIONS } from "@/types/portfolio";
import type { TemplateId } from "@/types/portfolio";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Choose Template</h1>
        <p className="text-muted-foreground mt-1">
          Pick the design that best fits your role. You can switch anytime without losing data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {TEMPLATE_DEFINITIONS.map((tmpl, i) => {
          const isActive = activeTemplate === tmpl.id;

          return (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={cn(
                "group relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
                isActive
                  ? "border-primary ring-2 ring-primary shadow-lg shadow-primary/20"
                  : "border-border/50 hover:border-primary/50 hover:shadow-md"
              )}
              onClick={() => handleSelect(tmpl.id as TemplateId)}
            >
              {/* Preview swatch */}
              <div
                className="h-44 flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: tmpl.bgColor }}
              >
                {/* Decorative dots / lines */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${tmpl.accentColor} 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />
                {/* Mini mock layout */}
                <div className="relative z-10 w-4/5 space-y-2">
                  <div
                    className="h-2 rounded-full w-1/2 opacity-80"
                    style={{ background: tmpl.textColor }}
                  />
                  <div
                    className="h-1.5 rounded-full w-3/4 opacity-40"
                    style={{ background: tmpl.textColor }}
                  />
                  <div className="flex gap-1.5 mt-1">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-8 rounded flex-1 opacity-30"
                        style={{ background: n === 1 ? tmpl.accentColor : tmpl.textColor }}
                      />
                    ))}
                  </div>
                  <div
                    className="h-1 rounded-full w-full opacity-20 mt-2"
                    style={{ background: tmpl.textColor }}
                  />
                </div>

                {/* Accent dot */}
                <div
                  className="absolute bottom-3 right-3 w-3 h-3 rounded-full opacity-80"
                  style={{ background: tmpl.accentColor }}
                />

                {/* Active check */}
                {isActive && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 bg-card">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm">{tmpl.name}</h3>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs gap-1 text-primary">
                      <Sparkles className="w-3 h-3" /> Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{tmpl.role}</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {tmpl.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tmpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs border border-border/70 rounded-full px-2 py-0.5 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Select overlay on hover */}
              {!isActive && (
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow">
                    Use this template
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={save}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? "Saving…" : "Save Selection"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Your template preference is saved automatically when you click a card.
        </p>
      </div>
    </div>
  );
}
