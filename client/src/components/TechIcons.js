import React from "react";

// Brand New Custom TechQuiz SVG Logo Mark
export function BrandLogo({ size = 38, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Futuristic Outer Glow Gradient */}
        <linearGradient id="tqBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="45%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Inner Hi-Tech Plate */}
        <linearGradient id="tqInnerPlate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.98" />
        </linearGradient>

        {/* Letter 'T' & Code Accent Gradient */}
        <linearGradient id="tqAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        {/* Lightning 'Q' Slash Spark Gradient */}
        <linearGradient id="tqSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>

        <filter id="tqShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Outer Rounded Chamfered Squircle */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="16"
        fill="url(#tqBaseGrad)"
        filter="url(#tqShadow)"
      />

      {/* Inner Hi-Tech Plate */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="13"
        fill="url(#tqInnerPlate)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1"
      />

      {/* Subtle Circuit Grid Accents */}
      <circle cx="14" cy="14" r="1.5" fill="#38BDF8" fillOpacity="0.6" />
      <circle cx="50" cy="14" r="1.5" fill="#C084FC" fillOpacity="0.6" />
      <line x1="14" y1="14" x2="20" y2="14" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="50" y1="14" x2="44" y2="14" stroke="#C084FC" strokeWidth="1" strokeOpacity="0.3" />

      {/* The 'Q' (Quiz Circle / Orbital Shield) */}
      <circle
        cx="32"
        cy="31"
        r="14"
        stroke="url(#tqAccentGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="72 16"
      />

      {/* The 'T' (Tech Crossbar & Central Stem) */}
      <path
        d="M24 23H40"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M32 23V37"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Terminal Code Glyphs on the Sides < > */}
      <path
        d="M14 28L11 31L14 34"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.75"
      />
      <path
        d="M50 28L53 31L50 34"
        stroke="#C084FC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.75"
      />

      {/* The Electric Lightning Bolt Tail completing the 'Q' */}
      <path
        d="M39 36L35 44H41L38 52L49 39H43L46 36H39Z"
        fill="url(#tqSparkGrad)"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Full Brand Logo with Integrated Typography & Theme Sensitivity
export function BrandLogoWithText({
  size = 38,
  theme = "dark",
  onClick,
  subtext = "ASSESSMENT PLATFORM",
}) {
  const isDark = theme === "dark";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
      }}
      onClick={onClick}
    >
      <BrandLogo size={size} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              fontSize: Math.round(size * 0.52),
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: isDark ? "#ffffff" : "#0f172a",
              lineHeight: 1.1,
            }}
          >
            Tech<span style={{ color: "#38bdf8" }}>Quiz</span>
          </span>
          <span
            style={{
              fontSize: Math.max(9, Math.round(size * 0.25)),
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: 6,
              background: isDark ? "rgba(56, 189, 248, 0.15)" : "#e0e7ff",
              color: isDark ? "#38bdf8" : "#4338ca",
              border: isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #c7d2fe",
              lineHeight: 1,
            }}
          >
            .io
          </span>
        </div>
        {subtext && (
          <span
            style={{
              fontSize: Math.max(8, Math.round(size * 0.24)),
              color: isDark ? "#818cf8" : "#6366f1",
              fontWeight: 700,
              letterSpacing: "0.08em",
              lineHeight: 1.2,
              marginTop: 2,
            }}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

// Official JavaScript SVG Badge
export function JavaScriptIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#F7DF1E" />
      <path
        d="M17.5 24.5C18.5 25.2 20 25.7 21.6 25.7C24.4 25.7 25.8 24.3 25.8 22.3C25.8 20.6 24.7 19.8 22.8 19L21.8 18.5C19.9 17.7 18.4 16.9 18.4 14.8C18.4 12.8 19.9 11.2 22.4 11.2C23.9 11.2 24.9 11.6 25.7 12.1L24.8 14.6C24.1 14.2 23.3 13.9 22.3 13.9C21.1 13.9 20.4 14.5 20.4 15.3C20.4 16.2 21.3 16.7 22.8 17.4L23.8 17.8C26 18.8 27.8 20 27.8 22.6C27.8 25.3 25.7 28 21.6 28C19.7 28 18.1 27.4 17 26.6L17.5 24.5ZM9 23.9C9.7 24.4 10.7 24.8 11.8 24.8C13.5 24.8 14.4 24 14.4 21.9V11.5H16.4V22C16.4 25.6 14.4 27 11.7 27C10.2 27 9 26.4 8.2 25.8L9 23.9Z"
        fill="#000000"
      />
    </svg>
  );
}

