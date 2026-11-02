import { Form, message, Row, Col } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { BrandLogo } from "../../../components/TechIcons";
import { AuthHeroIllustration } from "../../../components/SvgIllustrations";

function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
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
          {/* Left Hero & Illustration Column */}
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
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#818cf8", letterSpacing: "0.06em" }}>
                    ENTERPRISE ASSESSMENT
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "14px 0 8px 0" }}>
                Empowering developers with real-world assessments
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", margin: 0 }}>
                Practice MERN stack concepts, test your speed, and get certified reports.
              </p>
            </div>

            <div style={{ margin: "20px 0", textAlign: "center" }}>
              <AuthHeroIllustration height={220} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "#cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> Real-time anti-cheat answer verification
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> Dual Administrator & Candidate portals
              </div>
            </div>
          </Col>

          {/* Right Form Column */}
          <Col
            xs={24}
            md={12}
            style={{
              backgroundColor: "#ffffff",
              padding: "44px 38px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Sign In
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}>
                Enter your registered credentials to access your dashboard
              </p>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <input type="email" placeholder="e.g. admin@quiz.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <input type="password" placeholder="Enter your password" />
              </Form.Item>

              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <button type="submit" className="primary-contained-btn" style={{ width: "100%", height: "46px" }}>
                  Sign In to Platform
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
