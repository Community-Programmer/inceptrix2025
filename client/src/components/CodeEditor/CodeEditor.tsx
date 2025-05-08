// CodeRunner.tsx
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

interface SubmissionResponse {
  token: string;
}

interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
}

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_HEADERS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": "1063dae854mshb7285011c3e9141p1c5c69jsne78245d9325d",
};

const languages = [
  { id: 52, monaco: "cpp", name: "C++ (GCC 9.2.0)" },
  { id: 71, monaco: "python", name: "Python (3.8.1)" },
  { id: 62, monaco: "java", name: "Java (OpenJDK 13.0.1)" },
];

interface CodeRunnerProps {
  onFocus?: () => void;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({ onFocus }) => {
  const [code, setCode] = useState<string>(
    `#include <iostream>\nusing namespace std;\nint main() { cout << \"Hello, Judge0!\"; return 0; }`
  );
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  // Handle focus events
  const handleFocus = () => {
    if (onFocus) onFocus();
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const submitRes = await fetch(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
        {
          method: "POST",
          headers: JUDGE0_HEADERS,
          body: JSON.stringify({
            source_code: code,
            language_id: selectedLang.id,
          }),
        }
      );
      const { token }: SubmissionResponse = await submitRes.json();

      let result: any;
      do {
        await new Promise((r) => setTimeout(r, 1000));
        const res = await fetch(
          `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
          { headers: JUDGE0_HEADERS }
        );
        result = await res.json();
      } while (result.status?.id < 3);

      setOutput({
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ width: "100%", height: "100%" }}>
      <div
        className="frame"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="header" style={{ cursor: "move" }}>
          <div className="controls">
            <select
              value={selectedLang.id}
              onChange={(e) => {
                const lang = languages.find(
                  (l) => l.id === parseInt(e.target.value)
                );
                if (lang) setSelectedLang(lang);
              }}
              className="select"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleRun}
              disabled={loading}
              className="runButton"
            >
              {loading ? "Running..." : "Run"}
            </button>
          </div>
          <div className="title">NextHire Code Editor</div>
        </div>

        <div className="editorContainer" style={{ flex: 1 }}>
          <Editor
            height="100%"
            defaultLanguage={selectedLang.monaco}
            value={code}
            onChange={(value: any) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
            }}
          />
        </div>

        <div className="outputContainer">
          <div className="outputHeader">Output</div>
          {output ? (
            <div className="messages">
              {output.compile_output && (
                <div className="message compiler">
                  <span className="label">Compiler:</span>{" "}
                  {output.compile_output}
                </div>
              )}
              {output.stderr && (
                <div className="message error">
                  <span className="label">Errors:</span> {output.stderr}
                </div>
              )}
              {output.stdout && (
                <div className="message success">
                  <span className="label">Output:</span> {output.stdout}
                </div>
              )}
            </div>
          ) : (
            <div className="placeholder">Output will appear here...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeRunner;
