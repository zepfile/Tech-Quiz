import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { HideLoading } from "../../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import { CategoryBadgeIcon } from "../../../components/TechIcons";
import PageTitle from "../../../components/PageTitle";
import moment from "moment";

function Home() {
  const getCached = (key, fallback) => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [exams, setExams] = useState(() => getCached("tq_cached_exams", []));
  const [userReports, setUserReports] = useState(() => getCached("tq_cached_reports", []));
  const [attemptedExamIds, setAttemptedExamIds] = useState(() => {
    const cachedRep = getCached("tq_cached_reports", []);
    return new Set(cachedRep.map((r) => r.exam?._id || r.exam));
  });
  const [loadingData, setLoadingData] = useState(() => exams.length === 0);
  const [activeTab, setActiveTab] = useState("available");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const isAdmin = Boolean(user?.isAdmin);

  const loadData = async () => {
    try {
      // Parallel execution: Fetch exams and user reports concurrently
      const [examsResponse, reportsResponse] = await Promise.all([
        getAllExams(),
        !isAdmin
          ? getAllReportsByUser()
          : Promise.resolve({ success: true, data: [] }),
      ]);

      if (examsResponse.success && examsResponse.data) {
        setExams(examsResponse.data);
        try {
          sessionStorage.setItem("tq_cached_exams", JSON.stringify(examsResponse.data));
        } catch (e) {}
      }

      if (reportsResponse.success && reportsResponse.data) {
        setUserReports(reportsResponse.data);
        const attemptedSet = new Set(
          reportsResponse.data.map((r) => r.exam?._id || r.exam)
        );
        setAttemptedExamIds(attemptedSet);
        try {
          sessionStorage.setItem("tq_cached_reports", JSON.stringify(reportsResponse.data));
        } catch (e) {}
      }

      setLoadingData(false);
      dispatch(HideLoading());
    } catch (error) {
      setLoadingData(false);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to determine scheduled time-bound live competition status
  const getLiveStatus = (exam) => {
    if (!exam.isTimeBound) {
      return { status: "standard", canStart: true, label: "Always Available" };
    }
    const now = new Date();
    const start = exam.startTime ? new Date(exam.startTime) : null;
    const end = exam.endTime ? new Date(exam.endTime) : null;

    if (start && now < start) {
      return {
        status: "upcoming",
        canStart: false,
        label: `Opens ${moment(start).format("MMM D, h:mm A")}`,
        timeRemaining: moment(start).fromNow(),
      };
    }
    if (end && now > end) {
      return {
        status: "ended",
        canStart: false,
        label: "Competition Closed",
      };
    }
    return {
      status: "live",
      canStart: true,
      label: "LIVE COMPETITION",
      closesIn: end ? moment(end).fromNow(true) : "Active",
    };
  };

  // Filter exams: Attempted quizzes are removed from available list for users
  const availableExams = isAdmin
    ? exams
    : exams.filter((e) => !attemptedExamIds.has(e._id));

  const attemptedExams = isAdmin
    ? []
    : exams.filter((e) => attemptedExamIds.has(e._id));

  // Find user's score report for an attempted exam
  const getReportForExam = (examId) => {
    return userReports.find((r) => (r.exam?._id || r.exam) === examId);
  };

  return (
    user && (
      <div>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <div>
            <PageTitle title="Technical Assessment Catalog" />
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Select an available assessment to begin your proctored evaluation
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="primary-outlined-btn"
              onClick={() => navigate("/leaderboard")}
              style={{ height: 36, padding: "0 14px", borderRadius: 8, fontSize: 13 }}
            >
              <i className="ri-trophy-line" style={{ color: "#f59e0b" }}></i> Live Leaderboard 🏆
            </button>
            <span className="badge badge-primary" style={{ padding: "6px 12px", fontSize: 12 }}>
              {availableExams.length} Available
            </span>
          </div>
        </div>

        {/* User Filter Tabs: Available vs Attempted History */}
        {!isAdmin && (
          <div style={{ marginBottom: 20 }}>
            <div className="tab-pill-container">
              <button
                type="button"
                className={`tab-pill-btn ${activeTab === "available" ? "active" : ""}`}
                onClick={() => setActiveTab("available")}
              >
                Available Assessments ({availableExams.length})
              </button>

              <button
                type="button"
                className={`tab-pill-btn ${activeTab === "attempted" ? "active" : ""}`}
                onClick={() => setActiveTab("attempted")}
              >
                My Attempted History ({attemptedExams.length})
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE TAB: AVAILABLE EXAMS */}
        {activeTab === "available" && (
          <>
            {loadingData && availableExams.length === 0 ? (
              <Row gutter={[20, 20]}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Col xs={24} sm={12} md={8} lg={8} key={n}>
                    <div className="skeleton-card" />
                  </Col>
                ))}
              </Row>
            ) : availableExams.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  borderRadius: "16px",
                  marginTop: 16,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
                  All Available Assessments Completed!
                </h3>
                <p style={{ fontSize: 13, color: "#64748b", maxWidth: 440, margin: "0 auto 20px auto" }}>
                  You have completed all technical tracks currently in your catalog. You can review your scores, answers, and certificates in your history.
                </p>
                <button
                  type="button"
                  className="primary-contained-btn"
                  onClick={() => navigate("/user/reports")}
                >
                  <i className="ri-award-line"></i> View My Reports & Certificates
                </button>
              </div>
            ) : (
              <Row gutter={[20, 20]}>
                {availableExams.map((exam) => {
                  const liveInfo = getLiveStatus(exam);
                  return (
                    <Col xs={24} sm={12} md={8} lg={8} key={exam._id}>
                      <div
                        className="card-lg"
                        style={{
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                          border: liveInfo.status === "live"
                            ? "2px solid #ef4444"
                            : "1px solid #e2e8f0",
                          boxShadow: liveInfo.status === "live"
                            ? "0 8px 25px rgba(239, 68, 68, 0.15)"
                            : undefined,
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

                          {/* Live Scheduled Competition Banner */}
                          {exam.isTimeBound && (
                            <div
                              style={{
                                marginBottom: "14px",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                fontSize: "11px",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor:
                                  liveInfo.status === "live"
                                    ? "#fef2f2"
                                    : liveInfo.status === "upcoming"
                                    ? "#eff6ff"
                                    : "#f1f5f9",
                                color:
                                  liveInfo.status === "live"
                                    ? "#dc2626"
                                    : liveInfo.status === "upcoming"
                                    ? "#2563eb"
                                    : "#64748b",
                                border: `1px solid ${
                                  liveInfo.status === "live"
                                    ? "#fecaca"
                                    : liveInfo.status === "upcoming"
                                    ? "#bfdbfe"
                                    : "#e2e8f0"
                                }`,
                              }}
                            >
                              <span>
                                {liveInfo.status === "live" && "🔴 LIVE NOW"}
                                {liveInfo.status === "upcoming" && "⏳ UPCOMING SCHEDULE"}
                                {liveInfo.status === "ended" && "CLOSED"}
                              </span>
                              <span>
                                {liveInfo.status === "live" && `Closes in ${liveInfo.closesIn}`}
                                {liveInfo.status === "upcoming" && `Starts in ${liveInfo.timeRemaining}`}
                              </span>
                            </div>
                          )}

                          <h3
                            style={{
                              fontSize: "17px",
                              fontWeight: "700",
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
                              <strong>
                                {exam.questions?.length || exam.totalMarks} Qs ({exam.totalMarks} pts)
                              </strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                              <span>Passing Score:</span>
                              <strong style={{ color: "#16a34a" }}>
                                {exam.passingMarks} pts ({Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)
                              </strong>
                            </div>
                            {exam.negativeMarks > 0 && (
                              <div style={{ display: "flex", justifyContent: "space-between", color: "#dc2626" }}>
                                <span>Negative Marking:</span>
                                <strong>-{exam.negativeMarks} pts per wrong</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Assessment Trigger Button */}
                        <button
                          className={liveInfo.status === "live" ? "primary-contained-btn" : "primary-contained-btn"}
                          disabled={!liveInfo.canStart && !isAdmin}
                          style={{
                            width: "100%",
                            background:
                              liveInfo.status === "live"
                                ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                                : !liveInfo.canStart && !isAdmin
                                ? "#94a3b8"
                                : undefined,
                            cursor: !liveInfo.canStart && !isAdmin ? "not-allowed" : "pointer",
                          }}
                          onClick={() => {
                            if (!liveInfo.canStart && !isAdmin) {
                              message.info(liveInfo.label);
                              return;
                            }
                            navigate(`/user/write-exam/${exam._id}`);
                          }}
                        >
                          {liveInfo.status === "live" ? (
                            <>
                              <span>Enter Live Competition ⚡</span>
                              <i className="ri-flashlight-line"></i>
                            </>
                          ) : liveInfo.status === "upcoming" ? (
                            <>
                              <span>{liveInfo.label}</span>
                              <i className="ri-time-line"></i>
                            </>
                          ) : liveInfo.status === "ended" ? (
                            <span>Competition Ended</span>
                          ) : (
                            <>
                              <span>Start Assessment</span>
                              <i className="ri-arrow-right-line"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </>
        )}

        {/* ATTEMPTED ASSESSMENTS TAB */}
        {activeTab === "attempted" && (
          <>
            {attemptedExams.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  borderRadius: "16px",
                  marginTop: 16,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                  No Attempted Assessments Yet
                </h3>
                <p style={{ fontSize: 13, color: "#64748b" }}>
                  Choose any available assessment from the first tab to begin testing.
                </p>
              </div>
            ) : (
              <Row gutter={[20, 20]}>
                {attemptedExams.map((exam) => {
                  const report = getReportForExam(exam._id);
                  const isPassed = report?.result?.verdict === "Pass";
                  return (
                    <Col xs={24} sm={12} md={8} lg={8} key={exam._id}>
                      <div
                        className="card-lg"
                        style={{
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                          border: isPassed ? "1.5px solid #86efac" : "1.5px solid #fca5a5",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <CategoryBadgeIcon category={exam.category} size={36} />
                              <div>
                                <span className="badge badge-primary" style={{ fontSize: "11px" }}>
                                  {exam.category || "General"}
                                </span>
                              </div>
                            </div>

                            <span
                              style={{
                                backgroundColor: isPassed ? "#dcfce7" : "#fee2e2",
                                color: isPassed ? "#15803d" : "#b91c1c",
                                fontWeight: 800,
                                fontSize: "12px",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                border: `1px solid ${isPassed ? "#bbf7d0" : "#fecaca"}`,
                              }}
                            >
                              {isPassed ? "PASSED ✓" : "FAILED ✗"}
                            </span>
                          </div>

                          <h3
                            style={{
                              fontSize: "17px",
                              fontWeight: "700",
                              marginBottom: "12px",
                              minHeight: "44px",
                            }}
                          >
                            {exam.name}
                          </h3>

                          {/* Attempted Summary Card */}
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              borderRadius: "10px",
                              padding: "12px 14px",
                              marginBottom: "18px",
                              fontSize: "13px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                              <span>Score Achieved:</span>
                              <strong style={{ color: isPassed ? "#15803d" : "#dc2626", fontSize: "14px" }}>
                                {report?.result?.obtainedScore || 0} / {exam.totalMarks} pts
                              </strong>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                              <span>Submitted On:</span>
                              <strong>
                                {report ? moment(report.createdAt).format("MMM D, YYYY") : "Completed"}
                              </strong>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                              <span>Status:</span>
                              <span style={{ color: "#4f46e5", fontWeight: 600 }}>Attempted (Locked)</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="primary-outlined-btn"
                          style={{ width: "100%", height: 38 }}
                          onClick={() => navigate("/user/reports")}
                        >
                          <i className="ri-award-line"></i> View Report & Certificate
                        </button>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </>
        )}
      </div>
    )
  );
}

export default Home;
