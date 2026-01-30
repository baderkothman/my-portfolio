import { useEffect, useMemo } from "react";
import PostCard from "../components/PostCard";
import ContactForm from "../components/ContactForm";

function getHref(label, value) {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;

  const lower = String(label || "").toLowerCase();
  if (lower === "email") return `mailto:${v}`;
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
  const allPosts = useMemo(() => posts || [], [posts]);
  const pinned = useMemo(() => allPosts.slice(0, 6), [allPosts]);
  const skillsPreview = useMemo(
    () => (profile?.skills || []).slice(0, 10),
    [profile],
  );

  const tabs = [
    { key: "profile", label: "Overview" },
    { key: "projects", label: "Projects" },
    { key: "skills", label: "Skills" },
    { key: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const id =
      active === "projects"
        ? "projects"
        : active === "contact"
          ? "contact"
          : "";
    if (!id) return;

    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <div className="page">
      <section className="profileHeader card" aria-label="Profile header">
        <div className="avatarWrap">
          <div className="avatarRing">
            <div className="avatar" aria-label="Profile avatar">
              {profile?.name?.trim()?.[0]?.toUpperCase() || "B"}
            </div>
          </div>
        </div>

        <div className="profileMeta">
          <div className="profileRow1">
            <div className="profileName">{profile?.username}</div>

            <div className="profileActions">
              <button
                className="btnPrimary"
                type="button"
                onClick={() => onChangeTab("contact")}
              >
                Contact
              </button>

              <button
                className="btnGhost"
                type="button"
                onClick={() => onChangeTab("projects")}
              >
                View Projects
              </button>
            </div>
          </div>

          <div className="statsRow" aria-label="Profile stats">
            <div className="stat">
              <b>{profile?.stats?.posts ?? allPosts.length}</b> posts
            </div>
            <div className="stat">
              <b>{profile?.stats?.projects ?? allPosts.length}</b> projects
            </div>
            <div className="stat">
              <b>{profile?.stats?.years ?? "—"}</b> years
            </div>
          </div>

          <div className="bioBlock">
            <div className="realName">{profile?.name}</div>
            <div className="title">
              {profile?.title}
              {profile?.location ? ` • ${profile.location}` : ""}
            </div>

            <div className="bio">
              {(profile?.bioLines || []).map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>

            <div className="links" aria-label="Profile links">
              {(profile?.links || []).map((l) => {
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

      <section className="tabs" aria-label="Profile navigation">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              className={`tab ${isActive ? "active" : ""}`}
              type="button"
              onClick={() => onChangeTab(t.key)}
              aria-current={isActive ? "page" : undefined}
            >
              {t.label}
            </button>
          );
        })}
      </section>

      {active === "profile" ? (
        <>
          <section className="card sectionPad" aria-label="Pinned projects">
            <h3 className="sectionTitle">Pinned</h3>
            <p className="muted">
              Selected work — open a card for details and repository links.
            </p>

            <div className="postsGrid" aria-label="Pinned projects grid">
              {pinned.map((p) => (
                <PostCard key={p.id} post={p} onOpen={onOpenPost} />
              ))}
            </div>
          </section>

          <section className="card sectionPad" aria-label="Skills preview">
            <h3 className="sectionTitle">Skills</h3>
            <div className="chips">
              {skillsPreview.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="btnGhost"
                type="button"
                onClick={() => onChangeTab("skills")}
              >
                View all skills
              </button>
            </div>
          </section>
        </>
      ) : null}

      {active === "projects" ? (
        <section id="projects" aria-label="Projects">
          <div className="card sectionPad">
            <h3 className="sectionTitle">Projects</h3>
            <p className="muted">
              Each project should have a repository URL (and an optional live
              demo).
            </p>
          </div>

          <div className="postsGrid" aria-label="Projects grid">
            {allPosts.map((p) => (
              <PostCard key={p.id} post={p} onOpen={onOpenPost} />
            ))}
          </div>
        </section>
      ) : null}

      {active === "skills" ? (
        <section className="card sectionPad" aria-label="Skills">
          <h3 className="sectionTitle">Skills</h3>
          <div className="chips">
            {(profile?.skills || []).map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {active === "contact" ? (
        <section id="contact" className="card sectionPad" aria-label="Contact">
          <h3 className="sectionTitle">Contact</h3>
          <p className="muted">Fill the form below to reach me.</p>

          <div className="contactGrid" aria-label="Contact links">
            {(profile?.links || []).map((l) => {
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
    </div>
  );
}
