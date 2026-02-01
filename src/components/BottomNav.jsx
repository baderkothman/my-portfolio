import { Home, Briefcase, User, Mail } from "lucide-react";

/**
 * BottomNav
 * ---------
 * Mobile-only bottom navigation.
 *
 * Props:
 * - activeId: string
 * - onNavigate: (id: string) => void
 */
const NAV_ITEMS = [
  { id: "about", label: "About", Icon: User },
  { id: "projects", label: "Projects", Icon: Briefcase },
  { id: "contact", label: "Contact", Icon: Mail },
];

export default function BottomNav({ activeId = "top", onNavigate }) {
  return (
    <nav className="bottomNav" aria-label="Bottom navigation">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = activeId === id;

        return (
          <button
            key={id}
            className={`bottomNavItem ${isActive ? "active" : ""}`}
            type="button"
            onClick={() => onNavigate?.(id)}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            title={label}
          >
            <Icon size={20} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
