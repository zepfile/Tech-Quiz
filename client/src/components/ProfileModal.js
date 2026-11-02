import React, { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { updateUserProfile } from "../apicalls/users";
import { getAllReportsByUser, getAllReports } from "../apicalls/reports";
import moment from "moment";

const { TabPane } = Tabs;

function ProfileModal({ visible, onCancel, user, onLogout }) {
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

  const isAdmin = Boolean(user?.isAdmin);

  useEffect(() => {
    if (visible && user) {
      nameForm.setFieldsValue({ name: user.name });
      passwordForm.resetFields();
      loadUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, user]);

  const loadUserStats = async () => {
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

  const initial = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ padding: 0, borderRadius: 20, overflow: "hidden" }}
      className="profile-modal-modern"
    >
      {/* Top Gradient Banner */}
      <div
        style={{
          background: isAdmin
            ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0369a1 100%)",
          padding: "28px 24px 20px 24px",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255, 255, 255, 0.15)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            transition: "all 0.2s",
          }}
        >
          <i className="ri-close-line"></i>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: isAdmin
                ? "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)"
                : "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {user?.name}
              </h2>
              <span
                style={{
                  backgroundColor: isAdmin ? "rgba(192, 132, 252, 0.2)" : "rgba(56, 189, 248, 0.2)",
                  color: isAdmin ? "#e9d5ff" : "#bae6fd",
                  border: `1px solid ${isAdmin ? "rgba(192, 132, 252, 0.4)" : "rgba(56, 189, 248, 0.4)"}`,
                  borderRadius: 20,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {isAdmin ? "Admin Console" : "Candidate Portal"}
              </span>
            </div>

            <p style={{ margin: "4px 0 8px 0", fontSize: 13, color: "#cbd5e1", opacity: 0.9 }}>
              {user?.email}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#4ade80", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
                Active Account
              </span>
              <span style={{ color: "#94a3b8" }}>•</span>
              <span style={{ color: "#cbd5e1" }}>
                Member since {user?.createdAt ? moment(user.createdAt).format("MMM YYYY") : "2026"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Body */}
      <div style={{ padding: "20px 24px" }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Tab 1: Overview & Stats */}
          <TabPane
            tab={
              <span>
                <i className="ri-dashboard-line" style={{ marginRight: 6 }}></i>
                Overview
              </span>
            }
            key="overview"
          >
            {/* Quick Metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "12px 14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  {isAdmin ? "Submissions" : "Assessments"}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                  {stats.total}
                </div>
              </div>

              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 12,
                  padding: "12px 14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, textTransform: "uppercase" }}>
                  {isAdmin ? "Pass Count" : "Passed"}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#15803d", marginTop: 4 }}>
                  {stats.passed}
                </div>
              </div>

              <div
                style={{
                  background: "#faf5ff",
                  border: "1px solid #e9d5ff",
                  borderRadius: 12,
                  padding: "12px 14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11, color: "#7e22ce", fontWeight: 700, textTransform: "uppercase" }}>
                  Success Rate
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#6b21a8", marginTop: 4 }}>
                  {stats.rate}%
                </div>
              </div>
            </div>

            {/* Profile Information Card */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Full Name:</span>
                <strong style={{ fontSize: 14, color: "#0f172a" }}>{user?.name}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Email Address:</span>
                <span style={{ fontSize: 13, color: "#0f172a", fontFamily: "monospace", background: "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>
                  {user?.email}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Portal Role:</span>
                <span
                  style={{
                    backgroundColor: isAdmin ? "#f3e8ff" : "#dcfce7",
                    color: isAdmin ? "#7e22ce" : "#15803d",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}
                >
                  {isAdmin ? "Administrator" : "Candidate / Student"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Database Storage:</span>
                <span style={{ fontSize: 12, color: "#0284c7", fontWeight: 600 }}>
                  <i className="ri-cloud-line" style={{ marginRight: 4 }}></i>
                  MongoDB Atlas Cloud
                </span>
              </div>
            </div>
          </TabPane>

          {/* Tab 2: Edit Profile */}
          <TabPane
            tab={
              <span>
                <i className="ri-edit-line" style={{ marginRight: 6 }}></i>
                Edit Name
              </span>
            }
            key="edit"
          >
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
                label={<span style={{ fontWeight: 600, color: "#334155" }}>Email Address (Read-only)</span>}
              >
                <Input
                  prefix={<i className="ri-mail-line text-muted"></i>}
                  value={user?.email}
                  disabled
                  style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                />
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  className="primary-contained-btn"
                  disabled={loading}
                  style={{ height: 40, padding: "0 22px", borderRadius: 10 }}
                >
                  <i className="ri-save-line"></i> {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          </TabPane>

          {/* Tab 3: Security & Password */}
          <TabPane
            tab={
              <span>
                <i className="ri-lock-password-line" style={{ marginRight: 6 }}></i>
                Security
              </span>
            }
            key="security"
          >
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  className="primary-contained-btn"
                  disabled={loading}
                  style={{ height: 40, padding: "0 22px", borderRadius: 10 }}
                >
                  <i className="ri-shield-keyhole-line"></i> {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </Form>
          </TabPane>
        </Tabs>

        {/* Modal Bottom Action Strip */}
        <div
          style={{
            borderTop: "1px solid #e2e8f0",
            paddingTop: 16,
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: "transparent",
              border: "1px solid #fecaca",
              color: "#dc2626",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <i className="ri-logout-box-r-line"></i> Sign Out
          </button>

          <button
            type="button"
            className="primary-outlined-btn"
            style={{ height: 38, padding: "0 18px", borderRadius: 10 }}
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProfileModal;
