import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { BrandLogo } from "./TechIcons";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-4-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "My Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-box-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Logout",
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
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-4-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Manage Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-3-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "All Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-pie-chart-2-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-r-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
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

  return (
    <div className="layout">
      <div className="flex gap-2 w-full h-full">
        {/* Sidebar */}
        <div className="sidebar" style={{ width: collapsed ? "80px" : "240px" }}>
          {/* Brand header */}
          <div
            className="flex items-center gap-3 mb-4 px-2 py-3 border-b border-slate-700/60 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <BrandLogo size={36} />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                  TechQuiz<span style={{ color: "#38bdf8" }}>.io</span>
                </span>
                <span style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "0.05em", fontWeight: 600 }}>
                  ASSESSMENT PLATFORM
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
                Examination & Assessment Portal
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </div>
                <span
                  className={`badge ${
                    user?.isAdmin ? "badge-primary" : "badge-success"
                  }`}
                >
                  {user?.isAdmin ? "Admin" : "Candidate"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
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
