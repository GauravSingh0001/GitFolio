"use client";

import { Wrench, Plus, X } from "lucide-react";
import type { SkillEntry } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const SKILL_CATEGORIES = [
  "Frontend", "Backend", "Tools", "Design", "Languages", "Cloud", "Mobile", "Other",
];

const inputClass =
  "w-full bg-[#201f1f] border border-[#414754]/30 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#8b90a0]/60 focus:outline-none focus:ring-1 focus:ring-[#aec6ff]/50 focus:border-[#aec6ff]/40 transition-all";

export function SkillsTab({ config, patch }: { config: any; patch: any }) {
  const skills: SkillEntry[] = config.skills;

  const addSkill = () => {
    const newSkill: SkillEntry = {
      id: Date.now().toString(),
      name: "",
      category: "Frontend",
      level: 70,
      color: "#aec6ff",
    };
    patch("skills", [...skills, newSkill]);
  };

  const updateSkill = (id: string, field: keyof SkillEntry, value: string | number) =>
    patch("skills", skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const removeSkill = (id: string) =>
    patch("skills", skills.filter((s) => s.id !== id));

  const skillsByCategory = skills.reduce<Record<string, SkillEntry[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Skills card */}
      <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#414754]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#aec6ff]/10 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#aec6ff]" />
            </div>
            <h2 className="font-headline font-bold text-sm text-[#e5e2e1]">
              Skills ({skills.length})
            </h2>
          </div>
          <button
            onClick={addSkill}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#aec6ff]/10 border border-[#aec6ff]/20 rounded-lg text-xs font-label font-medium text-[#aec6ff] hover:bg-[#aec6ff]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </button>
        </div>

        <div className="p-6 space-y-3">
          {skills.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-[#8b90a0]">
                No skills yet. Click &quot;+ Add Skill&quot; to start.
              </p>
            </div>
          )}

          {skills.map((skill) => (
            <div
              key={skill.id}
              className="grid grid-cols-[1fr_140px_120px_40px_32px] gap-2 items-center"
            >
              <input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                placeholder="Skill name"
                className={inputClass}
              />
              <select
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                className="h-10 rounded-lg border border-[#414754]/30 bg-[#201f1f] px-3 text-sm text-[#e5e2e1] focus:outline-none focus:ring-1 focus:ring-[#aec6ff]/50"
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, "level", Number(e.target.value))}
                  className="flex-1 accent-[#aec6ff]"
                />
                <span className="text-[10px] font-label text-[#8b90a0] w-8 text-right">
                  {skill.level}%
                </span>
              </div>
              <input
                type="color"
                value={skill.color || "#aec6ff"}
                onChange={(e) => updateSkill(skill.id, "color", e.target.value)}
                className="h-9 w-9 rounded-lg border border-[#414754]/30 cursor-pointer bg-[#201f1f] p-1"
                title="Skill color"
              />
              <button
                onClick={() => removeSkill(skill.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8b90a0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category preview */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6">
          <h3 className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mb-4">
            Preview by Category
          </h3>
          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([cat, items]) => (
              <div key={cat}>
                <p className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mb-2">
                  {cat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201f1f] border border-[#414754]/20 text-xs font-label text-[#c1c6d7]"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color || "#aec6ff" }}
                      />
                      {s.name || "…"}
                      <span className="text-[#8b90a0]">{s.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