// Official React SVG Badge
export function ReactIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#1E293B" />
      <circle cx="16" cy="16" r="2.8" fill="#00D8FF" />
      <ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="#00D8FF" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)" stroke="#00D8FF" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(120 16 16)" stroke="#00D8FF" strokeWidth="1.4" />
    </svg>
  );
}

// Official Node.js Hexagon SVG
export function NodeIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0F172A" />
      <path
        d="M16 6L25 11.2V21.6L16 26.8L7 21.6V11.2L16 6Z"
        fill="#339933"
        stroke="#68A063"
        strokeWidth="1.5"
      />
      <path
        d="M16 11V21M16 16L21 13M16 16L11 13"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// MongoDB Leaf SVG
export function MongoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0F2D1A" />
      <path
        d="M15.8 6C15.8 6 11 12 11 17.5C11 21.6 13.2 24.8 15.7 26.2C15.7 26.2 15.6 22.8 15.7 21.7C15.7 20.6 16.1 19.5 16.1 19.5C16.1 19.5 16.5 20.6 16.5 21.7C16.5 22.8 16.4 26.2 16.4 26.2C18.9 24.8 21.1 21.6 21.1 17.5C21.1 12 16.3 6 15.8 6Z"
        fill="#13AA52"
      />
      <path
        d="M15.8 6C15.8 6 15.7 13.8 15.7 26.2C13.2 24.8 11 21.6 11 17.5C11 12 15.8 6 15.8 6Z"
        fill="#47A248"
      />
    </svg>
  );
}

// Full-Stack MERN Stack Icon
export function FullStackIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#312E81" />
      {/* 3 Layered Isometric Cards */}
      <path d="M16 7L24 11L16 15L8 11L16 7Z" fill="#818CF8" />
      <path d="M8 14.5L16 18.5L24 14.5L25 15.5L16 20L7 15.5L8 14.5Z" fill="#6366F1" />
      <path d="M8 19.5L16 23.5L24 19.5L25 20.5L16 25L7 20.5L8 19.5Z" fill="#4F46E5" />
    </svg>
  );
}

// Official Python SVG Badge
export function PythonIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#1E293B" />
      <path
        d="M15.9 6C11.5 6 11.8 7.9 11.8 7.9L11.8 9.9H16.1V10.5H10.1C8.2 10.5 6.6 11.6 6.6 14.1C6.6 16.9 7.8 17.5 9.3 17.5H10.6V15.7C10.6 13.6 12.3 12 14.4 12H18.7C20.3 12 21.6 10.7 21.6 9.1V7.9C21.6 7.9 21.4 6 15.9 6ZM13.8 7.3C14.3 7.3 14.7 7.7 14.7 8.2C14.7 8.7 14.3 9.1 13.8 9.1C13.3 9.1 12.9 8.7 12.9 8.2C12.9 7.7 13.3 7.3 13.8 7.3Z"
        fill="#38BDF8"
      />
      <path
        d="M16.1 26C20.5 26 20.2 24.1 20.2 24.1L20.2 22.1H15.9V21.5H21.9C23.8 21.5 25.4 20.4 25.4 17.9C25.4 15.1 24.2 14.5 22.7 14.5H21.4V16.3C21.4 18.4 19.7 20 17.6 20H13.3C11.7 20 10.4 21.3 10.4 22.9V24.1C10.4 24.1 10.6 26 16.1 26ZM18.2 24.7C17.7 24.7 17.3 24.3 17.3 23.8C17.3 23.3 17.7 22.9 18.2 22.9C18.7 22.9 19.1 23.3 19.1 23.8C19.1 24.3 18.7 24.7 18.2 24.7Z"
        fill="#FACC15"
      />
    </svg>
  );
}

