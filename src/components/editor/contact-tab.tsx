"use client";

import { Mail, Plus, X } from "lucide-react";

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

export function ContactTab({ config, patch }: { config: any; patch: any }) {
  const contact = config.contact;

  const updateContact = (field: string, value: unknown) =>
    patch("contact", { ...contact, [field]: value });

  const updateSocial = (idx: number, field: "platform" | "url", value: string) => {
    const updated = [...contact.socialLinks];
    updated[idx] = { ...updated[idx], [field]: value };
    updateContact("socialLinks", updated);
  };

  const addSocial = () =>
    updateContact("socialLinks", [...contact.socialLinks, { platform: "", url: "" }]);

  const removeSocial = (idx: number) =>
    updateContact(
      "socialLinks",
      contact.socialLinks.filter((_: unknown, i: number) => i !== idx)
    );

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Contact Info */}
      <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#414754]/15 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#aec6ff]/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-[#aec6ff]" />
          </div>
          <h2 className="font-headline font-bold text-sm text-[#e5e2e1]">
            Contact Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Email Address">
              <input
                type="email"
                value={contact.email || ""}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </FieldRow>
            <FieldRow label="Phone (optional)">
              <input
                type="tel"
                value={contact.phone || ""}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={inputClass}
              />
            </FieldRow>
          </div>

          <FieldRow label="Location">
            <input
              value={contact.location || ""}
              onChange={(e) => updateContact("location", e.target.value)}
              placeholder="San Francisco, CA"
              className={inputClass}
            />
          </FieldRow>

          {/* Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={contact.showContactForm}
                onChange={(e) => updateContact("showContactForm", e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-full transition-colors ${
                  contact.showContactForm ? "bg-[#00a572]" : "bg-[#414754]/40"
                }`}
              >
                <div
                  className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${
                    contact.showContactForm ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
            <span className="text-sm text-[#c1c6d7] group-hover:text-[#e5e2e1] transition-colors">
              Show contact form on portfolio
            </span>
          </label>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#414754]/15 flex items-center justify-between">
          <h2 className="font-headline font-bold text-sm text-[#e5e2e1]">Social Links</h2>
          <button
            onClick={addSocial}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#aec6ff]/10 border border-[#aec6ff]/20 rounded-lg text-xs font-label text-[#aec6ff] hover:bg-[#aec6ff]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Link
          </button>
        </div>
        <div className="p-6 space-y-3">
          {contact.socialLinks.length === 0 && (
            <p className="text-sm text-[#8b90a0] text-center py-4">
              No social links yet. Click &quot;+ Add Link&quot; to get started.
            </p>
          )}
          {contact.socialLinks.map(
            (link: { platform: string; url: string }, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={link.platform}
                  onChange={(e) => updateSocial(idx, "platform", e.target.value)}
                  placeholder="Platform"
                  className={`${inputClass} w-36`}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateSocial(idx, "url", e.target.value)}
                  placeholder="https://…"
                  className={`${inputClass} flex-1`}
                />
                <button
                  onClick={() => removeSocial(idx)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#201f1f] border border-[#414754]/20 text-[#8b90a0] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/30 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
