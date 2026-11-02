import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Form, Input, message, Row, Col } from "antd";
import { SetUser } from "../../../redux/usersSlice";
import { updateUserProfile } from "../../../apicalls/users";
import { getAllReportsByUser, getAllReports } from "../../../apicalls/reports";
import { TrophyIcon, TargetIcon } from "../../../components/TechIcons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { TabPane } = Tabs;

function Profile() {
  const { user } = useSelector((state) => state.users);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    rate: 0,
  });

  const [nameForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = Boolean(user?.isAdmin);

  useEffect(() => {
    if (user) {
      nameForm.setFieldsValue({ name: user.name });
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadStats = async () => {
    try {
      if (isAdmin) {
        const res = await getAllReports({});
        if (res.success) {
          const list = res.data || [];
          const passed = list.filter(
            (r) => r.result?.verdict?.toLowerCase() === "pass"
          ).length;
          setStats({
            total: list.length,
            passed,
            failed: list.length - passed,
            rate: list.length ? Math.round((passed / list.length) * 100) : 0,
          });
        }
      } else {
        const res = await getAllReportsByUser();
        if (res.success) {
          const list = res.data || [];
          const passed = list.filter(
            (r) => r.result?.verdict?.toLowerCase() === "pass"
          ).length;
          setStats({
            total: list.length,
            passed,
            failed: list.length - passed,
            rate: list.length ? Math.round((passed / list.length) * 100) : 0,
          });
        }
      }
    } catch (err) {
      // quiet fail for stats
    }
  };

  const handleUpdateName = async (values) => {
    try {
      setLoading(true);
      const res = await updateUserProfile({ name: values.name });
      setLoading(false);
      if (res.success) {
        message.success("Profile name updated successfully!");
        dispatch(SetUser(res.data));
      } else {
        message.error(res.message);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const handleUpdatePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      const res = await updateUserProfile({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      setLoading(false);
      if (res.success) {
        message.success("Password changed successfully!");
        passwordForm.resetFields();
        setActiveTab("overview");
      } else {
        message.error(res.message);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(isAdmin ? "/admin/login" : "/login");
  };

  const initial = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    user && (
      <div>
        {/* Profile Hero Header Card */}
        <div
          style={{
            background: isAdmin
              ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)"
              : "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0369a1 100%)",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "24px",
            color: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: isAdmin
                    ? "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)"
                    : "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 800,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                  border: "4px solid rgba(255, 255, 255, 0.3)",
                  flexShrink: 0,
                }}
              >
                {initial}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <h1
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#ffffff",
                      margin: 0,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {user?.name}
                  </h1>
                  <span
                    style={{
                      backgroundColor: isAdmin ? "rgba(192, 132, 252, 0.2)" : "rgba(56, 189, 248, 0.2)",
                      color: isAdmin ? "#e9d5ff" : "#bae6fd",
                      border: `1px solid ${isAdmin ? "rgba(192, 132, 252, 0.4)" : "rgba(56, 189, 248, 0.4)"}`,
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {isAdmin ? "Admin Console" : "User Portal"}
                  </span>
                </div>

                <p style={{ margin: "6px 0 10px 0", fontSize: 14, color: "#cbd5e1" }}>
                  {user?.email}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#4ade80", fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
                    Active & Verified
                  </span>
                  <span style={{ color: "#94a3b8" }}>•</span>
                  <span style={{ color: "#cbd5e1" }}>
                    Joined {user?.createdAt ? moment(user.createdAt).format("MMMM Do, YYYY") : "2026"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(248, 113, 113, 0.4)",
                color: "#fecaca",
                borderRadius: 12,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
            >
              <i className="ri-logout-box-r-line"></i> Sign Out
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <div className="card p-3 flex items-center gap-3">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                <i className="ri-folder-open-line"></i>
              </div>
              <div>
                <div className="text-xs text-muted uppercase font-bold tracking-wider">
                  {isAdmin ? "Total Submissions" : "Assessments Taken"}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="card p-3 flex items-center gap-3">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrophyIcon size={30} />
              </div>
              <div>
                <div className="text-xs text-muted uppercase font-bold tracking-wider">
                  Passed
                </div>
                <div className="text-2xl font-bold text-emerald-600">{stats.passed}</div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="card p-3 flex items-center gap-3">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TargetIcon size={30} />
              </div>
              <div>
                <div className="text-xs text-muted uppercase font-bold tracking-wider">
                  Failed
                </div>
                <div className="text-2xl font-bold text-rose-600">{stats.failed}</div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="card p-3 flex items-center gap-3">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#faf5ff",
                  color: "#9333ea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                <i className="ri-bar-chart-2-line"></i>
              </div>
              <div>
                <div className="text-xs text-muted uppercase font-bold tracking-wider">
                  Success Rate
                </div>
                <div className="text-2xl font-bold text-purple-700">{stats.rate}%</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Profile Management Tabs Container */}
        <div className="card p-4">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* Tab 1: Overview */}
            <TabPane
              tab={
                <span>
                  <i className="ri-user-line" style={{ marginRight: 6 }}></i>
                  Account Overview
                </span>
              }
              key="overview"
            >
              <div style={{ maxWidth: 650 }}>
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Full Name:</span>
                    <strong style={{ fontSize: 15, color: "#0f172a" }}>{user?.name}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Email Address:</span>
                    <span style={{ fontSize: 14, color: "#0f172a", fontFamily: "monospace", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6 }}>
                      {user?.email}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Assigned Role:</span>
                    <span
                      style={{
                        backgroundColor: isAdmin ? "#f3e8ff" : "#dcfce7",
                        color: isAdmin ? "#7e22ce" : "#15803d",
                        fontWeight: 700,
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 20,
                      }}
                    >
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Database Infrastructure:</span>
                    <span style={{ fontSize: 13, color: "#0284c7", fontWeight: 600 }}>
                      <i className="ri-cloud-line" style={{ marginRight: 4 }}></i>
                      MongoDB Atlas Live Cluster
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Quick Navigation:</span>
                    <button
                      type="button"
                      className="primary-outlined-btn"
                      style={{ height: 34, padding: "0 14px", borderRadius: 8, fontSize: 12 }}
                      onClick={() => navigate(isAdmin ? "/admin/reports" : "/user/reports")}
                    >
                      <i className="ri-file-list-3-line"></i> View Submissions & History
                    </button>
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Tab 2: Edit Name */}
            <TabPane
              tab={
                <span>
                  <i className="ri-edit-line" style={{ marginRight: 6 }}></i>
                  Edit Display Name
                </span>
              }
              key="edit"
            >
              <div style={{ maxWidth: 520, padding: "8px 0" }}>
                <Form form={nameForm} layout="vertical" onFinish={handleUpdateName}>
                  <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: 600, color: "#334155" }}>Display Name</span>}
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input
                      prefix={<i className="ri-user-line text-muted"></i>}
                      placeholder="Enter full name..."
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: "#334155" }}>Email Address (Non-editable)</span>}
                  >
                    <Input
                      prefix={<i className="ri-mail-line text-muted"></i>}
                      value={user?.email}
                      disabled
                      style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                    />
                  </Form.Item>

                  <button
                    type="submit"
                    className="primary-contained-btn"
                    disabled={loading}
                    style={{ height: 42, padding: "0 24px", borderRadius: 10, marginTop: 10 }}
                  >
                    <i className="ri-save-line"></i> {loading ? "Saving..." : "Save Changes"}
                  </button>
                </Form>
              </div>
            </TabPane>

            {/* Tab 3: Security & Password */}
            <TabPane
              tab={
                <span>
                  <i className="ri-lock-password-line" style={{ marginRight: 6 }}></i>
                  Security & Password
                </span>
              }
              key="security"
            >
              <div style={{ maxWidth: 520, padding: "8px 0" }}>
                <Form form={passwordForm} layout="vertical" onFinish={handleUpdatePassword}>
                  <Form.Item
                    name="oldPassword"
                    label={<span style={{ fontWeight: 600, color: "#334155" }}>Current Password</span>}
                    rules={[{ required: true, message: "Please enter current password" }]}
                  >
                    <Input.Password
                      prefix={<i className="ri-lock-line text-muted"></i>}
                      placeholder="Enter current password..."
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label={<span style={{ fontWeight: 600, color: "#334155" }}>New Password</span>}
                    rules={[
                      { required: true, message: "Please enter new password" },
                      { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                  >
                    <Input.Password
                      prefix={<i className="ri-key-line text-muted"></i>}
                      placeholder="Minimum 6 characters..."
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label={<span style={{ fontWeight: 600, color: "#334155" }}>Confirm New Password</span>}
                    rules={[{ required: true, message: "Please confirm new password" }]}
                  >
                    <Input.Password
                      prefix={<i className="ri-checkbox-circle-line text-muted"></i>}
                      placeholder="Re-enter new password..."
                    />
                  </Form.Item>

                  <button
                    type="submit"
                    className="primary-contained-btn"
                    disabled={loading}
                    style={{ height: 42, padding: "0 24px", borderRadius: 10, marginTop: 10 }}
                  >
                    <i className="ri-shield-keyhole-line"></i> {loading ? "Updating..." : "Update Password"}
                  </button>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  );
}

export default Profile;
