import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { BrandLogo, BrandLogoWithText } from "./TechIcons";
import ProfileModal from "./ProfileModal";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  
  // Theme state: Day (Light) vs Night (Dark) mode with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved =
      localStorage.getItem("techquiz_theme") ||
      localStorage.getItem("techquiz_landing_theme");
    return saved ? saved === "dark" : false; // Default: Clean Day mode
  });

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("techquiz_theme", next ? "dark" : "light");
    localStorage.setItem("techquiz_landing_theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const syncTheme = (e) => {
      if (e.key === "techquiz_theme" || e.key === "techquiz_landing_theme") {
        setIsDarkMode(e.newValue === "dark");
      }
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  // Sidebar states:
  // isPinned: whether user locked it open permanently (persisted in localStorage)
  // isHovered: true when mouse arrow enters the sidebar
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem("techquiz_sidebar_pinned");
    return saved !== null ? saved === "true" : true;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sidebar is open if either pinned OR mouse arrow is hovering over it!
  const isExpanded = isPinned || isHovered;

  const togglePin = () => {
    const nextPin = !isPinned;
    setIsPinned(nextPin);
    localStorage.setItem("techquiz_sidebar_pinned", String(nextPin));
    if (nextPin) {
      message.info("Sidebar locked open");
    } else {
      message.info("Auto-expand on hover enabled! Move mouse arrow away to collapse.");
    }
  };

  const isAdmin = Boolean(user?.isAdmin);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userMenu = [
    {
      title: "Available Quizzes",
      paths: ["/", "/home", "/user/write-exam"],
      icon: <i className="ri-compass-3-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Leaderboard & Ranks",
      paths: ["/leaderboard"],
      icon: <i className="ri-trophy-line"></i>,
      onClick: () => navigate("/leaderboard"),
    },
    {
      title: "My History & Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-award-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "My Profile",
      paths: ["/profile"],
      icon: <i className="ri-user-3-line"></i>,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Sign Out",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-r-line"></i>,
      onClick: handleSignOut,
    },
  ];

  const adminMenu = [
    {
      title: "Manage Exams",
      paths: ["/admin/exams"],
      icon: <i className="ri-dashboard-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Add New Exam",
      paths: ["/admin/exams/add"],
      icon: <i className="ri-add-circle-line"></i>,
      onClick: () => navigate("/admin/exams/add"),
    },
    {
      title: "Submissions & Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-file-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Leaderboard & Ranks",
      paths: ["/leaderboard"],
      icon: <i className="ri-trophy-line"></i>,
      onClick: () => navigate("/leaderboard"),
    },
    {
      title: "Admin Profile",
      paths: ["/profile"],
      icon: <i className="ri-shield-user-line"></i>,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Candidate View Preview",
      paths: ["/"],
      icon: <i className="ri-eye-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Sign Out",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-r-line"></i>,
      onClick: handleSignOut,
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        const userData = response.data;
        dispatch(SetUser(userData));

        // Strict Admin Route Guard
        if (requireAdmin && !userData.isAdmin) {
          message.error("Access Denied: Administrator role required to access this portal.");
          navigate("/");
          return;
        }

        if (userData.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(HideLoading());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  const isExamRunner = activeRoute.includes("/user/write-exam");

  return (
    <div className={`layout ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      {/* Authentic Full-Height Anchored Sidebar (Hidden during Proctored Exam) */}
      {!isExamRunner && (
        <aside
          className={`sidebar ${!isExpanded ? "collapsed" : ""} ${
            isHovered && !isPinned ? "hover-active" : ""
          } ${isDarkMode ? "theme-dark" : "theme-light"}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: isExpanded ? "250px" : "74px",
          }}
        >
          {/* Brand header */}
          <div
            className="flex items-center gap-3 mb-4 px-2 py-3"
            style={{
              justifyContent: isExpanded ? "space-between" : "center",
              borderBottom: isDarkMode
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid #e2e8f0",
            }}
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(isAdmin ? "/admin/exams" : "/")}
              title="TechQuiz Home"
            >
              <BrandLogo size={36} />
              {isExpanded && (
                <div className="flex flex-col">
                  <span
                    style={{
                      fontWeight: 800,
                      color: isDarkMode ? "#ffffff" : "#0f172a",
                      fontSize: "16px",
                      letterSpacing: "-0.02em",
                      lineHeight: "1.1",
                    }}
                  >
                    TechQuiz
                    <span style={{ color: isAdmin ? "#a855f7" : "#0284c7" }}>
                      {isAdmin ? ".admin" : ".io"}
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "9.5px",
                      color: isDarkMode
                        ? isAdmin ? "#c084fc" : "#38bdf8"
                        : isAdmin ? "#7c3aed" : "#2563eb",
                      letterSpacing: "0.06em",
                      fontWeight: 700,
                      marginTop: "2px",
                    }}
                  >
                    {isAdmin ? "ADMIN CONSOLE" : "STUDENT PORTAL"}
                  </span>
                </div>
              )}
            </div>
            {isExpanded && (
              <i
                className={isPinned ? "ri-menu-fold-line" : "ri-menu-unfold-line"}
                onClick={togglePin}
                title={
                  isPinned
                    ? "Sidebar is locked open. Click to enable auto-collapse on hover."
                    : "Auto-expand on hover is active. Click to lock sidebar open."
                }
                style={{
                  color: isPinned
                    ? (isDarkMode ? "#818cf8" : "#4f46e5")
                    : (isDarkMode ? "#64748b" : "#94a3b8"),
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                }}
              ></i>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="menu" style={{ flex: 1 }}>
            {menu.map((item, index) => {
              const isActive = getIsActiveOrNot(item.paths);
              return (
                <div
                  className={`menu-item ${isActive ? "active-menu-item" : ""}`}
                  key={index}
                  onClick={item.onClick}
                  title={!isExpanded ? item.title : ""}
                >
                  {item.icon}
                  {isExpanded && <span>{item.title}</span>}
                </div>
              );
            })}
          </nav>

          {/* Day / Night Theme Toggle Switcher */}
          <div
            className="sidebar-theme-btn"
            onClick={toggleTheme}
            title={
              isDarkMode
                ? "Currently Night Mode. Click for Day Mode ☀️"
                : "Currently Day Mode. Click for Night Mode 🌙"
            }
            style={{
              marginBottom: "10px",
              padding: isExpanded ? "9px 12px" : "9px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: isExpanded ? "space-between" : "center",
              cursor: "pointer",
              borderRadius: "10px",
            }}
          >
            {isExpanded ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{isDarkMode ? "🌙" : "☀️"}</span>
                  <span style={{ fontSize: "12.5px", fontWeight: 600 }}>
                    {isDarkMode ? "Night Mode" : "Day Mode"}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 7px",
                    borderRadius: "6px",
                    background: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "#e2e8f0",
                    color: isDarkMode ? "#cbd5e1" : "#475569",
                    fontWeight: 600,
                  }}
                >
                  {isDarkMode ? "Switch ☀️" : "Switch 🌙"}
                </span>
              </>
            ) : (
              <span
                style={{ fontSize: 18 }}
                title={isDarkMode ? "Night Mode (click for Day)" : "Day Mode (click for Night)"}
              >
                {isDarkMode ? "🌙" : "☀️"}
              </span>
            )}
          </div>

          {/* Bottom Sidebar User Profile Card */}
          {user && (
            <div
              className="sidebar-user-footer"
              onClick={() => navigate("/profile")}
              title="Click to view full profile & settings"
              style={{
                padding: isExpanded ? "10px 12px" : "10px 0",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: isExpanded ? "flex-start" : "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: isAdmin
                    ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                    : "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              {isExpanded && (
                <div style={{ overflow: "hidden", flex: 1 }}>
                  <div
                    style={{
                      color: isDarkMode ? "#f8fafc" : "#0f172a",
                      fontSize: "13px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.name}
                  </div>
                  <div
                    style={{
                      color: isDarkMode ? "#94a3b8" : "#64748b",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#10b981",
                        display: "inline-block",
                      }}
                    ></span>
                    {isAdmin ? "Admin • Console" : "Online • Candidate"}
                  </div>
                </div>
              )}
              {isExpanded && (
                <i
                  className="ri-arrow-right-s-line"
                  style={{
                    color: isDarkMode ? "#94a3b8" : "#64748b",
                    fontSize: 18,
                  }}
                ></i>
              )}
            </div>
          )}
        </aside>
      )}

      {/* Main Workspace Body */}
      <main className="body">
        {/* Top Header - only shown during proctored exams */}
        {isExamRunner && (
          <div className="header" style={{ marginBottom: 14 }}>
            <div className="flex items-center gap-3">
              <BrandLogo size={32} />
              <div>
                <span className="font-extrabold text-slate-800 text-base">
                  TechQuiz • Assessment Runner
                </span>
                <span
                  className="badge badge-primary ml-2"
                  style={{ fontSize: 10, background: "#e0e7ff", color: "#4338ca" }}
                >
                  FULL PAGE PROCTORED
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">
                Candidate: <strong>{user?.name}</strong>
              </span>
              <button
                type="button"
                className="primary-outlined-btn"
                style={{ height: 32, padding: "0 12px", fontSize: 12, borderRadius: 8 }}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to exit the examination? Any unsaved responses will be discarded."
                    )
                  ) {
                    navigate("/");
                  }
                }}
              >
                <i className="ri-close-line"></i> Exit Exam
              </button>
            </div>
          </div>
        )}

        {/* Main Page Content */}
        <div className={`content ${isDarkMode ? "theme-dark" : "theme-light"}`}>
          {children}
        </div>
      </main>

      {/* Modern Profile Modal */}
      <ProfileModal
        visible={showProfileModal}
        onCancel={() => setShowProfileModal(false)}
        user={user}
        onLogout={handleSignOut}
      />
    </div>
  );
}

export default ProtectedRoute;
