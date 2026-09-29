// API 호출 주소와 호출 함수. 화면 구성은 서버가 내려주는 카탈로그(/open-api/catalog)를 그대로 따른다.

const OPEN_API_PREFIX = "/open-api";

/**
 * 로컬에서는 webpack devServer 프록시(/open-api → localhost:8100)를 타므로 주소를 붙이지 않는다.
 * 같은 오리진으로 부르는 셈이라 CORS 설정이 필요 없다.
 * 운영은 sj-lab.co.kr 에서 api.sj-lab.co.kr 로 부르며, 게이트웨이가 이미 허용한 오리진이다.
 */
export function getApiBaseUrl() {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "";
  }
  return "https://api.sj-lab.co.kr";
}

/** 문서·샘플 코드에 보여 줄 "밖에서 부를 때의" 주소(프록시를 거치지 않는 실제 주소) */
export function getPublicBaseUrl() {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:8100" + OPEN_API_PREFIX;
  }
  return "https://api.sj-lab.co.kr" + OPEN_API_PREFIX;
}

export function buildQueryString(values) {
  const params = new URLSearchParams();
  Object.keys(values).forEach((key) => {
    const value = values[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.append(key, String(value).trim());
    }
  });
  const query = params.toString();
  return query ? "?" + query : "";
}

/** 경로 변수({totalId})를 입력값으로 바꾼다. 비어 있으면 그대로 둬서 사용자가 알아볼 수 있게 한다. */
export function fillPathVariables(path, values) {
  return path.replace(/\{([^}]+)\}/g, (match, name) => {
    const value = values[name];
    return value !== undefined && String(value).trim() !== ""
      ? encodeURIComponent(String(value).trim())
      : match;
  });
}

/**
 * 화면·샘플 코드에 보여 줄 주소. bbox 처럼 쉼표가 들어가는 값이 %2C 로 보이면 읽기 불편해서
 * 쉼표만 되돌린다(서버는 둘 다 같은 값으로 받는다).
 */
export function toReadableUrl(url) {
  return url.replace(/%2C/g, ",");
}

export async function fetchCatalog() {
  const response = await fetch(getApiBaseUrl() + OPEN_API_PREFIX + "/catalog");
  if (!response.ok) {
    throw new Error("API 목록을 불러오지 못했습니다 (HTTP " + response.status + ")");
  }
  return response.json();
}

/**
 * "실행해 보기" 호출. 응답 본문과 함께 걸린 시간·크기를 돌려준다.
 * 오류 응답(400·404 등)도 화면에 그대로 보여 줘야 하므로 throw 하지 않는다.
 */
export async function callApi(relativePath) {
  const startedAt = performance.now();
  try {
    const response = await fetch(getApiBaseUrl() + OPEN_API_PREFIX + relativePath);
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("Content-Type") || "",
      elapsedMs: Math.round(performance.now() - startedAt),
      sizeBytes: new Blob([text]).size,
      body: text,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      contentType: "",
      elapsedMs: Math.round(performance.now() - startedAt),
      sizeBytes: 0,
      body: "",
      errorMessage: "요청을 보내지 못했습니다: " + error.message,
    };
  }
}

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/** 응답이 JSON 이면 보기 좋게, 아니면 원문 그대로. 너무 길면 잘라서 브라우저가 멈추지 않게 한다. */
export function prettyPrint(text, maxLength = 20000) {
  let output = text;
  try {
    output = JSON.stringify(JSON.parse(text), null, 2);
  } catch (e) {
    // JSON 이 아니면 원문 그대로 보여 준다
  }
  if (output.length > maxLength) {
    return output.slice(0, maxLength) + "\n\n… 이하 생략 (전체는 위 주소를 직접 열어 확인하세요)";
  }
  return output;
}
