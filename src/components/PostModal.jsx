import React, { useEffect, useRef } from "react";

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
  // Filter out elements that are not actually visible
  return nodes.filter((el) => {
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

export default function PostModal({ post, onClose }) {
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    if (!post) return;

    // Save the element that opened the modal so we can restore focus on close
    lastActiveRef.current = document.activeElement;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab") {
        const focusables = getFocusable(modalRef.current);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (active === first || !modalRef.current.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab
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
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;

      // Restore focus to the opener (or fallback to body)
      const el = lastActiveRef.current;
      if (el && typeof el.focus === "function") {
        requestAnimationFrame(() => el.focus());
      }
    };
  }, [post, onClose]);

  if (!post) return null;

  const titleId = `modal-title-${post.id}`;
  const descId = `modal-desc-${post.id}`;

  const hasRepo =
    typeof post.repoUrl === "string" && post.repoUrl.trim().length > 0;
  const hasDemo =
    typeof post.demoUrl === "string" && post.demoUrl.trim().length > 0;

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
          ✕
        </button>

        <div className="modalLeft">
          <div className="modalMedia">
            <div className="modalEmoji" aria-hidden="true">
              {post.coverEmoji || "📌"}
            </div>
          </div>
        </div>

        <div className="modalRight">
          <div className="modalHeader">
            <div className="modalTitle" id={titleId}>
              {post.title}
            </div>
            <div className="modalTags" aria-label="Project tags">
              {(post.tags || []).map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="modalCaption" id={descId}>
            {post.caption}
          </div>

          {hasRepo || hasDemo ? (
            <div className="modalActions" aria-label="Project links">
              {hasRepo ? (
                <a
                  className="btnPrimary"
                  href={post.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub Repo
                </a>
              ) : null}

              {hasDemo ? (
                <a
                  className="btnGhost"
                  href={post.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </a>
              ) : null}
            </div>
          ) : (
            <div className="modalHint">
              Add <b>repoUrl</b> (and optional <b>demoUrl</b>) in{" "}
              <b>src/data/profile.js</b>.
            </div>
          )}

          <div className="modalSection">
            <div className="sectionLabel">What I built / planned</div>
            <ul className="bullets">
              {(post.details || []).map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>

          {post.metrics?.length ? (
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
        </div>
      </div>

      {/* Backdrop click closes modal */}
      <div className="modalBackdrop" onClick={onClose} />
    </div>
  );
}
