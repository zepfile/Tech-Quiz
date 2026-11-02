import React from "react";

// Modern Hero Banner Illustration for Home Page (Clean Skill Progress & Analytics)
export function HeroDashboardIllustration({ className = "", width = "100%", height = 210 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 460 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="heroCardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="chartBarGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="chartBarGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="chartBarGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="glowCircle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
        </linearGradient>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Background Soft Glow Circles */}
      <circle cx="230" cy="105" r="90" fill="url(#glowCircle)" filter="blur(20px)" />
      <circle cx="360" cy="50" r="45" fill="#38bdf8" fillOpacity="0.2" filter="blur(15px)" />

      {/* Main Glassmorphic Assessment Window */}
      <g filter="url(#cardShadow)">
        <rect x="70" y="24" width="320" height="162" rx="16" fill="url(#heroCardGrad1)" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />
        {/* Window Header */}
        <rect x="70" y="24" width="320" height="34" rx="16" fill="#0f172a" fillOpacity="0.5" />
        <circle cx="92" cy="41" r="4.5" fill="#ef4444" />
        <circle cx="106" cy="41" r="4.5" fill="#f59e0b" />
        <circle cx="120" cy="41" r="4.5" fill="#10b981" />
        <rect x="145" y="34" width="170" height="14" rx="7" fill="#ffffff" fillOpacity="0.15" />

        {/* Developer Skill Progress Chart Bars */}
        <g transform="translate(100, 75)">
          <text x="0" y="0" fill="#ffffff" fontSize="12" fontWeight="700">Skill Proficiency Benchmark</text>
          
          {/* Bar 1 - JavaScript */}
          <rect x="0" y="16" width="220" height="8" rx="4" fill="#ffffff" fillOpacity="0.1" />
          <rect x="0" y="16" width="195" height="8" rx="4" fill="url(#chartBarGrad1)" />
          <text x="228" y="24" fill="#38bdf8" fontSize="11" fontWeight="700">92%</text>

          {/* Bar 2 - React.js */}
          <rect x="0" y="36" width="220" height="8" rx="4" fill="#ffffff" fillOpacity="0.1" />
          <rect x="0" y="36" width="180" height="8" rx="4" fill="url(#chartBarGrad2)" />
          <text x="228" y="44" fill="#c084fc" fontSize="11" fontWeight="700">85%</text>

          {/* Bar 3 - Node & Express */}
          <rect x="0" y="56" width="220" height="8" rx="4" fill="#ffffff" fillOpacity="0.1" />
          <rect x="0" y="56" width="210" height="8" rx="4" fill="url(#chartBarGrad3)" />
          <text x="228" y="64" fill="#4ade80" fontSize="11" fontWeight="700">96%</text>
        </g>
      </g>

      {/* Floating Pill: Verified Student Badge */}
      <g filter="url(#cardShadow)">
        <rect x="30" y="125" width="130" height="44" rx="22" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="52" cy="147" r="12" fill="#059669" />
        <path d="M47 147L50 150L57 143" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="70" y="144" fill="#6ee7b7" fontSize="10" fontWeight="bold">STATUS</text>
        <text x="70" y="157" fill="#ffffff" fontSize="12" fontWeight="700">Certified</text>
      </g>

      {/* Floating Pill: Score & Accuracy */}
      <g filter="url(#cardShadow)">
        <rect x="315" y="125" width="125" height="44" rx="14" fill="#1e1b4b" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="338" cy="147" r="12" fill="#eab308" />
        <path d="M334 142H342V147C342 150 340 152 338 152C336 152 334 150 334 147V142Z" fill="#ffffff" />
        <text x="356" y="143" fill="#fef08a" fontSize="10" fontWeight="bold">PERFORMANCE</text>
        <text x="356" y="157" fill="#ffffff" fontSize="13" fontWeight="800">Top 5%</text>
      </g>

      {/* Code Floating Chips */}
      <g transform="translate(365, 30)">
        <rect width="64" height="28" rx="14" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1" />
        <text x="12" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold">&lt;JS /&gt;</text>
      </g>
      <g transform="translate(18, 50)">
        <rect width="68" height="28" rx="14" fill="#a855f7" fillOpacity="0.2" stroke="#c084fc" strokeWidth="1" />
        <text x="12" y="18" fill="#e9d5ff" fontSize="11" fontWeight="bold">&#123; MERN &#125;</text>
      </g>
    </svg>
  );
}

