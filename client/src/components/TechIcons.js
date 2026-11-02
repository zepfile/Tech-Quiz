import React from "react";

// Modern Brand Logo (Hexagonal Gradient with Tech Spark)
export function BrandLogo({ size = 38, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brandHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4f46e5" floodOpacity="0.35" />
        </filter>
      </defs>
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="12"
        fill="url(#brandHexGrad)"
        filter="url(#logoGlow)"
      />
      {/* Code Brackets */}
      <path
        d="M16 19L11 24L16 29"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.8"
      />
      <path
        d="M32 19L37 24L32 29"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.8"
      />
      {/* Central Lightning Quiz Spark */}
      <path
        d="M26 12L19 25H25L22 36L31 22H24L26 12Z"
        fill="url(#boltGrad)"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
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

