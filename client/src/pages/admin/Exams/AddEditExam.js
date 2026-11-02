import { Col, Form, message, Row, Table, Tabs, Popconfirm, Tag, Space, Switch } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById,
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import AddEditQuestion from "./AddEditQuestion";
import BulkImportQuestionsModal from "./BulkImportQuestionsModal";
import { downloadCSV, escapeCSV } from "../../../utils/csvHelper";

const { TabPane } = Tabs;

function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const params = useParams();
  const [form] = Form.useForm();
  const [isTimeBoundState, setIsTimeBoundState] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;

      if (params.id) {
        response = await editExamById({
          ...values,
          examId: params.id,
        });
      } else {
        response = await addExam(values);
      }
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (examData) {
      setIsTimeBoundState(Boolean(examData.isTimeBound));
      form.setFieldsValue({
        ...examData,
        startTime: examData.startTime
          ? moment(examData.startTime).format("YYYY-MM-DDTHH:mm")
          : "",
        endTime: examData.endTime
          ? moment(examData.endTime).format("YYYY-MM-DDTHH:mm")
          : "",
      });
    }
  }, [examData, form]);

  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleExportQuestions = () => {
    if (!examData?.questions || !examData.questions.length) {
      message.warning("No questions available to export.");
      return;
    }
    const headers = ["Question", "Option A", "Option B", "Option C", "Option D", "Correct Option", "Explanation"];
    const rows = examData.questions.map((q) => [
      q.name,
      q.options?.A || "",
      q.options?.B || "",
      q.options?.C || "",
      q.options?.D || "",
      q.correctOption || "",
      q.explanation || "",
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const safeName = (examData.name || "Exam").replace(/[^a-zA-Z0-9_-]/g, "_");
    downloadCSV(`${safeName}_Questions.csv`, csvContent);
    message.success(`Exported ${examData.questions.length} questions to CSV!`);
  };

  const questionsColumns = [
    {
      title: "#",
      width: 50,
      render: (text, record, index) => (
        <span className="font-semibold text-muted">{index + 1}</span>
      ),
    },
    {
      title: "Question Statement",
      dataIndex: "name",
      render: (text) => (
        <span className="font-semibold text-gray-900">{text}</span>
      ),
    },
    {
      title: "Multiple Choice Options",
      dataIndex: "options",
      render: (text, record) => {
        return (
          <div className="flex flex-col gap-1 py-1">
            {Object.keys(record.options || {}).map((key) => {
              const isCorrect = record.correctOption === key;
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 text-sm"
                  style={{
                    color: isCorrect ? "#15803d" : "#475569",
                    fontWeight: isCorrect ? 600 : 400,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isCorrect ? "#dcfce7" : "#f1f5f9",
                      color: isCorrect ? "#15803d" : "#475569",
                    }}
                  >
                    {key}
                  </span>
                  <span>{record.options[key]}</span>
                  {isCorrect && (
                    <span className="badge badge-success" style={{ fontSize: 9, padding: "2px 6px" }}>
                      Correct
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Correct Answer",
      dataIndex: "correctOption",
      render: (text, record) => (
        <Tag color="green" style={{ fontWeight: 600, padding: "2px 8px" }}>
          Option {text}
        </Tag>
      ),
    },
    {
      title: "Concept Explanation",
      dataIndex: "explanation",
      ellipsis: true,
      render: (text) =>
        text ? (
          <span style={{ fontSize: 12, color: "#475569" }} title={text}>
            <i className="ri-lightbulb-fill" style={{ color: "#f59e0b", marginRight: 4 }}></i>
            {text}
          </span>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <Space size="small">
          <button
            type="button"
            className="primary-outlined-btn"
            style={{
              height: 32,
              padding: "0 10px",
              fontSize: 13,
              borderRadius: 6,
            }}
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          >
            <i className="ri-pencil-line"></i>
            Edit
          </button>
          <Popconfirm
            title="Delete Question"
            description="Are you sure you want to delete this question?"
            onConfirm={() => deleteQuestion(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <button
              type="button"
              style={{
                height: 32,
                padding: "0 8px",
                fontSize: 13,
                borderRadius: 6,
                background: "transparent",
                border: "1px solid #fecaca",
                color: "#dc2626",
                cursor: "pointer",
              }}
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
      <div className="flex justify-between items-center mb-3">
        <div>
          <PageTitle title={params.id ? "Edit Technical Exam" : "Add New Exam Track"} />
          <p className="text-sm text-muted mt-1">
            {params.id
              ? `Manage parameters and questions for ${examData?.name || "Exam"}`
              : "Configure assessment duration, category, and evaluation metrics"}
          </p>
        </div>

        <button
          className="primary-outlined-btn"
          type="button"
          onClick={() => navigate("/admin/exams")}
        >
          <i className="ri-arrow-left-line"></i> Back to Exams
        </button>
      </div>

      <div className="divider"></div>

      <div className="mt-2">
        {(examData || !params.id) && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={examData}
            className="w-full"
          >
            <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span className="flex items-center gap-1 font-semibold">
                    <i className="ri-settings-4-line"></i> Exam Parameters
                  </span>
                }
                key="1"
              >
                <div className="card p-4">
                  <Row gutter={[24, 16]}>
                    <Col span={24} md={12}>
                      <Form.Item
                        label="Exam / Assessment Title"
                        name="name"
                        rules={[{ required: true, message: "Exam name is required" }]}
                      >
                        <input type="text" placeholder="e.g. Node.js & Express Intermediate Exam" />
                      </Form.Item>
                    </Col>

                    <Col span={24} md={6}>
                      <Form.Item
                        label="Duration (Seconds)"
                        name="duration"
                        rules={[{ required: true, message: "Duration is required" }]}
                        help="300 sec = 5 min, 600 sec = 10 min"
                      >
                        <input type="number" min={10} placeholder="e.g. 300" />
                      </Form.Item>
                    </Col>

                    <Col span={24} md={6}>
                      <Form.Item
                        label={
                          <span style={{ fontWeight: 600 }}>
                            Category / Tech Stack{" "}
                            <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 500 }}>
                              (Type custom or pick)
                            </span>
                          </span>
                        }
                        name="category"
                        rules={[{ required: true, message: "Category / Tech Stack is required" }]}
                        help="Type custom stack e.g. Python, Docker, AWS, React..."
                      >
                        <input
                          type="text"
                          list="category-suggestions"
                          placeholder="Type or select Tech Stack..."
                          autoComplete="off"
                        />
                      </Form.Item>
                      <datalist id="category-suggestions">
                        <option value="JavaScript" />
                        <option value="React" />
                        <option value="Node" />
                        <option value="MongoDB" />
                        <option value="FullStack" />
                        <option value="Python" />
                        <option value="TypeScript" />
                        <option value="Java" />
                        <option value="C / C++" />
                        <option value="Docker" />
                        <option value="Kubernetes" />
                        <option value="AWS" />
                        <option value="DevOps" />
                        <option value="Next.js" />
                        <option value="SQL" />
                        <option value="Cybersecurity" />
                        <option value="General" />
                      </datalist>

                      {/* Quick click suggestions */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 5,
                          marginTop: -8,
                          marginBottom: 8,
                        }}
                      >
                        {[
                          "JavaScript",
                          "React",
                          "Node",
                          "Python",
                          "Docker",
                          "AWS",
                          "Java",
                          "MongoDB",
                          "FullStack",
                        ].map((tech) => (
                          <span
                            key={tech}
                            onClick={() => form.setFieldsValue({ category: tech })}
                            style={{
                              cursor: "pointer",
                              fontSize: 10.5,
                              padding: "2px 7px",
                              borderRadius: 6,
                              background: "#e0e7ff",
                              color: "#4338ca",
                              fontWeight: 600,
                              border: "1px solid #c7d2fe",
                              userSelect: "none",
                              transition: "all 0.15s ease",
                            }}
                            title={`Click to fill: ${tech}`}
                          >
                            + {tech}
                          </span>
                        ))}
                      </div>
                    </Col>

                    <Col span={24} md={8}>
                      <Form.Item
                        label="Total Marks"
                        name="totalMarks"
                        rules={[{ required: true, message: "Total marks required" }]}
                        help="Total possible marks (usually total questions)"
                      >
                        <input type="number" min={1} />
                      </Form.Item>
                    </Col>

                    <Col span={24} md={8}>
                      <Form.Item
                        label="Passing Marks"
                        name="passingMarks"
                        rules={[{ required: true, message: "Passing marks required" }]}
                        help="Minimum marks needed to pass"
                      >
                        <input type="number" min={1} />
                      </Form.Item>
                    </Col>

                    <Col span={24} md={8}>
                      <Form.Item
                        label="Negative Marking"
                        name="negativeMarks"
                        help="Penalty deducted per wrong answer"
                      >
                        <select>
                          <option value={0}>0 (No Negative Penalty)</option>
                          <option value={0.25}>-0.25 Marks (25% penalty)</option>
                          <option value={0.33}>-0.33 Marks (33% penalty)</option>
                          <option value={0.5}>-0.50 Marks (50% penalty)</option>
                          <option value={1}>-1.00 Mark (Full deduction)</option>
                        </select>
                      </Form.Item>
                    </Col>

                    {/* Time-Bound Scheduled Live Competition Configuration */}
                    <Col span={24}>
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          marginTop: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 12,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: "14px",
                                color: "#0f172a",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <i
                                className="ri-calendar-event-line"
                                style={{ color: "#4f46e5", fontSize: 18 }}
                              ></i>
                              Schedule Live Competition (Fixed Time Window)
                            </div>
                            <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                              If enabled, users can only start this quiz inside this time window. Once live, strict proctoring and live leaderboard apply.
                            </p>
                          </div>

                          <Form.Item
                            name="isTimeBound"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Switch
                              checkedChildren="Live Scheduled"
                              unCheckedChildren="Standard (Always On)"
                              onChange={(checked) => setIsTimeBoundState(checked)}
                            />
                          </Form.Item>
                        </div>

                        {isTimeBoundState && (
                          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                            <Col span={24} md={12}>
                              <Form.Item
                                label="Live Competition Start Time"
                                name="startTime"
                                rules={[
                                  {
                                    required: isTimeBoundState,
                                    message: "Start time required for scheduled live quiz",
                                  },
                                ]}
                                help="Quiz becomes active and visible for candidates at this exact time"
                              >
                                <input type="datetime-local" />
                              </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                              <Form.Item
                                label="Live Competition End Time"
                                name="endTime"
                                rules={[
                                  {
                                    required: isTimeBoundState,
                                    message: "End time required for scheduled live quiz",
                                  },
                                ]}
                                help="Window closes after this time; no new attempts allowed"
                              >
                                <input type="datetime-local" />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                    <button
                      className="primary-outlined-btn"
                      type="button"
                      onClick={() => navigate("/admin/exams")}
                    >
                      Cancel
                    </button>
                    <button className="primary-contained-btn" type="submit">
                      <i className="ri-save-line"></i> Save Exam Details
                    </button>
                  </div>
                </div>
              </TabPane>

              {params.id && (
                <TabPane
                  tab={
                    <span className="flex items-center gap-1 font-semibold">
                      <i className="ri-questionnaire-line"></i> Question Bank (
                      {examData?.questions?.length || 0})
                    </span>
                  }
                  key="2"
                >
                  <div className="flex justify-between items-center mb-3 mt-2 flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold">Exam Questions</h3>
                      <p className="text-sm text-muted">
                        Configure questions, four options, and set the correct answer.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        className="primary-outlined-btn"
                        type="button"
                        style={{ height: 38, padding: "0 14px", borderRadius: 8, fontSize: 13 }}
                        onClick={handleExportQuestions}
                        title="Export current questions as CSV"
                      >
                        <i className="ri-download-2-line"></i> Export Questions (CSV)
                      </button>

                      <button
                        className="primary-outlined-btn"
                        type="button"
                        style={{ height: 38, padding: "0 14px", borderRadius: 8, fontSize: 13, borderColor: "#4f46e5", color: "#4f46e5" }}
                        onClick={() => setShowBulkImportModal(true)}
                        title="Bulk upload questions via CSV / Excel"
                      >
                        <i className="ri-file-upload-line"></i> Import CSV / Excel
                      </button>

                      <button
                        className="primary-contained-btn"
                        type="button"
                        style={{ height: 38, padding: "0 16px", borderRadius: 8, fontSize: 13 }}
                        onClick={() => {
                          setSelectedQuestion(null);
                          setShowAddEditQuestionModal(true);
                        }}
                      >
                        <i className="ri-add-line"></i> Add Question
                      </button>
                    </div>
                  </div>

                  <Table
                    columns={questionsColumns}
                    dataSource={examData?.questions || []}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                  />
                </TabPane>
              )}
            </Tabs>
          </Form>
        )}
      </div>

      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}

      {showBulkImportModal && (
        <BulkImportQuestionsModal
          visible={showBulkImportModal}
          onCancel={() => setShowBulkImportModal(false)}
          examId={params.id}
          examName={examData?.name || "Exam"}
          refreshData={getExamData}
        />
      )}
    </div>
  );
}

export default AddEditExam;
