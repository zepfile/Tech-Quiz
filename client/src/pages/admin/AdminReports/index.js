import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Input } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import { CategoryBadgeIcon, TrophyIcon, TargetIcon } from "../../../components/TechIcons";
import { EmptyDataIllustration } from "../../../components/SvgIllustrations";
import { downloadCSV, escapeCSV } from "../../../utils/csvHelper";
import CertificateModal from "../../../components/CertificateModal";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const [selectedReportForCert, setSelectedReportForCert] = useState(null);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  const totalReports = reportsData.length;
  const passedReports = reportsData.filter(
    (r) => r.result?.verdict?.toLowerCase() === "pass"
  ).length;
  const failedReports = totalReports - passedReports;
  const overallPassRate =
    totalReports > 0 ? Math.round((passedReports / totalReports) * 100) : 0;

  const handleExportCSV = () => {
    if (!reportsData || !reportsData.length) {
      message.warning("No submissions available to export.");
      return;
    }

    const headers = [
      "Candidate Name",
      "Candidate Email",
      "Exam Name",
      "Category",
      "Submission Date",
      "Marks Obtained",
      "Total Marks",
      "Accuracy (%)",
      "Passing Marks",
      "Verdict",
    ];

    const rows = reportsData.map((r) => {
      const score =
        r.result?.obtainedScore !== undefined
          ? r.result.obtainedScore
          : r.result?.correctAnswers?.length || 0;
      const total = r.exam?.totalMarks || 1;
      const pct = Math.round((score / total) * 100);
      return [
        r.user?.name || "N/A",
        r.user?.email || "N/A",
        r.exam?.name || "N/A",
        r.exam?.category || "General",
        moment(r.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        score,
        total,
        `${pct}%`,
        r.exam?.passingMarks || 0,
        r.result?.verdict?.toUpperCase() || "N/A",
      ];
    });

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const dateStr = moment().format("YYYY-MM-DD");
    downloadCSV(`TechQuiz_Admin_Submissions_${dateStr}.csv`, csvContent);
    message.success(`Exported ${reportsData.length} submissions to CSV!`);
  };

  const columns = [
    {
      title: "Candidate",
      dataIndex: "userName",
      render: (text, record) => {
        const userName = record.user?.name || "Candidate";
        const userEmail = record.user?.email || "";
        const initial = userName.charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {initial}
            </span>
            <div>
              <div className="font-semibold text-gray-900">{userName}</div>
              {userEmail && <div className="text-xs text-muted">{userEmail}</div>}
            </div>
          </div>
        );
      },
    },
    {
      title: "Exam & Category",
      dataIndex: "examName",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <CategoryBadgeIcon category={record.exam?.category} size={30} />
          <div>
            <div className="font-semibold text-gray-900">
              {record.exam?.name || "Quiz"}
            </div>
            {record.exam?.category && (
              <span className="badge badge-primary" style={{ fontSize: 10, marginTop: 2 }}>
                {record.exam.category}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Submission Date",
      dataIndex: "date",
      render: (text, record) => (
        <span className="text-sm text-gray-700">
          <i className="ri-calendar-line text-muted mr-1"></i>
          {moment(record.createdAt).format("MMM DD, YYYY • hh:mm A")}
        </span>
      ),
    },
    {
      title: "Score & Marks",
      dataIndex: "obtainedMarks",
      render: (text, record) => {
        const score =
          record.result?.obtainedScore !== undefined
            ? record.result.obtainedScore
            : record.result?.correctAnswers?.length || 0;
        const total = record.exam?.totalMarks || 1;
        const percentage = Math.round((score / total) * 100);
        const penalty = record.result?.penaltyDeducted;
        return (
          <div>
            <span className="font-bold text-gray-900">
              {score} / {total}
            </span>
            <span className="text-xs text-muted ml-2">({percentage}%)</span>
            {penalty > 0 && (
              <div
                className="text-xs"
                style={{ color: "#dc2626", fontWeight: 600, marginTop: 2 }}
              >
                -{penalty} neg. mark
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Passing Threshold",
      dataIndex: "passingMarks",
      render: (text, record) => (
        <span className="text-sm text-gray-600">
          Need {record.exam?.passingMarks || 0} marks
        </span>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => {
        const isPass = record.result?.verdict?.toLowerCase() === "pass";
        return (
          <span className={`badge ${isPass ? "badge-success" : "badge-danger"}`}>
            {isPass ? "Passed" : "Failed"}
          </span>
        );
      },
    },
    {
      title: "Certificate",
      dataIndex: "certificate",
      render: (text, record) => {
        const isPass = record.result?.verdict?.toLowerCase() === "pass";
        if (!isPass) {
          return <span className="text-xs text-muted">N/A</span>;
        }
        return (
          <button
            type="button"
            className="primary-outlined-btn"
            style={{
              height: 32,
              padding: "0 10px",
              fontSize: 12,
              borderRadius: 8,
              borderColor: "#f59e0b",
              color: "#b45309",
              background: "#fffbeb",
            }}
            onClick={() => setSelectedReportForCert(record)}
          >
            <i className="ri-award-fill"></i> View Certificate
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
        <div>
          <PageTitle title="Candidate Submission Reports" />
          <p className="text-sm text-muted mt-1">
            Global audit log of candidate quiz attempts, scores, and evaluations
          </p>
        </div>
      </div>

      {/* KPI Stats Strip with Custom SVGs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <div className="card p-3 flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#eef2ff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            <i className="ri-folder-user-line"></i>
          </div>
          <div>
            <div className="text-xs text-muted uppercase font-bold tracking-wider">
              Total Submissions
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalReports}</div>
          </div>
        </div>

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
              Successful Passes
            </div>
            <div className="text-2xl font-bold text-emerald-600">{passedReports}</div>
          </div>
        </div>

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
              Failed Attempts
            </div>
            <div className="text-2xl font-bold text-rose-600">{failedReports}</div>
          </div>
        </div>

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
            <div className="text-2xl font-bold text-purple-700">{overallPassRate}%</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-3 mb-3">
        <div className="flex gap-3 flex-wrap items-center">
          <div style={{ flex: 1, minWidth: 220 }}>
            <Input
              prefix={<i className="ri-draft-line text-muted"></i>}
              placeholder="Filter by Exam Name..."
              value={filters.examName}
              onChange={(e) =>
                setFilters({ ...filters, examName: e.target.value })
              }
              onPressEnter={() => getData(filters)}
              allowClear
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <Input
              prefix={<i className="ri-user-line text-muted"></i>}
              placeholder="Filter by Candidate Name..."
              value={filters.userName}
              onChange={(e) =>
                setFilters({ ...filters, userName: e.target.value })
              }
              onPressEnter={() => getData(filters)}
              allowClear
            />
          </div>

          <button
            type="button"
            className="primary-outlined-btn"
            style={{ height: 42, padding: "0 18px", borderRadius: 10 }}
            onClick={() => {
              const reset = { examName: "", userName: "" };
              setFilters(reset);
              getData(reset);
            }}
          >
            <i className="ri-refresh-line"></i> Reset
          </button>

          <button
            type="button"
            className="primary-contained-btn"
            style={{ height: 42, padding: "0 20px", borderRadius: 10 }}
            onClick={() => getData(filters)}
          >
            <i className="ri-search-line"></i> Filter Submissions
          </button>

          <button
            type="button"
            className="primary-outlined-btn"
            style={{
              height: 42,
              padding: "0 18px",
              borderRadius: 10,
              borderColor: "#10b981",
              color: "#059669",
              background: "#f0fdf4",
            }}
            onClick={handleExportCSV}
            title="Export all visible submissions as CSV"
          >
            <i className="ri-file-excel-2-line"></i> Export to CSV
          </button>
        </div>
      </div>

      {/* Reports Table or Empty State */}
      {reportsData.length === 0 ? (
        <div className="card p-5 text-center mt-3" style={{ padding: "48px 20px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <EmptyDataIllustration width={150} height={130} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 6px 0" }}>
            No Matching Submissions Found
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Try adjusting your search filters or check back after candidates complete exams.
          </p>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={reportsData}
          rowKey={(record) => record._id || record.createdAt}
          pagination={{ pageSize: 8 }}
        />
      )}

      {selectedReportForCert && (
        <CertificateModal
          visible={Boolean(selectedReportForCert)}
          onCancel={() => setSelectedReportForCert(null)}
          report={selectedReportForCert}
        />
      )}
    </div>
  );
}

export default AdminReports;
