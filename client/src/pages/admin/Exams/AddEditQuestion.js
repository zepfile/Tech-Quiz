import { Form, message, Modal, Row, Col } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setSelectedQuestion,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        exam: examId,
      };

      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id,
        });
      } else {
        response = await addQuestionToExam(requiredPayload);
      }

      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#eef2ff",
              color: "#4f46e5",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            <i className={selectedQuestion ? "ri-pencil-line" : "ri-add-line"}></i>
          </span>
          <span className="font-bold text-gray-900">
            {selectedQuestion ? "Edit Question" : "Add New Question"}
          </span>
        </div>
      }
      open={showAddEditQuestionModal}
      visible={showAddEditQuestionModal}
      footer={false}
      onCancel={() => {
        setShowAddEditQuestionModal(false);
        setSelectedQuestion(null);
      }}
      width={680}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: selectedQuestion?.name || "",
          A: selectedQuestion?.options?.A || "",
          B: selectedQuestion?.options?.B || "",
          C: selectedQuestion?.options?.C || "",
          D: selectedQuestion?.options?.D || "",
          correctOption: selectedQuestion?.correctOption || "A",
        }}
      >
        <Form.Item
          name="name"
          label={<span className="font-semibold text-gray-800">Question Statement</span>}
          rules={[{ required: true, message: "Please enter the question" }]}
        >
          <input
            type="text"
            placeholder="e.g. Which keyword declares an immutable variable in JavaScript?"
          />
        </Form.Item>

        <Form.Item
          name="correctOption"
          label={<span className="font-semibold text-gray-800">Correct Answer</span>}
          rules={[{ required: true, message: "Please select the correct option" }]}
          help="Select which option will be awarded 1 point upon correct submission"
        >
          <select>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>
        </Form.Item>

        <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, marginBottom: 16 }}>
          <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
            Four Answer Options
          </div>
          <Row gutter={[12, 10]}>
            <Col span={24} md={12}>
              <Form.Item
                name="A"
                label={<span className="font-semibold text-gray-700">Option A</span>}
                rules={[{ required: true, message: "Option A is required" }]}
              >
                <input type="text" placeholder="Choice A" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="B"
                label={<span className="font-semibold text-gray-700">Option B</span>}
                rules={[{ required: true, message: "Option B is required" }]}
              >
                <input type="text" placeholder="Choice B" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="C"
                label={<span className="font-semibold text-gray-700">Option C</span>}
                rules={[{ required: true, message: "Option C is required" }]}
              >
                <input type="text" placeholder="Choice C" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="D"
                label={<span className="font-semibold text-gray-700">Option D</span>}
                rules={[{ required: true, message: "Option D is required" }]}
              >
                <input type="text" placeholder="Choice D" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t">
          <button
            className="primary-outlined-btn"
            type="button"
            onClick={() => {
              setShowAddEditQuestionModal(false);
              setSelectedQuestion(null);
            }}
          >
            Cancel
          </button>
          <button className="primary-contained-btn" type="submit">
            <i className="ri-check-line"></i>
            {selectedQuestion ? "Update Question" : "Add Question"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditQuestion;
