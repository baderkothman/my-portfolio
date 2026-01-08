import React from "react";
import { User, Briefcase, Layers, Mail } from "lucide-react";

const items = [
  { key: "profile", icon: User, label: "Profile" },
  { key: "projects", icon: Briefcase, label: "Projects" },
  { key: "skills", icon: Layers, label: "Skills" },
  { key: "contact", icon: Mail, label: "Contact" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottomNav" aria-label="Bottom navigation">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <button
            key={it.key}
            className={`bottomNavItem ${active === it.key ? "active" : ""}`}
            onClick={() => onChange(it.key)}
            aria-label={it.label}
            type="button"
          >
            <Icon size={22} />
          </button>
        );
      })}
    </nav>
  );
}
