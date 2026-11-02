import React, { useRef } from "react";
import { Modal } from "antd";
import { BrandLogo, CategoryBadgeIcon } from "./TechIcons";
import moment from "moment";

function CertificateModal({ visible, onCancel, report }) {
  const printRef = useRef(null);

  if (!report) return null;

  const candidateName = report.user?.name || "Candidate";
  const examName = report.exam?.name || "Technical Assessment";
  const category = report.exam?.category || "General";
  const dateStr = moment(report.createdAt || new Date()).format("MMMM DD, YYYY");
  const scoreObtained =
    report.result?.obtainedScore !== undefined
      ? report.result.obtainedScore
      : report.result?.correctAnswers?.length || 0;
  const totalCount = report.exam?.totalMarks || 1;
  const percentage = Math.round((scoreObtained / totalCount) * 100);
  const certId = `TQ-${(report._id || Date.now().toString()).slice(-8).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={940}
      centered
      destroyOnClose
      bodyStyle={{ padding: 0, backgroundColor: "#0f172a", borderRadius: 16, overflow: "hidden" }}
      className="certificate-modal-wrapper"
    >
      {/* Modal Action Header (Hidden in Print) */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 24px",
          background: "#1e1b4b",
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <i className="ri-award-fill" style={{ color: "#facc15", fontSize: 22 }}></i>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Official Verified Certificate</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            className="primary-contained-btn"
            onClick={handlePrint}
            style={{
              height: 38,
              padding: "0 18px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              fontSize: 13,
            }}
          >
            <i className="ri-printer-line"></i> Print / Save as PDF
          </button>

          <button
            type="button"
            className="primary-outlined-btn"
            onClick={onCancel}
            style={{ height: 38, padding: "0 14px", borderRadius: 8, fontSize: 13, borderColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Certificate Sheet (Printable Canvas) */}
      <div
        style={{
          padding: "24px",
          backgroundColor: "#0f172a",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          id="certificate-print-area"
          ref={printRef}
          style={{
            width: "880px",
            height: "600px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            position: "relative",
            padding: "36px 44px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "8px solid #312e81",
            backgroundImage: "radial-gradient(#f1f5f9 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Inner Golden Border */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
              border: "1.5px solid #d97706",
              borderRadius: 8,
              pointerEvents: "none",
            }}
          ></div>

          {/* Corner Flourishes */}
          <div style={{ position: "absolute", top: 18, left: 18, width: 20, height: 20, borderTop: "3px solid #4f46e5", borderLeft: "3px solid #4f46e5" }}></div>
          <div style={{ position: "absolute", top: 18, right: 18, width: 20, height: 20, borderTop: "3px solid #4f46e5", borderRight: "3px solid #4f46e5" }}></div>
          <div style={{ position: "absolute", bottom: 18, left: 18, width: 20, height: 20, borderBottom: "3px solid #4f46e5", borderLeft: "3px solid #4f46e5" }}></div>
          <div style={{ position: "absolute", bottom: 18, right: 18, width: 20, height: 20, borderBottom: "3px solid #4f46e5", borderRight: "3px solid #4f46e5" }}></div>

          {/* Certificate Header */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
              <BrandLogo size={36} />
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#1e1b4b", letterSpacing: "0.08em" }}>
                  TECHQUIZ ASSESSMENT BOARD
                </span>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Global Technical Certification Standards
                </div>
              </div>
            </div>

            <h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 30,
                fontWeight: 800,
                color: "#1e1b4b",
                letterSpacing: "0.06em",
                margin: "12px 0 4px 0",
                textTransform: "uppercase",
              }}
            >
              Certificate of Excellence
            </h1>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              This technical credential is proud presented to
            </p>
          </div>

          {/* Candidate Name Banner */}
          <div style={{ textAlign: "center", margin: "14px 0", position: "relative", zIndex: 2 }}>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 34,
                fontWeight: 800,
                color: "#4f46e5",
                letterSpacing: "0.02em",
                display: "inline-block",
                padding: "0 24px 8px 24px",
                borderBottom: "2px solid #f59e0b",
              }}
            >
              {candidateName}
            </div>

            <p
              style={{
                fontSize: 13,
                color: "#475569",
                maxWidth: "620px",
                margin: "12px auto 0 auto",
                lineHeight: 1.6,
              }}
            >
              For successfully achieving passing standards and demonstrating distinguished proficiency in the timed MCQ technical evaluation for
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#eef2ff",
                border: "1px solid #c7d2fe",
                borderRadius: 20,
                padding: "6px 18px",
                marginTop: 10,
              }}
            >
              <CategoryBadgeIcon category={category} size={22} />
              <strong style={{ fontSize: 15, color: "#312e81" }}>{examName}</strong>
            </div>
          </div>

          {/* Performance Benchmark Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              maxWidth: "520px",
              margin: "0 auto 16px auto",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Score</div>
              <strong style={{ fontSize: 15, color: "#0f172a" }}>{scoreObtained} / {totalCount}</strong>
            </div>

            <div style={{ backgroundColor: "#f0fdf4", padding: "8px 12px", borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, textTransform: "uppercase" }}>Accuracy</div>
              <strong style={{ fontSize: 15, color: "#15803d" }}>{percentage}%</strong>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Status</div>
              <strong style={{ fontSize: 15, color: "#16a34a" }}>Verified Pass</strong>
            </div>
          </div>

          {/* Certificate Footer (Signatures & Official Gold Seal) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: 12,
              borderTop: "1px solid #e2e8f0",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Left Signature */}
            <div style={{ textAlign: "center", width: 180 }}>
              <svg width="130" height="34" viewBox="0 0 130 34" fill="none">
                <path d="M10 24C25 15 40 5 60 14C80 23 100 8 120 18" stroke="#312e81" strokeWidth="2" strokeLinecap="round" />
                <path d="M35 12C45 28 55 28 65 10" stroke="#312e81" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div style={{ borderTop: "1px solid #94a3b8", paddingTop: 4, fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
                Dr. Ronald Vance
              </div>
              <div style={{ fontSize: 10, color: "#64748b" }}>Assessment Director</div>
            </div>

            {/* Center Official Gold Seal SVG */}
            <div style={{ textAlign: "center" }}>
              <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                <circle cx="34" cy="34" r="30" fill="#f59e0b" fillOpacity="0.15" stroke="#d97706" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="34" cy="34" r="24" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                <polygon points="34,16 38,27 49,27 40,34 43,45 34,39 25,45 28,34 19,27 30,27" fill="#ffffff" />
                <path d="M26 48L22 62L34 56L46 62L42 48" fill="#d97706" />
              </svg>
              <div style={{ fontSize: 9, fontWeight: 800, color: "#b45309", letterSpacing: "0.1em", marginTop: 2 }}>
                OFFICIAL SEAL
              </div>
            </div>

            {/* Right Signature & Credential ID */}
            <div style={{ textAlign: "center", width: 180 }}>
              <div style={{ fontSize: 11, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                {dateStr}
              </div>
              <div style={{ borderTop: "1px solid #94a3b8", paddingTop: 4, fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
                Date of Issue
              </div>
              <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, fontFamily: "monospace", marginTop: 2 }}>
                ID: {certId}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CertificateModal;

