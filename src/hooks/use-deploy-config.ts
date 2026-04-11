"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { PortfolioConfig } from "@/types/portfolio";

const DEPLOY_CONFIG_KEY = "gitfolio-deploy-config";

export type DeployStatus = "idle" | "deploying" | "success" | "error";

interface DeployConfig {
  pat: string;
  repoName: string;
  autoDeployEnabled: boolean;
}

interface DeployResult {
  repoUrl: string;
  pagesUrl: string;
  commitSha: string;
  branch?: string;
}

function loadDeployConfig(): DeployConfig {
  if (typeof window === "undefined") {
    return { pat: "", repoName: "portfolio", autoDeployEnabled: false };
  }
  try {
    const stored = localStorage.getItem(DEPLOY_CONFIG_KEY);
    if (stored) return JSON.parse(stored) as DeployConfig;
  } catch {}
  return { pat: "", repoName: "portfolio", autoDeployEnabled: false };
}

function saveDeployConfig(cfg: DeployConfig) {
  localStorage.setItem(DEPLOY_CONFIG_KEY, JSON.stringify(cfg));
}

export function useDeployConfig() {
  const [deployConfig, setDeployConfigState] = useState<DeployConfig>(loadDeployConfig);
  const [deployStatus, setDeployStatus] = useState<DeployStatus>("idle");
  const [lastDeployed, setLastDeployed] = useState<Date | null>(null);
  const [lastResult, setLastResult] = useState<DeployResult | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  // Debounce auto-deploy so rapid saves don't spam GitHub
  const autoDeployTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDeployConfig = useCallback((updates: Partial<DeployConfig>) => {
    setDeployConfigState((prev) => {
      const next = { ...prev, ...updates };
      saveDeployConfig(next);
      return next;
    });
  }, []);

  /** Core deploy function — generate HTML then push via API */
  const deploy = useCallback(
    async (config: PortfolioConfig): Promise<boolean> => {
      const { pat, repoName } = loadDeployConfig(); // read fresh from storage
      if (!pat.trim()) {
        setDeployError(
          "No Personal Access Token configured. Set one up in the Deploy page."
        );
        setDeployStatus("error");
        return false;
      }

      setDeployStatus("deploying");
      setDeployError(null);

      try {
        // Step 1: Generate HTML
        const genRes = await fetch("/api/portfolio/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });
        const genResult = await genRes.json();
        if (!genRes.ok)
          throw new Error(genResult.error || "Portfolio generation failed");
        if (!genResult.files?.length) throw new Error("No files were generated");

        // Step 2: Push
        const pushRes = await fetch("/api/portfolio/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: genResult.files,
            repoName: repoName.trim() || "portfolio",
            pat: pat.trim(),
          }),
        });
        const pushResult = await pushRes.json();
        if (!pushRes.ok)
          throw new Error(pushResult.error || "Push to GitHub failed");

        setLastResult(pushResult as DeployResult);
        setLastDeployed(new Date());
        setDeployStatus("success");

        // Reset to idle after 5s so next deploy can start
        setTimeout(() => setDeployStatus("idle"), 5000);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Deploy failed";
        setDeployError(msg);
        setDeployStatus("error");
        setTimeout(() => setDeployStatus("idle"), 8000);
        return false;
      }
    },
    []
  );

  /**
   * Auto-deploy trigger — call this when portfolio saves.
   * Debounced 3s so multiple rapid saves collapse into one deploy.
   */
  const triggerAutoDeploy = useCallback(
    (config: PortfolioConfig) => {
      const { autoDeployEnabled, pat } = loadDeployConfig();
      if (!autoDeployEnabled || !pat.trim()) return;

      if (autoDeployTimer.current) clearTimeout(autoDeployTimer.current);
      autoDeployTimer.current = setTimeout(() => {
        deploy(config);
      }, 3000); // 3s debounce after save
    },
    [deploy]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoDeployTimer.current) clearTimeout(autoDeployTimer.current);
    };
  }, []);

  return {
    deployConfig,
    updateDeployConfig,
    deploy,
    triggerAutoDeploy,
    deployStatus,
    lastDeployed,
    lastResult,
    deployError,
    isConfigured: !!deployConfig.pat.trim(),
  };
}
