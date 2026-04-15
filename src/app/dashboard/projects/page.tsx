"use client";

import { useState } from "react";
import { useGitHubData } from "@/hooks/use-github-data";
import { Star, GitFork, Pin, PinOff, GripVertical, ExternalLink } from "lucide-react";
import type { PortfolioProject } from "@/types/github";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { data, isLoading } = useGitHubData();
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 6) next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-48 bg-[#1c1b1b] rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-[#1c1b1b] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const projects: PortfolioProject[] = data.projects.map((p) => ({
    ...p,
    isPinned: pinnedIds.has(p.id),
  }));

  const pinned = projects.filter((p) => p.isPinned);
  const unpinned = projects.filter((p) => !p.isPinned);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
            Dashboard · Projects
          </span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl tracking-tight text-[#e5e2e1]">
          Projects
        </h1>
        <p className="text-[#8b90a0] mt-1 text-sm">
          Pin up to 6 projects to feature on your portfolio.
          <span className="ml-1 text-[#aec6ff]">{pinnedIds.size}/6 pinned.</span>
        </p>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#aec6ff]">
              ◉ Pinned Projects
            </span>
          </div>
          <div className="space-y-2">
            {pinned.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onTogglePin={togglePin}
                isPinned
              />
            ))}
          </div>
        </div>
      )}

      {/* All unpinned */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
            All Projects ({unpinned.length})
          </span>
        </div>
        <div className="space-y-2">
          {unpinned.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onTogglePin={togglePin}
              isPinned={false}
              maxReached={pinnedIds.size >= 6}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  onTogglePin,
  isPinned,
  maxReached = false,
}: {
  project: PortfolioProject;
  onTogglePin: (id: string) => void;
  isPinned: boolean;
  maxReached?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-150",
        isPinned
          ? "bg-[#aec6ff]/5 border-[#aec6ff]/20"
          : "bg-[#1c1b1b] border-[#414754]/15 hover:border-[#414754]/40"
      )}
    >
      <GripVertical className="w-4 h-4 text-[#414754] cursor-grab shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-headline font-bold text-sm text-[#e5e2e1] truncate">
            {project.name}
          </h3>
          {project.primaryLanguage && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#201f1f] border border-[#414754]/20 font-label text-[10px] uppercase tracking-wider text-[#8b90a0] shrink-0">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: project.primaryLanguageColor || "#64748b" }}
              />
              {project.primaryLanguage}
            </span>
          )}
        </div>
        {project.description && (
          <p className="text-xs text-[#8b90a0] truncate">{project.description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs font-label text-[#8b90a0] shrink-0">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" /> {project.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3 h-3" /> {project.forks}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8b90a0] hover:text-[#e5e2e1] hover:bg-[#2a2a2a] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => onTogglePin(project.id)}
          disabled={!isPinned && maxReached}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
            isPinned
              ? "text-[#aec6ff] bg-[#aec6ff]/10 hover:bg-[#aec6ff]/20"
              : "text-[#8b90a0] hover:text-[#e5e2e1] hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          {isPinned ? (
            <PinOff className="w-3.5 h-3.5" />
          ) : (
            <Pin className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
