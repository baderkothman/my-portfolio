import React, { useMemo } from "react";
import PostCard from "../components/PostCard";
import ContactForm from "../components/ContactForm";

function getHref(label, value) {
  if (!value) return null;
  const v = String(value).trim();

  if (label.toLowerCase() === "email") return `mailto:${v}`;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  return null;
}

export default function ProfilePage({
  profile,
  posts,
  active,
  onChangeTab,
  onOpenPost,
}) {
  const gridPosts = useMemo(() => posts, [posts]);

  function goTo(tabKey, anchorId) {
    onChangeTab(tabKey);
    if (!anchorId) return;

    // after React updates the DOM
    requestAnimationFrame(() => {
      const el = document.getElementById(anchorId);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="page">
      {/* Profile header */}
      <section className="profileHeader card">
        <div className="avatarWrap">
          <div className="avatarRing">
            <div className="avatar">B</div>
          </div>
        </div>

        <div className="profileMeta">
          <div className="profileRow1">
            <div className="profileName">{profile.username}</div>
            <div className="profileActions">
              <button
                className="btnPrimary"
                type="button"
                onClick={() => goTo("contact", "contact")}
              >
                Contact
              </button>
              <button
                className="btnGhost"
                type="button"
                onClick={() => goTo("projects", "projects")}
              >
                View Projects
              </button>
            </div>
          </div>

          <div className="statsRow">
            <div className="stat">
              <b>{profile.stats.posts}</b> posts
            </div>
            <div className="stat">
              <b>{profile.stats.projects}</b> projects
            </div>
            <div className="stat">
              <b>{profile.stats.years}</b> years
            </div>
          </div>

          <div className="bioBlock">
            <div className="realName">{profile.name}</div>
            <div className="title">{profile.title}</div>
            <div className="bio">
              {profile.bioLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
            <div className="links" aria-label="Profile links">
              {profile.links.map((l) => {
                const href = getHref(l.label, l.value);
                return (
                  <div key={l.label} className="linkLine">
                    <span className="linkLabel">{l.label}:</span>{" "}
                    {href ? (
                      <a
                        className="linkValue linkAnchor"
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                      >
                        {l.value}
                      </a>
                    ) : (
                      <span className="linkValue">{l.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="highlights card">
        {profile.highlights.map((h) => (
          <div className="highlight" key={h.title}>
            <div className="highlightCircle" />
            <div className="highlightTitle">{h.title}</div>
            <div className="highlightSub">{h.subtitle}</div>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <section className="tabs card">
        <button
          className={`tab ${active === "profile" ? "active" : ""}`}
          onClick={() => onChangeTab("profile")}
          type="button"
        >
          POSTS
        </button>
        <button
          className={`tab ${active === "projects" ? "active" : ""}`}
          onClick={() => onChangeTab("projects")}
          type="button"
        >
          PROJECTS
        </button>
        <button
          className={`tab ${active === "skills" ? "active" : ""}`}
          onClick={() => onChangeTab("skills")}
          type="button"
        >
          SKILLS
        </button>
        <button
          className={`tab ${active === "contact" ? "active" : ""}`}
          onClick={() => onChangeTab("contact")}
          type="button"
        >
          CONTACT
        </button>
      </section>

      {/* Content */}
      {active === "skills" ? (
        <section className="card sectionPad">
          <h3 className="sectionTitle">Skills</h3>
          <div className="chips">
            {profile.skills.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {active === "contact" ? (
        <section id="contact" className="card sectionPad">
          <h3 className="sectionTitle">Contact</h3>
          <p className="muted">
            Fill the form below to reach me. It sends directly via EmailJS.
          </p>

          <div className="contactGrid" aria-label="Contact links">
            {profile.links.map((l) => {
              const href = getHref(l.label, l.value);
              return (
                <div className="contactItem" key={l.label}>
                  <div className="contactLabel">{l.label}</div>
                  <div className="contactValue">
                    {href ? (
                      <a
                        className="contactAnchor"
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                      >
                        {l.value}
                      </a>
                    ) : (
                      l.value
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="contactFormWrap">
            <h4 className="sectionSubtitle">Send a message</h4>
            <ContactForm />
          </div>
        </section>
      ) : null}

      {/* Posts grid (default + projects tab) */}
      {active !== "skills" && active !== "contact" ? (
        <section id="projects" className="postsGrid" aria-label="Projects grid">
          {gridPosts.map((p) => (
            <PostCard key={p.id} post={p} onOpen={onOpenPost} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