// Official Docker Whale SVG Badge
export function DockerIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0C4A6E" />
      <rect x="7" y="14" width="3" height="2.5" rx="0.5" fill="#38BDF8" />
      <rect x="11" y="14" width="3" height="2.5" rx="0.5" fill="#38BDF8" />
      <rect x="15" y="14" width="3" height="2.5" rx="0.5" fill="#38BDF8" />
      <rect x="11" y="11" width="3" height="2.5" rx="0.5" fill="#38BDF8" />
      <rect x="15" y="11" width="3" height="2.5" rx="0.5" fill="#38BDF8" />
      <rect x="15" y="8" width="3" height="2.5" rx="0.5" fill="#38BDF8" />
      <path
        d="M26.5 17C25.8 17 25.2 17.3 24.8 17.7C23.6 16.8 22 17 22 17C21.7 18.7 20.4 19.8 19 20H8C6.5 20 5.4 18.8 5.4 18.8C5 21.8 7.5 24 11 24C17.5 24 23 22 25.5 18C26 18.2 26.5 18.2 27 18C27.5 17.5 27 17 26.5 17Z"
        fill="#38BDF8"
      />
    </svg>
  );
}

// Java Coffee Cup SVG Badge
export function JavaIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#1E1B4B" />
      <path
        d="M13 10C13 10 14 11 13 13C12 15 14 16 14 16C14 16 13 14 14 13C15 12 14 10 13 10Z"
        fill="#F97316"
      />
      <path
        d="M17 9C17 9 19 11 17 13.5C15 16 18 17 18 17C18 17 16 15 18 13.5C20 12 18 9 17 9Z"
        fill="#EA580C"
      />
      <path
        d="M9 19H21C21 23 18.5 25 15 25C11.5 25 9 23 9 19Z"
        fill="#38BDF8"
      />
      <path
        d="M21 19.5H23C24 19.5 24.5 20.5 24.5 21.5C24.5 22.5 24 23.5 23 23.5H21"
        stroke="#38BDF8"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// AWS & Cloud SVG Badge
export function AwsIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0F172A" />
      <path
        d="M8 15L10 10H12L14 15H12.5L12 13.5H10L9.5 15H8ZM10.4 12.2H11.6L11 10.7L10.4 12.2Z"
        fill="#FFFFFF"
      />
      <path
        d="M14.5 10H16L17.5 14L19 10H20.5L22 14L23.5 10H25L23 15H21.5L20 11.5L18.5 15H17L14.5 10Z"
        fill="#FFFFFF"
      />
      <path
        d="M8 20C13 23 19 23 24 20"
        stroke="#FF9900"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 19L24.5 20.2L22 21.5"
        stroke="#FF9900"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// C / C++ Code Badge
export function CppIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#004482" />
      <path
        d="M15 11C12 11 10 13 10 16C10 19 12 21 15 21C16.5 21 17.5 20.5 18 19.5L16.2 18.5C15.8 19 15.4 19.2 14.8 19.2C13.2 19.2 12.2 18 12.2 16C12.2 14 13.2 12.8 14.8 12.8C15.4 12.8 15.8 13 16.2 13.5L18 12.5C17.5 11.5 16.5 11 15 11Z"
        fill="#FFFFFF"
      />
      <path d="M19 15H22M20.5 13.5V16.5" stroke="#659AD2" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M23 15H26M24.5 13.5V16.5" stroke="#659AD2" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// DevOps & Cloud Infrastructure Icon
export function DevOpsIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#18181B" />
      <path
        d="M12 12C9.5 12 7.5 13.8 7.5 16C7.5 18.2 9.5 20 12 20C14 20 15.5 18.8 16 17.5C16.5 18.8 18 20 20 20C22.5 20 24.5 18.2 24.5 16C24.5 13.8 22.5 12 20 12C18 12 16.5 13.2 16 14.5C15.5 13.2 14 12 12 12Z"
        stroke="url(#devopsGrad)"
        strokeWidth="2.5"
      />
      <defs>
        <linearGradient id="devopsGrad" x1="7" y1="12" x2="25" y2="20">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// General Tech / Computer Science Icon
