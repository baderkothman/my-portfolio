import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/**
 * TopBar
 * ------
 * Sticky header:
 * - On home: brand links to #top
 * - On /cv: back button + brand links to /
 */
export default function TopBar({ name, theme, onToggleTheme, showNav = true }) {
  const location = useLocation();
  const isCv = location.pathname === "/cv";

  return (
    <header className="topBar" aria-label="Site header">
      <div className="topBarInner">
        <div className="topBarLeft">
          {isCv ? (
            <Link
              className="iconBtn"
              to="/"
              aria-label="Back to home"
              title="Back"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          ) : null}

          {isCv ? (
            <Link className="brand" to="/" aria-label="Go to home">
              <span className="brandMark" aria-hidden="true" />
              <span className="brandText">{name}</span>
            </Link>
          ) : (
            <a className="brand" href="#top" aria-label="Go to top">
              <span className="brandMark" aria-hidden="true" />
              <span className="brandText">{name}</span>
            </a>
          )}
        </div>

        {showNav ? (
          <nav className="topNav" aria-label="Primary">
            <a className="topNavLink" href="#about">
              About
            </a>
            <a className="topNavLink" href="#projects">
              Projects
            </a>
            <a className="topNavLink" href="#contact">
              Contact
            </a>
          </nav>
        ) : (
          <div />
        )}

        <div className="topBarActions">
          <button
            className="iconBtn"
            type="button"
            aria-label="Toggle theme"
            aria-pressed={theme === "dark"}
            onClick={onToggleTheme}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
