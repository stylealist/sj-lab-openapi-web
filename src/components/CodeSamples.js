import React, { useState } from "react";

// 지금 보고 있는 주소를 그대로 붙여 넣어 쓸 수 있는 코드로 만들어 준다.
// 키를 고른 상태면 헤더(X-API-Key)까지 넣어 준다 — 키는 주소보다 헤더로 보내는 편이 안전하다.
function buildSamples(url, apiKey) {
  const curlHeader = apiKey ? ' \\\n  -H "X-API-Key: ' + apiKey + '"' : "";
  const jsHeader = apiKey ? ', {\n  headers: { "X-API-Key": "' + apiKey + '" }\n}' : "";
  const pyHeader = apiKey ? ', headers={"X-API-Key": "' + apiKey + '"}' : "";

  return [
    {
      id: "curl",
      label: "curl",
      code: 'curl "' + url + '"' + curlHeader,
    },
    {
      id: "javascript",
      label: "JavaScript",
      code:
        'const response = await fetch("' +
        url +
        '"' +
        jsHeader +
        ");\nconst data = await response.json();\nconsole.log(data);",
    },
    {
      id: "python",
      label: "Python",
      code:
        'import requests\n\nresponse = requests.get("' +
        url +
        '"' +
        pyHeader +
        ")\nresponse.raise_for_status()\nprint(response.json())",
    },
  ];
}

function CodeSamples({ url, apiKey }) {
  const samples = buildSamples(url, apiKey);
  const [activeId, setActiveId] = useState(samples[0].id);
  const [copied, setCopied] = useState(false);

  const active = samples.find((sample) => sample.id === activeId) || samples[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div style={tabsStyle}>
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => setActiveId(sample.id)}
            style={sample.id === activeId ? tabActiveStyle : tabStyle}
          >
            {sample.label}
          </button>
        ))}
        <button type="button" onClick={handleCopy} style={copyButtonStyle}>
          {copied ? "복사했습니다" : "복사"}
        </button>
      </div>
      <pre style={codeStyle}>{active.code}</pre>
    </div>
  );
}

export default CodeSamples;

const tabsStyle = { display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.6rem" };

const tabStyle = {
  background: "#ffffff",
  color: "#475569",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0.35rem 0.7rem",
  fontSize: "0.82rem",
  cursor: "pointer",
};

const tabActiveStyle = {
  ...tabStyle,
  // border 와 borderColor 를 섞어 쓰면 React 가 경고를 낸다 — 항상 border 한 줄로 덮어쓴다.
  border: "1px solid #2563eb",
  color: "#1e40af",
  background: "#eff6ff",
};

const copyButtonStyle = { ...tabStyle, marginLeft: "auto" };

const codeStyle = {
  background: "#0f172a",
  color: "#e2e8f0",
  borderRadius: "8px",
  padding: "0.8rem",
  fontSize: "0.78rem",
  lineHeight: 1.6,
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
};
