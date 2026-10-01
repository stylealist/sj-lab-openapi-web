import React, { useState } from "react";

/**
 * 지금 입력한 값으로 바로 돌려볼 수 있는 코드를 만든다.
 *
 * 긴 주소 한 줄이 아니라 **파라미터를 따로 모은 형태**로 적는다 — 값을 바꿀 때 주소 안에서
 * 찾아 고치지 않아도 되고, `apiKey` 가 다른 값들과 나란히 보여서 "이게 필요하다"는 게 드러난다.
 * 쉼표가 들어가는 `bbox` 같은 값도 각 언어가 알아서 인코딩해 준다.
 *
 * @param baseUrl 쿼리 없는 주소(경로 값은 채워진 상태)
 * @param params  [이름, 값] 쌍의 배열. 값이 빈 것은 호출하는 쪽에서 걸러 넘긴다
 */
function buildSamples(baseUrl, params) {
  const quote = (value) => '"' + String(value).replace(/"/g, '\\"') + '"';

  const curlData = params.map((p) => '  --data-urlencode ' + quote(p[0] + "=" + p[1])).join(" \\\n");
  const curl = params.length
    ? 'curl -G ' + quote(baseUrl) + " \\\n" + curlData
    : "curl " + quote(baseUrl);

  const jsEntries = params.map((p) => "  " + p[0] + ": " + quote(p[1]) + ",").join("\n");
  const js = params.length
    ? "const params = new URLSearchParams({\n" +
      jsEntries +
      "\n});\n\nconst response = await fetch(" +
      quote(baseUrl + "?") +
      " + params);\nconst data = await response.json();\nconsole.log(data);"
    : "const response = await fetch(" +
      quote(baseUrl) +
      ");\nconst data = await response.json();\nconsole.log(data);";

  const pyEntries = params.map((p) => "    " + quote(p[0]) + ": " + quote(p[1]) + ",").join("\n");
  const py = params.length
    ? "import requests\n\nparams = {\n" +
      pyEntries +
      "\n}\n\nresponse = requests.get(" +
      quote(baseUrl) +
      ", params=params)\nresponse.raise_for_status()\nprint(response.json())"
    : "import requests\n\nresponse = requests.get(" +
      quote(baseUrl) +
      ")\nresponse.raise_for_status()\nprint(response.json())";

  return [
    { id: "curl", label: "curl", code: curl },
    { id: "javascript", label: "JavaScript", code: js },
    { id: "python", label: "Python", code: py },
  ];
}

function CodeSamples({ baseUrl, params }) {
  const samples = buildSamples(baseUrl, params || []);
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
