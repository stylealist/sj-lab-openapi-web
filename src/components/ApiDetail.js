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

/**
 * 모든 API 에 공통으로 붙는 키 파라미터.
 * 카탈로그에 넣지 않고 화면에서 더한다 — 서버는 apiKey 를 쿼리에서 먼저 떼어내고 나서
 * "카탈로그에 정의된 파라미터인지"를 검사하므로, 카탈로그에 넣으면 필수 검사가
 * 헤더로 보낸 호출까지 400 으로 떨어뜨린다.
 */
const API_KEY_PARAM = {
  name: "apiKey",
  type: "string",
  required: true,
  description: "내 API 키. 로그인하면 자동으로 채워집니다. 다른 서버·프로그램에서 부를 때 이 값이 필요합니다.",
};

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
    if (apiKey) initial.apiKey = apiKey;
    setValues(initial);
    setResult(null);
  }, [api.id]);

  // 내 키가 늦게 도착하거나(키 영역이 먼저 불러온다) 바뀌면 입력칸에도 반영한다.
  useEffect(() => {
    if (apiKey) setValues((prev) => (prev.apiKey === apiKey ? prev : { ...prev, apiKey }));
  }, [apiKey]);

  const pathParams = (api.params || []).filter((param) => param.in === "path");
  // 쿼리 파라미터 맨 뒤에 키를 붙인다 — 주소에서도 맨 뒤에 오도록.
  const queryParams = [
    ...(api.params || []).filter((param) => param.in !== "path"),
    API_KEY_PARAM,
  ];

  const filledPath = fillPathVariables(api.path, values);

  const requestPath = useMemo(() => {
    const query = {};
    queryParams.forEach((param) => {
      query[param.name] = values[param.name];
    });
    return filledPath + buildQueryString(query);
  }, [filledPath, values, queryParams]);

  const fullUrl = toReadableUrl(getPublicBaseUrl() + requestPath);
  const hasEmptyPathParam = /\{[^}]+\}/.test(requestPath);
  const hasEmptyKey = !values.apiKey;

  // 샘플 코드는 긴 주소 한 줄이 아니라 파라미터를 따로 모은 형태로 보여 준다.
  // 그래서 주소(쿼리 없는 것)와 값이 채워진 파라미터만 따로 넘긴다 — apiKey 도 그 안에 들어간다.
  const sampleBaseUrl = getPublicBaseUrl() + filledPath;
  const sampleParams = queryParams
    .map((param) => [param.name, (values[param.name] || "").trim()])
    .filter((pair) => pair[1] !== "");

  // 표에 보여 줄 순서: 필수 먼저, 그다음 선택. 같은 묶음 안에서는 원래 순서를 지킨다
  // (경로 값 -> 쿼리 값 -> apiKey). sort 는 안정 정렬이라 그대로 유지된다.
  const sortedParams = pathParams
    .concat(queryParams)
    .slice()
    .sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0));

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // 키가 주소에 들어가 있으므로 헤더로 또 보내지 않는다 — 화면에 보이는 주소가 실제로 보내는 주소다.
  // 세 번째 인자 false: 로그인 토큰으로 대신 통과시키지 않는다. 그래야 값을 비우고 눌렀을 때
  // 서버가 "어떤 값이 없는지" 돌려주는 응답을 그대로 볼 수 있다.
  const handleRun = async () => {
    // 경로 값을 안 채우면 주소에 {totalId} 가 그대로 남는다. 그걸 그냥 보내면 Tomcat 이
    // 중괄호를 먼저 거부해 본문 없는 400 만 돌아와 무엇이 빠졌는지 알 수 없다.
    // 그래서 이 경우만 응답 칸에 직접 메시지를 적어 준다(버튼은 잠그지 않는다).
    const missingPath = (requestPath.match(/\{([^}]+)\}/g) || []).map((s) => s.slice(1, -1));
    if (missingPath.length > 0) {
      setResult({
        ok: false,
        status: 400,
        contentType: "application/json",
        elapsedMs: 0,
        sizeBytes: 0,
        body: JSON.stringify(
          { error: { code: "MISSING_PATH_PARAMETER", message: "경로 값이 없습니다: " + missingPath.join(", ") } },
          null,
          2
        ),
      });
      return;
    }
    setRunning(true);
    setResult(await callApi(requestPath, null, false));
    setRunning(false);
    if (onCalled) onCalled();
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
        {hasEmptyKey ? (
          <p style={keyUrlNoteStyle}>
            이 주소에 <strong>아직 키가 들어가 있지 않습니다</strong> — 위 <strong>내 API 키</strong>에서 키 값을
            복사해 아래 <code>apiKey</code> 칸에 넣으면 주소와 샘플 코드에 함께 들어갑니다(로그인하면 보통 자동으로 채워집니다).
          </p>
        ) : (
          <p style={keyUrlNoteStyle}>
            이 주소에는 <strong>내 API 키가 포함</strong>되어 있어 다른 서버·프로그램에서 그대로 쓸 수 있습니다.
            주소에 키가 들어가면 브라우저 방문기록·서버 로그에 남으니, 공개된 곳에 붙여 넣지 마세요.
          </p>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>파라미터</h2>
        {/* apiKey 가 항상 들어가므로 "없습니다" 분기는 남겨 두지 않는다 — 표는 늘 한 줄 이상이다 */}
        {(
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
              {sortedParams.map((param) => (
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

        {/* 값이 비어도 막지 않는다 — 그냥 보내고, 서버가 어떤 값이 없는지 알려 주는 응답을
            아래 "응답"에 그대로 보여 준다(400 MISSING_PARAMETER / 401 API_KEY_REQUIRED). */}
        <div style={runRowStyle}>
          <button type="button" style={runButtonStyle} onClick={handleRun} disabled={running}>
            {running ? "부르는 중…" : "실행해 보기"}
          </button>
          {(hasEmptyPathParam || hasEmptyKey) ? (
            <span style={hintStyle}>필수 값이 비어 있습니다 — 눌러 보면 응답에 무엇이 없는지 나옵니다.</span>
          ) : (
            <span style={keyNoteStyle}>위 주소 그대로 보냅니다(키 포함)</span>
          )}
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
        <CodeSamples baseUrl={sampleBaseUrl} params={sampleParams} />
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

const keyUrlNoteStyle = { fontSize: "0.78rem", color: "#b45309", margin: "0.4rem 0 0", lineHeight: 1.6 };

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
