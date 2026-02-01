import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Routes, Route, Link } from "react-router-dom";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import PostCard from "./components/PostCard";
import PostModal from "./components/PostModal";
import ContactForm from "./components/ContactForm";
import TagDropdown from "./components/TagDropdown";
import CvPage from "./pages/CvPage";

import {
  posts as postsData,
  profile as profileData,
  CV_URL,
} from "./data/profile";

function getLink(links, label) {
  const found = (links || []).find(
    (x) => String(x.label || "").toLowerCase() === String(label).toLowerCase(),
  );
  return found?.value ? String(found.value).trim() : "";
}

function pick(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
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

function HomePage({ theme, setTheme }) {
  // ✅ memoize normalized imports (removes your ESLint warning)
  const profile = useMemo(() => {
    return profileData && typeof profileData === "object" ? profileData : {};
  }, []);

  const posts = useMemo(() => {
    return Array.isArray(postsData) ? postsData : [];
  }, []);

  const [activePost, setActivePost] = useState(null);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [activeSection, setActiveSection] = useState("top");

  const allTags = useMemo(() => {
    const set = new Set(["all"]);
    for (const p of posts) for (const t of p?.tags || []) set.add(String(t));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((p) => {
      const tags = Array.isArray(p?.tags) ? p.tags : [];
      const matchesTag = tag === "all" ? true : tags.includes(tag);

      const matchesQuery = !q
        ? true
        : String(p?.title || "")
            .toLowerCase()
            .includes(q) ||
          String(p?.caption || "")
            .toLowerCase()
            .includes(q) ||
          tags.some((t) => String(t).toLowerCase().includes(q));

      return matchesTag && matchesQuery;
    });
  }, [posts, query, tag]);

  const scrollToId = useCallback((id) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const ids = ["top", "about", "projects", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0),
          )[0];

        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { root: null, threshold: [0.15, 0.25, 0.4, 0.6] },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const name = pick(profile.name, "Your Name");
  const headline = pick(profile.title, "Full-Stack Developer");
  const location = pick(profile.location, "");

  const aboutText =
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

      <TopBar
        name={name}
        theme={theme}
        avatarUrl="/avatar.jpg" // ✅ add this
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        showNav
      />

      <main id="main" className="content">
        {/* HERO / TOP */}
        <section id="top" className="section card sectionCard hero">
          <div className="heroInner">
            <div className="heroLeft">
              <div className="heroKicker muted">
                {location ? location : "Available for work"}
              </div>
              <h1 className="heroTitle">{name}</h1>
              <div className="heroSubtitle">{headline}</div>
              <p className="heroDesc muted">{aboutText}</p>

              <div className="heroActions" aria-label="Primary actions">
                <Link className="btnPrimary" to="/cv">
                  View CV
                </Link>
              </div>
            </div>

            <div className="heroRight" aria-label="Highlights">
              <div className="statGrid">
                {highlights.map((x) => (
                  <div className="statCard" key={x}>
                    <div className="statText">{x}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section card sectionCard">
          <h2 className="sectionTitle">About</h2>

          <p className="bodyText">{aboutText}</p>

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

              <TagDropdown
                value={tag}
                options={allTags}
                onChange={setTag}
                placeholder="All tags"
              />
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

        {/* CONTACT */}
        <section id="contact" className="section card sectionCard">
          <h2 className="sectionTitle">Contact</h2>
          <p className="bodyText muted">
            Want to collaborate or review a project? Send a message:
          </p>

          {email || github || linkedin ? (
            <>
              <h3 className="sectionSubtitle">Direct links</h3>
              <div className="contactRow" aria-label="Contact links">
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
            </>
          ) : null}

          <div className="contactFormWrap">
            <h3 className="sectionSubtitle">Send a message</h3>
            <ContactForm />
          </div>
        </section>
      </main>

      <BottomNav activeId={activeSection} onNavigate={scrollToId} />
      <PostModal post={activePost} onClose={() => setActivePost(null)} />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => safeGetTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0b0f14" : "#f7f7fb");
    }
  }, [theme]);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage theme={theme} setTheme={setTheme} />}
      />
      <Route
        path="/cv"
        element={
          <CvPage
            theme={theme}
            onToggleTheme={() =>
              setTheme((t) => (t === "dark" ? "light" : "dark"))
            }
            cvUrl={CV_URL}
          />
        }
      />
      <Route
        path="*"
        element={<HomePage theme={theme} setTheme={setTheme} />}
      />
    </Routes>
  );
}
