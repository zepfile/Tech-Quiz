import React, { useState } from "react";
import { Modal, message, Table, Tag, Alert } from "antd";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";
import { bulkAddQuestionsToExam } from "../../../apicalls/exams";
import {
  downloadCSV,
  getQuestionsSampleCSV,
  parseQuestionsCSV,
} from "../../../utils/csvHelper";

function BulkImportQuestionsModal({
  visible,
  onCancel,
  examId,
  examName,
  refreshData,
}) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDownloadSample = () => {
    downloadCSV("TechQuiz_Sample_Questions_Template.csv", getQuestionsSampleCSV());
    message.success("Sample questions template downloaded!");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv") && !selectedFile.name.endsWith(".txt")) {
      message.error("Please upload a .csv or .txt file.");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = parseQuestionsCSV(text);
      setParsedData(parsed);
      if (parsed.success) {
        message.success(
          `Successfully parsed ${parsed.validQuestions.length} questions from file!`
        );
      } else {
        message.warning(
          parsed.message || "No valid questions found. Please check format."
        );
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!parsedData || !parsedData.validQuestions?.length) {
      message.error("No valid questions to import.");
      return;
    }

    try {
      setLoading(true);
      dispatch(ShowLoading());
      const response = await bulkAddQuestionsToExam({
        examId,
        questions: parsedData.validQuestions,
      });
      dispatch(HideLoading());
      setLoading(false);

      if (response.success) {
        message.success(response.message);
        refreshData();
        onCancel();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      setLoading(false);
      message.error(error.message);
    }
  };

  const previewColumns = [
    {
      title: "#",
      width: 45,
      render: (_, __, idx) => <span className="font-semibold text-muted">{idx + 1}</span>,
    },
    {
      title: "Question Statement",
      dataIndex: "name",
      ellipsis: true,
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: "Options",
      render: (_, record) => (
        <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          <div><strong style={{ color: "#475569" }}>A:</strong> {record.options.A}</div>
          <div><strong style={{ color: "#475569" }}>B:</strong> {record.options.B}</div>
          <div><strong style={{ color: "#475569" }}>C:</strong> {record.options.C}</div>
          <div><strong style={{ color: "#475569" }}>D:</strong> {record.options.D}</div>
        </div>
      ),
    },
    {
      title: "Correct",
      width: 80,
      render: (_, record) => (
        <Tag color="green" style={{ fontWeight: 700 }}>
          Option {record.correctOption}
        </Tag>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={780}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ri-file-upload-line" style={{ color: "#4f46e5", fontSize: 20 }}></i>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
            Bulk Import Questions (CSV / Excel)
          </span>
        </div>
      }
      centered
      destroyOnClose
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Step 1: Download Sample Card */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
              Step 1: Download Standard Template
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Format: <code>Question, Option A, Option B, Option C, Option D, Correct Option</code>
            </div>
          </div>

          <button
            type="button"
            className="primary-outlined-btn"
            style={{ height: 38, padding: "0 14px", borderRadius: 8, fontSize: 13 }}
            onClick={handleDownloadSample}
          >
            <i className="ri-download-2-line"></i> Download Sample CSV
          </button>
        </div>

        {/* Step 2: Upload File Box */}
        <div
          style={{
            border: "2px dashed #cbd5e1",
            borderRadius: 14,
            padding: "24px 16px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => document.getElementById("csvFileInput").click()}
        >
          <input
            id="csvFileInput"
            type="file"
            accept=".csv, .txt"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "#eef2ff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              margin: "0 auto 10px auto",
            }}
          >
            <i className="ri-upload-cloud-2-line"></i>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
            {file ? file.name : "Click or drag your CSV file here to upload"}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Supports comma-delimited (.csv) files exported from Excel, Google Sheets, or Notepad
          </div>
        </div>

        {/* Parsing Error Warning */}
        {parsedData && parsedData.errors?.length > 0 && (
          <Alert
            type="warning"
            showIcon
            message={`${parsedData.errors.length} issue(s) detected in CSV`}
            description={
              <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: 12 }}>
                {parsedData.errors.slice(0, 4).map((err, i) => (
                  <li key={i}>
                    <strong>Row {err.line}:</strong> {err.message}
                  </li>
                ))}
                {parsedData.errors.length > 4 && (
                  <li>...and {parsedData.errors.length - 4} more rows skipped.</li>
                )}
              </ul>
            }
          />
        )}

        {/* Parsing Success Preview */}
        {parsedData && parsedData.validQuestions?.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>
                <i className="ri-checkbox-circle-fill" style={{ marginRight: 4 }}></i>
                {parsedData.validQuestions.length} Questions Ready for Import
              </span>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Target Exam: <strong>{examName}</strong>
              </span>
            </div>

            <Table
              columns={previewColumns}
              dataSource={parsedData.validQuestions}
              rowKey={(_, idx) => idx}
              pagination={{ pageSize: 4 }}
              size="small"
              bordered
            />
          </div>
        )}

        {/* Bottom Action Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            borderTop: "1px solid #e2e8f0",
            paddingTop: 14,
            marginTop: 4,
          }}
        >
          <button
            type="button"
            className="primary-outlined-btn"
            style={{ height: 40, padding: "0 18px", borderRadius: 10 }}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary-contained-btn"
            disabled={!parsedData || !parsedData.validQuestions?.length || loading}
            style={{
              height: 40,
              padding: "0 22px",
              borderRadius: 10,
              background:
                !parsedData || !parsedData.validQuestions?.length
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            }}
            onClick={handleImport}
          >
            <i className="ri-check-double-line"></i>{" "}
            {loading
              ? "Importing..."
              : `Import ${parsedData?.validQuestions?.length || 0} Questions`}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default BulkImportQuestionsModal;
