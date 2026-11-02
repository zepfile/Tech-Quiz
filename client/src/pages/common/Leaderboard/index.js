import React, { useEffect, useState } from "react";
import { Row, Col, Select, Table, Input, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { CategoryBadgeIcon } from "../../../components/TechIcons";
import moment from "moment";

const { Option } = Select;

function Leaderboard() {
  const [selectedExamId, setSelectedExamId] = useState("all");
  const [allExams, setAllExams] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserStanding, setCurrentUserStanding] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const fetchLeaderboard = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await getLeaderboard({ examId });
      dispatch(HideLoading());
      if (response && response.success) {
        setLeaderboardData(response.data.leaderboard || []);
        if (response.data.allExams && response.data.allExams.length) {
          setAllExams(response.data.allExams);
        }
        setCurrentUserStanding(response.data.currentUserStanding || null);
      }
    } catch (error) {
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedExamId);
  }, [selectedExamId]);

  const isGlobalView = selectedExamId === "all";

  // Filtered leaderboard data by search query
  const filteredData = leaderboardData.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.userName?.toLowerCase().includes(q) ||
      item.userEmail?.toLowerCase().includes(q)
    );
  });

  // Top 3 Podium
  const top1 = leaderboardData[0] || null;
  const top2 = leaderboardData[1] || null;
  const top3 = leaderboardData[2] || null;

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      width: 90,
      render: (rank) => {
        let badgeStyle = {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          borderRadius: "50%",
          fontWeight: 800,
          fontSize: 14,
        };
        if (rank === 1) {
          return (
            <span
              style={{
                ...badgeStyle,
                background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(217, 119, 6, 0.35)",
              }}
              title="1st Place (Gold)"
            >
              🥇 1
            </span>
          );
        }
        if (rank === 2) {
          return (
            <span
              style={{
                ...badgeStyle,
                background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(100, 116, 139, 0.3)",
              }}
              title="2nd Place (Silver)"
            >
              🥈 2
            </span>
          );
        }
        if (rank === 3) {
          return (
            <span
              style={{
                ...badgeStyle,
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(180, 83, 9, 0.3)",
              }}
              title="3rd Place (Bronze)"
            >
              🥉 3
            </span>
          );
        }
        return (
          <span
            style={{
              ...badgeStyle,
              background: "#f1f5f9",
              color: "#475569",
              border: "1px solid #e2e8f0",
            }}
          >
            #{rank}
          </span>
        );
      },
    },
    {
      title: "Candidate",
      dataIndex: "userName",
      render: (text, record) => {
        const isCurrentUser = user && record.userId === user._id;
        const initial = (record.userName || "C").charAt(0).toUpperCase();
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: isCurrentUser
                  ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)"
                  : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {initial}
            </span>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                {record.userName}
                {isCurrentUser && (
                  <Tag color="purple" style={{ fontSize: 10, padding: "0 6px", borderRadius: 10, fontWeight: 700 }}>
                    YOU
                  </Tag>
                )}
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{record.userEmail}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: isGlobalView ? "Completed Tracks" : "Assessment Track",
      dataIndex: "trackInfo",
      render: (text, record) => {
        if (isGlobalView) {
          return (
            <div>
              <span style={{ fontWeight: 700, color: "#312e81" }}>
                {record.uniqueExamsCount} {record.uniqueExamsCount === 1 ? "Track" : "Tracks"}
              </span>
              <div style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>
                {record.examsPassed} Passed • {record.totalAttempts} Attempts
              </div>
            </div>
          );
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CategoryBadgeIcon category={record.examCategory} size={26} />
            <div>
              <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
                {record.examName || "Quiz Track"}
              </div>
              {record.examCategory && (
                <span className="badge badge-primary" style={{ fontSize: 10 }}>
                  {record.examCategory}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Score Obtained",
      dataIndex: "score",
      render: (text, record) => {
        const score = isGlobalView ? record.totalScore : record.score;
        const total = record.totalMarks || 1;
        return (
          <div>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              {score}
            </span>
            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 3 }}>
              / {total} pts
            </span>
            {record.penaltyDeducted > 0 && (
              <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 600 }}>
                -{record.penaltyDeducted} neg. mark
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Accuracy",
      dataIndex: "accuracy",
      render: (accuracy) => {
        const pct = accuracy || 0;
        let barColor = "#10b981";
        if (pct < 50) barColor = "#ef4444";
        else if (pct < 75) barColor = "#f59e0b";

        return (
          <div style={{ minWidth: 100 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: barColor }}>{pct}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "#e2e8f0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  backgroundColor: barColor,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: isGlobalView ? "Last Active" : "Attempt Date",
      dataIndex: "date",
      render: (text, record) => {
        const dateVal = isGlobalView ? record.lastActive : record.attemptDate;
        return (
          <span style={{ fontSize: 12, color: "#64748b" }}>
            <i className="ri-calendar-line" style={{ marginRight: 4 }}></i>
            {dateVal ? moment(dateVal).format("MMM DD, YYYY") : "Recently"}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ width: "100%", paddingBottom: 40 }}>
      {/* Header Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <div>
          <PageTitle title="Competitive Leaderboard & Ranks" />
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>
            Explore top performers, track proficiencies, and candidate rankings
          </p>
        </div>

        {/* Track Selector & Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Select
            value={selectedExamId}
            onChange={(val) => setSelectedExamId(val)}
            style={{ width: 260 }}
            size="middle"
          >
            <Option value="all">🌐 Global Standings (All Exams)</Option>
            {allExams.map((ex) => (
              <Option key={ex._id} value={ex._id}>
                {ex.name} ({ex.category || "General"})
              </Option>
            ))}
          </Select>

          <button
            type="button"
            className="primary-outlined-btn"
            style={{ height: 36, padding: "0 14px", borderRadius: 8 }}
            onClick={() => fetchLeaderboard(selectedExamId)}
            title="Refresh Rankings"
          >
            <i className="ri-refresh-line"></i> Refresh
          </button>
        </div>
      </div>

      {/* Current User Standing Banner */}
      {currentUserStanding ? (
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
            borderRadius: 16,
            padding: "20px 24px",
            color: "#ffffff",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              🏆
            </div>
            <div>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a5b4fc", fontWeight: 700 }}>
                Your Performance Standing
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>
                Rank #{currentUserStanding.rank} of {leaderboardData.length} Candidates
              </div>
              <div style={{ fontSize: 13, color: "#e0e7ff", marginTop: 2 }}>
                {isGlobalView ? (
                  <>Total Score: <strong>{currentUserStanding.totalScore} pts</strong> across {currentUserStanding.uniqueExamsCount} tracks ({currentUserStanding.accuracy}% Accuracy)</>
                ) : (
                  <>Score: <strong>{currentUserStanding.score} / {currentUserStanding.totalMarks} marks</strong> ({currentUserStanding.accuracy}% Accuracy)</>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="primary-contained-btn"
              style={{
                backgroundColor: "#ffffff",
                color: "#312e81",
                height: 38,
                padding: "0 18px",
                borderRadius: 8,
                fontWeight: 700,
                border: "none",
              }}
              onClick={() => navigate("/user/reports")}
            >
              <i className="ri-award-line"></i> View My History
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <i className="ri-information-line" style={{ color: "#4f46e5", fontSize: 20 }}></i>
            <span style={{ fontSize: 13, color: "#475569" }}>
              Take an assessment track to secure your position on this leaderboard!
            </span>
          </div>
          <button
            type="button"
            className="primary-contained-btn"
            style={{ height: 34, padding: "0 14px", borderRadius: 8, fontSize: 12 }}
            onClick={() => navigate("/")}
          >
            Browse Quizzes
          </button>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      {leaderboardData.length > 0 && (
        <Row gutter={[20, 20]} style={{ marginBottom: 28 }} align="bottom">
          {/* Top 2: Silver */}
          <Col xs={24} sm={8}>
            {top2 ? (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "24px 16px",
                  borderRadius: 16,
                  border: "2px solid #cbd5e1",
                  background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#64748b",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: 12,
                    padding: "2px 14px",
                    borderRadius: 20,
                    boxShadow: "0 2px 6px rgba(100, 116, 139, 0.4)",
                  }}
                >
                  🥈 Rank #2
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    border: "3px solid #e2e8f0",
                  }}
                >
                  {(top2.userName || "C").charAt(0).toUpperCase()}
                </div>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>
                  {top2.userName}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {isGlobalView ? `${top2.totalScore} pts` : `${top2.score} / ${top2.totalMarks} marks`}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Tag color="default" style={{ fontWeight: 700, borderRadius: 10 }}>
                    {top2.accuracy}% Accuracy
                  </Tag>
                </div>
              </div>
            ) : null}
          </Col>

          {/* Top 1: Gold (Center & Elevated) */}
          <Col xs={24} sm={8}>
            {top1 ? (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "32px 16px 26px 16px",
                  borderRadius: 18,
                  border: "2.5px solid #f59e0b",
                  background: "linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)",
                  boxShadow: "0 10px 25px rgba(245, 158, 11, 0.2)",
                  position: "relative",
                  transform: "scale(1.03)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: 13,
                    padding: "4px 18px",
                    borderRadius: 20,
                    boxShadow: "0 4px 10px rgba(217, 119, 6, 0.4)",
                  }}
                >
                  👑 Champion 🥇 #1
                </div>
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 26,
                    marginTop: 8,
                    marginBottom: 10,
                    border: "4px solid #fef3c7",
                    boxShadow: "0 6px 14px rgba(217, 119, 6, 0.3)",
                  }}
                >
                  {(top1.userName || "C").charAt(0).toUpperCase()}
                </div>
                <div style={{ fontWeight: 900, color: "#0f172a", fontSize: 17 }}>
                  {top1.userName}
                </div>
                <div style={{ fontSize: 14, color: "#b45309", fontWeight: 700, marginTop: 2 }}>
                  {isGlobalView ? `${top1.totalScore} pts Total` : `${top1.score} / ${top1.totalMarks} marks`}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Tag color="gold" style={{ fontWeight: 800, borderRadius: 10, padding: "2px 10px" }}>
                    🌟 {top1.accuracy}% Accuracy
                  </Tag>
                </div>
              </div>
            ) : null}
          </Col>

          {/* Top 3: Bronze */}
          <Col xs={24} sm={8}>
            {top3 ? (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "24px 16px",
                  borderRadius: 16,
                  border: "2px solid #fed7aa",
                  background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#b45309",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: 12,
                    padding: "2px 14px",
                    borderRadius: 20,
                    boxShadow: "0 2px 6px rgba(180, 83, 9, 0.4)",
                  }}
                >
                  🥉 Rank #3
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #fb923c 0%, #c2410c 100%)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    border: "3px solid #ffedd5",
                  }}
                >
                  {(top3.userName || "C").charAt(0).toUpperCase()}
                </div>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>
                  {top3.userName}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {isGlobalView ? `${top3.totalScore} pts` : `${top3.score} / ${top3.totalMarks} marks`}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Tag color="orange" style={{ fontWeight: 700, borderRadius: 10 }}>
                    {top3.accuracy}% Accuracy
                  </Tag>
                </div>
              </div>
            ) : null}
          </Col>
        </Row>
      )}

      {/* Main Leaderboard Table Section */}
      <div className="card" style={{ padding: "20px", borderRadius: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
            All Ranked Participants ({filteredData.length})
          </div>

          <div style={{ width: 260 }}>
            <Input
              placeholder="Search candidate name or email..."
              prefix={<i className="ri-search-line" style={{ color: "#94a3b8" }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.userId + (record.reportId || "")}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: "No participants have completed assessments for this track yet." }}
        />
      </div>
    </div>
  );
}

export default Leaderboard;

