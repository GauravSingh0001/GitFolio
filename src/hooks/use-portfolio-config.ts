"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import type { PortfolioConfig } from "@/types/portfolio";
import { createDefaultPortfolioConfig } from "@/types/portfolio";
import { useGitHubData } from "./use-github-data";

const STORAGE_KEY = "gitfolio-portfolio-config";
const AUTOSAVE_DELAY_MS = 2000; // debounce before syncing to server

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function usePortfolioConfig(onSaved?: (config: PortfolioConfig) => void) {
  const { data: session } = useSession();
  const { data: githubData } = useGitHubData();
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Ref to hold the latest config so the debounce timer always has current value
  const configRef = useRef<PortfolioConfig | null>(null);
  configRef.current = config;

  // Debounce timer ref
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load from localStorage on mount / when GitHub data is ready ──
  useEffect(() => {
    if (!session?.githubUsername) return;

    const key = `${STORAGE_KEY}-${session.githubUsername}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PortfolioConfig;
        setConfig(parsed);
        return;
      } catch {
        // fall through to create default
      }
    }

    // Build a default config pre-populated from GitHub data
    if (githubData) {
      const defaultCfg = createDefaultPortfolioConfig(
        githubData.profile.name || githubData.profile.login,
        githubData.profile.bio,
        githubData.profile.avatarUrl
      );

      // Merge top GitHub projects
      defaultCfg.projects = githubData.projects.slice(0, 6).map((p, idx) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        techStack: p.languages.map((l) => l.name),
        githubUrl: p.url,
        liveUrl: "",
        imageUrl: "",
        featured: p.isPinned,
        displayOrder: idx,
      }));

      // Merge skill cloud
      defaultCfg.skills = githubData.skillCloud.slice(0, 10).map((s, idx) => ({
        id: String(idx),
        name: s.language,
        category: "Languages",
        level: Math.min(95, Math.round(s.percentage * 1.5 + 40)),
        color: s.color,
      }));

      setConfig(defaultCfg);
      localStorage.setItem(key, JSON.stringify(defaultCfg));
    }
  }, [session?.githubUsername, githubData]);

  // ── Core save to server (non-blocking, best-effort) ──
  const saveToServer = useCallback(
    async (cfg: PortfolioConfig) => {
      if (!session?.accessToken) {
        // No token — still mark as "saved" from localStorage perspective
        setIsDirty(false);
        setLastSaved(new Date());
        setSaveStatus("saved");
        if (onSaved) onSaved(cfg);
        setTimeout(() => setSaveStatus("idle"), 2500);
        return;
      }

      setIsSaving(true);
      setSaveStatus("saving");

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch("/api/portfolio/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cfg),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          // Non-fatal: log the error but don't surface it as a crash
          const body = await res.text().catch(() => "");
          console.warn(`Portfolio config server save returned ${res.status}:`, body);
          // Still treat localStorage save as success so UX is unblocked
          setIsDirty(false);
          setLastSaved(new Date());
          setSaveStatus("saved");
          if (onSaved) onSaved(cfg);
          setTimeout(() => setSaveStatus("idle"), 2500);
          return;
        }

        setIsDirty(false);
        setLastSaved(new Date());
        setSaveStatus("saved");
        if (onSaved) onSaved(cfg);
        setTimeout(() => setSaveStatus("idle"), 2500);
      } catch (err: unknown) {
        // Network error or timeout — localStorage already has the data, so this is non-fatal
        const isAbort = err instanceof Error && err.name === "AbortError";
        console.warn(
          isAbort
            ? "Portfolio config server save timed out (localStorage is up to date)"
            : "Portfolio config server save failed (localStorage is up to date)",
          err
        );
        // Still show saved — the user's data is safe in localStorage
        setIsDirty(false);
        setLastSaved(new Date());
        setSaveStatus("saved");
        if (onSaved) onSaved(cfg);
        setTimeout(() => setSaveStatus("idle"), 2500);
      } finally {
        setIsSaving(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.accessToken]
  );

  // ── Explicit manual save ──
  const save = useCallback(async () => {
    if (!configRef.current) return;
    // Cancel any pending auto-save
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    await saveToServer(configRef.current);
  }, [saveToServer]);

  // ── Update the whole config + write-through to localStorage ──
  const updateConfig = useCallback(
    (updater: (prev: PortfolioConfig) => PortfolioConfig) => {
      setConfig((prev) => {
        if (!prev) return prev;
        const next = updater(prev);

        // Persist to localStorage immediately (instant, no latency)
        if (session?.githubUsername) {
          const key = `${STORAGE_KEY}-${session.githubUsername}`;
          localStorage.setItem(key, JSON.stringify(next));
        }

        // Debounce server auto-save
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(() => {
          if (configRef.current) {
            saveToServer(configRef.current);
          }
        }, AUTOSAVE_DELAY_MS);

        return next;
      });
      setIsDirty(true);
      setSaveStatus("idle");
    },
    [session?.githubUsername, saveToServer]
  );

  // ── Partial update helper ──
  const patch = useCallback(
    <K extends keyof PortfolioConfig>(section: K, value: PortfolioConfig[K]) => {
      updateConfig((prev) => ({ ...prev, [section]: value }));
    },
    [updateConfig]
  );

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  return {
    config,
    updateConfig,
    patch,
    save,
    isDirty,
    isSaving,
    saveStatus,
    lastSaved,
    isReady: config !== null,
  };
}
