/* eslint-disable no-unused-vars */
import React from "react";
import { User, Briefcase, Layers, Mail } from "lucide-react";

const navItems = [
  { key: "profile", label: "Overview", Icon: User },
  { key: "projects", label: "Work", Icon: Briefcase },
  { key: "skills", label: "Skills", Icon: Layers },
  { key: "contact", label: "Contact", Icon: Mail },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottomNav" aria-label="Bottom navigation">
      {navItems.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            className={`bottomNavItem ${isActive ? "active" : ""}`}
            onClick={() => onChange(key)}
            type="button"
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={22} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
