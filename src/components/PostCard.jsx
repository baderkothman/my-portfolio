import {
  MapPin,
  Home,
  ShoppingCart,
  Palette,
  Server,
  GraduationCap,
  Briefcase,
  Github,
  ArrowUpRight,
} from "lucide-react";

/**
 * PostCard
 * --------
 * Clickable project card.
 * - Accessible: role="button" + tabIndex + Enter/Space open
 * - Links inside do NOT trigger open
 */

const ICONS = Object.freeze({
  geofence: MapPin,
  realestate: Home,
  pos: ShoppingCart,
  designsystem: Palette,
  api: Server,
  education: GraduationCap,
});

function Icon({ iconKey, size = 18 }) {
  const Comp = ICONS[iconKey] || Briefcase;
  return <Comp size={size} aria-hidden="true" />;
}

function isValidUrl(v) {
  const s = String(v ?? "").trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

export default function PostCard({ post, onOpen }) {
  const safePost = post && typeof post === "object" ? post : null;
  if (!safePost) return null;

  const title = String(safePost.title || "Untitled Project");
  const caption = String(safePost.caption || "No description yet.");

  const repoUrl = String(safePost.repoUrl || "").trim();
  const demoUrl = String(safePost.demoUrl || "").trim();

  const repoOk = isValidUrl(repoUrl);
  const demoOk = isValidUrl(demoUrl);

  const tags = Array.isArray(safePost.tags)
    ? safePost.tags.map((t) => String(t ?? "").trim()).filter(Boolean)
    : [];

  function open() {
    onOpen?.(safePost);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  }

  function stop(e) {
    e.stopPropagation();
  }

  return (
    <article
      className="projectCard"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={onKeyDown}
      aria-label={`Open details for ${title}`}
    >
      <div className="projectCardHeader">
        <span className="projectIcon" aria-hidden="true">
          <Icon iconKey={safePost.iconKey} />
        </span>

        <div style={{ minWidth: 0 }}>
          <div className="projectTitleRow">
            <h3 className="projectTitle">{title}</h3>
            <span className="projectKicker" aria-label="Item type">
              Project
            </span>
          </div>

          <p className="projectDesc">{caption}</p>
        </div>
      </div>

      {tags.length ? (
        <div className="projectTags" aria-label="Project tags">
          {tags.slice(0, 6).map((t) => (
            <span className="pill" key={t}>
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="projectFooter">
        <div className="projectLinks" aria-label="Project links">
          {repoOk ? (
            <a
              className="linkPill"
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={stop}
              onKeyDown={stop}
              aria-label={`Open repository for ${title}`}
            >
              <Github size={16} aria-hidden="true" />
              Repo <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : null}

          {demoOk ? (
            <a
              className="linkPill"
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={stop}
              onKeyDown={stop}
              aria-label={`Open live demo for ${title}`}
            >
              Demo <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : null}
        </div>

        <span className="viewCase" aria-hidden="true">
          View details <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
