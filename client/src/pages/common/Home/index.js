import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import { CategoryBadgeIcon } from "../../../components/TechIcons";
import PageTitle from "../../../components/PageTitle";

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
        {/* Clean Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 10,
            marginBottom: 24,
          }}
        >
          <div>
            <PageTitle title="Available Technical Tracks" />
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Select an assessment module to begin your timed technical evaluation
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="primary-outlined-btn"
              onClick={() => navigate("/leaderboard")}
              style={{ height: 36, padding: "0 14px", borderRadius: 8, fontSize: 13 }}
            >
              <i className="ri-trophy-line" style={{ color: "#f59e0b" }}></i> Leaderboard 🏆
            </button>
            <span className="badge badge-primary" style={{ padding: "6px 12px", fontSize: 12 }}>
              {exams.length} Assessments
            </span>
          </div>
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
