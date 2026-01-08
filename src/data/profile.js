export const profile = {
  name: "Bader Othman",
  username: "baderkothman",
  title: "Full-Stack Developer",
  location: "Lebanon",
  bioLines: [
    "Full-stack developer focused on clean UI, solid architecture, and production-ready delivery.",
    "I build web + mobile products (React/Next.js, Flutter, PHP/Node, SQL) and care about design systems.",
    "Recent work: geofencing dashboards + mobile apps, SaaS-style platforms, and admin panels.",
  ],
  links: [
    { label: "GitHub", value: "github.com/baderkothman" },
    { label: "LinkedIn", value: "linkedin.com/in/your-profile" },
    { label: "Email", value: "youremail@example.com" },
  ],
  highlights: [
    { title: "Design System", subtitle: "Tokens, dark/light" },
    { title: "Geofencing", subtitle: "Flutter + Web" },
    { title: "SaaS", subtitle: "Subscriptions" },
    { title: "Dashboards", subtitle: "Admin panels" },
  ],
  stats: {
    posts: 9,
    projects: 6,
    years: "2+",
  },
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Flutter",
    "Dart",
    "PHP (PDO)",
    "Node.js",
    "MySQL/PostgreSQL",
    "REST APIs",
    "Tailwind/CSS",
    "Git/GitHub",
    "UI Systems",
  ],
};

export const posts = [
  {
    id: "geo-1",
    title: "Geofencing System",
    caption:
      "Admin dashboard + Flutter apps. Circular zones, enter/exit alerts, logs, CSV export.",
    tags: ["Flutter", "Next.js", "SQL", "Maps"],
    details: [
      "Admin dashboard (web): user management, zones configuration, alerts + export.",
      "Mobile apps: user location tracking, zone detection UX, API-driven updates.",
      "Backend: location ingestion + alert generation, persistent logs.",
    ],
    metrics: ["ENTER/EXIT alerts", "CSV export", "Role-based flows"],
    coverEmoji: "🗺️",
  },
  {
    id: "real-1",
    title: "Real Estate SaaS Platform",
    caption:
      "Listings, images, subscription tiers, analytics-ready architecture and UI tokens.",
    tags: ["PHP", "MySQL", "UI/UX"],
    details: [
      "SaaS mindset: Free/Pro/Agency tiers concept and scalable structure.",
      "Property CRUD + images, clean branding, reusable UI components.",
    ],
    metrics: ["SaaS-ready structure", "Reusable UI tokens"],
    coverEmoji: "🏠",
  },
  {
    id: "pos-1",
    title: "Barcode POS / Inventory Concept",
    caption:
      "Planning a barcode-based inventory + sales workflow for a toy store.",
    tags: ["Systems", "DB Design"],
    details: [
      "Barcode scan -> product lookup -> cart -> receipt.",
      "Inventory import, stock adjustments, sales reports and auditing.",
    ],
    metrics: ["Workflow-first design", "Report-friendly data model"],
    coverEmoji: "🏷️",
  },
  {
    id: "ui-1",
    title: "UI Token System",
    caption:
      "Consistent light/dark tokens, typography, spacing, and component patterns.",
    tags: ["Design System", "CSS"],
    details: [
      "HSL/variable-based palette approach for maintainability.",
      "Layout consistency: radii, shadows, spacing scale, responsive rules.",
    ],
    metrics: ["Dark/light parity", "Reusable components"],
    coverEmoji: "🎨",
  },
  {
    id: "api-1",
    title: "API Architecture Patterns",
    caption:
      "Clean API client patterns, cookie/session handling, environment-based URLs.",
    tags: ["APIs", "Architecture"],
    details: [
      "Separation of concerns: config, API client, models, and screens.",
      "Safe defaults for emulator/device networking setups.",
    ],
    metrics: ["Maintainable structure", "Deployment-ready thinking"],
    coverEmoji: "🧩",
  },
  {
    id: "unity-1",
    title: "Unity Education Web Concept",
    caption:
      "Exploring lesson/game structure inside Unity with web delivery considerations.",
    tags: ["Unity", "Learning"],
    details: [
      "Lesson progression, modular scenes, user progress tracking concept.",
      "Performance tradeoffs and lightweight alternatives evaluation.",
    ],
    metrics: ["Modular lessons", "Progress-first planning"],
    coverEmoji: "📚",
  },
  // extra to make the grid feel “alive”
  {
    id: "extra-1",
    title: "Build Notes",
    caption: "Practical debugging + shipping mindset.",
    tags: ["Dev"],
    details: ["Logs, fixes, iterations."],
    metrics: ["Iteration speed"],
    coverEmoji: "🛠️",
  },
  {
    id: "extra-2",
    title: "Design QA",
    caption: "Spacing, contrast, responsiveness checks.",
    tags: ["UI"],
    details: ["Consistency + clarity."],
    metrics: ["Cleaner UI"],
    coverEmoji: "✅",
  },
  {
    id: "extra-3",
    title: "Docs & READMEs",
    caption: "Clear documentation for handoff and reuse.",
    tags: ["Docs"],
    details: ["Structure + setup steps."],
    metrics: ["Easier onboarding"],
    coverEmoji: "📝",
  },
];