export function GeneralTechIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0F172A" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#6366F1" />
      <path d="M14 6V10M18 6V10M14 22V26M18 22V26M6 14H10M6 18H10M22 14H26M22 18H26" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
    </svg>
  );
}

// Helper: pick Category Icon automatically
export function CategoryBadgeIcon({ category = "", size = 32 }) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("js") || cat.includes("javascript")) return <JavaScriptIcon size={size} />;
  if (cat.includes("react")) return <ReactIcon size={size} />;
  if (cat.includes("node")) return <NodeIcon size={size} />;
  if (cat.includes("mongo")) return <MongoIcon size={size} />;
  if (cat.includes("full") || cat.includes("stack") || cat.includes("mern")) return <FullStackIcon size={size} />;
  if (cat.includes("python") || cat.includes("py")) return <PythonIcon size={size} />;
  if (cat.includes("docker") || cat.includes("container") || cat.includes("k8s") || cat.includes("kube")) return <DockerIcon size={size} />;
  if (cat.includes("java") && !cat.includes("script")) return <JavaIcon size={size} />;
  if (cat.includes("aws") || cat.includes("cloud")) return <AwsIcon size={size} />;
  if (cat.includes("c++") || cat.includes("cpp") || cat.includes("c#")) return <CppIcon size={size} />;
  if (cat.includes("devops") || cat.includes("git") || cat.includes("ci") || cat.includes("cd")) return <DevOpsIcon size={size} />;
  return <GeneralTechIcon size={size} />;
}

// Modern 3D Gold Trophy SVG
export function TrophyIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="cupStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CA8A04" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
      </defs>
      {/* Base */}
      <rect x="20" y="52" width="24" height="6" rx="2" fill="#334155" />
      <path d="M24 46H40L42 52H22L24 46Z" fill="#475569" />
      {/* Stem */}
      <rect x="30" y="38" width="4" height="8" fill="url(#cupStemGrad)" />
      {/* Cup Body */}
      <path
        d="M18 14H46V25C46 32.732 39.732 39 32 39C24.268 39 18 32.732 18 25V14Z"
        fill="url(#goldCupGrad)"
      />
      {/* Left Handle */}
      <path
        d="M18 18H14C11.7909 18 10 19.7909 10 22C10 25.5 12.8 28.5 16.5 28.9L18 29"
        stroke="#EAB308"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right Handle */}
      <path
        d="M46 18H50C52.2091 18 54 19.7909 54 22C54 25.5 51.2 28.5 47.5 28.9L46 29"
        stroke="#EAB308"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Star on Cup */}
      <path
        d="M32 19L33.5 22.5L37.2 23L34.5 25.5L35.2 29.2L32 27.4L28.8 29.2L29.5 25.5L26.8 23L30.5 22.5L32 19Z"
        fill="#FFFFFF"
      />
      {/* Sparkles */}
      <circle cx="12" cy="12" r="2" fill="#FACC15" />
      <circle cx="52" cy="11" r="2.5" fill="#38BDF8" />
    </svg>
  );
}

// Modern Target Bullseye SVG
export function TargetIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#FEE2E2" />
      <circle cx="32" cy="32" r="22" fill="#FFFFFF" stroke="#EF4444" strokeWidth="3" />
      <circle cx="32" cy="32" r="14" fill="#FEE2E2" />
      <circle cx="32" cy="32" r="7" fill="#EF4444" />
      {/* Arrow hitting bullseye */}
      <path d="M48 16L33 31" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 14L50 14L50 20" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Modern Stopwatch Timer SVG
export function TimerClockSvg({ size = 24, color = "#38BDF8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="8" stroke={color} strokeWidth="2" />
      <path d="M10 2H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M19 6L17.5 7.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

