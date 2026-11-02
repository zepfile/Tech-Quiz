import React, { useState } from "react";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { BrandLogoWithText, CategoryBadgeIcon } from "../../../components/TechIcons";
import { HeroDashboardIllustration } from "../../../components/SvgIllustrations";

function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Day & Night mode state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved =
      localStorage.getItem("techquiz_theme") ||
      localStorage.getItem("techquiz_landing_theme");
    return saved ? saved === "dark" : false; // Clean Day mode default
  });

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("techquiz_theme", next ? "dark" : "light");
    localStorage.setItem("techquiz_landing_theme", next ? "dark" : "light");
  };

  // Color theme tokens for Day vs Night
  const theme = {
    bg: isDarkMode ? "#0b0f19" : "#f8fafc",
    textPrimary: isDarkMode ? "#ffffff" : "#0f172a",
    textSecondary: isDarkMode ? "#94a3b8" : "#475569",
    textMuted: isDarkMode ? "#64748b" : "#64748b",
    navBg: isDarkMode ? "rgba(11, 15, 25, 0.88)" : "rgba(255, 255, 255, 0.92)",
    navBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    navLink: isDarkMode ? "#cbd5e1" : "#475569",
    navLinkHover: isDarkMode ? "#ffffff" : "#0f172a",
    themeToggleBg: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    themeToggleBorder: isDarkMode ? "rgba(255, 255, 255, 0.16)" : "#cbd5e1",
    themeToggleText: isDarkMode ? "#f8fafc" : "#0f172a",
    tagBg: isDarkMode ? "rgba(99, 102, 241, 0.15)" : "#e0e7ff",
    tagBorder: isDarkMode ? "rgba(129, 140, 248, 0.3)" : "#c7d2fe",
    tagColor: isDarkMode ? "#a5b4fc" : "#4338ca",
    cardBg: isDarkMode ? "rgba(15, 23, 42, 0.6)" : "#ffffff",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
    featureCardBg: isDarkMode ? "#111827" : "#ffffff",
    featureCardBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    featureCardShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 18px rgba(15, 23, 42, 0.06)",
    metricsBg: isDarkMode ? "rgba(15, 23, 42, 0.5)" : "#f1f5f9",
    metricsBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    sectionAltBg: isDarkMode ? "rgba(15, 23, 42, 0.4)" : "#f1f5f9",
    sectionAltBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    stepCardBg: isDarkMode ? "rgba(15, 23, 42, 0.6)" : "#ffffff",
    stepCardBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    stepCardShadow: isDarkMode ? "none" : "0 4px 16px rgba(15, 23, 42, 0.05)",
    stepNumberColor: isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)",
    footerBg: isDarkMode ? "#070a10" : "#ffffff",
    footerBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    heroIllustrationBg: isDarkMode
      ? "linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    heroIllustrationBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#cbd5e1",
    heroIllustrationShadow: isDarkMode ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)" : "0 20px 40px -10px rgba(15, 23, 42, 0.12)",
    ambientGlow: isDarkMode
      ? "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(11, 15, 25, 0) 70%)"
      : "radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(248, 250, 252, 0) 70%)",
  };

  const featuredTracks = [
    {
      name: "React.js Ecosystem",
      category: "React.js",
      desc: "Hooks, Virtual DOM, Redux, Performance Profiling & Component Architecture",
      questions: "25+ MCQs",
      time: "20 Mins",
    },
    {
      name: "Node.js & Express",
      category: "NodeJS",
      desc: "Event Loop, Async I/O, REST APIs, Middleware Pipelines & JWT Security",
      questions: "20+ MCQs",
      time: "15 Mins",
    },
    {
      name: "JavaScript Core (ES6+)",
      category: "JavaScript",
      desc: "Closures, Prototypes, Event Delegation, Promises, Microtasks & Scope",
      questions: "30+ MCQs",
      time: "25 Mins",
    },
    {
      name: "MongoDB & Data Modeling",
      category: "MongoDB",
      desc: "Document Schemas, Aggregation Pipelines, Indexing Strategies & Mongoose",
      questions: "15+ MCQs",
      time: "15 Mins",
    },
    {
      name: "Full-Stack MERN",
      category: "Full Stack",
      desc: "End-to-End Architectural Integration, CRUD Ops, State Sync & Deployment",
      questions: "35+ MCQs",
      time: "30 Mins",
    },
    {
      name: "Python Core Engineering",
      category: "Python",
      desc: "Data Structures, OOP, Generators, Comprehensions & Standard Library",
      questions: "20+ MCQs",
      time: "15 Mins",
    },
  ];

  const features = [
    {
      icon: "ri-shield-check-fill",
      color: "#10b981",
      bg: "#ecfdf5",
      title: "Anti-Cheating Proctoring",
      desc: "Fullscreen enforcement, tab-switch / window-blur tracking with a 3-strike policy, plus right-click and copy-paste lockdown.",
    },
    {
      icon: "ri-timer-flash-line",
      color: "#f59e0b",
      bg: "#fffbeb",
      title: "Real-Time Timed Engine",
      desc: "Simulate rigorous interview time constraints with dynamic per-exam countdowns and live question palettes.",
    },
    {
      icon: "ri-lightbulb-flash-line",
      color: "#6366f1",
      bg: "#eef2ff",
      title: "Deep Concept Explanations",
      desc: "Review questions post-assessment with detailed solution breakdowns to reinforce technical mastery and learn from mistakes.",
    },
    {
      icon: "ri-trophy-line",
      color: "#eab308",
      bg: "#fefce8",
      title: "Global Leaderboard Podium",
      desc: "Compete with top developers worldwide. View Gold, Silver, and Bronze podium standings with real-time accuracy metrics.",
    },
    {
      icon: "ri-award-fill",
      color: "#06b6d4",
      bg: "#ecfeff",
      title: "Verifiable PDF Certificates",
      desc: "Earn formal certificates with unique verification IDs, candidate score breakdown, and print-ready PDF styling upon passing.",
    },
    {
      icon: "ri-file-excel-2-line",
      color: "#8b5cf6",
      bg: "#f5f3ff",
      title: "Bulk Tools & CSV Exports",
      desc: "Admins can import 50+ questions via CSV in one click. Candidates can export their complete test progression to spreadsheets.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Pick Your Technology Track",
      desc: "Select from curated technical assessments spanning JavaScript, React, Node, MongoDB, and Python.",
    },
    {
      step: "02",
      title: "Take The Proctored Assessment",
      desc: "Answer timed MCQs with proctoring safeguards, negative marking evaluations, and active question navigation.",
    },
    {
      step: "03",
      title: "Get Certified & Climb Ranks",
      desc: "Analyze score reports, study concept explanations, download verified PDF certificates, and climb the leaderboard.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowX: "hidden",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* 1. STICKY MODERN NAVBAR */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: theme.navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.navBorder}`,
          padding: "16px 32px",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Brand Logo with New TechQuiz SVG */}
          <BrandLogoWithText
            size={38}
            theme={isDarkMode ? "dark" : "light"}
            onClick={() => navigate("/")}
            subtext="ASSESSMENT PLATFORM"
          />

          {/* Quick Links (Hidden on tiny screens) */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden-mobile">
            <a href="#tracks" style={{ color: theme.navLink, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              Assessment Tracks
            </a>
            <a href="#features" style={{ color: theme.navLink, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              Features
            </a>
            <a href="#how-it-works" style={{ color: theme.navLink, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              How It Works
            </a>
            <span
              onClick={() => navigate("/leaderboard")}
              style={{ color: "#eab308", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              <i className="ri-trophy-line"></i> Leaderboard
            </span>
          </div>

          {/* Controls: Day/Night Theme Toggle + Auth Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Day & Night Mode Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Day Mode (Light Theme)" : "Switch to Night Mode (Dark Theme)"}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: theme.themeToggleBg,
                border: `1px solid ${theme.themeToggleBorder}`,
                color: theme.themeToggleText,
                transition: "all 0.25s ease",
                boxShadow: isDarkMode ? "none" : "0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              {isDarkMode ? (
                <>
                  <i className="ri-sun-fill" style={{ color: "#facc15", fontSize: 16 }}></i>
                  <span style={{ fontSize: 12 }}>Day</span>
                </>
              ) : (
                <>
                  <i className="ri-moon-fill" style={{ color: "#6366f1", fontSize: 16 }}></i>
                  <span style={{ fontSize: 12 }}>Night</span>
                </>
              )}
            </button>

            {isLoggedIn ? (
              <button
                type="button"
                className="primary-contained-btn"
                onClick={() => navigate("/")}
                style={{
                  height: 38,
                  padding: "0 20px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                }}
              >
                Go to Portal 🚀
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="primary-outlined-btn"
                  onClick={() => navigate("/login")}
                  style={{
                    height: 38,
                    padding: "0 18px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#cbd5e1",
                    color: isDarkMode ? "#ffffff" : "#0f172a",
                    backgroundColor: isDarkMode ? "transparent" : "#ffffff",
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="primary-contained-btn"
                  onClick={() => navigate("/register")}
                  style={{
                    height: 38,
                    padding: "0 20px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  }}
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{ padding: "80px 24px 60px 24px", position: "relative" }}>
        {/* Ambient Gradient Glow */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: theme.ambientGlow,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Top Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: theme.tagBg,
              border: `1px solid ${theme.tagBorder}`,
              padding: "6px 18px",
              borderRadius: 30,
              marginBottom: 24,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.tagColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              ENTERPRISE-GRADE TECHNICAL ASSESSMENTS
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(34px, 5.5vw, 58px)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: 960,
              margin: "0 auto 20px auto",
              color: theme.textPrimary,
            }}
          >
            Validate & Elevate Your Developer Skills With{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Precision Assessments
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: theme.textSecondary,
              maxWidth: 760,
              margin: "0 auto 36px auto",
              lineHeight: 1.6,
            }}
          >
            A proctored, anti-cheat, verified evaluation platform built for developers, students, and engineering leads.
            Take timed MCQs, study concept solution breakdowns, compete on leaderboards, and download official certificates.
          </p>

          {/* Dual Action CTAs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 50,
            }}
          >
            <button
              type="button"
              className="primary-contained-btn"
              onClick={() => navigate(isLoggedIn ? "/" : "/register")}
              style={{
                height: 48,
                padding: "0 28px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)",
              }}
            >
              <span>Start Free Assessment</span>
              <i className="ri-arrow-right-line" style={{ marginLeft: 6 }}></i>
            </button>

            <button
              type="button"
              className="primary-outlined-btn"
              onClick={() => navigate("/leaderboard")}
              style={{
                height: 48,
                padding: "0 24px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#cbd5e1",
                color: isDarkMode ? "#ffffff" : "#0f172a",
                background: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <i className="ri-trophy-line" style={{ color: "#facc15", marginRight: 6 }}></i>
              <span>View Leaderboard</span>
            </button>
          </div>

          {/* Interactive Hero Illustration & Live Mockup */}
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              borderRadius: 20,
              padding: "16px",
              background: theme.heroIllustrationBg,
              border: `1px solid ${theme.heroIllustrationBorder}`,
              boxShadow: theme.heroIllustrationShadow,
              transition: "all 0.3s ease",
            }}
          >
            <HeroDashboardIllustration height={260} />
          </div>
        </div>
      </section>

      {/* 3. METRICS STRIP */}
      <section
        style={{
          borderTop: `1px solid ${theme.metricsBorder}`,
          borderBottom: `1px solid ${theme.metricsBorder}`,
          backgroundColor: theme.metricsBg,
          padding: "36px 24px",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Row gutter={[24, 24]} justify="center">
            {[
              { num: "50+ Curated", label: "Technical Assessment Modules" },
              { num: "100% Proctored", label: "Anti-Cheating Verification" },
              { num: "0.00s Instant", label: "Score & PDF Certificate Generation" },
              { num: "4.9 / 5.0", label: "Candidate Satisfaction Score" },
            ].map((metric, i) => (
              <Col xs={12} sm={6} key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: theme.textPrimary }}>
                  {metric.num}
                </div>
                <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>
                  {metric.label}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 4. FEATURED ASSESSMENT TRACKS */}
      <section id="tracks" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            READY-TO-EVALUATE MODULES
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: theme.textPrimary, marginTop: 8 }}>
            Curated Assessment Tracks
          </h2>
          <p style={{ color: theme.textSecondary, fontSize: 15, maxWidth: 600, margin: "8px auto 0 auto" }}>
            Explore standardized technical evaluations across contemporary web engineering domains.
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {featuredTracks.map((track, idx) => (
            <Col xs={24} sm={12} lg={8} key={idx}>
              <div
                className="card"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: 18,
                  padding: "24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, border-color 0.2s ease, background-color 0.3s ease",
                  boxShadow: isDarkMode ? "none" : "0 4px 16px rgba(15, 23, 42, 0.05)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <CategoryBadgeIcon category={track.category} size={42} />
                    <span
                      style={{
                        backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "#e0e7ff",
                        color: isDarkMode ? "#a5b4fc" : "#4338ca",
                        border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.3)" : "#c7d2fe"}`,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {track.time}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
                    {track.name}
                  </h3>
                  <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5, marginBottom: 18 }}>
                    {track.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: `1px solid ${theme.cardBorder}`,
                    paddingTop: 16,
                  }}
                >
                  <span style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>
                    {track.questions}
                  </span>
                  <button
                    type="button"
                    className="primary-outlined-btn"
                    onClick={() => navigate(isLoggedIn ? "/" : "/login")}
                    style={{
                      height: 32,
                      padding: "0 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      borderColor: "#0284c7",
                      color: isDarkMode ? "#38bdf8" : "#0284c7",
                      backgroundColor: isDarkMode ? "transparent" : "#f0f9ff",
                    }}
                  >
                    Start Track
                  </button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* 5. PLATFORM FEATURES GRID */}
      <section
        id="features"
        style={{
          padding: "80px 24px",
          backgroundColor: theme.sectionAltBg,
          borderTop: `1px solid ${theme.sectionAltBorder}`,
          borderBottom: `1px solid ${theme.sectionAltBorder}`,
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              ENTERPRISE CAPABILITIES
            </span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: theme.textPrimary, marginTop: 8 }}>
              Built For Serious Technical Evaluations
            </h2>
            <p style={{ color: theme.textSecondary, fontSize: 15, maxWidth: 640, margin: "8px auto 0 auto" }}>
              Everything needed to conduct clean, proctored, verifiable technical evaluations at scale.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feat, idx) => (
              <Col xs={24} sm={12} lg={8} key={idx}>
                <div
                  className="card"
                  style={{
                    backgroundColor: theme.featureCardBg,
                    border: `1px solid ${theme.featureCardBorder}`,
                    borderRadius: 18,
                    padding: "28px 24px",
                    height: "100%",
                    boxShadow: theme.featureCardShadow,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: feat.bg,
                      color: feat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      marginBottom: 18,
                    }}
                  >
                    <i className={feat.icon}></i>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 6. HOW IT WORKS WORKFLOW */}
      <section id="how-it-works" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            SEAMLESS EXPERIENCE
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: theme.textPrimary, marginTop: 8 }}>
            How TechQuiz Works
          </h2>
          <p style={{ color: theme.textSecondary, fontSize: 15, maxWidth: 600, margin: "8px auto 0 auto" }}>
            Three simple steps to benchmark your capabilities and earn official proof of proficiency.
          </p>
        </div>

        <Row gutter={[32, 24]}>
          {workflowSteps.map((step, idx) => (
            <Col xs={24} md={8} key={idx}>
              <div
                style={{
                  backgroundColor: theme.stepCardBg,
                  border: `1px solid ${theme.stepCardBorder}`,
                  borderRadius: 18,
                  padding: "32px 24px",
                  height: "100%",
                  position: "relative",
                  boxShadow: theme.stepCardShadow,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: theme.stepNumberColor,
                    marginBottom: 12,
                    fontFamily: "monospace",
                  }}
                >
                  {step.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* 7. BOTTOM HERO CALL TO ACTION */}
      <section style={{ padding: "40px 24px 80px 24px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4f46e5 100%)",
            borderRadius: 24,
            padding: "50px 36px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(49, 46, 129, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, color: "#ffffff", margin: "0 0 12px 0" }}>
            Ready to Prove Your Technical Expertise?
          </h2>
          <p style={{ fontSize: 16, color: "#e0e7ff", maxWidth: 640, margin: "0 auto 32px auto", lineHeight: 1.6 }}>
            Join candidates benchmarks across modern full-stack web technologies. Free access to timed assessments and instant certificate evaluation.
          </p>

          <button
            type="button"
            className="primary-contained-btn"
            onClick={() => navigate(isLoggedIn ? "/" : "/register")}
            style={{
              height: 48,
              padding: "0 32px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 800,
              backgroundColor: "#ffffff",
              color: "#312e81",
              border: "none",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <span>{isLoggedIn ? "Access Quiz Tracks" : "Create Free Account Now"}</span>
            <i className="ri-arrow-right-line" style={{ marginLeft: 6 }}></i>
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer
        style={{
          borderTop: `1px solid ${theme.footerBorder}`,
          backgroundColor: theme.footerBg,
          padding: "36px 24px",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <BrandLogoWithText
            size={30}
            theme={isDarkMode ? "dark" : "light"}
            onClick={() => navigate("/")}
            subtext=""
          />

          <div style={{ fontSize: 13, color: theme.textMuted }}>
            © {new Date().getFullYear()} TechQuiz Platform. Built on full-stack MERN (MongoDB Atlas, Express, React, Node.js).
          </div>

          <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
            <span
              onClick={() => navigate("/leaderboard")}
              style={{ color: theme.textSecondary, cursor: "pointer" }}
            >
              Leaderboard
            </span>
            <span
              onClick={() => navigate("/login")}
              style={{ color: theme.textSecondary, cursor: "pointer" }}
            >
              Sign In
            </span>
            <span
              onClick={() => navigate("/register")}
              style={{ color: theme.textSecondary, cursor: "pointer" }}
            >
              Register
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
