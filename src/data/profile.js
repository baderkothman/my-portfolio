export const posts = [
  {
    id: "geo-1",
    title: "Geofencing System",
    caption:
      "Admin dashboard + Flutter apps. Circular zones, enter/exit alerts, logs, CSV export.",
    tags: ["Flutter", "Next.js", "SQL", "Maps"],
    repoUrl: "",
    demoUrl: "",
    iconKey: "geofence",
    details: [
      "Admin dashboard (web): user management, zones configuration, alerts + export.",
      "Mobile apps: user location tracking, zone detection UX, API-driven updates.",
      "Backend: location ingestion + alert generation, persistent logs.",
    ],
    metrics: ["ENTER/EXIT alerts", "CSV export", "Role-based flows"],
  },
  {
    id: "real-1",
    title: "Real Estate SaaS Platform",
    caption:
      "Listings, images, subscription tiers, analytics-ready architecture and UI tokens.",
    tags: ["PHP", "MySQL", "UI/UX"],
    repoUrl: "",
    demoUrl: "",
    iconKey: "realestate",
    details: [
      "SaaS mindset: Free/Pro/Agency tiers concept and scalable structure.",
      "Property CRUD + images, clean branding, reusable UI components.",
    ],
    metrics: ["SaaS-ready structure", "Reusable UI tokens"],
  },
  {
    id: "pos-1",
    title: "Barcode POS / Inventory Concept",
    caption:
      "Planning a barcode-based inventory + sales workflow for a toy store.",
    tags: ["Systems", "DB Design"],
    repoUrl: "",
    demoUrl: "",
    iconKey: "pos",
    details: [
      "Barcode scan -> product lookup -> cart -> receipt.",
      "Inventory import, stock adjustments, sales reports and auditing.",
    ],
    metrics: ["Workflow-first design", "Report-friendly data model"],
  },
  {
    id: "ui-1",
    title: "UI Token System",
    caption:
      "Consistent light/dark tokens, typography, spacing, and component patterns.",
    tags: ["Design System", "CSS"],
    repoUrl: "",
    demoUrl: "",
    iconKey: "designsystem",
    details: [
      "HSL/variable-based palette approach for maintainability.",
      "Layout consistency: radii, shadows, spacing scale, responsive rules.",
    ],
    metrics: ["Dark/light parity", "Reusable components"],
  },
  {
    id: "api-1",
    title: "API Architecture Patterns",
    caption:
      "Clean API client patterns, cookie/session handling, environment-based URLs.",
    tags: ["APIs", "Architecture"],
    repoUrl: "",
    demoUrl: "",
    iconKey: "api",
    details: [
      "Separation of concerns: config, API client, models, and screens.",
      "Safe defaults for emulator/device networking setups.",
    ],
    metrics: ["Maintainable structure", "Deployment-ready thinking"],
  },
  {
    id: "unity-1",
    title: "Unity Education Web Concept",
    caption:
      "Exploring lesson/game structure inside Unity with web delivery considerations.",
    tags: ["Unity", "Learning"],
    repoUrl: "",
    demoUrl: "",
    iconKey: "education",
    details: [
      "Lesson progression, modular scenes, user progress tracking concept.",
      "Performance tradeoffs and lightweight alternatives evaluation.",
    ],
    metrics: ["Modular lessons", "Progress-first planning"],
  },
];

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
    { label: "GitHub", value: "https://github.com/baderkothman" },
    {
      label: "LinkedIn",
      value: "https://www.linkedin.com/in/bader-othman-1a778127a/",
    },
    { label: "Email", value: "bader.k.othman@gmail.com" },
  ],
  stats: {
    posts: posts.length,
    projects: posts.length,
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
