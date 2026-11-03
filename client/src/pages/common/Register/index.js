import { Form, message, Row, Col } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { BrandLogo } from "../../../components/TechIcons";
import { AuthHeroIllustration } from "../../../components/SvgIllustrations";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
        padding: "clamp(12px, 3vw, 24px)",
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
          {/* Left Column with Tech Branding */}
          <Col
            xs={24}
            md={12}
            style={{
              background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
              padding: "clamp(24px, 4vw, 40px) clamp(20px, 3vw, 32px)",
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
                    ASSESSMENT PLATFORM
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "14px 0 8px 0" }}>
                Start evaluating and showcasing your coding acumen
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", margin: 0 }}>
                Join candidates and team leads taking and creating tech challenges.
              </p>
            </div>

            <div style={{ margin: "20px 0", textAlign: "center" }}>
              <AuthHeroIllustration height={220} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "#cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> Instant detailed score analytics
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> Full-stack JavaScript, React & Node benchmarks
              </div>
            </div>
          </Col>

          {/* Right Form Column */}
          <Col
            xs={24}
            md={12}
            style={{
              backgroundColor: "#ffffff",
              padding: "clamp(24px, 4vw, 40px) clamp(20px, 3vw, 36px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Create Account
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                Sign up to begin your technical evaluations and track skill progress
              </p>
            </div>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your full name" }]}
              >
                <input type="text" placeholder="e.g. Alex Johnson" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <input type="email" placeholder="e.g. alex@example.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter a password" }]}
              >
                <input type="password" placeholder="Create a secure password" />
              </Form.Item>

              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <button type="submit" className="primary-contained-btn" style={{ width: "100%", height: "44px" }}>
                  Register Account
                </button>

                <div style={{ textAlign: "center", fontSize: "13px", color: "#64748b" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ fontWeight: "600", color: "#4f46e5" }}>
                    Sign in here
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

export default Register;
