import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Home,
  ShoppingCart,
  Palette,
  Server,
  GraduationCap,
  Briefcase,
  X,
  Github,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const ICONS = {
  geofence: MapPin,
  realestate: Home,
  pos: ShoppingCart,
  designsystem: Palette,
  api: Server,
  education: GraduationCap,
};

function Icon({ iconKey, size = 22 }) {
  const Comp = ICONS[iconKey] || Briefcase;
  return <Comp size={size} aria-hidden="true" />;
}

function isValidUrl(v) {
  if (!v) return false;
  const s = String(v).trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

function getFocusable(container) {
  if (!container) return [];
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  const nodes = Array.from(container.querySelectorAll(selector));
  return nodes.filter((el) => {
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

async function safeCopy(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // ignore and fallback
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function PostModal({ post, onClose }) {
  const closeBtnRef = useRef(null);
  const sheetRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const safePost = post && typeof post === "object" ? post : null;

  const repoUrl = safePost?.repoUrl ? String(safePost.repoUrl).trim() : "";
  const demoUrl = safePost?.demoUrl ? String(safePost.demoUrl).trim() : "";

  const hasRepo = useMemo(() => isValidUrl(repoUrl), [repoUrl]);
  const hasDemo = useMemo(() => isValidUrl(demoUrl), [demoUrl]);

  const titleText = safePost?.title ? String(safePost.title) : "Project";
  const captionText = safePost?.caption ? String(safePost.caption) : "";

  const titleId = `modal-title-${safePost?.id || "x"}`;
  const descId = `modal-desc-${safePost?.id || "x"}`;

  const tags = Array.isArray(safePost?.tags)
    ? safePost.tags.filter(Boolean).map(String)
    : [];

  const details = Array.isArray(safePost?.details)
    ? safePost.details.filter(Boolean).map(String)
    : [];

  const metrics = Array.isArray(safePost?.metrics)
    ? safePost.metrics.filter(Boolean).map(String)
    : [];

  useEffect(() => {
    if (!safePost) return;

    let alive = true;

    // reset UI states on open
    const resetId = window.setTimeout(() => {
      if (!alive) return;
      setCopied(false);
      setCopyError("");
    }, 0);

    // remember opener
    lastActiveRef.current = document.activeElement;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }

      // focus trap
      if (e.key === "Tab") {
        const container = sheetRef.current;
        const focusables = getFocusable(container);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first || !container.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);

    // lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus close button
    const focusId = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    return () => {
      alive = false;
      window.clearTimeout(resetId);
      window.clearTimeout(focusId);
      window.removeEventListener("keydown", onKeyDown);

      document.body.style.overflow = prevOverflow;

      // restore focus
      const el = lastActiveRef.current;
      if (el && typeof el.focus === "function") {
        window.setTimeout(() => el.focus(), 0);
      }
    };
  }, [safePost, onClose]);

  if (!safePost) return null;

  async function onCopyRepo() {
    setCopyError("");
    setCopied(false);

    if (!hasRepo) {
      setCopyError("Repository link is missing.");
      return;
    }

    const ok = await safeCopy(repoUrl);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } else {
      setCopyError("Copy failed. Please copy the link manually.");
    }
  }

  function onOverlayClick(e) {
    // close only if click is on overlay itself
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={onOverlayClick}
    >
      <div ref={sheetRef} className="modalSheet" role="document">
        <div className="modalSheetTop">
          <div className="modalSheetTitleRow">
            <span className="modalMark" aria-hidden="true">
              <Icon iconKey={safePost?.iconKey} size={20} />
            </span>

            <div className="modalSheetHead">
              <div className="modalTitle" id={titleId}>
                {titleText}
              </div>
              <div className="modalCaption" id={descId}>
                {captionText}
              </div>
            </div>

            <button
              ref={closeBtnRef}
              className="modalClose"
              onClick={() => onClose?.()}
              aria-label="Close dialog"
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {tags.length ? (
            <div className="modalTags" aria-label="Tech stack">
              {tags.map((t, idx) => (
                <span className="pill" key={`${t}-${idx}`}>
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="modalBody">
          <div className="modalSection">
            <div className="sectionLabel">Links</div>

            <div className="linkPanel" role="group" aria-label="Project links">
              <div className="linkRow">
                <div className="linkRowLeft">
                  <Github size={16} aria-hidden="true" />
                  <div className="linkRowText">
                    <div className="linkRowTitle">Repository</div>
                    <div className="linkRowValue">
                      {hasRepo ? repoUrl : "Not provided yet"}
                    </div>
                  </div>
                </div>

                <div className="linkRowActions">
                  {hasRepo ? (
                    <a
                      className="btnPrimary"
                      href={repoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                      Open
                    </a>
                  ) : (
                    <button className="btnPrimary" type="button" disabled>
                      <ExternalLink size={16} aria-hidden="true" />
                      Open
                    </button>
                  )}

                  <button
                    className="btnGhost"
                    type="button"
                    onClick={onCopyRepo}
                  >
                    {copied ? (
                      <>
                        <Check size={16} aria-hidden="true" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} aria-hidden="true" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {hasDemo ? (
                <div className="linkRow">
                  <div className="linkRowLeft">
                    <ExternalLink size={16} aria-hidden="true" />
                    <div className="linkRowText">
                      <div className="linkRowTitle">Live demo</div>
                      <div className="linkRowValue">{demoUrl}</div>
                    </div>
                  </div>

                  <div className="linkRowActions">
                    <a
                      className="btnGhost"
                      href={demoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                      Open
                    </a>
                  </div>
                </div>
              ) : null}

              {copyError ? <div className="error">{copyError}</div> : null}
            </div>
          </div>

          {details.length ? (
            <div className="modalSection">
              <div className="sectionLabel">What I built</div>
              <ul className="bullets">
                {details.map((d, idx) => (
                  <li key={`${safePost?.id || "x"}-d-${idx}`}>{d}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {metrics.length ? (
            <div className="modalSection">
              <div className="sectionLabel">Highlights</div>
              <div className="chips">
                {metrics.map((m, idx) => (
                  <span className="chip" key={`${m}-${idx}`}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="modalBackdrop" aria-hidden="true" />
    </div>
  );
}