// Modern Auth Side Illustration for Login & Register
export function AuthHeroIllustration({ width = "100%", height = 340 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 380 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="authGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>

      {/* Background Radial Glow */}
      <circle cx="190" cy="170" r="130" fill="url(#authGlow)" filter="blur(30px)" />

      {/* Tech Quiz Dashboard Preview Box */}
      <rect x="40" y="40" width="300" height="230" rx="20" fill="#1e1b4b" fillOpacity="0.75" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="2" />

      {/* Header bar */}
      <rect x="40" y="40" width="300" height="42" rx="20" fill="#0f172a" fillOpacity="0.6" />
      <circle cx="64" cy="61" r="5" fill="#f43f5e" />
      <circle cx="80" cy="61" r="5" fill="#f59e0b" />
      <circle cx="96" cy="61" r="5" fill="#10b981" />
      <rect x="120" y="54" width="140" height="14" rx="7" fill="#ffffff" fillOpacity="0.15" />

      {/* Center Shield with Spark */}
      <g transform="translate(145, 95)">
        <rect width="90" height="90" rx="24" fill="url(#shieldGrad)" stroke="#818cf8" strokeWidth="2" />
        {/* Shield Icon */}
        <path
          d="M45 22L65 30V48C65 60 56 68 45 72C34 68 25 60 25 48V30L45 22Z"
          fill="#312e81"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Checkmark inside shield */}
        <path d="M38 46L43 51L53 40" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Floating Badges */}
      {/* 1. Verified Candidate */}
      <g transform="translate(25, 180)">
        <rect width="130" height="40" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="22" cy="20" r="10" fill="#059669" />
        <path d="M18 20L21 23L27 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <text x="38" y="18" fill="#6ee7b7" fontSize="10" fontWeight="bold">CANDIDATE</text>
        <text x="38" y="30" fill="#ffffff" fontSize="11" fontWeight="700">Verified</text>
      </g>

      {/* 2. Admin Security */}
      <g transform="translate(225, 180)">
        <rect width="130" height="40" rx="12" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="22" cy="20" r="10" fill="#4f46e5" />
        <path d="M22 14V22M18 18H26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <text x="38" y="18" fill="#a5b4fc" fontSize="10" fontWeight="bold">ADMIN ROLE</text>
        <text x="38" y="30" fill="#ffffff" fontSize="11" fontWeight="700">Full Access</text>
      </g>

      {/* Floating Code Tags */}
      <g transform="translate(50, 105)">
        <rect width="66" height="26" rx="8" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1" />
        <text x="10" y="17" fill="#7dd3fc" fontSize="10" fontWeight="bold">&lt;React /&gt;</text>
      </g>
      <g transform="translate(265, 105)">
        <rect width="68" height="26" rx="8" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1" />
        <text x="12" y="17" fill="#86efac" fontSize="10" fontWeight="bold">node.js</text>
      </g>

      {/* Bottom Summary Bar */}
      <g transform="translate(60, 245)">
        <rect width="260" height="34" rx="10" fill="#0f172a" fillOpacity="0.8" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="18" y="22" fill="#94a3b8" fontSize="11">Security: Anti-inspect answer protection</text>
        <circle cx="240" cy="17" r="4" fill="#10b981" />
      </g>
    </svg>
  );
}

