import "./stylesheets/theme.css";
import "./stylesheets/alignments.css";
import "./stylesheets/textelements.css";
import "./stylesheets/custom-components.css";
import "./stylesheets/form-elements.css";
import "./stylesheets/layout.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/common/Home";
import Exams from "./pages/admin/Exams";
import AddEditExam from "./pages/admin/Exams/AddEditExam";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import WriteExam from "./pages/user/WriteExam";
import UserReports from "./pages/user/UserReports";
import AdminReports from "./pages/admin/AdminReports";
import Profile from "./pages/common/Profile";
import Leaderboard from "./pages/common/Leaderboard";
import LandingPage from "./pages/common/LandingPage";
import { BrandLogo } from "./components/TechIcons";

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          {/* Public Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />

          {/* Public Landing Page */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/welcome" element={<LandingPage />} />

          {/* Root Route: If authenticated -> Home Dashboard; If visitor -> Public Landing Page */}
          <Route
            path="/"
            element={
              localStorage.getItem("token") ? (
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/write-exam/:id"
            element={
              <ProtectedRoute>
                <WriteExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute>
                <UserReports />
              </ProtectedRoute>
            }
          />

          {/* User Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard: Accessible within Protected Layout if logged in, or with clean public header if visitor */}
          <Route
            path="/leaderboard"
            element={
              localStorage.getItem("token") ? (
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              ) : (
                <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px" }}>
                  <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div
                      style={{
                        marginBottom: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        padding: "12px 20px",
                        borderRadius: 14,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                        onClick={() => (window.location.href = "/")}
                      >
                        <BrandLogo size={32} />
                        <span style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
                          TechQuiz<span style={{ color: "#38bdf8" }}>.io</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          type="button"
                          className="primary-outlined-btn"
                          style={{ height: 34, padding: "0 14px", borderRadius: 8, fontSize: 12 }}
                          onClick={() => (window.location.href = "/login")}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          className="primary-contained-btn"
                          style={{ height: 34, padding: "0 16px", borderRadius: 8, fontSize: 12 }}
                          onClick={() => (window.location.href = "/register")}
                        >
                          Register Free
                        </button>
                      </div>
                    </div>
                    <Leaderboard />
                  </div>
                </div>
              )
            }
          />

          {/* Administrator Dedicated Routes (Protected by requireAdmin) */}
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
