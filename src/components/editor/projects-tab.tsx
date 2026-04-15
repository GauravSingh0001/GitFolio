"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2, Plus, X, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import type { ProjectEntry } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full bg-[#201f1f] border border-[#414754]/30 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#8b90a0]/60 focus:outline-none focus:ring-1 focus:ring-[#aec6ff]/50 focus:border-[#aec6ff]/40 transition-all";

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] font-label text-[#8b90a0]">{hint}</p>}
    </div>
  );
}

export function ProjectsTab({ config, patch }: { config: any; patch: any }) {
  const projects: ProjectEntry[] = config.projects;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addProject = () => {
    const newProject: ProjectEntry = {
      id: Date.now().toString(),
      name: "New Project",
      description: "",
      techStack: [],
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
      featured: false,
      displayOrder: projects.length,
    };
    patch("projects", [...projects, newProject]);
    setExpandedId(newProject.id);
  };

  const updateProject = (id: string, field: keyof ProjectEntry, value: unknown) =>
    patch("projects", projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const removeProject = (id: string) => {
    patch("projects", projects.filter((p) => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={addProject}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#aec6ff]/10 border border-[#aec6ff]/20 rounded-lg text-xs font-label font-medium text-[#aec6ff] hover:bg-[#aec6ff]/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex items-center justify-center py-16 border border-[#414754]/15 border-dashed rounded-xl text-[#8b90a0] text-sm text-center px-6">
          No projects yet. Your GitHub projects are auto-imported — click &quot;+ Add Project&quot; to add more.
        </div>
      )}

      {/* Project list */}
      {projects.map((proj) => {
        const isExpanded = expandedId === proj.id;
        return (
          <div
            key={proj.id}
            className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl overflow-hidden"
          >
            {/* Row header */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#201f1f] transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : proj.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#aec6ff]/10 flex items-center justify-center shrink-0">
                  <FolderGit2 className="w-4 h-4 text-[#aec6ff]" />
                </div>
                <div>
                  <p className="font-headline font-bold text-sm text-[#e5e2e1]">
                    {proj.name || "Untitled Project"}
                  </p>
                  {proj.techStack.length > 0 && (
                    <p className="text-xs text-[#8b90a0] truncate max-w-xs">
                      {proj.techStack.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {proj.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 font-label text-[10px] uppercase tracking-wider text-[#4edea3]">
                    Featured
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
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
                      <FieldRow label="Project Name">
                        <input
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                          className={inputClass}
                        />
                      </FieldRow>
                      <FieldRow label="Image URL">
                        <input
                          value={proj.imageUrl || ""}
                          onChange={(e) => updateProject(proj.id, "imageUrl", e.target.value)}
                          placeholder="https://…"
                          className={inputClass}
                        />
                      </FieldRow>
                    </div>

                    <FieldRow label="Description">
                      <textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                        rows={2}
                        placeholder="What does this project do?"
                        className={`${inputClass} resize-none`}
                      />
                    </FieldRow>

                    <FieldRow label="Tech Stack" hint="Comma-separated list of technologies">
                      <input
                        value={proj.techStack.join(", ")}
                        onChange={(e) =>
                          updateProject(
                            proj.id,
                            "techStack",
                            e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        placeholder="React, TypeScript, Node.js"
                        className={inputClass}
                      />
                    </FieldRow>

                    <div className="grid grid-cols-2 gap-4">
                      <FieldRow label="Live URL">
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b90a0]" />
                          <input
                            value={proj.liveUrl || ""}
                            onChange={(e) => updateProject(proj.id, "liveUrl", e.target.value)}
                            placeholder="https://…"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </FieldRow>
                      <FieldRow label="GitHub URL">
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b90a0]" />
                          <input
                            value={proj.githubUrl || ""}
                            onChange={(e) => updateProject(proj.id, "githubUrl", e.target.value)}
                            placeholder="https://github.com/…"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </FieldRow>
                    </div>

                    {/* Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={proj.featured}
                          onChange={(e) => updateProject(proj.id, "featured", e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-9 h-5 rounded-full transition-colors",
                            proj.featured ? "bg-[#00a572]" : "bg-[#414754]/40"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform",
                              proj.featured ? "translate-x-5" : "translate-x-1"
                            )}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-[#c1c6d7] group-hover:text-[#e5e2e1] transition-colors">
                        Featured project (shown first)
                      </span>
                    </label>
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
