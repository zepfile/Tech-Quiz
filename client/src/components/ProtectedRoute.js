import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { BrandLogo } from "./TechIcons";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Available Quizzes",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-compass-3-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "My History & Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-award-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Sign Out",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-r-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
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
      title: "Candidate View Preview",
      paths: ["/"],
      icon: <i className="ri-eye-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Sign Out",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-r-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/admin/login");
      },
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
        message.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
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

  const isAdmin = Boolean(user?.isAdmin);

  return (
    <div className="layout">
      <div className="flex gap-2 w-full h-full">
        {/* Sidebar */}
        <div
          className="sidebar"
          style={{
            width: collapsed ? "80px" : "240px",
            background: isAdmin
              ? "linear-gradient(180deg, #130f26 0%, #0f172a 100%)"
              : "#0f172a",
          }}
        >
          {/* Brand header */}
          <div
            className="flex items-center gap-3 mb-4 px-2 py-3 border-b border-slate-700/60 cursor-pointer"
            onClick={() => navigate(isAdmin ? "/admin/exams" : "/")}
          >
            <BrandLogo size={36} />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                  TechQuiz<span style={{ color: isAdmin ? "#c084fc" : "#38bdf8" }}>{isAdmin ? ".admin" : ".io"}</span>
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: isAdmin ? "#c084fc" : "#38bdf8",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                  }}
                >
                  {isAdmin ? "ADMIN CONSOLE" : "STUDENT PORTAL"}
                </span>
              </div>
            )}
          </div>

          <div className="menu">
            {menu.map((item, index) => {
              return (
                <div
                  className={`menu-item ${
                    getIsActiveOrNot(item.paths) && "active-menu-item"
                  }`}
                  key={index}
                  onClick={item.onClick}
                  title={collapsed ? item.title : ""}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Body */}
        <div className="body">
          {/* Top Header */}
          <div className="header">
            <div className="flex items-center gap-3">
              <i
                className={collapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"}
                onClick={() => setCollapsed(!collapsed)}
              ></i>
              <span className="text-lg font-bold text-slate-800">
                {isAdmin
                  ? "Administrator Control & Assessment Console"
                  : "Candidate Skill Evaluation & Testing Portal"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </div>
                <span
                  className={`badge ${
                    isAdmin ? "badge-primary" : "badge-success"
                  }`}
                  style={{
                    backgroundColor: isAdmin ? "#f3e8ff" : "#dcfce7",
                    color: isAdmin ? "#7e22ce" : "#15803d",
                  }}
                >
                  {isAdmin ? "Administrator" : "Candidate"}
                </span>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                style={{
                  backgroundColor: isAdmin ? "#f3e8ff" : "#e0e7ff",
                  color: isAdmin ? "#7e22ce" : "#4338ca",
                  borderColor: isAdmin ? "#d8b4fe" : "#c7d2fe",
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
            </div>
          </div>

          {/* Main Page Content */}
          <div className="content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
