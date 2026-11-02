import { Form, message, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { BrandLogo } from "../../../components/TechIcons";
import { AuthHeroIllustration } from "../../../components/SvgIllustrations";

function Login({ defaultRole = "candidate" }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePortal, setActivePortal] = useState(
    location.pathname.includes("/admin") ? "admin" : defaultRole
  );

  useEffect(() => {
    setActivePortal(location.pathname.includes("/admin") ? "admin" : "candidate");
    form.resetFields();
  }, [location.pathname]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        // Enforce Portal Separation
        if (activePortal === "admin" && !response.isAdmin) {
          message.error("Access Denied: This account does not have Administrator privileges. Please sign in via the Candidate Portal.");
          return;
        }

        message.success(response.message);
        localStorage.setItem("token", response.data);

        if (response.isAdmin) {
          window.location.href = "/admin/exams";
        } else {
          window.location.href = "/";
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const isAdminPortal = activePortal === "admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isAdminPortal
          ? "linear-gradient(135deg, #090514 0%, #170f2c 50%, #2e1065 100%)"
          : "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #312e81 100%)",
        padding: "24px",
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "940px",
          borderRadius: "24px",
          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.45)",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Row>
          {/* Left Hero Column */}
          <Col
            xs={24}
            md={12}
            style={{
              background: isAdminPortal
                ? "linear-gradient(145deg, #130a24 0%, #2e1065 100%)"
                : "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <BrandLogo size={40} />
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em" }}>
                    TechQuiz<span style={{ color: isAdminPortal ? "#c084fc" : "#38bdf8" }}>{isAdminPortal ? ".admin" : ".io"}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: isAdminPortal ? "#c084fc" : "#818cf8",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {isAdminPortal ? "ADMIN CONSOLE & AUDIT" : "CANDIDATE ASSESSMENT PORTAL"}
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "14px 0 8px 0" }}>
                {isAdminPortal
                  ? "Manage examinations, question banks, and submissions"
                  : "Empowering developers with real-world assessments"}
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", margin: 0 }}>
                {isAdminPortal
                  ? "Full administrative control over candidate evaluations, scoring thresholds, and quiz catalog."
                  : "Practice MERN stack concepts, test your speed, and get certified reports."}
              </p>
            </div>

            <div style={{ margin: "20px 0", textAlign: "center" }}>
              <AuthHeroIllustration height={210} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "#cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> {isAdminPortal ? "Direct database-synced question management" : "Real-time anti-cheat answer verification"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> {isAdminPortal ? "Audit logs with pass/fail evaluation filters" : "Timed tests with instant score breakdown"}
              </div>
            </div>
          </Col>

          {/* Right Form Column */}
          <Col
            xs={24}
            md={12}
            style={{
              backgroundColor: "#ffffff",
              padding: "36px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Dedicated Portal Selector Tabs */}
            <div
              style={{
                display: "flex",
                backgroundColor: "#f1f5f9",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActivePortal("candidate");
                  navigate("/login");
                }}
                style={{
                  flex: 1,
                  height: "36px",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: !isAdminPortal ? "#ffffff" : "transparent",
                  color: !isAdminPortal ? "#4f46e5" : "#64748b",
                  boxShadow: !isAdminPortal ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                  cursor: "pointer",
                }}
              >
                <i className="ri-user-line"></i> Candidate Portal
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortal("admin");
                  navigate("/admin/login");
                }}
                style={{
                  flex: 1,
                  height: "36px",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: isAdminPortal ? "#ffffff" : "transparent",
                  color: isAdminPortal ? "#7e22ce" : "#64748b",
                  boxShadow: isAdminPortal ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                  cursor: "pointer",
                }}
              >
                <i className="ri-shield-user-line"></i> Administrator Portal
              </button>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: isAdminPortal ? "#f3e8ff" : "#e0e7ff",
                    color: isAdminPortal ? "#7e22ce" : "#4338ca",
                    fontSize: "11px",
                  }}
                >
                  {isAdminPortal ? "ADMIN CONSOLE SIGN IN" : "CANDIDATE SIGN IN"}
                </span>
              </div>
              <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                {isAdminPortal ? "Administrator Access" : "Welcome Back"}
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                {isAdminPortal
                  ? "Sign in with your administrative credentials"
                  : "Sign in to take quizzes and view your score reports"}
              </p>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <input
                  type="email"
                  placeholder={isAdminPortal ? "admin@quiz.com" : "user@quiz.com"}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <input type="password" placeholder="Enter your password" />
              </Form.Item>

              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                  type="submit"
                  className="primary-contained-btn"
                  style={{
                    width: "100%",
                    height: "44px",
                    background: isAdminPortal
                      ? "linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)"
                      : "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                  }}
                >
                  <i className={isAdminPortal ? "ri-shield-keyhole-line" : "ri-login-box-line"}></i>
                  {isAdminPortal ? "Sign In to Admin Console" : "Sign In to Candidate Portal"}
                </button>

                <div style={{ textAlign: "center", fontSize: "13px", color: "#64748b" }}>
                  Don't have an account?{" "}
                  <Link to="/register" style={{ fontWeight: "600", color: "#4f46e5" }}>
                    Create account here
                  </Link>
                </div>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Login;
