import { Form, message, Row, Col } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { SetUser } from "../../../redux/usersSlice";
import { BrandLogo } from "../../../components/TechIcons";
import { AuthHeroIllustration } from "../../../components/SvgIllustrations";

function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        if (response.user) {
          dispatch(SetUser(response.user));
        }

        // Instant Single Page Navigation (No page reload)
        if (response.isAdmin) {
          navigate("/admin/exams");
        } else {
          navigate("/");
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #312e81 100%)",
        padding: "24px",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "920px",
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
              background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
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
                    TechQuiz<span style={{ color: "#38bdf8" }}>.io</span>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#818cf8",
                      letterSpacing: "0.06em",
                    }}
                  >
                    ASSESSMENT PLATFORM
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "14px 0 8px 0" }}>
                Empowering developers with real-world technical assessments
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", margin: 0 }}>
                Practice MERN stack concepts, test your speed, compete on leaderboards, and earn verified skill certificates.
              </p>
            </div>

            <div style={{ margin: "20px 0", textAlign: "center" }}>
              <AuthHeroIllustration height={210} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "#cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> Real-time anti-cheat answer verification
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> Timed assessments with instant performance breakdown
              </div>
            </div>
          </Col>

          {/* Right Form Column */}
          <Col
            xs={24}
            md={12}
            style={{
              backgroundColor: "#ffffff",
              padding: "40px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: "26px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  className="badge badge-primary"
                  style={{
                    backgroundColor: "#e0e7ff",
                    color: "#4338ca",
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: 6,
                  }}
                >
                  SECURE ACCESS
                </span>
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Welcome Back
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                Enter your credentials to access your assessment dashboard
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
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <input
                  type="password"
                  placeholder="Enter your account password"
                  autoComplete="current-password"
                />
              </Form.Item>

              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <button
                  type="submit"
                  className="primary-contained-btn"
                  style={{
                    width: "100%",
                    height: "44px",
                    background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  <i className="ri-login-box-line"></i>
                  Sign In
                </button>

                <div style={{ textAlign: "center", fontSize: "13px", color: "#64748b" }}>
                  Don't have an account?{" "}
                  <Link to="/register" style={{ fontWeight: "600", color: "#4f46e5" }}>
                    Register here
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
