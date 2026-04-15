"use client";

import { User } from "lucide-react";

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

export function ProfileTab({ config, patch }: { config: any; patch: any }) {
  const p = config.profile;
  const update = (field: string, value: string) =>
    patch("profile", { ...p, [field]: value });

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#414754]/15 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#aec6ff]/10 flex items-center justify-center">
            <User className="w-4 h-4 text-[#aec6ff]" />
          </div>
          <h2 className="font-headline font-bold text-sm text-[#e5e2e1]">
            Personal Information
          </h2>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Display Name">
              <input
                id="displayName"
                value={p.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </FieldRow>
            <FieldRow label="Professional Title">
              <input
                id="title"
                value={p.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Full-Stack Developer"
                className={inputClass}
              />
            </FieldRow>
          </div>

          <FieldRow label="Bio / Tagline">
            <textarea
              id="bio"
              value={p.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              placeholder="Short description that appears below your name…"
              className={`${inputClass} resize-none`}
            />
          </FieldRow>

          <FieldRow label="Goals / Personal Statement">
            <textarea
              id="goals"
              value={p.goals || ""}
              onChange={(e) => update("goals", e.target.value)}
              rows={2}
              placeholder="What drives you? What are you working towards?"
              className={`${inputClass} resize-none`}
            />
          </FieldRow>

          <FieldRow label="Profile Image URL">
            <input
              id="avatarUrl"
              value={p.avatarUrl || ""}
              onChange={(e) => update("avatarUrl", e.target.value)}
              placeholder="https://example.com/photo.jpg (leave blank to use GitHub avatar)"
              className={inputClass}
            />
            <p className="text-[10px] font-label text-[#8b90a0] mt-1">
              Leave blank to automatically use your GitHub profile picture.
            </p>
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
