/**
 * Universal CSV Helper for TechQuiz
 * Handles proper CSV escaping, UTF-8 BOM for Microsoft Excel, and robust parsing.
 */

// Escape CSV cell string (handle commas, quotes, newlines)
export const escapeCSV = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

// Trigger browser download for CSV string
export const downloadCSV = (filename, content) => {
  const bom = "\uFEFF";
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate standard questions template CSV with Explanation
export const getQuestionsSampleCSV = () => {
  const headers = [
    "Question",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Correct Option",
    "Explanation",
  ];
  const sampleRows = [
    [
      "What is the output of typeof null in JavaScript?",
      "null",
      "object",
      "undefined",
      "number",
      "B",
      "In JavaScript, typeof null returning 'object' is a well-known historical bug dating back to the first implementation in 1995.",
    ],
    [
      "Which React Hook is primarily used for side effects like API calls and subscriptions?",
      "useState",
      "useMemo",
      "useEffect",
      "useCallback",
      "C",
      "useEffect runs after every render by default and lets developers perform side effects like network requests, timers, and manual DOM mutations.",
    ],
    [
      "In Node.js, what module is built-in for handling file system operations?",
      "fs",
      "path",
      "http",
      "crypto",
      "A",
      "The 'fs' (file system) module provides both synchronous and asynchronous methods to read, write, and manipulate files on disk.",
    ],
    [
      "What type of database is MongoDB?",
      "Relational SQL",
      "Document NoSQL",
      "Graph",
      "Key-Value Store only",
      "B",
      "MongoDB stores flexible JSON-like documents (BSON) rather than rigid rows and columns of traditional relational databases.",
    ],
    [
      "Which HTTP status code signifies a resource was successfully created?",
      "200 OK",
      "201 Created",
      "204 No Content",
      "301 Moved",
      "B",
      "HTTP 201 Created is the standard REST status code returned after a successful POST request that creates a new resource.",
    ],
  ];

  const lines = [
    headers.map(escapeCSV).join(","),
    ...sampleRows.map((row) => row.map(escapeCSV).join(",")),
  ];

  return lines.join("\r\n");
};

// Robust CSV Line Splitter (respects quotes containing commas)
export const splitCSVRow = (rowText) => {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < rowText.length; i++) {
    const char = rowText[i];
    const nextChar = rowText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

// Parse uploaded CSV content into structured question objects
export const parseQuestionsCSV = (csvContent) => {
  const cleanContent = csvContent.replace(/^\uFEFF/, "").trim();
  const rawLines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (rawLines.length < 2) {
    return {
      success: false,
      message: "The CSV file must contain a header row and at least 1 question row.",
      validQuestions: [],
      errors: [],
    };
  }

  const validQuestions = [];
  const errors = [];

  // Line 0 is header, parse from line 1
  for (let idx = 1; idx < rawLines.length; idx++) {
    const lineNum = idx + 1;
    const cols = splitCSVRow(rawLines[idx]);

    if (cols.length < 6) {
      errors.push({
        line: lineNum,
        message: `Row has only ${cols.length} column(s). Expected at least 6 columns: Question, Option A, Option B, Option C, Option D, Correct Option.`,
      });
      continue;
    }

    const questionText = cols[0] ? cols[0].trim() : "";
    const optionA = cols[1] ? cols[1].trim() : "";
    const optionB = cols[2] ? cols[2].trim() : "";
    const optionC = cols[3] ? cols[3].trim() : "";
    const optionD = cols[4] ? cols[4].trim() : "";
    const rawCorrect = cols[5] ? cols[5].trim().toUpperCase() : "";
    const explanation = cols[6] ? cols[6].trim() : "";

    if (!questionText) {
      errors.push({ line: lineNum, message: "Question statement is empty." });
      continue;
    }

    if (!optionA || !optionB || !optionC || !optionD) {
      errors.push({
        line: lineNum,
        message: "All 4 options (A, B, C, D) must have text values.",
      });
      continue;
    }

    const cleanCorrect = rawCorrect.charAt(0);
    if (!["A", "B", "C", "D"].includes(cleanCorrect)) {
      errors.push({
        line: lineNum,
        message: `Invalid correct option "${rawCorrect}". Must be one of A, B, C, or D.`,
      });
      continue;
    }

    validQuestions.push({
      name: questionText,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctOption: cleanCorrect,
      explanation,
    });
  }

  return {
    success: validQuestions.length > 0,
    validQuestions,
    errors,
  };
};
