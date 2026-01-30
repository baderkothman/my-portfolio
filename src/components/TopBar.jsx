import React from "react";
import { Github, Mail, MoreHorizontal } from "lucide-react";

function getLink(links, label) {
  const found = (links || []).find(
    (x) => String(x.label || "").toLowerCase() === String(label).toLowerCase(),
  );
  return found?.value ? String(found.value).trim() : "";
}

export default function TopBar({ title, username, profile }) {
  const links = profile?.links || [];
  const github = getLink(links, "GitHub");
  const email = getLink(links, "Email");
  const mailto = email ? `mailto:${email}` : "";

  const displayName = username || profile?.username || "portfolio";

  return (
    <header className="topBar" aria-label="Top bar">
      <div className="topBarInner">
        <div className="brand" aria-label="Brand">
          <span className="brandMark" aria-hidden="true" />
          <span className="brandText">{displayName}</span>
        </div>

        <div className="topBarTitle" aria-label="Current section">
          {title}
        </div>

        <div className="topBarActions">
          {github ? (
            <a
              className="iconBtn"
              href={github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github size={18} aria-hidden="true" />
            </a>
          ) : null}

          {mailto ? (
            <a className="iconBtn" href={mailto} aria-label="Email">
              <Mail size={18} aria-hidden="true" />
            </a>
          ) : null}

          <button className="iconBtn" type="button" aria-label="More actions">
            <MoreHorizontal size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
