import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { CategoryBadgeIcon, TrophyIcon, TargetIcon } from "../../../components/TechIcons";
import { EmptyDataIllustration } from "../../../components/SvgIllustrations";
import { downloadCSV, escapeCSV } from "../../../utils/csvHelper";
import CertificateModal from "../../../components/CertificateModal";
import moment from "moment";

function UserReports() {
  const [reportsData, setReportsData] = useState([]);
  const [selectedReportForCert, setSelectedReportForCert] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
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
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalAttempts = reportsData.length;
  const passedAttempts = reportsData.filter(
    (r) => r.result?.verdict?.toLowerCase() === "pass"
  ).length;
  const failedAttempts = totalAttempts - passedAttempts;
  const passRate =
    totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  const handleExportCSV = () => {
    if (!reportsData || !reportsData.length) {
      message.warning("No records available to export.");
      return;
    }

    const headers = [
      "Exam Name",
      "Category",
      "Attempt Date & Time",
      "Score Obtained",
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
    downloadCSV(`TechQuiz_My_Assessment_History_${dateStr}.csv`, csvContent);
    message.success(`Exported ${reportsData.length} records to CSV!`);
  };

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <CategoryBadgeIcon category={record.exam?.category} size={32} />
          <div>
            <div className="font-semibold text-gray-900">
              {record.exam?.name || "Exam Track"}
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
      title: "Attempt Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span className="text-sm text-gray-700">
          <i className="ri-calendar-line text-muted mr-1"></i>
          {moment(record.createdAt).format("MMM DD, YYYY • hh:mm A")}
        </span>
      ),
    },
    {
      title: "Score & Accuracy",
      dataIndex: "correctAnswers",
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
              {score} / {total} marks
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
      title: "Passing Requirement",
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
          return <span className="text-xs text-muted">Not Eligible</span>;
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
            <i className="ri-award-fill"></i> Certificate
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
        <div>
          <PageTitle title="My Assessment History" />
          <p className="text-sm text-muted mt-1">
            Review detailed scores, accuracy, and test progression
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="primary-outlined-btn"
            style={{ borderColor: "#10b981", color: "#059669", background: "#f0fdf4" }}
            onClick={handleExportCSV}
            title="Export your attempts to CSV"
          >
            <i className="ri-file-excel-2-line"></i> Export My Records (CSV)
          </button>

          <button
            className="primary-outlined-btn"
            onClick={() => navigate("/")}
          >
            <i className="ri-compass-line"></i> Browse Quizzes
          </button>
        </div>
      </div>

      {/* KPI Performance Strip with Custom SVGs */}
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
            <i className="ri-history-line"></i>
          </div>
          <div>
            <div className="text-xs text-muted uppercase font-bold tracking-wider">
              Total Attempts
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalAttempts}</div>
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
              Passed
            </div>
            <div className="text-2xl font-bold text-emerald-600">{passedAttempts}</div>
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
              Retakes Needed
            </div>
            <div className="text-2xl font-bold text-rose-600">{failedAttempts}</div>
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
            <i className="ri-pie-chart-line"></i>
          </div>
          <div>
            <div className="text-xs text-muted uppercase font-bold tracking-wider">
              Pass Rate
            </div>
            <div className="text-2xl font-bold text-purple-700">{passRate}%</div>
          </div>
        </div>
      </div>

      {reportsData.length === 0 ? (
        <div className="card p-5 text-center mt-3" style={{ padding: "48px 20px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <EmptyDataIllustration width={150} height={130} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 6px 0" }}>
            No Quiz Attempts Recorded Yet
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>
            Select an assessment from the catalog to test your technical skills!
          </p>
          <button
            className="primary-contained-btn"
            onClick={() => navigate("/")}
            style={{ margin: "0 auto" }}
          >
            <i className="ri-play-line"></i> Start Your First Quiz
          </button>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={reportsData}
          rowKey={(record) => record._id || record.createdAt}
          pagination={{ pageSize: 6 }}
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

export default UserReports;
