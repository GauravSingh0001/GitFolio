"use client";

import { useState } from "react";
import { useGitHubData } from "@/hooks/use-github-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, GitFork, Pin, PinOff, GripVertical, ExternalLink } from "lucide-react";
import type { PortfolioProject } from "@/types/github";

export default function ProjectsPage() {
  const { data, isLoading } = useGitHubData();
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Pin up to 6 projects to feature on your portfolio. {pinnedIds.size}/6 pinned.
        </p>
      </div>

      {pinned.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            📌 Pinned Projects
          </h2>
          <div className="grid gap-3">
            {pinned.map((project) => (
              <ProjectRow key={project.id} project={project} onTogglePin={togglePin} isPinned />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          All Projects ({unpinned.length})
        </h2>
        <div className="grid gap-3">
          {unpinned.map((project) => (
            <ProjectRow key={project.id} project={project} onTogglePin={togglePin} isPinned={false} />
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
}: {
  project: PortfolioProject;
  onTogglePin: (id: string) => void;
  isPinned: boolean;
}) {
  return (
    <Card className={`border-border/50 transition-all duration-200 ${isPinned ? "bg-blue-500/5 border-blue-500/20" : "bg-card/50 hover:bg-card/80"}`}>
      <CardContent className="flex items-center gap-4 py-4">
        <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{project.name}</h3>
            {project.primaryLanguage && (
              <Badge variant="secondary" className="text-xs gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.primaryLanguageColor || "#64748b" }}
                />
                {project.primaryLanguage}
              </Badge>
            )}
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground truncate">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" /> {project.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" /> {project.forks}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className={`w-8 h-8 ${isPinned ? "text-blue-400" : "text-muted-foreground"}`}
            onClick={() => onTogglePin(project.id)}
          >
            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
