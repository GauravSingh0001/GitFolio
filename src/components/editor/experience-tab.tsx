"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ChevronDown, ChevronUp, Briefcase, GraduationCap, Award } from "lucide-react";
import type { ExperienceEntry } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full bg-[#201f1f] border border-[#414754]/30 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#8b90a0]/60 focus:outline-none focus:ring-1 focus:ring-[#aec6ff]/50 focus:border-[#aec6ff]/40 transition-all";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
        {label}
      </label>
      {children}
    </div>
  );
}

const typeConfig = {
  work: {
    icon: Briefcase,
    color: "text-[#aec6ff] bg-[#aec6ff]/10",
    label: "Work",
    titleLabel: "Job Title",
    orgLabel: "Company / Organization",
    titlePlaceholder: "Senior Developer",
  },
  education: {
    icon: GraduationCap,
    color: "text-[#4edea3] bg-[#4edea3]/10",
    label: "Education",
    titleLabel: "Degree / Program",
    orgLabel: "University / School",
    titlePlaceholder: "B.Sc. Computer Science",
  },
  certification: {
    icon: Award,
    color: "text-[#b9c8de] bg-[#b9c8de]/10",
    label: "Certification",
    titleLabel: "Certification Name",
    orgLabel: "Issuing Organization",
    titlePlaceholder: "AWS Certified Developer",
  },
} as const;

export function ExperienceTab({ config, patch }: { config: any; patch: any }) {
  const experience: ExperienceEntry[] = config.experience;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addEntry = (type: "work" | "education" | "certification") => {
    const entry: ExperienceEntry = {
      id: Date.now().toString(),
      type,
      title: "",
      organization: "",
      startDate: new Date().toISOString().slice(0, 7),
      endDate: "",
      description: "",
    };
    patch("experience", [...experience, entry]);
    setExpandedId(entry.id);
  };

  const updateEntry = (id: string, field: keyof ExperienceEntry, value: string) =>
    patch("experience", experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const removeEntry = (id: string) =>
    patch("experience", experience.filter((e) => e.id !== id));

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Add buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mr-1">
          Add:
        </span>
        {(["work", "education", "certification"] as const).map((t) => {
          const { icon: Icon, color, label } = typeConfig[t];
          return (
            <button
              key={t}
              onClick={() => addEntry(t)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1b1b] border border-[#414754]/20 rounded-lg text-xs font-label font-medium text-[#8b90a0] hover:text-[#e5e2e1] hover:border-[#414754]/50 transition-all"
            >
              <Plus className="w-3 h-3" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {experience.length === 0 && (
        <div className="flex items-center justify-center py-16 border border-[#414754]/15 border-dashed rounded-xl text-[#8b90a0] text-sm">
          No experience entries yet. Add work, education, or certifications above.
        </div>
      )}

      {/* Entries */}
      {experience.map((entry) => {
        const cfg = typeConfig[entry.type as keyof typeof typeConfig] ?? typeConfig.work;
        const Icon = cfg.icon;
        const isExpanded = expandedId === entry.id;

        return (
          <div
            key={entry.id}
            className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl overflow-hidden"
          >
            {/* Row header */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#201f1f] transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-headline font-bold text-sm text-[#e5e2e1]">
                    {entry.title || "Untitled"}
                  </p>
                  {entry.organization && (
                    <p className="text-xs text-[#8b90a0]">{entry.organization}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#201f1f] border border-[#414754]/20 font-label text-[10px] uppercase tracking-wider text-[#8b90a0]">
                  {cfg.label}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8b90a0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#8b90a0]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8b90a0]" />
                )}
              </div>
            </div>

            {/* Expanded form */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-3 border-t border-[#414754]/15 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FieldRow label={cfg.titleLabel}>
                        <input
                          value={entry.title}
                          onChange={(e) => updateEntry(entry.id, "title", e.target.value)}
                          placeholder={cfg.titlePlaceholder}
                          className={inputClass}
                        />
                      </FieldRow>
                      <FieldRow label={cfg.orgLabel}>
                        <input
                          value={entry.organization}
                          onChange={(e) => updateEntry(entry.id, "organization", e.target.value)}
                          className={inputClass}
                        />
                      </FieldRow>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FieldRow label="Start Date (YYYY-MM)">
                        <input
                          value={entry.startDate}
                          onChange={(e) => updateEntry(entry.id, "startDate", e.target.value)}
                          placeholder="2022-01"
                          className={inputClass}
                        />
                      </FieldRow>
                      <FieldRow label='End Date (blank = "Present")'>
                        <input
                          value={entry.endDate || ""}
                          onChange={(e) => updateEntry(entry.id, "endDate", e.target.value)}
                          placeholder="2024-06 or leave blank"
                          className={inputClass}
                        />
                      </FieldRow>
                    </div>

                    {entry.type !== "certification" && (
                      <FieldRow label="Description">
                        <textarea
                          value={entry.description || ""}
                          onChange={(e) => updateEntry(entry.id, "description", e.target.value)}
                          rows={2}
                          placeholder="What did you accomplish?"
                          className={`${inputClass} resize-none`}
                        />
                      </FieldRow>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
