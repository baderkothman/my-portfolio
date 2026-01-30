import React from "react";
import {
  MapPin,
  Home,
  ShoppingCart,
  Palette,
  Server,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Github,
} from "lucide-react";

const ICONS = {
  geofence: MapPin,
  realestate: Home,
  pos: ShoppingCart,
  designsystem: Palette,
  api: Server,
  education: GraduationCap,
};

function Icon({ iconKey }) {
  const Comp = ICONS[iconKey] || Briefcase;
  return <Comp size={18} aria-hidden="true" />;
}

function isValidUrl(v) {
  if (!v) return false;
  const s = String(v).trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

export default function PostCard({ post, onOpen }) {
  const repoOk = isValidUrl(post?.repoUrl);
  const demoOk = isValidUrl(post?.demoUrl);

  // Prevent modal open when clicking action buttons
  function stop(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <button
      type="button"
      className="repoCard"
      onClick={() => onOpen(post)}
      aria-label={`Open details for ${post?.title || "project"}`}
    >
      <div className="repoCardTop">
        <div className="repoCardTitleRow">
          <span className="repoCardIcon">
            <Icon iconKey={post?.iconKey} />
          </span>

          <span className="repoCardTitle">{post?.title}</span>

          <span className="repoCardBadge" aria-label="Project">
            Project
          </span>
        </div>

        {post?.caption ? (
          <p className="repoCardDesc">{post.caption}</p>
        ) : (
          <p className="repoCardDesc muted">No description yet.</p>
        )}
      </div>

      {Array.isArray(post?.tags) && post.tags.length ? (
        <div className="repoCardTags" aria-label="Tags">
          {post.tags.slice(0, 4).map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="repoCardActions" aria-label="Project actions">
        {repoOk ? (
          <a
            className="repoBtn repoBtnPrimary"
            href={post.repoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
            aria-label="Open repository"
          >
            <Github size={16} aria-hidden="true" />
            Repo
          </a>
        ) : (
          <span
            className="repoBtn repoBtnDisabled"
            aria-label="Repository missing"
          >
            <Github size={16} aria-hidden="true" />
            Repo
          </span>
        )}

        {demoOk ? (
          <a
            className="repoBtn"
            href={post.demoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
            aria-label="Open live demo"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Demo
          </a>
        ) : null}

        <span className="repoCardHint">Click card for details</span>
      </div>
    </button>
  );
}
