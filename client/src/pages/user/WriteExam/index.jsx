import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import { CategoryBadgeIcon, TimerClockSvg } from "../../../components/TechIcons";
import { ExamPassedIllustration, ExamFailedIllustration } from "../../../components/SvgIllustrations";

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
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

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
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

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const currentQuestion = questions[selectedQuestionIndex];

  return (
    examData && (
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {/* QUESTIONS VIEW */}
        {view === "questions" && currentQuestion && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Top Bar: Exam Title & Timer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderRadius: "16px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
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

        {/* RESULT VIEW */}
        {view === "result" && (
          <div style={{ maxWidth: "640px", margin: "20px auto" }}>
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

              <span
                className={`badge ${
                  result.verdict === "Pass" ? "badge-success" : "badge-danger"
                }`}
                style={{ fontSize: "13px", padding: "6px 16px" }}
              >
                {result.verdict === "Pass" ? "PASSED EXAMINATION" : "NEEDS RETAKE"}
              </span>

              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "12px", marginBottom: "4px" }}>
                {examData.name}
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                {result.verdict === "Pass"
                  ? "Congratulations! You successfully cleared the passing threshold."
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
                    Obtained
                  </span>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#4f46e5", marginTop: "4px" }}>
                    {result.correctAnswers?.length || 0}
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#94a3b8" }}> / {examData.totalMarks}</span>
                  </div>
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
              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <button
                  type="button"
                  className="primary-outlined-btn"
                  onClick={() => {
                    setView("instructions");
                    setSelectedQuestionIndex(0);
                    setSelectedOptions({});
                    setSecondsLeft(examData.duration);
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
      </div>
    )
  );
}

export default WriteExam;
