import { useEffect, useRef, useState } from "react";
import { Moon, Sun, ArrowLeft, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function TopBar({
  name,
  theme,
  onToggleTheme,
  showNav = true,
  avatarUrl = "",
}) {
  const location = useLocation();
  const isCv = location.pathname === "/cv";

  const [avatarOpen, setAvatarOpen] = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!avatarOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        setAvatarOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [avatarOpen]);

  function openAvatar() {
    if (!avatarUrl) return;
    setAvatarOpen(true);
  }

  function closeAvatar() {
    setAvatarOpen(false);
  }

  return (
    <>
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

            {/* Brand group: avatar button + name link */}
            <div className="brandGroup">
              <button
                type="button"
                className="brandAvatarBtn"
                onClick={openAvatar}
                aria-label={avatarUrl ? "Open profile photo" : "Profile mark"}
                title={avatarUrl ? "Open photo" : ""}
                disabled={!avatarUrl}
              >
                {avatarUrl ? (
                  <img
                    className="brandAvatar"
                    src={avatarUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="brandMark" aria-hidden="true" />
                )}
              </button>

              {isCv ? (
                <Link className="brandName" to="/" aria-label="Go to home">
                  {name}
                </Link>
              ) : (
                <a className="brandName" href="#top" aria-label="Go to top">
                  {name}
                </a>
              )}
            </div>
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

      {/* Avatar modal */}
      {avatarOpen ? (
        <div
          className="avatarOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAvatar();
          }}
        >
          <div className="avatarModal" role="document">
            <button
              ref={closeBtnRef}
              className="avatarClose"
              type="button"
              onClick={closeAvatar}
              aria-label="Close photo"
              title="Close"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <img className="avatarModalImg" src={avatarUrl} alt={`${name}`} />
          </div>
        </div>
      ) : null}
    </>
  );
}
