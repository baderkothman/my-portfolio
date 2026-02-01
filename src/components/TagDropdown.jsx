import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

/**
 * TagDropdown
 * -----------
 * Custom dropdown with search.
 * - Click outside closes
 * - Escape closes
 * - Resets search when opened (without setState-in-effect lint issues)
 */

export default function TagDropdown({
  value = "all",
  options = [],
  onChange,
  placeholder = "All tags",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const label = useMemo(() => {
    if (!value || value === "all") return placeholder;
    return String(value);
  }, [value, placeholder]);

  const safeOptions = useMemo(() => {
    const arr = Array.isArray(options) ? options : [];
    return arr.map((x) => String(x)).filter(Boolean);
  }, [options]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return safeOptions;
    return safeOptions.filter((x) => x.toLowerCase().includes(s));
  }, [q, safeOptions]);

  function closeMenu() {
    setOpen(false);
  }

  function openMenu() {
    setQ("");
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function toggleMenu() {
    if (open) closeMenu();
    else openMenu();
  }

  useEffect(() => {
    function onDocDown(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) closeMenu();
    }

    function onDocKey(e) {
      if (e.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onDocKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onDocKey);
    };
  }, []);

  function pick(v) {
    onChange?.(v);
    closeMenu();
  }

  return (
    <div className="tagDrop" ref={rootRef}>
      <button
        type="button"
        className="tagTrigger"
        aria-haspopup="listbox"
        aria-expanded={open ? "true" : "false"}
        onClick={toggleMenu}
      >
        <span className="tagTriggerText">{label}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open ? (
        <div className="tagMenu" role="listbox" aria-label="Tags dropdown">
          <div className="tagMenuSearch">
            <Search size={16} aria-hidden="true" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="tagMenuInput"
              placeholder="Search tags..."
              aria-label="Search tags"
            />
          </div>

          <div className="tagMenuList">
            {filtered.map((t) => {
              const isActive = t === value || (value === "all" && t === "all");
              return (
                <button
                  key={t}
                  type="button"
                  className={`tagOption ${isActive ? "active" : ""}`}
                  onClick={() => pick(t)}
                  role="option"
                  aria-selected={isActive ? "true" : "false"}
                >
                  {t === "all" ? placeholder : t}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
