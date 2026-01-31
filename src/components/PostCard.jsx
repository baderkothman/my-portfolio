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

const ICONS = {
  geofence: MapPin,
  realestate: Home,
  pos: ShoppingCart,
  designsystem: Palette,
  api: Server,
  education: GraduationCap,
};

function Icon({ iconKey, size = 18 }) {
  const Comp = ICONS[iconKey] || Briefcase;
  return <Comp size={size} aria-hidden="true" />;
}

function isValidUrl(v) {
  if (!v) return false;
  const s = String(v).trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

export default function PostCard({ post, onOpen }) {
  const safePost = post && typeof post === "object" ? post : null;

  const title = safePost?.title ? String(safePost.title) : "Untitled Project";
  const caption = safePost?.caption
    ? String(safePost.caption)
    : "No description yet.";

  const repoUrl = safePost?.repoUrl ? String(safePost.repoUrl).trim() : "";
  const demoUrl = safePost?.demoUrl ? String(safePost.demoUrl).trim() : "";

  const repoOk = isValidUrl(repoUrl);
  const demoOk = isValidUrl(demoUrl);

  const tags = Array.isArray(safePost?.tags)
    ? safePost.tags.filter(Boolean).map(String)
    : [];

  function open() {
    if (!safePost) return;
    if (typeof onOpen === "function") onOpen(safePost);
  }

  function onCardKeyDown(e) {
    // Make card behave like a button
    if (e.key === "Enter") {
      e.preventDefault();
      open();
    }

    // Space triggers click for button-like elements (and prevents page scroll)
    if (e.key === " ") {
      e.preventDefault();
      open();
    }
  }

  function stopOpen(e) {
    // Keep anchor default behavior, just prevent opening the modal
    e.stopPropagation();
  }

  function stopOpenOnKeyDown(e) {
    // If user presses Enter/Space on the link, don't bubble up to the card
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
    }
  }

  return (
    <article
      className="projectCard"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={onCardKeyDown}
      aria-label={`Open details for ${title}`}
    >
      <div className="projectCardHeader">
        <span className="projectIcon" aria-hidden="true">
          <Icon iconKey={safePost?.iconKey} />
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
              onClick={stopOpen}
              onKeyDown={stopOpenOnKeyDown}
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
              onClick={stopOpen}
              onKeyDown={stopOpenOnKeyDown}
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
