"use client";

import { signIn } from "next-auth/react";
import { GithubIcon as Github } from "@/components/icons/github";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e0e] text-[#e5e2e1]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-primary" />
      </div>

      {/* Nav bar */}
      <nav className="h-16 border-b border-[#414754]/15 flex items-center px-8">
        <div className="font-headline font-black text-lg tracking-tighter">
          GitFolio Engine
        </div>
      </nav>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-[#1c1b1b] border border-[#414754]/20 rounded-2xl overflow-hidden shadow-2xl">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#aec6ff] via-[#0070f3] to-[#4edea3]" />

            <div className="p-8 text-center">
              {/* Icon badge */}
              <div className="w-14 h-14 rounded-xl bg-[#aec6ff]/10 border border-[#aec6ff]/20 flex items-center justify-center mx-auto mb-6">
                <span className="font-headline font-black text-xl text-[#aec6ff]">
                  GF
                </span>
              </div>

              <h1 className="font-headline font-extrabold text-2xl tracking-tight text-[#e5e2e1] mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-[#8b90a0] mb-8 leading-relaxed">
                Sign in with your GitHub account to access your portfolio
                workspace.
              </p>

              {/* GitHub button */}
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 bg-[#24292f] hover:bg-[#2d333a] text-white font-headline font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-black/30 border border-white/5"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </button>

              <p className="text-[10px] font-label uppercase tracking-wider text-[#8b90a0]/60 mt-6 leading-relaxed">
                We only request read access to your public profile and
                repositories
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-[#8b90a0] mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#aec6ff] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#aec6ff] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div className="flex items-center gap-1.5 text-[#4edea3] font-label uppercase text-[10px] tracking-widest">
          <span className="animate-pulse">⚡</span>
          API Limit: 4982/5000
        </div>
        <div className="flex items-center gap-1.5 text-[#e5e2e1]/30 font-label uppercase text-[10px] tracking-widest">
          <span>↺</span>
          Sync: Operational
        </div>
      </div>
    </div>
  );
}
