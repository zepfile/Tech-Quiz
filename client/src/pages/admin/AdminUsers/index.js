import React, { useEffect, useState } from "react";
import { Table, message, Input, Modal, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { getAllUsers, updateUserRole } from "../../../apicalls/users";
import PageTitle from "../../../components/PageTitle";
import moment from "moment";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState("admin"); // 'admin' | 'user' | 'all'
  const [searchQuery, setSearchQuery] = useState("");
  const [superAdminEmail, setSuperAdminEmail] = useState("admin@quiz.com");
  const { user } = useSelector((state) => state.users);

  const isCurrentSuperAdmin =
    (user?.email || "").toLowerCase() === superAdminEmail.toLowerCase();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setLoading(false);
      if (res && res.success) {
        setUsers(res.data || []);
        if (res.superAdminEmail) {
          setSuperAdminEmail(res.superAdminEmail);
        }
      } else {
        message.error(res?.message || "Failed to load admin directory");
      }
    } catch (err) {
      setLoading(false);
      message.error(err.message || "Failed to load user directory");
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleToggle = (targetUser) => {
    const nextRoleIsAdmin = !targetUser.isAdmin;
    const actionLabel = nextRoleIsAdmin ? "Promote to Admin" : "Demote to User";

    Modal.confirm({
      title: `Confirm Role Change`,
      content: (
        <div>
          <p>
            Are you sure you want to <strong>{actionLabel}</strong> for:
          </p>
          <p style={{ fontWeight: 700, color: "#4f46e5" }}>{targetUser.email}</p>
          {nextRoleIsAdmin ? (
            <p style={{ fontSize: 12, color: "#d97706" }}>
              ⚠️ This will grant full administrator powers: creating & editing quizzes, viewing reports, and accessing candidate data.
            </p>
          ) : (
            <p style={{ fontSize: 12, color: "#64748b" }}>
              This account will revert to regular User permissions and can only take available assessments.
            </p>
          )}
        </div>
      ),
      okText: actionLabel,
      okButtonProps: {
        danger: !nextRoleIsAdmin,
      },
      onOk: async () => {
        try {
          const res = await updateUserRole({
            targetUserId: targetUser._id,
            newIsAdmin: nextRoleIsAdmin,
          });
          if (res && res.success) {
            message.success(res.message);
            fetchUsers();
          } else {
            message.error(res?.message || "Failed to update role");
          }
        } catch (err) {
          message.error(err.message);
        }
      },
    });
  };

  // Filter accounts
  const adminUsers = users.filter((u) => u.isAdmin);
  const regularUsers = users.filter((u) => !u.isAdmin);

  const displayedUsers = users.filter((item) => {
    // 1. Role filter
    if (filterRole === "admin" && !item.isAdmin) return false;
    if (filterRole === "user" && item.isAdmin) return false;

    // 2. Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.name || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      title: "Account Member",
      dataIndex: "name",
      width: 240,
      render: (name, record) => {
        const isSuper = (record.email || "").toLowerCase() === superAdminEmail.toLowerCase();
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: isSuper
                  ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  : record.isAdmin
                  ? "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)"
                  : "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {name ? name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {name || "User Account"}
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                ID: {record._id.slice(-6)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Email Address (Admin Identification)",
      dataIndex: "email",
      render: (email, record) => {
        const isSuper = (email || "").toLowerCase() === superAdminEmail.toLowerCase();
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontWeight: record.isAdmin ? 700 : 500,
                fontSize: 13.5,
                color: isSuper ? "#f59e0b" : record.isAdmin ? "#818cf8" : undefined,
                fontFamily: "monospace",
              }}
            >
              {email}
            </span>
            <Tooltip title="Copy Email">
              <i
                className="ri-file-copy-line"
                style={{ cursor: "pointer", color: "#94a3b8", fontSize: 14 }}
                onClick={() => {
                  navigator.clipboard.writeText(email);
                  message.success("Email copied to clipboard!");
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Account Privilege Role",
      dataIndex: "isAdmin",
      width: 180,
      render: (isAdmin, record) => {
        const isSuper = (record.email || "").toLowerCase() === superAdminEmail.toLowerCase();
        if (isSuper) {
          return (
            <span
              className="badge"
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                color: "#92400e",
                border: "1px solid #fcd34d",
                fontWeight: 800,
                fontSize: 11.5,
                padding: "4px 10px",
                borderRadius: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              👑 SUPER ADMIN
            </span>
          );
        }
        if (isAdmin) {
          return (
            <span
              className="badge"
              style={{
                background: "#f3e8ff",
                color: "#7e22ce",
                border: "1px solid #d8b4fe",
                fontWeight: 800,
                fontSize: 11.5,
                padding: "4px 10px",
                borderRadius: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              🛡️ ADMIN
            </span>
          );
        }
        return (
          <span
            className="badge"
            style={{
              background: "#f1f5f9",
              color: "#475569",
              border: "1px solid #cbd5e1",
              fontWeight: 600,
              fontSize: 11.5,
              padding: "4px 10px",
              borderRadius: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            👤 USER
          </span>
        );
      },
    },
    {
      title: "Date Registered",
      dataIndex: "createdAt",
      width: 160,
      render: (date) => (
        <span style={{ fontSize: 12.5, color: "#64748b" }}>
          <i className="ri-calendar-line" style={{ marginRight: 5 }} />
          {date ? moment(date).format("MMM DD, YYYY") : "Initial Setup"}
        </span>
      ),
    },
    {
      title: "Privilege Controls",
      key: "actions",
      width: 170,
      render: (text, record) => {
        const isSuper = (record.email || "").toLowerCase() === superAdminEmail.toLowerCase();

        if (isSuper) {
          return (
            <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 600, fontStyle: "italic" }}>
              Permanent Super Admin
            </span>
          );
        }

        // Only allow role toggling if current user is Super Admin or Admin modifying user
        return (
          <button
            type="button"
            className={record.isAdmin ? "primary-outlined-btn" : "primary-contained-btn"}
            style={{
              padding: "4px 12px",
              height: 30,
              fontSize: 11.5,
              borderRadius: 8,
              borderColor: record.isAdmin ? "#ef4444" : undefined,
              color: record.isAdmin ? "#ef4444" : undefined,
            }}
            onClick={() => handleRoleToggle(record)}
          >
            {record.isAdmin ? "Demote to User" : "Grant Admin 🛡️"}
          </button>
        );
      },
    },
  ];

  return (
    <div style={{ width: "100%", paddingBottom: 40 }}>
      {/* Page Header */}
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
          <PageTitle title="Admin Accounts & Role Privilege Directory" />
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            Inspect all authorized admin email addresses and manage system permissions.
          </p>
        </div>

        {/* Super Admin Status Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              background: isCurrentSuperAdmin
                ? "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)"
                : "rgba(99, 102, 241, 0.12)",
              border: `1.5px solid ${isCurrentSuperAdmin ? "#f59e0b" : "#818cf8"}`,
              padding: "6px 14px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              fontWeight: 700,
              color: isCurrentSuperAdmin ? "#d97706" : "#4f46e5",
            }}
          >
            <span>{isCurrentSuperAdmin ? "👑 Master Super Admin Active" : "🛡️ Admin Console"}</span>
            <span style={{ opacity: 0.7, fontWeight: 500 }}>({user?.email})</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 22,
        }}
      >
        {/* Card 1: Total Admins */}
        <div
          className="card"
          style={{
            padding: "18px 20px",
            borderRadius: 14,
            borderLeft: "4px solid #7c3aed",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Authorized Admin Emails
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800 }}>
              {adminUsers.length}
            </span>
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>
              Active Privileges
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            Primary Master: <strong style={{ color: "#d97706" }}>{superAdminEmail}</strong>
          </div>
        </div>

        {/* Card 2: Regular Users */}
        <div
          className="card"
          style={{
            padding: "18px 20px",
            borderRadius: 14,
            borderLeft: "4px solid #0284c7",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Candidate Users
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800 }}>
              {regularUsers.length}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              Standard Accounts
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            Quiz examinees and participants
          </div>
        </div>

        {/* Card 3: Total Accounts */}
        <div
          className="card"
          style={{
            padding: "18px 20px",
            borderRadius: 14,
            borderLeft: "4px solid #10b981",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Total Registered Database Accounts
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800 }}>
              {users.length}
            </span>
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>
              100% Synced
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            MongoDB Atlas verified identities
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          borderRadius: "14px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        {/* Adaptive Tab Filter Pills */}
        <div className="tab-pill-container">
          <button
            type="button"
            className={`tab-pill-btn ${filterRole === "admin" ? "active" : ""}`}
            onClick={() => setFilterRole("admin")}
          >
            🛡️ Admin Emails Only ({adminUsers.length})
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${filterRole === "user" ? "active" : ""}`}
            onClick={() => setFilterRole("user")}
          >
            👤 Candidate Users ({regularUsers.length})
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${filterRole === "all" ? "active" : ""}`}
            onClick={() => setFilterRole("all")}
          >
            🌐 All Accounts ({users.length})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ width: 320, maxWidth: "100%" }}>
          <Input
            placeholder="Search by email address or name..."
            prefix={<i className="ri-search-line" style={{ color: "#94a3b8" }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>
      </div>

      {/* Users Table */}
      <Table
        loading={loading}
        columns={columns}
        dataSource={displayedUsers}
        rowKey="_id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{
          emptyText:
            filterRole === "admin"
              ? "No administrator accounts match your search filter."
              : "No user accounts found.",
        }}
      />
    </div>
  );
}

export default AdminUsers;
