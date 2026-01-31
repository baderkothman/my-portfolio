import { useEffect, useMemo, useState } from "react";
import { Moon, Sun, Search, Mail, Github, ArrowUpRight } from "lucide-react";
import PostCard from "./components/PostCard";
import PostModal from "./components/PostModal";
import ContactForm from "./components/ContactForm";
import { posts as postsData, profile as profileData } from "./data/profile";

function getLink(links, label) {
  const found = (links || []).find(
    (x) => String(x.label || "").toLowerCase() === String(label).toLowerCase(),
  );
  return found?.value ? String(found.value).trim() : "";
}

function pick(v, fallback = "") {
  return v == null || String(v).trim() === "" ? fallback : String(v);
}

function safeGetTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // ignore
  }

  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;

  return prefersDark ? "dark" : "light";
}

export default function App() {
  // ✅ Stabilize imported data (prevents exhaustive-deps warnings)
  const profile = useMemo(() => profileData || {}, []);
  const posts = useMemo(() => (Array.isArray(postsData) ? postsData : []), []);

  const [activePost, setActivePost] = useState(null);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const [theme, setTheme] = useState(() => safeGetTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const allTags = useMemo(() => {
    const set = new Set();
    for (const p of posts) for (const t of p?.tags || []) set.add(t);
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((p) => {
      const matchesTag = tag === "all" ? true : (p?.tags || []).includes(tag);

      const matchesQuery = !q
        ? true
        : String(p?.title || "")
            .toLowerCase()
            .includes(q) ||
          String(p?.caption || "")
            .toLowerCase()
            .includes(q) ||
          (p?.tags || []).some((t) => String(t).toLowerCase().includes(q));

      return matchesTag && matchesQuery;
    });
  }, [posts, query, tag]);

  const name = pick(profile.name, "Your Name");
  const headline = pick(profile.title, "Full-Stack Developer");
  const location = pick(profile.location, "Lebanon");

  const about =
    Array.isArray(profile.bioLines) && profile.bioLines.length
      ? profile.bioLines.join(" ")
      : "I build reliable, scalable web apps with clean UI and strong fundamentals.";

  const email = getLink(profile.links, "Email");
  const github = getLink(profile.links, "GitHub");
  const linkedin = getLink(profile.links, "LinkedIn");

  const highlights =
    Array.isArray(profile.skills) && profile.skills.length
      ? profile.skills.slice(0, 6)
      : ["React", "Node.js", "REST APIs", "SQL"];

  return (
    <div className="appShell">
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <header className="topBar">
        <div className="topBarInner">
          <div className="brand">
            <span className="brandMark" aria-hidden="true" />
            <span className="brandText">{name}</span>
          </div>

          <nav className="topNav" aria-label="Primary">
            <a className="topNavLink" href="#projects">
              Projects
            </a>
            <a className="topNavLink" href="#about">
              About
            </a>
            <a className="topNavLink" href="#contact">
              Contact
            </a>
          </nav>

          <div className="topBarActions">
            <button
              className="iconBtn"
              type="button"
              aria-label="Toggle theme"
              aria-pressed={theme === "dark"}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="content">
        {/* HERO */}
        <section className="hero card">
          <div className="heroLeft">
            <h1 className="heroTitle">{headline}</h1>
            <p className="heroSub">
              <span className="muted">{location}</span>
            </p>

            <p className="heroAbout">{about}</p>

            <div className="heroCtas">
              {email ? (
                <a className="btnPrimary" href={`mailto:${email}`}>
                  <Mail size={16} aria-hidden="true" />
                  Email
                </a>
              ) : null}

              {github ? (
                <a
                  className="btnGhost"
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} aria-hidden="true" />
                  GitHub <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : null}

              {linkedin ? (
                <a
                  className="btnGhost"
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="heroRight">
            <div className="statGrid" aria-label="Highlights">
              {highlights.map((x) => (
                <div className="statCard" key={x}>
                  <div className="statText">{x}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section">
          <div className="sectionHead">
            <h2 className="sectionTitle">Projects</h2>

            <div className="filters" role="group" aria-label="Project filters">
              <div className="searchWrap">
                <Search size={16} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="searchInput"
                  placeholder="Search projects..."
                  aria-label="Search projects"
                />
              </div>

              <select
                className="select"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                aria-label="Filter by tag"
              >
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "All tags" : t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="projectsGrid" role="list" aria-label="Project list">
            {filteredPosts.map((p) => (
              <div role="listitem" key={p.id || p.title}>
                <PostCard post={p} onOpen={setActivePost} />
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section card sectionCard">
          <h2 className="sectionTitle">About</h2>
          <p className="bodyText">{about}</p>

          {Array.isArray(profile.skills) && profile.skills.length ? (
            <>
              <h3 className="sectionSubtitle">Core skills</h3>
              <div className="chips" aria-label="Skills">
                {profile.skills.slice(0, 18).map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </section>

        {/* CONTACT */}
        <section id="contact" className="section card sectionCard">
          <h2 className="sectionTitle">Contact</h2>
          <p className="bodyText muted">
            Want to collaborate or review a project? Reach out:
          </p>

          <div className="contactRow">
            {email ? (
              <a className="linkPill" href={`mailto:${email}`}>
                Email
              </a>
            ) : null}

            {github ? (
              <a
                className="linkPill"
                href={github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            ) : null}

            {linkedin ? (
              <a
                className="linkPill"
                href={linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            ) : null}
          </div>

          {/* ✅ CONTACT FORM (your existing component) */}
          <div className="contactFormWrap">
            <h3 className="sectionSubtitle">Send a message</h3>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer muted">
        <div className="content footerInner">
          Built with React · {new Date().getFullYear()}
        </div>
      </footer>

      <PostModal post={activePost} onClose={() => setActivePost(null)} />
    </div>
  );
}
