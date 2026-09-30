import React, { useEffect, useMemo, useState } from "react";
import {
  buildQueryString,
  callApi,
  fillPathVariables,
  formatBytes,
  getPublicBaseUrl,
  prettyPrint,
  toReadableUrl,
} from "../api";
import CodeSamples from "./CodeSamples";

/** 선택한 API 하나의 문서 + 실행해 보기 + 샘플 코드 */
function ApiDetail({ api, apiKey, onCalled }) {
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  // API 를 바꾸면 입력값과 지난 결과를 비운 뒤 예시값을 채워 둔다(누르면 바로 결과가 보이도록).
  useEffect(() => {
    const initial = {};
    (api.params || []).forEach((param) => {
      if (param.example) initial[param.name] = param.example;
    });
    setValues(initial);
    setResult(null);
  }, [api.id]);

  const pathParams = (api.params || []).filter((param) => param.in === "path");
  const queryParams = (api.params || []).filter((param) => param.in !== "path");

  const requestPath = useMemo(() => {
    const filledPath = fillPathVariables(api.path, values);
    const query = {};
    queryParams.forEach((param) => {
      query[param.name] = values[param.name];
    });
    return filledPath + buildQueryString(query);
  }, [api.path, values, queryParams]);

  const fullUrl = toReadableUrl(getPublicBaseUrl() + requestPath);
  const hasEmptyPathParam = /\{[^}]+\}/.test(requestPath);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRun = async () => {
    setRunning(true);
    setResult(await callApi(requestPath, apiKey));
    setRunning(false);
    // 키를 붙여 부른 경우에만 사용량이 늘어난다. 호출 직후 "오늘 사용"을 다시 읽게 알린다.
    if (apiKey && onCalled) onCalled();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
  };

  return (
    <section>
      <div style={cardStyle}>
        <div style={titleRowStyle}>
          <h1 style={titleStyle}>{api.title}</h1>
          <span style={methodStyle}>{api.method}</span>
        </div>
        <p style={summaryStyle}>{api.summary}</p>
        <div style={urlRowStyle}>
          <code style={urlStyle}>{fullUrl}</code>
          <button type="button" style={ghostButtonStyle} onClick={handleCopyUrl}>
            주소 복사
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>파라미터</h2>
        {(api.params || []).length === 0 ? (
          <p style={mutedStyle}>없습니다. 그냥 부르면 됩니다.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>이름</th>
                <th style={thStyle}>필수</th>
                <th style={thStyle}>설명</th>
                <th style={thStyle}>값</th>
              </tr>
            </thead>
            <tbody>
              {pathParams.concat(queryParams).map((param) => (
                <tr key={param.name}>
                  <td style={tdStyle}>
                    <code style={paramNameStyle}>{param.name}</code>
                    <div style={paramTypeStyle}>
                      {param.type}
                      {param.in === "path" ? " · 경로" : ""}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    {param.required ? <span style={requiredStyle}>필수</span> : <span style={mutedStyle}>선택</span>}
                  </td>
                  <td style={tdStyle}>{param.description}</td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={values[param.name] || ""}
                      placeholder={param.example || ""}
                      onChange={(event) => handleChange(param.name, event.target.value)}
                      style={inputStyle}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={runRowStyle}>
          <button type="button" style={runButtonStyle} onClick={handleRun} disabled={running || hasEmptyPathParam}>
            {running ? "부르는 중…" : "실행해 보기"}
          </button>
          {hasEmptyPathParam && <span style={hintStyle}>경로 값을 채워야 실행할 수 있습니다.</span>}
          {apiKey && <span style={keyNoteStyle}>내 API 키를 함께 보냅니다</span>}
        </div>
      </div>

      {result && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>응답</h2>
          <div style={resultMetaStyle}>
            <span style={result.ok ? statusOkStyle : statusBadStyle}>
              {result.status === 0 ? "실패" : "HTTP " + result.status}
            </span>
            <span style={metaItemStyle}>{result.elapsedMs} ms</span>
            <span style={metaItemStyle}>{formatBytes(result.sizeBytes)}</span>
            {result.contentType && <span style={metaItemStyle}>{result.contentType.split(";")[0]}</span>}
          </div>
          {result.errorMessage ? (
            <p style={errorTextStyle}>{result.errorMessage}</p>
          ) : (
            <pre style={preStyle}>{prettyPrint(result.body)}</pre>
          )}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>샘플 코드</h2>
        <CodeSamples url={fullUrl} apiKey={apiKey} />
      </div>
    </section>
  );
}

export default ApiDetail;

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "1.1rem 1.25rem",
  marginBottom: "1rem",
};

const titleRowStyle = { display: "flex", alignItems: "center", gap: "0.6rem" };

const titleStyle = {
  fontFamily: "Poppins, Inter, sans-serif",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "#0f172a",
};

const methodStyle = {
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "#1e40af",
  background: "#dbeafe",
  borderRadius: "4px",
  padding: "0.18rem 0.4rem",
};

const summaryStyle = { color: "#475569", fontSize: "0.92rem", lineHeight: 1.6, margin: "0.5rem 0 0.9rem" };

const urlRowStyle = { display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" };

const urlStyle = {
  flex: 1,
  minWidth: "240px",
  background: "#0f172a",
  color: "#e2e8f0",
  borderRadius: "8px",
  padding: "0.55rem 0.7rem",
  fontSize: "0.8rem",
  wordBreak: "break-all",
};

const ghostButtonStyle = {
  background: "#ffffff",
  color: "#475569",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0.45rem 0.7rem",
  fontSize: "0.82rem",
  cursor: "pointer",
};

const sectionTitleStyle = {
  fontFamily: "Poppins, Inter, sans-serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: "0.7rem",
};

const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" };

const thStyle = {
  textAlign: "left",
  color: "#64748b",
  fontWeight: 500,
  fontSize: "0.75rem",
  padding: "0.4rem 0.5rem",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "0.55rem 0.5rem",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  verticalAlign: "top",
  lineHeight: 1.5,
};

const paramNameStyle = { fontSize: "0.83rem", color: "#0f172a" };

const paramTypeStyle = { fontSize: "0.72rem", color: "#94a3b8" };

const requiredStyle = { fontSize: "0.75rem", color: "#b91c1c" };

const mutedStyle = { fontSize: "0.8rem", color: "#94a3b8" };

const inputStyle = {
  width: "100%",
  minWidth: "150px",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0.4rem 0.5rem",
  fontSize: "0.82rem",
  color: "#0f172a",
};

const runRowStyle = { display: "flex", alignItems: "center", gap: "0.7rem", marginTop: "1rem" };

const runButtonStyle = {
  background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "0.55rem 1.1rem",
  fontSize: "0.9rem",
  cursor: "pointer",
};

const hintStyle = { fontSize: "0.8rem", color: "#b45309" };

const keyNoteStyle = { fontSize: "0.8rem", color: "#1e40af" };

const resultMetaStyle = { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.7rem", flexWrap: "wrap" };

const statusOkStyle = {
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#047857",
  background: "#d1fae5",
  borderRadius: "4px",
  padding: "0.2rem 0.45rem",
};

const statusBadStyle = { ...statusOkStyle, color: "#b91c1c", background: "#fee2e2" };

const metaItemStyle = { fontSize: "0.78rem", color: "#64748b" };

const errorTextStyle = { fontSize: "0.86rem", color: "#b91c1c" };

const preStyle = {
  background: "#0f172a",
  color: "#e2e8f0",
  borderRadius: "8px",
  padding: "0.8rem",
  fontSize: "0.78rem",
  lineHeight: 1.55,
  maxHeight: "420px",
  overflow: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
};
