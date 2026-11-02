import { Col, Form, message, Row, Table, Tabs, Popconfirm, Tag, Space } from "antd";
import React, { useEffect, useState } from "react";
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

const { TabPane } = Tabs;

function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const params = useParams();

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
  }, [params.id]);

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
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                cursor: "pointer",
              }}
              title="Delete question"
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
      {/* Top Breadcrumb / Navigation */}
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => navigate("/admin/exams")}
          className="primary-outlined-btn"
          style={{ height: 36, padding: "0 12px", fontSize: 13, borderRadius: 8 }}
        >
          <i className="ri-arrow-left-line"></i> Back to Exams
        </button>
        <div>
          <PageTitle title={params.id ? "Edit Exam Configuration" : "Create New Exam"} />
        </div>
      </div>
      <div className="divider"></div>

      <div className="card p-4">
        {(examData || !params.id) && (
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={
              examData || {
                duration: 180,
                category: "JavaScript",
                totalMarks: 5,
                passingMarks: 3,
              }
            }
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span className="flex items-center gap-1 font-semibold">
                    <i className="ri-settings-4-line"></i> Exam Details & Rules
                  </span>
                }
                key="1"
              >
                <div style={{ maxWidth: 860, marginTop: 12 }}>
                  <Row gutter={[16, 8]}>
                    <Col span={24} md={12}>
                      <Form.Item
                        label="Exam Title"
                        name="name"
                        rules={[{ required: true, message: "Exam name is required" }]}
                      >
                        <input
                          type="text"
                          placeholder="e.g. Modern Full-Stack JavaScript Assessment"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                      <Form.Item
                        label="Category / Topic"
                        name="category"
                        rules={[{ required: true, message: "Category is required" }]}
                      >
                        <select>
                          <option value="JavaScript">JavaScript</option>
                          <option value="React">React.js</option>
                          <option value="Node">Node.js</option>
                          <option value="MongoDB">MongoDB</option>
                          <option value="Full-Stack">Full-Stack MERN</option>
                          <option value="General Knowledge">General Knowledge</option>
                          <option value="Computer Science">Computer Science</option>
                        </select>
                      </Form.Item>
                    </Col>

                    <Col span={24} md={8}>
                      <Form.Item
                        label="Duration (in seconds)"
                        name="duration"
                        rules={[{ required: true, message: "Duration is required" }]}
                        help="e.g. 180s = 3 minutes, 300s = 5 minutes"
                      >
                        <input type="number" min={10} />
                      </Form.Item>
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

                    <button
                      className="primary-contained-btn"
                      type="button"
                      onClick={() => {
                        setSelectedQuestion(null);
                        setShowAddEditQuestionModal(true);
                      }}
                    >
                      <i className="ri-add-line"></i> Add Question
                    </button>
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
    </div>
  );
}

export default AddEditExam;
