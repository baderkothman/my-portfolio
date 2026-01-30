/* eslint-disable no-unused-vars */
import { User, Briefcase, Layers, Mail } from "lucide-react";

const navItems = [
  { key: "profile", label: "Overview", Icon: User },
  { key: "projects", label: "Work", Icon: Briefcase },
  { key: "skills", label: "Skills", Icon: Layers },
  { key: "contact", label: "Contact", Icon: Mail },
];

export default function SideNav({ active, onChange, profile }) {
  const username = profile?.username || "portfolio";

  return (
    <aside className="sideNav" aria-label="Sidebar">
      <div className="sideNavInner">
        <div className="sideBrand" aria-label="Brand">
          <span className="sideBrandLogo" aria-hidden="true" />
          <div className="sideBrandText">{username}</div>
        </div>

        <nav className="sideNavLinks" aria-label="Primary navigation">
          {navItems.map(({ key, label, Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                className={`navItem ${isActive ? "active" : ""}`}
                onClick={() => onChange(key)}
                type="button"
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
