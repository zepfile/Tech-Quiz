import { message, Modal } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport, getAllReportsByUser } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import { CategoryBadgeIcon, TimerClockSvg } from "../../../components/TechIcons";
import { ExamPassedIllustration, ExamFailedIllustration } from "../../../components/SvgIllustrations";
import CertificateModal from "../../../components/CertificateModal";

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);

  // Anti-Cheating & Proctoring States
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [violationReason, setViolationReason] = useState("");
  const [terminatedDueToCheating, setTerminatedDueToCheating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const lastViolationTime = useRef(0);
  const examStartTime = useRef(0);

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());

      // One Attempt Rule: prevent users from re-attempting a completed exam
      if (!user?.isAdmin) {
        const reportsRes = await getAllReportsByUser();
        if (reportsRes.success && reportsRes.data) {
          const alreadyDone = reportsRes.data.find(
            (r) => (r.exam?._id || r.exam) === params.id
          );
          if (alreadyDone) {
            dispatch(HideLoading());
            message.warning("You have already completed this assessment. Re-attempts are not permitted.");
            navigate("/user/reports");
            return;
          }
        }
      }

      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        const exam = response.data;

        // Scheduled Live Quiz Window Check
        if (exam.isTimeBound && !user?.isAdmin) {
          const now = new Date();
          const start = exam.startTime ? new Date(exam.startTime) : null;
          const end = exam.endTime ? new Date(exam.endTime) : null;

          if (start && now < start) {
            message.info(
              `This live competition has not started yet. Opens on ${new Date(start).toLocaleString()}`
            );
            navigate("/");
            return;
          }
          if (end && now > end) {
            message.error("This live competition has already ended.");
            navigate("/");
            return;
          }
        }

        setQuestions(exam.questions);
        setExamData(exam);
        setSecondsLeft(exam.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async (isTerminated = false) => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      const negPerWrong = Number(examData.negativeMarks) || 0;
      const penaltyDeducted = Math.round(wrongAnswers.length * negPerWrong * 100) / 100;
      const rawScore = correctAnswers.length - penaltyDeducted;
      const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);

      let verdict = "Pass";
      if (isTerminated || finalScore < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        obtainedScore: finalScore,
        penaltyDeducted,
        negativePerWrong: negPerWrong,
        verdict,
        terminatedDueToCheating: isTerminated,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const id = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(id);
  };

  // Anti-Cheating: Handle Violation (Debounced to 2000ms to prevent double-counting single ESC keystroke)
  const handleViolation = (reason) => {
    if (view !== "questions") return;
    const now = Date.now();
    if (now - lastViolationTime.current < 2000) return;
    lastViolationTime.current = now;

    const detectedReason = reason || "Fullscreen exit or window blur detected";
    setViolationReason(detectedReason);

    setTabSwitchWarnings((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setTerminatedDueToCheating(true);
        setShowWarningModal(false);
        if (intervalId) clearInterval(intervalId);
        message.error("EXAMINATION TERMINATED: 3 proctoring violations recorded! Exam submitted as FAIL.");
        calculateResult(true);
      } else {
        setShowWarningModal(true);
      }
      return next;
    });
  };

  // When switching to questions view, request fullscreen and initialize exam timer buffer
  useEffect(() => {
    if (view === "questions") {
      examStartTime.current = Date.now();
      requestFullscreen();
    }
  }, [view]);

  // Anti-Cheating: Tab switch / Window blur / Fullscreen loss listeners
  useEffect(() => {
    if (view !== "questions") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Browser tab switched or minimized");
      }
    };

    const handleWindowBlur = () => {
      handleViolation("Window lost focus / clicked outside examination");
    };

    const handleFullscreenChange = () => {
      const isFull = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFull);

      // Strictly detect exit from fullscreen during questions
      if (!isFull && view === "questions") {
        // 1.5s grace period for initial fullscreen setup
        if (Date.now() - examStartTime.current > 1500) {
          handleViolation("Fullscreen exited (ESC or window exit detected)! Fullscreen is strictly mandatory.");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, intervalId]);

  // Anti-Cheating: Block Copy / Paste / Context Menu / Devtools & ESC shortcut keys
  useEffect(() => {
    if (view !== "questions") return;

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();
    const handlePaste = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      // ESC key detection: strictly count violation when ESC is pressed
      if (e.key === "Escape" || e.code === "Escape" || e.keyCode === 27) {
        handleViolation("ESC key pressed to exit Fullscreen! Fullscreen mode is strictly mandatory.");
      }

      // F11 fullscreen manipulation prevention
      if (e.key === "F11" || e.code === "F11" || e.keyCode === 122) {
        e.preventDefault();
        handleViolation("F11 pressed! Fullscreen manipulation is strictly prohibited.");
      }

      // Alt+Tab window switching attempt
      if (e.altKey && (e.key === "Tab" || e.code === "Tab")) {
        e.preventDefault();
        handleViolation("Alt+Tab window switching attempt detected!");
      }

      // Prevent Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+Shift+I, F12
      if (
        (e.ctrlKey && ["c", "v", "u", "a", "p", "s"].includes(e.key.toLowerCase())) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const requestFullscreen = () => {
    const el = document.documentElement;
    const rfs =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (rfs) {
      rfs.call(el).catch(() => {});
    }
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const currentQuestion = questions[selectedQuestionIndex];

  return (
    examData && (
      <div style={{ width: "100%", margin: "0 auto" }}>
        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {/* QUESTIONS VIEW */}
        {view === "questions" && currentQuestion && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              userSelect: "none",
            }}
          >
            {/* Anti-Cheating & Proctoring Status Ribbon */}
            <div
              style={{
                backgroundColor: tabSwitchWarnings === 0 ? "#f8fafc" : tabSwitchWarnings === 1 ? "#fefce8" : "#fef2f2",
                border: `1px solid ${tabSwitchWarnings === 0 ? "#e2e8f0" : tabSwitchWarnings === 1 ? "#fde047" : "#fca5a5"}`,
                borderRadius: "14px",
                padding: "10px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span
                  style={{
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  <i className="ri-shield-check-fill"></i>
                </span>
                <span style={{ fontWeight: 700, color: "#1e293b" }}>
                  Live Anti-Cheating Protected
                </span>
                <span style={{ color: "#94a3b8" }}>•</span>
                <span style={{ color: "#64748b", fontSize: 12 }}>
                  Copy/Paste Disabled
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {!isFullscreen && (
                  <button
                    type="button"
                    onClick={requestFullscreen}
                    style={{
                      background: "#fee2e2",
                      border: "1px solid #f87171",
                      color: "#b91c1c",
                      borderRadius: 8,
                      padding: "5px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <i className="ri-fullscreen-line"></i> Re-Enter Fullscreen (Required)
                  </button>
                )}

                <span
                  style={{
                    backgroundColor:
                      tabSwitchWarnings === 0
                        ? "#dcfce7"
                        : tabSwitchWarnings === 1
                        ? "#fef08a"
                        : "#fee2e2",
                    color:
                      tabSwitchWarnings === 0
                        ? "#15803d"
                        : tabSwitchWarnings === 1
                        ? "#854d0e"
                        : "#b91c1c",
                    fontWeight: 800,
                    fontSize: 12,
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: `1px solid ${
                      tabSwitchWarnings === 0
                        ? "#bbf7d0"
                        : tabSwitchWarnings === 1
                        ? "#fde047"
                        : "#fca5a5"
                    }`,
                  }}
                >
                  <i className="ri-alert-line" style={{ marginRight: 4 }}></i>
                  Proctoring Violations: {tabSwitchWarnings}/3 (ESC/Tabs)
                </span>
              </div>
            </div>

            {/* Top Bar: Exam Title & Timer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <CategoryBadgeIcon category={examData.category} size={36} />
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: "2px", fontSize: "10px" }}>
                    {examData.category || "Exam Track"}
                  </span>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                    {examData.name}
                  </h2>
                </div>
              </div>

              {/* Countdown Timer with SVG Icon */}
              <div
                className="timer"
                style={{
                  backgroundColor: secondsLeft < 30 ? "#7f1d1d" : "#0f172a",
                  borderColor: secondsLeft < 30 ? "#ef4444" : "rgba(255,255,255,0.15)",
                }}
              >
                <TimerClockSvg size={18} color={secondsLeft < 30 ? "#fca5a5" : "#38bdf8"} />
                <span>{formatTimer(secondsLeft)}</span>
              </div>
            </div>

            {/* Question Quick Palette Strip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginRight: "6px" }}>
                Questions:
              </span>
              {questions.map((_, idx) => {
                const isSelected = selectedQuestionIndex === idx;
                const isAnswered = selectedOptions[idx] !== undefined;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedQuestionIndex(idx)}
                    style={{
                      width: "34px",
                      height: "34px",
                      padding: 0,
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      backgroundColor: isSelected
                        ? "#4f46e5"
                        : isAnswered
                        ? "#ecfdf5"
                        : "#ffffff",
                      color: isSelected
                        ? "#ffffff"
                        : isAnswered
                        ? "#059669"
                        : "#64748b",
                      border: isSelected
                        ? "1.5px solid #4338ca"
                        : isAnswered
                        ? "1px solid #a7f3d0"
                        : "1px solid #e2e8f0",
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Question Box */}
            <div
              className="card-lg"
              style={{
                padding: "28px",
                borderRadius: "18px",
                backgroundColor: "#ffffff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#4f46e5" }}>
                  Question {selectedQuestionIndex + 1} of {questions.length}
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  1 Mark
                </span>
              </div>

              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "24px", lineHeight: "1.5" }}>
                {currentQuestion.name}
              </h2>

              {/* 4 Options List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Object.keys(currentQuestion.options).map((optionKey) => {
                  const isChecked = selectedOptions[selectedQuestionIndex] === optionKey;
                  return (
                    <div
                      key={optionKey}
                      className={isChecked ? "selected-option" : "option"}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: optionKey,
                        });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "13px",
                          backgroundColor: isChecked ? "#4f46e5" : "#f1f5f9",
                          color: isChecked ? "#ffffff" : "#475569",
                          flexShrink: 0,
                        }}
                      >
                        {optionKey}
                      </div>

                      <div style={{ fontSize: "15px", color: isChecked ? "#312e81" : "#1e293b", fontWeight: isChecked ? "600" : "500" }}>
                        {currentQuestion.options[optionKey]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "28px",
                  paddingTop: "20px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  className="primary-outlined-btn"
                  disabled={selectedQuestionIndex === 0}
                  onClick={() => setSelectedQuestionIndex(selectedQuestionIndex - 1)}
                  style={{ opacity: selectedQuestionIndex === 0 ? 0.4 : 1 }}
                >
                  <i className="ri-arrow-left-line"></i> Previous
                </button>

                {selectedQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    className="primary-contained-btn"
                    onClick={() => setSelectedQuestionIndex(selectedQuestionIndex + 1)}
                  >
                    <span>Next</span>
                    <i className="ri-arrow-right-line"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-contained-btn"
                    style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" }}
                    onClick={() => {
                      clearInterval(intervalId);
                      calculateResult();
                    }}
                  >
                    <span>Finish & Submit</span>
                    <i className="ri-check-line"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Anti-Cheating & Proctoring Violation Warning Modal */}
        <Modal
          visible={showWarningModal}
          footer={null}
          closable={false}
          centered
          width={500}
          bodyStyle={{ padding: "32px 28px", textAlign: "center", borderRadius: 20 }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              margin: "0 auto 16px auto",
              boxShadow: "0 6px 18px rgba(239, 68, 68, 0.25)",
              border: "2px solid #fecaca",
            }}
          >
            <i className="ri-alarm-warning-line"></i>
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
            Strict Proctoring Violation Detected!
          </h3>

          <div
            style={{
              display: "inline-block",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              fontWeight: 800,
              fontSize: 13,
              padding: "4px 16px",
              borderRadius: 20,
              marginBottom: 14,
              border: "1px solid #fca5a5",
            }}
          >
            ⚠️ Strike {tabSwitchWarnings} of 3 Recorded
          </div>

          <div
            style={{
              backgroundColor: "#fff1f2",
              border: "1px solid #fecdd3",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "16px",
              color: "#be123c",
              fontWeight: 600,
              fontSize: "13px",
              textAlign: "left",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <i className="ri-error-warning-fill" style={{ fontSize: 16, marginTop: 1 }}></i>
            <div>
              <strong>Trigger:</strong> {violationReason || "ESC key pressed or Fullscreen mode exited."}
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            Exiting Fullscreen mode (pressing <strong>ESC</strong>, F11, or minimizing window) is strictly monitored.
            <br />
            <strong>You have {Math.max(0, 3 - tabSwitchWarnings)} strike(s) remaining.</strong> Reaching 3 strikes will permanently terminate your assessment and record a FAIL score.
          </p>

          <button
            type="button"
            className="primary-contained-btn"
            style={{ width: "100%", height: 46, borderRadius: 12, fontSize: 14, fontWeight: 700 }}
            onClick={() => {
              setShowWarningModal(false);
              requestFullscreen();
            }}
          >
            <i className="ri-fullscreen-line" style={{ marginRight: 6 }}></i>
            Re-Enter Fullscreen & Resume Assessment
          </button>
        </Modal>

        {/* RESULT VIEW */}
        {view === "result" && (
          <div style={{ width: "100%", maxWidth: "850px", margin: "20px auto" }}>
            <div
              className="card-lg"
              style={{
                padding: "36px",
                borderRadius: "20px",
                textAlign: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                {result.verdict === "Pass" ? (
                  <ExamPassedIllustration width={170} height={170} />
                ) : (
                  <ExamFailedIllustration width={170} height={170} />
                )}
              </div>

              {terminatedDueToCheating && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#991b1b",
                    padding: "8px 16px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <i className="ri-alarm-warning-line"></i> Terminated due to repeated tab switching violations (3/3)
                </div>
              )}

              <div>
                <span
                  className={`badge ${
                    result.verdict === "Pass" ? "badge-success" : "badge-danger"
                  }`}
                  style={{ fontSize: "13px", padding: "6px 16px" }}
                >
                  {result.verdict === "Pass" ? "PASSED EXAMINATION" : "NEEDS RETAKE"}
                </span>
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "12px", marginBottom: "4px" }}>
                {examData.name}
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                {result.verdict === "Pass"
                  ? "Congratulations! You successfully cleared the passing threshold."
                  : terminatedDueToCheating
                  ? "Your attempt was disqualified because tab switching limits were exceeded."
                  : "You did not reach the passing criteria. Review your answers and try again."}
              </p>

              {/* Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  margin: "24px 0",
                  textAlign: "center",
                }}
              >
                <div style={{ padding: "16px", borderRadius: "14px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>
                    Final Score
                  </span>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#4f46e5", marginTop: "4px" }}>
                    {result.obtainedScore !== undefined ? result.obtainedScore : result.correctAnswers?.length || 0}
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#94a3b8" }}> / {examData.totalMarks}</span>
                  </div>
                  {result.penaltyDeducted > 0 && (
                    <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: "700", marginTop: "2px" }}>
                      (-{result.penaltyDeducted} penalty)
                    </div>
                  )}
                </div>

                <div style={{ padding: "16px", borderRadius: "14px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>
                    Passing Mark
                  </span>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#16a34a", marginTop: "4px" }}>
                    {examData.passingMarks} pts
                  </div>
                </div>

                <div style={{ padding: "16px", borderRadius: "14px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>
                    Wrong
                  </span>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#ef4444", marginTop: "4px" }}>
                    {result.wrongAnswers?.length || 0}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                {result.verdict === "Pass" && (
                  <button
                    type="button"
                    className="primary-contained-btn"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      color: "#ffffff",
                      boxShadow: "0 4px 12px rgba(217, 119, 6, 0.35)",
                    }}
                    onClick={() => setShowCertificateModal(true)}
                  >
                    <i className="ri-award-fill"></i> View & Print Certificate
                  </button>
                )}
                <button
                  type="button"
                  className="primary-outlined-btn"
                  onClick={() => {
                    setView("instructions");
                    setSelectedQuestionIndex(0);
                    setSelectedOptions({});
                    setSecondsLeft(examData.duration);
                    setTabSwitchWarnings(0);
                    setTerminatedDueToCheating(false);
                  }}
                >
                  <i className="ri-restart-line"></i> Retake Exam
                </button>
                <button
                  type="button"
                  className="primary-contained-btn"
                  onClick={() => setView("review")}
                >
                  <span>Review Answers</span>
                  <i className="ri-eye-line"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW VIEW */}
        {view === "review" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
                  Answers Review Breakdown
                </h2>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Review what you submitted against the correct answers
                </p>
              </div>
              <button
                type="button"
                className="primary-outlined-btn"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </div>

            {questions.map((question, index) => {
              const isCorrect = question.correctOption === selectedOptions[index];
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    borderLeft: isCorrect ? "4px solid #10b981" : "4px solid #ef4444",
                    backgroundColor: isCorrect ? "#f0fdf4" : "#fef2f2",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: isCorrect ? "#15803d" : "#b91c1c" }}>
                      Question {index + 1}
                    </span>
                    <span className={`badge ${isCorrect ? "badge-success" : "badge-danger"}`}>
                      {isCorrect ? "Correct (+1)" : "Incorrect (0)"}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                    {question.name}
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                    <div style={{ color: isCorrect ? "#166534" : "#991b1b" }}>
                      <strong>Your Answer: </strong>
                      {selectedOptions[index]
                        ? `${selectedOptions[index]} - ${question.options[selectedOptions[index]]}`
                        : "Skipped / Unanswered"}
                    </div>
                    <div style={{ color: "#166534" }}>
                      <strong>Correct Answer: </strong>
                      {question.correctOption} - {question.options[question.correctOption]}
                    </div>
                  </div>

                  {question.explanation && (
                    <div
                      style={{
                        marginTop: 10,
                        backgroundColor: "#fefce8",
                        border: "1px solid #fef08a",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontSize: "13px",
                        color: "#713f12",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <i className="ri-lightbulb-fill" style={{ color: "#eab308", fontSize: 16, marginTop: 1, flexShrink: 0 }}></i>
                      <div>
                        <strong>Concept & Solution Breakdown: </strong>
                        <span>{question.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "16px" }}>
              <button
                type="button"
                className="primary-contained-btn"
                onClick={() => navigate("/")}
              >
                Back to Assessment Tracks
              </button>
            </div>
          </div>
        )}

        {showCertificateModal && (
          <CertificateModal
            visible={showCertificateModal}
            onCancel={() => setShowCertificateModal(false)}
            report={{
              user,
              exam: examData,
              result,
              createdAt: new Date(),
              _id: "cert_" + Date.now(),
            }}
          />
        )}
      </div>
    )
  );
}

export default WriteExam;
