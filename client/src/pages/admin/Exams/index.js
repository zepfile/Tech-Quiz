import { message, Table, Popconfirm, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { CategoryBadgeIcon } from "../../../components/TechIcons";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      setTableLoading(true);
      const response = await getAllExams();
      setTableLoading(false);
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      setTableLoading(false);
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExamsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredExams = exams.filter(
    (e) =>
      e.name.toLowerCase().includes(searchText.toLowerCase()) ||
      e.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalQuestions = exams.reduce(
    (sum, e) => sum + (e.questions?.length || 0),
    0
  );
  const totalCategories = new Set(exams.map((e) => e.category)).size;

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <CategoryBadgeIcon category={record.category} size={36} />
          <div>
            <div className="font-semibold text-gray-900">
              {record.name}
            </div>
            <div className="text-sm text-muted mt-1">
              {record.questions?.length || 0} questions configured
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text) => (
        <span className="badge badge-primary">{text}</span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => (
        <span className="flex items-center gap-1 text-sm text-gray-700">
          <i className="ri-time-line text-muted"></i>
          {Math.floor(text / 60)} mins ({text}s)
        </span>
      ),
    },
    {
      title: "Scoring (Pass / Total)",
      dataIndex: "totalMarks",
      render: (text, record) => (
        <div>
          <span className="font-semibold text-gray-900">
            {record.passingMarks} / {record.totalMarks}
          </span>
          <span className="text-xs text-muted ml-2">
            ({Math.round((record.passingMarks / record.totalMarks) * 100)}% to pass)
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (text, record) => (
        <Space size="middle">
          <button
            type="button"
            className="primary-outlined-btn"
            style={{
              height: 34,
              padding: "0 12px",
              fontSize: 13,
              borderRadius: 8,
            }}
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          >
            <i className="ri-pencil-line"></i>
            Edit & Questions
          </button>

          <Popconfirm
            title="Delete Exam"
            description="Are you sure you want to delete this exam and its questions?"
            onConfirm={() => deleteExam(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <button
              type="button"
              style={{
                height: 34,
                padding: "0 10px",
                fontSize: 14,
                borderRadius: 8,
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                cursor: "pointer",
              }}
              title="Delete Exam"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Top Header */}
      <div className="flex justify-between items-center mt-2 flex-wrap gap-3">
        <div>
          <PageTitle title="Exam Management" />
          <p className="text-sm text-muted mt-1">
            Create, configure, and manage quizzes and their question banks
          </p>
        </div>

        <button
          className="primary-contained-btn"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-line"></i>
          Create New Exam
        </button>
      </div>

      {/* KPI Stats Strip */}
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
              borderRadius: 10,
              background: "#eef2ff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            <i className="ri-book-read-line"></i>
          </div>
          <div>
            <div className="text-xs text-muted uppercase font-bold tracking-wider">
              Total Exams
            </div>
            <div className="text-2xl font-bold text-gray-900">{exams.length}</div>
          </div>
        </div>

        <div className="card p-3 flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#f0fdf4",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            <i className="ri-question-answer-line"></i>
          </div>
          <div>
            <div className="text-xs text-muted uppercase font-bold tracking-wider">
              Total Questions
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
          </div>
        </div>

        <div className="card p-3 flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#faf5ff",
              color: "#9333ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            <i className="ri-price-tag-3-line"></i>
          </div>
          <div>
            <div className="text-xs text-muted uppercase font-bold tracking-wider">
              Categories
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalCategories}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-3 mb-3 flex justify-between items-center flex-wrap gap-2">
        <div style={{ maxWidth: 360, width: "100%" }}>
          <Input
            prefix={<i className="ri-search-line text-muted"></i>}
            placeholder="Search by exam name or category..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        <div className="text-sm text-muted">
          Showing <b>{filteredExams.length}</b> of <b>{exams.length}</b> exams
        </div>
      </div>

      {/* Table */}
      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={filteredExams}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Exams;
