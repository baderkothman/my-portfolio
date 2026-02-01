import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

/**
 * PostModal
 * --------
 * Accessible modal dialog for a "post/project".
 *
 * Behaviors:
 * - ESC closes
 * - Click overlay closes (outside sheet)
 * - Focus trap
 * - Locks background scroll
 * - Restores focus to opener
 * - Safe clipboard copy (with fallback)
 */

const ICONS = Object.freeze({
  geofence: MapPin,
  realestate: Home,
  pos: ShoppingCart,
  designsystem: Palette,
  api: Server,
  education: GraduationCap,
});

function Icon({ iconKey, size = 22 }) {
  const Comp = ICONS[iconKey] || Briefcase;
  return <Comp size={size} aria-hidden="true" />;
}

function isValidUrl(v) {
  const s = String(v ?? "").trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

function toCleanString(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
}

function normalizeStringArray(v) {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x ?? "").trim()).filter(Boolean);
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
  const value = String(text ?? "");
  if (!value) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // ignore and fallback
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = value;
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

function PostModal({ post, onClose }) {
  const closeBtnRef = useRef(null);
  const sheetRef = useRef(null);
  const lastActiveRef = useRef(null);
  const copiedTimerRef = useRef(null);

  const safePost = post && typeof post === "object" ? post : null;

  const vm = useMemo(() => {
    if (!safePost) return null;

    const id = toCleanString(safePost.id, "x");
    const title = toCleanString(safePost.title, "Project");
    const caption = toCleanString(safePost.caption, "");

    const repoUrl = toCleanString(safePost.repoUrl, "");
    const demoUrl = toCleanString(safePost.demoUrl, "");

    return {
      id,
      title,
      caption,
      iconKey: safePost.iconKey,
      repoUrl,
      demoUrl,
      hasRepo: isValidUrl(repoUrl),
      hasDemo: isValidUrl(demoUrl),
      tags: normalizeStringArray(safePost.tags),
      details: normalizeStringArray(safePost.details),
      metrics: normalizeStringArray(safePost.metrics),
    };
  }, [safePost]);

  const titleId = vm ? `modal-title-${vm.id}` : "modal-title-x";
  const descId = vm ? `modal-desc-${vm.id}` : "modal-desc-x";

  // Copy UI stored per modal id so it doesn't require effect resets.
  const [copyUi, setCopyUi] = useState(() => ({
    forId: "",
    copied: false,
    error: "",
  }));

  const copied = vm && copyUi.forId === vm.id ? copyUi.copied : false;
  const copyError = vm && copyUi.forId === vm.id ? copyUi.error : "";

  const requestClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const onOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) requestClose();
    },
    [requestClose],
  );

  const onCopyRepo = useCallback(async () => {
    if (!vm) return;

    if (copiedTimerRef.current) {
      window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = null;
    }

    if (!vm.hasRepo) {
      setCopyUi({
        forId: vm.id,
        copied: false,
        error: "Repository link is missing.",
      });
      return;
    }

    const ok = await safeCopy(vm.repoUrl);

    if (ok) {
      setCopyUi({ forId: vm.id, copied: true, error: "" });
      copiedTimerRef.current = window.setTimeout(() => {
        setCopyUi({ forId: vm.id, copied: false, error: "" });
        copiedTimerRef.current = null;
      }, 1400);
    } else {
      setCopyUi({
        forId: vm.id,
        copied: false,
        error: "Copy failed. Please copy the link manually.",
      });
    }
  }, [vm]);

  useEffect(() => {
    if (!vm) return;

    lastActiveRef.current = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusId = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }

      if (e.key === "Tab") {
        const container = sheetRef.current;
        const focusables = getFocusable(container);
        if (!focusables.length) return;

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

    return () => {
      window.clearTimeout(focusId);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;

      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = null;
      }

      const el = lastActiveRef.current;
      if (el && typeof el.focus === "function") {
        window.setTimeout(() => el.focus(), 0);
      }
    };
  }, [vm, requestClose]);

  if (!vm) return null;

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
              <Icon iconKey={vm.iconKey} size={20} />
            </span>

            <div className="modalSheetHead">
              <div className="modalTitle" id={titleId}>
                {vm.title}
              </div>
              <div className="modalCaption" id={descId}>
                {vm.caption}
              </div>
            </div>

            <button
              ref={closeBtnRef}
              className="modalClose"
              onClick={requestClose}
              aria-label="Close dialog"
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {vm.tags.length ? (
            <div className="modalTags" aria-label="Tech stack">
              {vm.tags.map((t) => (
                <span className="pill" key={t}>
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
                      {vm.hasRepo ? vm.repoUrl : "Not provided yet"}
                    </div>
                  </div>
                </div>

                <div className="linkRowActions">
                  {vm.hasRepo ? (
                    <a
                      className="btnPrimary"
                      href={vm.repoUrl}
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

              {vm.hasDemo ? (
                <div className="linkRow">
                  <div className="linkRowLeft">
                    <ExternalLink size={16} aria-hidden="true" />
                    <div className="linkRowText">
                      <div className="linkRowTitle">Live demo</div>
                      <div className="linkRowValue">{vm.demoUrl}</div>
                    </div>
                  </div>

                  <div className="linkRowActions">
                    <a
                      className="btnGhost"
                      href={vm.demoUrl}
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

          {vm.details.length ? (
            <div className="modalSection">
              <div className="sectionLabel">What I built</div>
              <ul className="bullets">
                {vm.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {vm.metrics.length ? (
            <div className="modalSection">
              <div className="sectionLabel">Highlights</div>
              <div className="chips">
                {vm.metrics.map((m) => (
                  <span className="chip" key={m}>
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

export default memo(PostModal);
