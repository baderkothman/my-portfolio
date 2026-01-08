import React, { useMemo } from "react";
import PostCard from "../components/PostCard";

export default function ProfilePage({
  profile,
  posts,
  active,
  onChangeTab,
  onOpenPost,
}) {
  const gridPosts = useMemo(() => posts, [posts]);

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
              <a
                className="btnPrimary"
                href="#contact"
                onClick={() => onChangeTab("contact")}
              >
                Contact
              </a>
              <a
                className="btnGhost"
                href="#projects"
                onClick={() => onChangeTab("projects")}
              >
                View Projects
              </a>
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
            <div className="links">
              {profile.links.map((l) => (
                <div key={l.label} className="linkLine">
                  <span className="linkLabel">{l.label}:</span>{" "}
                  <span className="linkValue">{l.value}</span>
                </div>
              ))}
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
        >
          POSTS
        </button>
        <button
          className={`tab ${active === "projects" ? "active" : ""}`}
          onClick={() => onChangeTab("projects")}
        >
          PROJECTS
        </button>
        <button
          className={`tab ${active === "skills" ? "active" : ""}`}
          onClick={() => onChangeTab("skills")}
        >
          SKILLS
        </button>
        <button
          className={`tab ${active === "contact" ? "active" : ""}`}
          onClick={() => onChangeTab("contact")}
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
            Replace the placeholders in <b>src/data/profile.js</b> with your
            real links (GitHub, LinkedIn, email).
          </p>
          <div className="contactGrid">
            {profile.links.map((l) => (
              <div className="contactItem" key={l.label}>
                <div className="contactLabel">{l.label}</div>
                <div className="contactValue">{l.value}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Posts grid (default + projects tab) */}
      {active !== "skills" && active !== "contact" ? (
        <section className="postsGrid">
          {gridPosts.map((p) => (
            <PostCard key={p.id} post={p} onOpen={onOpenPost} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
