import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Tag,
} from "lucide-react";

const ICONS = {
  geofence: MapPin,
  realestate: Home,
  pos: ShoppingCart,
  designsystem: Palette,
  api: Server,
  education: GraduationCap,
};

function Icon({ iconKey, size = 72 }) {
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
  const modalRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const hasRepo = useMemo(() => isValidUrl(post?.repoUrl), [post?.repoUrl]);
  const hasDemo = useMemo(() => isValidUrl(post?.demoUrl), [post?.demoUrl]);

  useEffect(() => {
    if (!post) return;

    // Reset state on open (async to satisfy react-hooks/set-state-in-effect rule)
    const resetId = window.setTimeout(() => {
      setCopied(false);
      setCopyError("");
    }, 0);

    lastActiveRef.current = document.activeElement;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusables = getFocusable(modalRef.current);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first || !modalRef.current.contains(active)) {
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

    // Lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on open
    const focusId = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(resetId);
      window.clearTimeout(focusId);

      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;

      // Restore focus to the opener
      const el = lastActiveRef.current;
      if (el && typeof el.focus === "function") {
        window.setTimeout(() => el.focus(), 0);
      }
    };
  }, [post, onClose]);

  if (!post) return null;

  const titleId = `modal-title-${post.id}`;
  const descId = `modal-desc-${post.id}`;

  async function onCopyRepo() {
    setCopyError("");
    setCopied(false);

    if (!hasRepo) {
      setCopyError("Repository link is missing.");
      return;
    }

    const ok = await safeCopy(String(post.repoUrl).trim());
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } else {
      setCopyError("Copy failed. Please copy the link manually.");
    }
  }

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div ref={modalRef} className="modalCard" role="document">
        <button
          ref={closeBtnRef}
          className="modalClose"
          onClick={onClose}
          aria-label="Close dialog"
          type="button"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="modalLeft">
          <div className="modalMedia">
            <div className="modalIcon" aria-hidden="true">
              <Icon iconKey={post.iconKey} size={86} />
            </div>
          </div>
        </div>

        <div className="modalRight">
          <div className="modalHeader">
            <div className="modalTitle" id={titleId}>
              {post.title}
            </div>

            {Array.isArray(post.tags) && post.tags.length ? (
              <div className="modalTags" aria-label="Project tags">
                {post.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="modalCaption" id={descId}>
            {post.caption}
          </div>

          {/* Repository panel */}
          <div className="modalSection">
            <div className="sectionLabel">Repository</div>

            <div className="linkPanel" role="group" aria-label="Project links">
              <div className="linkRow">
                <div className="linkRowLeft">
                  <Github size={16} aria-hidden="true" />
                  <div className="linkRowText">
                    <div className="linkRowTitle">Repo</div>
                    <div className="linkRowValue">
                      {hasRepo ? post.repoUrl : "Not provided yet"}
                    </div>
                  </div>
                </div>

                <div className="linkRowActions">
                  {hasRepo ? (
                    <a
                      className="btnPrimary"
                      href={post.repoUrl}
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
                        <Check size={16} aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} aria-hidden="true" />
                        Copy
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
                      <div className="linkRowTitle">Demo</div>
                      <div className="linkRowValue">{post.demoUrl}</div>
                    </div>
                  </div>

                  <div className="linkRowActions">
                    <a
                      className="btnGhost"
                      href={post.demoUrl}
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

            {!hasRepo ? (
              <div className="modalHint" style={{ marginTop: 10 }}>
                Add <b>repoUrl</b> (and optional <b>demoUrl</b>) in{" "}
                <b>src/data/profile.js</b>.
              </div>
            ) : null}
          </div>

          {/* What I built */}
          <div className="modalSection">
            <div className="sectionLabel">What I built / planned</div>
            <ul className="bullets">
              {(post.details || []).map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          {Array.isArray(post.metrics) && post.metrics.length ? (
            <div className="modalSection">
              <div className="sectionLabel">Highlights</div>
              <div className="chips">
                {post.metrics.map((m) => (
                  <span className="chip" key={m}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Tech stack */}
          {Array.isArray(post.tags) && post.tags.length ? (
            <div className="modalSection">
              <div className="sectionLabel">Tech stack</div>
              <div className="chips" aria-label="Tech stack">
                {post.tags.map((t) => (
                  <span className="chip" key={t}>
                    <Tag
                      size={14}
                      aria-hidden="true"
                      style={{ marginRight: 6 }}
                    />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="modalBackdrop" onClick={onClose} />
    </div>
  );
}
