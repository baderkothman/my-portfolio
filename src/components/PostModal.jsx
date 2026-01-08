import React, { useEffect } from "react";

export default function PostModal({ post, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (post) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modalCard">
        <button className="modalClose" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modalLeft">
          <div className="modalMedia">
            <div className="modalEmoji">{post.coverEmoji || "📌"}</div>
          </div>
        </div>

        <div className="modalRight">
          <div className="modalHeader">
            <div className="modalTitle">{post.title}</div>
            <div className="modalTags">
              {(post.tags || []).map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="modalCaption">{post.caption}</div>

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

      <div className="modalBackdrop" onClick={onClose} />
    </div>
  );
}
