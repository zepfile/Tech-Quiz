import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import { CategoryBadgeIcon } from "../../../components/TechIcons";
import { HeroDashboardIllustration } from "../../../components/SvgIllustrations";

function Home() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    user && (
      <div>
        {/* Modern SaaS Hero Banner with Vector Illustration */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
            borderRadius: "20px",
            padding: "28px 32px",
            marginBottom: "28px",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 30px -10px rgba(15, 23, 42, 0.4)",
          }}
        >
          <Row align="middle" gutter={[24, 20]}>
            <Col xs={24} md={14}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99, 102, 241, 0.2)", border: "1px solid rgba(129, 140, 248, 0.3)", borderRadius: 30, padding: "4px 14px", marginBottom: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Live Assessment Engine
                </span>
              </div>

              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#ffffff", margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
                Welcome back, {user.name}! 🚀
              </h1>

              <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6", margin: "0 0 20px 0", maxWidth: "520px" }}>
                Test and certify your technical skills with curated assessments. Complete timed MCQs, analyze code logic, and review instant performance reports.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#e2e8f0", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <i className="ri-folder-open-line" style={{ color: "#38bdf8" }}></i>
                  {exams.length} Active Quizzes
                </span>
                <span style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#e2e8f0", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <i className="ri-timer-line" style={{ color: "#facc15" }}></i>
                  Timed Submissions
                </span>
                <span style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#e2e8f0", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <i className="ri-shield-check-line" style={{ color: "#4ade80" }}></i>
                  Verified Evaluation
                </span>
              </div>
            </Col>

            <Col xs={24} md={10} style={{ textAlign: "center" }}>
              <HeroDashboardIllustration height={170} />
            </Col>
          </Row>
        </div>

        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Available Technical Tracks
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
              Select a module to read instructions and begin your attempt
            </p>
          </div>
          <span className="badge badge-primary">
            {exams.length} Assessments
          </span>
        </div>

        {/* Available Exams Grid */}
        <Row gutter={[20, 20]}>
          {exams.map((exam) => (
            <Col xs={24} sm={12} md={8} lg={8} key={exam._id}>
              <div
                className="card-lg"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div>
                  {/* Card Header with Tech Category SVG Icon */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <CategoryBadgeIcon category={exam.category} size={36} />
                      <div>
                        <span className="badge badge-primary" style={{ fontSize: "11px" }}>
                          {exam.category || "General"}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#f1f5f9",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      <i className="ri-time-line text-muted"></i> {Math.round(exam.duration / 60)} min
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: "700",
                      color: "#0f172a",
                      marginBottom: "14px",
                      minHeight: "44px",
                    }}
                  >
                    {exam?.name}
                  </h3>

                  {/* Spec Strip */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      marginBottom: "20px",
                      fontSize: "13px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                      <span>Questions / Marks:</span>
                      <strong style={{ color: "#0f172a" }}>
                        {exam.questions?.length || exam.totalMarks} questions ({exam.totalMarks} pts)
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                      <span>Passing Score:</span>
                      <strong style={{ color: "#16a34a" }}>
                        {exam.passingMarks} pts ({Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  className="primary-contained-btn"
                  style={{ width: "100%" }}
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  <span>Start Assessment</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Home;
