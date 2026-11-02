import React from "react";
import { useNavigate } from "react-router-dom";
import { CategoryBadgeIcon } from "../../../components/TechIcons";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    if (mins > 0 && remaining > 0) return `${mins}m ${remaining}s`;
    if (mins > 0) return `${mins} minute${mins > 1 ? "s" : ""}`;
    return `${secs} seconds`;
  };

  const handleStartExam = () => {
    // Attempt fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    startTimer();
    setView("questions");
  };

  return (
    <div style={{ width: "100%", maxWidth: "980px", margin: "0 auto", padding: "10px 0" }}>
      <div
        className="card-lg"
        style={{
          padding: "36px 32px",
          borderRadius: "24px",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", marginBottom: "14px" }}>
            <CategoryBadgeIcon category={examData.category} size={54} />
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            {examData.name}
          </h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
            <span className="badge badge-primary">
              {examData.category || "General Tech"}
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: "#fef3c7",
                color: "#92400e",
                border: "1px solid #fde68a",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <i className="ri-shield-check-line"></i> Anti-Cheating Protected
            </span>
          </div>
        </div>

        {/* Exam Quick Specs Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            marginBottom: "28px",
            textAlign: "center",
          }}
        >
          <div style={{ padding: "14px 10px", borderRadius: "14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", display: "block" }}>
              Duration
            </span>
            <strong style={{ fontSize: "16px", color: "#0f172a", marginTop: "4px", display: "block" }}>
              {formatDuration(examData.duration)}
            </strong>
          </div>
          <div style={{ padding: "14px 10px", borderRadius: "14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", display: "block" }}>
              Total Marks
            </span>
            <strong style={{ fontSize: "16px", color: "#4f46e5", marginTop: "4px", display: "block" }}>
              {examData.totalMarks} pts
            </strong>
          </div>
          <div style={{ padding: "14px 10px", borderRadius: "14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", display: "block" }}>
              Passing Score
            </span>
            <strong style={{ fontSize: "16px", color: "#16a34a", marginTop: "4px", display: "block" }}>
              {examData.passingMarks} pts
            </strong>
          </div>
          <div style={{ padding: "14px 10px", borderRadius: "14px", backgroundColor: examData.negativeMarks > 0 ? "#fef2f2" : "#f8fafc", border: `1px solid ${examData.negativeMarks > 0 ? "#fecaca" : "#e2e8f0"}` }}>
            <span style={{ fontSize: "11px", color: examData.negativeMarks > 0 ? "#dc2626" : "#64748b", textTransform: "uppercase", fontWeight: "700", display: "block" }}>
              Negative Mark
            </span>
            <strong style={{ fontSize: "16px", color: examData.negativeMarks > 0 ? "#b91c1c" : "#16a34a", marginTop: "4px", display: "block" }}>
              {examData.negativeMarks > 0 ? `-${examData.negativeMarks} pts` : "None"}
            </strong>
          </div>
        </div>

        {/* Anti-Cheating & Proctoring Protocol Banner */}
        <div
          style={{
            marginBottom: "20px",
            background: "linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)",
            border: "1px solid #fecaca",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b91c1c", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            <i className="ri-shield-keyhole-line" style={{ fontSize: 18 }}></i>
            Proctoring & Anti-Cheating Protocol Active:
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#991b1b", lineHeight: 1.6 }}>
            • <strong>Tab-Switch Tracking:</strong> Switching tabs or minimizing the browser window will trigger a penalty warning. <strong>Exceeding 3 warnings will terminate and auto-submit the exam.</strong><br />
            • <strong>Integrity Safeguards:</strong> Copying, pasting, right-clicking, text selection, and developer inspector keys are disabled during the test.
          </p>
        </div>

        {/* Guidelines List */}
        <div style={{ marginBottom: "32px", backgroundColor: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "14px", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ri-information-line text-indigo-600" style={{ fontSize: 18 }}></i>
            Candidate Rules & Guidelines:
          </h4>
          <ul style={{ paddingLeft: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", margin: 0, fontSize: "13px", color: "#475569" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>✓</span>
              <span>The timer starts immediately upon clicking <strong>Begin Assessment</strong>.</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>✓</span>
              <span>You can use the <strong>Question Palette</strong> to jump directly to any question.</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>✓</span>
              <span>Each correct answer awards <strong>1 mark</strong>.</span>
            </li>
            {examData.negativeMarks > 0 && (
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee2e2", color: "#dc2626", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>!</span>
                <span style={{ color: "#b91c1c" }}><strong>Negative Marking Active:</strong> Each incorrect answer will deduct <strong>-{examData.negativeMarks} marks</strong>.</span>
              </li>
            )}
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>✓</span>
              <span>If time runs out, your selected answers are automatically submitted.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            className="primary-outlined-btn"
            onClick={() => navigate("/")}
          >
            <i className="ri-arrow-left-line"></i> Back to Catalog
          </button>

          <button
            type="button"
            className="primary-contained-btn"
            onClick={handleStartExam}
            style={{ padding: "0 28px" }}
          >
            <span>Begin Assessment</span>
            <i className="ri-play-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