// Victory Illustration for Passed Quiz
export function ExamPassedIllustration({ width = 200, height = 200 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="winGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Background Aura */}
      <circle cx="100" cy="100" r="85" fill="url(#winGlow)" />
      <circle cx="100" cy="100" r="70" stroke="#86efac" strokeWidth="1.5" strokeDasharray="6 6" />

      {/* Confetti / Stars */}
      <path d="M40 50L43 56L50 58L44 63L46 70L40 66L34 70L36 63L30 58L37 56L40 50Z" fill="#facc15" />
      <path d="M160 45L162 49L167 51L163 55L164 60L160 57L156 60L157 55L153 51L158 49L160 45Z" fill="#38bdf8" />
      <circle cx="50" cy="130" r="4" fill="#a855f7" />
      <circle cx="155" cy="120" r="5" fill="#f43f5e" />
      <circle cx="130" cy="35" r="4" fill="#10b981" />
      <circle cx="70" cy="40" r="3" fill="#f59e0b" />

      {/* Trophy Stand */}
      <rect x="68" y="152" width="64" height="14" rx="4" fill="#334155" />
      <path d="M78 138H122L126 152H74L78 138Z" fill="#475569" />
      <rect x="94" y="122" width="12" height="18" fill="#ca8a04" />

      {/* Trophy Cup */}
      <path
        d="M66 60H134V92C134 110.778 118.778 126 100 126C81.2222 126 66 110.778 66 92V60Z"
        fill="url(#trophyGrad)"
      />

      {/* Handles */}
      <path
        d="M66 70H54C47.3726 70 42 75.3726 42 82C42 92.5 50.5 101 61 102L66 102.5"
        stroke="#ca8a04"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M134 70H146C152.627 70 158 75.3726 158 82C158 92.5 149.5 101 139 102L134 102.5"
        stroke="#ca8a04"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Star Crest */}
      <path
        d="M100 74L103.5 82.5L112.5 83.5L106 89.5L107.5 98.5L100 94L92.5 98.5L94 89.5L87.5 83.5L96.5 82.5L100 74Z"
        fill="#ffffff"
      />

      {/* Laurel Wreath */}
      <path
        d="M48 140C44 125 44 105 52 90"
        stroke="#16a34a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M152 140C156 125 156 105 148 90"
        stroke="#16a34a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Diagnostic/Practice Illustration for Failed/Retry Quiz
export function ExamFailedIllustration({ width = 200, height = 200 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="failGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Background Aura */}
      <circle cx="100" cy="100" r="85" fill="url(#failGlow)" />

      {/* Target Board */}
      <circle cx="100" cy="95" r="55" fill="#fee2e2" />
      <circle cx="100" cy="95" r="42" fill="#ffffff" stroke="#ef4444" strokeWidth="4" />
      <circle cx="100" cy="95" r="28" fill="#fee2e2" />
      <circle cx="100" cy="95" r="14" fill="#ef4444" />

      {/* Arrow */}
      <path d="M140 55L102 93" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M132 50L145 50L145 63" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Lightbulb Spark */}
      <circle cx="48" cy="60" r="16" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
      <path d="M48 52V62M43 57H53" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />

      {/* Motivational Book Base */}
      <rect x="55" y="152" width="90" height="14" rx="4" fill="#334155" />
      <rect x="62" y="160" width="76" height="4" fill="#94a3b8" />
    </svg>
  );
}

// Modern Empty State Illustration
export function EmptyDataIllustration({ width = 160, height = 140 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="70" r="50" fill="#f1f5f9" />
      {/* Notebook Document */}
      <rect x="45" y="30" width="55" height="70" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="56" y1="46" x2="88" y2="46" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="58" x2="84" y2="58" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="70" x2="76" y2="70" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      {/* Magnifying Glass */}
      <circle cx="100" cy="85" r="22" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
      <line x1="116" y1="101" x2="132" y2="117" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
      <path d="M93 85L98 90L107 81" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

