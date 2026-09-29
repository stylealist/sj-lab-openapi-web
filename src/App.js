import React, { useEffect, useMemo, useState } from "react";
import { fetchCatalog, getPublicBaseUrl } from "./api";
import ApiDetail from "./components/ApiDetail";
import KeyPanel from "./components/KeyPanel";

// 허브는 로컬에서 3000번 포트에 따로 뜬다. 운영은 같은 오리진의 최상위 경로다.
function resolveHubUrl() {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }
  return "/";
}

function App() {
  const [catalog, setCatalog] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  // 실행해 보기에 함께 보낼 API 키. 화면에서만 들고 있다(저장하지 않는다).
  const [apiKey, setApiKey] = useState("");
  const [isHubHovered, setIsHubHovered] = useState(false);

  useEffect(() => {
    fetchCatalog()
      .then((data) => {
        setCatalog(data);
        const firstGroup = data.groups && data.groups[0];
        const firstApi = firstGroup && firstGroup.apis && firstGroup.apis[0];
        if (firstApi) setSelectedId(firstApi.id);
      })
      .catch((error) => setLoadError(error.message));
  }, []);

  const apis = useMemo(() => {
    if (!catalog) return [];
    return catalog.groups.reduce((all, group) => all.concat(group.apis), []);
  }, [catalog]);

  const selectedApi = apis.find((api) => api.id === selectedId) || null;
  const username = window.SjLabAuth ? window.SjLabAuth.getUsername() : "";

  const handleLogout = () => {
    if (window.SjLabAuth) window.SjLabAuth.logout();
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={brandStyle}>
          <span style={brandMarkStyle}>API</span>
          <div>
            <div style={brandTitleStyle}>SJ-LAB OpenAPI</div>
            <div style={brandSubStyle}>지도 · 시설물 데이터를 바로 가져다 쓰기</div>
          </div>
        </div>
        <div style={headerRightStyle}>
          <a
            href={resolveHubUrl()}
            title="sj-lab 허브로 이동"
            style={isHubHovered ? { ...hubLinkStyle, ...hubLinkHoverStyle } : hubLinkStyle}
            onMouseEnter={() => setIsHubHovered(true)}
            onMouseLeave={() => setIsHubHovered(false)}
            onFocus={() => setIsHubHovered(true)}
            onBlur={() => setIsHubHovered(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 5h6v6H4zM14 5h6v6h-6zM4 13h6v6H4zM14 13h6v6h-6z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
            <span>허브</span>
          </a>
          {username && <span style={userStyle}>{username} 님</span>}
          <button type="button" style={logoutButtonStyle} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      {loadError && (
        <div style={errorBannerStyle}>
          {loadError} — API 서버(<code>sj-lab-openapi</code>)가 떠 있는지 확인해 주세요.
        </div>
      )}

      <div style={bodyStyle}>
        <nav style={sidebarStyle}>
          <div style={baseUrlBoxStyle}>
            <div style={baseUrlLabelStyle}>기본 주소</div>
            <code style={baseUrlValueStyle}>{getPublicBaseUrl()}</code>
          </div>
          {catalog &&
            catalog.groups.map((group) => (
              <div key={group.id} style={groupStyle}>
                <div style={groupTitleStyle}>{group.title}</div>
                <div style={groupDescStyle}>{group.description}</div>
                {group.apis.map((api) => {
                  const active = api.id === selectedId;
                  return (
                    <button
                      key={api.id}
                      type="button"
                      onClick={() => setSelectedId(api.id)}
                      style={active ? apiItemActiveStyle : apiItemStyle}
                    >
                      <span style={methodBadgeStyle}>{api.method}</span>
                      <span style={apiItemTextStyle}>
                        <span style={apiItemTitleStyle}>{api.title}</span>
                        <span style={apiItemPathStyle}>{api.path}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          {!catalog && !loadError && <div style={sidebarLoadingStyle}>불러오는 중…</div>}
        </nav>

        <main style={mainStyle}>
          {catalog && catalog.notice && <div style={noticeStyle}>{catalog.notice}</div>}
          <KeyPanel selectedKey={apiKey} onSelectKey={setApiKey} />
          {selectedApi ? (
            <ApiDetail api={selectedApi} apiKey={apiKey} />
          ) : (
            !loadError && <div style={placeholderStyle}>왼쪽에서 API를 고르세요.</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: "#f8fafc",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "0.9rem 1.5rem",
  background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
  color: "#ffffff",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.18)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const brandStyle = { display: "flex", alignItems: "center", gap: "0.75rem" };

const brandMarkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.18)",
  fontFamily: "Poppins, Inter, sans-serif",
  fontWeight: 600,
  fontSize: "0.8rem",
  letterSpacing: "0.04em",
};

const brandTitleStyle = {
  fontFamily: "Poppins, Inter, sans-serif",
  fontWeight: 600,
  fontSize: "1.05rem",
  lineHeight: 1.2,
};

const brandSubStyle = { fontSize: "0.78rem", opacity: 0.85 };

const headerRightStyle = { display: "flex", alignItems: "center", gap: "0.7rem" };

const hubLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.38rem 0.8rem",
  borderRadius: "999px",
  border: "1px solid rgba(148, 178, 232, 0.28)",
  color: "rgba(226, 232, 240, 0.82)",
  fontSize: "0.78rem",
  fontWeight: 500,
  letterSpacing: "0.02em",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
};

const hubLinkHoverStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(148, 178, 232, 0.5)",
  color: "#ffffff",
};

const userStyle = { fontSize: "0.85rem", opacity: 0.95 };

const logoutButtonStyle = {
  background: "rgba(255, 255, 255, 0.16)",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  borderRadius: "6px",
  padding: "0.35rem 0.7rem",
  fontSize: "0.85rem",
  cursor: "pointer",
};

const errorBannerStyle = {
  padding: "0.7rem 1.5rem",
  background: "#fef2f2",
  color: "#b91c1c",
  fontSize: "0.88rem",
  borderBottom: "1px solid #fecaca",
};

const bodyStyle = { display: "flex", alignItems: "flex-start", gap: "1.5rem", padding: "1.5rem", flex: 1 };

const sidebarStyle = {
  width: "300px",
  flex: "0 0 300px",
  position: "sticky",
  top: "5.2rem",
  maxHeight: "calc(100vh - 6.5rem)",
  overflowY: "auto",
};

const baseUrlBoxStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "0.7rem 0.85rem",
  marginBottom: "1rem",
};

const baseUrlLabelStyle = { fontSize: "0.72rem", color: "#64748b", marginBottom: "0.25rem" };

const baseUrlValueStyle = { fontSize: "0.78rem", color: "#0f172a", wordBreak: "break-all" };

const groupStyle = { marginBottom: "1.25rem" };

const groupTitleStyle = {
  fontFamily: "Poppins, Inter, sans-serif",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#0f172a",
  marginBottom: "0.2rem",
};

const groupDescStyle = { fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5, marginBottom: "0.6rem" };

const apiItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  width: "100%",
  textAlign: "left",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "0.5rem 0.6rem",
  marginBottom: "0.35rem",
  cursor: "pointer",
};

const apiItemActiveStyle = {
  ...apiItemStyle,
  // border 와 borderColor 를 섞어 쓰면 React 가 경고를 낸다 — 항상 border 한 줄로 덮어쓴다.
  border: "1px solid #2563eb",
  background: "#eff6ff",
  boxShadow: "0 0 0 1px #2563eb inset",
};

const methodBadgeStyle = {
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: "#1e40af",
  background: "#dbeafe",
  borderRadius: "4px",
  padding: "0.15rem 0.35rem",
};

const apiItemTextStyle = { display: "flex", flexDirection: "column", minWidth: 0 };

const apiItemTitleStyle = { fontSize: "0.88rem", color: "#0f172a" };

const apiItemPathStyle = {
  fontSize: "0.72rem",
  color: "#64748b",
  fontFamily: "SFMono-Regular, Consolas, monospace",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const sidebarLoadingStyle = { fontSize: "0.85rem", color: "#64748b" };

const mainStyle = { flex: 1, minWidth: 0 };

const noticeStyle = {
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  color: "#334155",
  borderRadius: "10px",
  padding: "0.7rem 0.9rem",
  fontSize: "0.85rem",
  marginBottom: "1rem",
};

const placeholderStyle = { color: "#64748b", fontSize: "0.9rem" };
