import React from "react";
import { User, Briefcase, Layers, Mail } from "lucide-react";

const items = [
  { key: "profile", label: "Profile", icon: User },
  { key: "projects", label: "Projects", icon: Briefcase },
  { key: "skills", label: "Skills", icon: Layers },
  { key: "contact", label: "Contact", icon: Mail },
];

export default function SideNav({ active, onChange, profile }) {
  return (
    <aside className="sideNav">
      <div className="sideNavInner">
        <div className="sideBrand">
          <div className="sideBrandLogo">◻︎</div>
          <div className="sideBrandText">{profile.username}</div>
        </div>

        <nav className="sideNavLinks" aria-label="Primary navigation">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.key}
                className={`navItem ${active === it.key ? "active" : ""}`}
                onClick={() => onChange(it.key)}
                type="button"
              >
                <Icon size={20} />
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sideFooter">
          <div className="miniHint">Instagram-style portfolio</div>
          <div className="miniHint">{profile.location}</div>
        </div>
      </div>
    </aside>
  );
}
