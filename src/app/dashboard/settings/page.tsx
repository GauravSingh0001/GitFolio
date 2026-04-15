"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, X, Save, User, Link as LinkIcon, CheckCircle2 } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#414754]/15 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#aec6ff]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#aec6ff]" />
        </div>
        <h2 className="font-headline font-bold text-sm text-[#e5e2e1]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[#201f1f] border border-[#414754]/30 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#8b90a0]/60 focus:outline-none focus:ring-1 focus:ring-[#aec6ff]/50 focus:border-[#aec6ff]/40 transition-all";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "LinkedIn", url: "" },
    { platform: "Twitter", url: "" },
  ]);
  const [saved, setSaved] = useState(false);

  const addSocialLink = () =>
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);

  const removeSocialLink = (index: number) =>
    setSocialLinks(socialLinks.filter((_, i) => i !== index));

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const handleSave = () => {
    localStorage.setItem("gitfolio-settings", JSON.stringify({ bio, socialLinks }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
            Dashboard · Settings
          </span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl tracking-tight text-[#e5e2e1]">
          Settings
        </h1>
        <p className="text-[#8b90a0] mt-1 text-sm">
          Customize your portfolio&apos;s personal information.
        </p>
      </div>

      {/* Profile section */}
      <SectionCard title="Profile" icon={User}>
        <div className="space-y-4">
          <FieldGroup label="GitHub Username">
            <input
              value={session?.githubUsername || ""}
              disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`}
            />
          </FieldGroup>
          <FieldGroup label="Bio / Tagline">
            <textarea
              rows={3}
              placeholder="Full-stack developer passionate about open source..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`${inputClass} resize-none`}
            />
            <p className="text-[10px] font-label text-[#8b90a0] mt-1">
              This will appear below your name on your portfolio.
            </p>
          </FieldGroup>
        </div>
      </SectionCard>

      {/* Social Links section */}
      <SectionCard title="Social Links" icon={LinkIcon}>
        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                placeholder="Platform"
                value={link.platform}
                onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                className={`${inputClass} w-36`}
              />
              <input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={() => removeSocialLink(index)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#201f1f] border border-[#414754]/20 text-[#8b90a0] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/30 transition-all shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={addSocialLink}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#201f1f] border border-[#414754]/20 border-dashed rounded-lg text-xs font-label text-[#8b90a0] hover:text-[#e5e2e1] hover:border-[#414754]/50 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Social Link
          </button>
        </div>
      </SectionCard>

      {/* Divider */}
      <div className="border-t border-[#414754]/15" />

      {/* Save row */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-[#aec6ff] to-[#0070f3] text-[#002e6b] font-headline font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 active:scale-[0.99] transition-all"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
        {saved && (
          <div className="flex items-center gap-1.5 text-[#4edea3] text-sm font-label">
            <CheckCircle2 className="w-4 h-4" />
            Saved!
          </div>
        )}
      </div>
    </div>
  );
}
