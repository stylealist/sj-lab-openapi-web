import React, { useState } from "react";

function ContactPage() {
  const [isHighlightHovered, setIsHighlightHovered] = useState(false);

  const repositories = [
    {
      name: "sj-lab-openapi",
      desc: "공개 API 서버 (이 페이지가 부르는 곳)",
    },
    {
      name: "sj-lab-openapi-web",
      desc: "이 화면",
    },
    {
      name: "sj-lab",
      desc: "플랫폼 소개 · 총괄 문서",
    },
    {
      name: "sj-lab-hub",
      desc: "첫 화면(허브)",
    },
    {
      name: "sj-lab-mapservice",
      desc: "지도 화면",
    },
    {
      name: "mapservice-rest",
      desc: "지도 · 시설물 데이터 API",
    },
    {
      name: "sj-lab-apigateway",
      desc: "API 게이트웨이",
    },
    {
      name: "sj-lab-discoveryServer",
      desc: "서비스 레지스트리(Eureka)",
    },
    {
      name: "sj-lab-scheduler",
      desc: "공공데이터 수집 배치",
    },
    {
      name: "sj-lab-authserver",
      desc: "로그인 서버",
    },
    {
      name: "sj-qfieldsync",
      desc: "현장 데이터 동기화 워커",
    },
    {
      name: "sj-qfieldCloud",
      desc: "QFieldCloud 서버 설정",
    },
    {
      name: "fast-api-ai",
      desc: "AI 기능용 FastAPI 서버",
    },
    {
      name: "sj-lab-k8s-manifests",
      desc: "쿠버네티스 배포 매니페스트",
    },
    {
      name: "sj-lab-nginx",
      desc: "nginx 설정",
    },
  ];

  const infraLinks = [
    {
      url: "https://sj-lab.co.kr",
      title: "허브 첫 화면",
    },
    {
      url: "https://api.sj-lab.co.kr/open-api/catalog",
      title: "공개 API 목록 (이 화면이 읽는 원본)",
    },
    {
      url: "https://api.sj-lab.co.kr/map/check",
      title: "API 게이트웨이 · 데이터 서버 상태",
    },
    {
      url: "https://eureka.sj-lab.co.kr",
      title: "마이크로서비스 등록 현황",
    },
    {
      url: "https://api.sj-lab.co.kr/auth/login.html",
      title: "공유 로그인 화면",
    },
    {
      url: "https://qfield.sj-lab.co.kr",
      title: "현장 조사 데이터가 올라가는 곳",
    },
    {
      url: "https://argo.sj-lab.co.kr",
      title: "배포 상태(ArgoCD)",
    },
    {
      url: "https://jenkins.sj-lab.co.kr",
      title: "빌드(Jenkins)",
    },
    {
      url: "https://dashboard.sj-lab.co.kr",
      title: "쿠버네티스 대시보드",
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        {/* (1) 머리 영역 */}
        <header style={heroStyle}>
          <div style={badgeStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>SJ-LAB 개발 · 운영</span>
          </div>
          <h1 style={heroTitleStyle}>막히는 데가 있으면 알려 주세요</h1>
          <p style={heroDescStyle}>
            쓰다가 막히거나 이상한 응답이 오면 아래로 알려 주세요. 확인해서 답장드립니다.
          </p>
        </header>

        {/* (2) 만든 사람 카드 한 개 */}
        <section style={leadCardStyle}>
          <div style={leadAvatarWrapStyle}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div style={leadInfoStyle}>
            <span style={leadRoleBadgeStyle}>만든 사람</span>
            <div style={leadNameStyle}>주성중 (Sungjoong Joo)</div>
            <div style={leadPositionStyle}>
              기획부터 백엔드 · 프론트엔드 · 배포까지 직접 만들고 운영하고 있습니다
            </div>
            <p style={leadQuoteStyle}>
              모아 둔 데이터가 저장소 안에서만 돌지 않고 밖에서도 쓰이는 것,
              그 통로를 문서와 실제 동작이 어긋나지 않게 만드는 것. 그게 이 페이지를 만든 이유입니다.
            </p>
          </div>
        </section>

        {/* (3) GitHub 저장소 카드 (넓은 카드 한 개) */}
        <section style={cardStyle}>
          <div style={channelIconStyle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </div>
          <h2 style={channelTitleStyle}>GitHub 저장소</h2>
          <p style={channelDescStyle}>
            화면부터 API, 배포 설정까지 모두 공개해 뒀습니다. 저장소마다 README 에 구조와 실행 방법이 있습니다.
          </p>

          <a
            href="https://claude.ai/artifact/HhEYu2UmxSko5h8uef7hB9"
            target="_blank"
            rel="noopener noreferrer"
            style={isHighlightHovered ? { ...highlightLinkStyle, ...highlightLinkHoverStyle } : highlightLinkStyle}
            onMouseEnter={() => setIsHighlightHovered(true)}
            onMouseLeave={() => setIsHighlightHovered(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
              <path d="M12 8v4l3 2" />
              <path d="M3.05 11a9 9 0 1 1 .5 4" />
              <polyline points="3 4 3 11 10 11" />
            </svg>
            <div style={highlightTextWrapStyle}>
              <strong style={highlightTitleStyle}>개발 변경 로그 (v1.0 ~ 현재)</strong>
              <span style={highlightDescStyle}>
                버전마다 남긴 작업 기록 — 무엇을 왜 바꿨는지, 어떻게 확인했는지
              </span>
            </div>
          </a>

          <div style={repoGridStyle}>
            {repositories.map((repo, idx) => (
              <div key={idx} style={repoItemStyle}>
                <a
                  href={`https://github.com/stylealist/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={repoLinkStyle}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: "3px" }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <div style={repoContentStyle}>
                    <span style={repoNameStyle}>stylealist/{repo.name}</span>
                    <span style={repoNoteStyle}>{repo.desc}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 2열: (4) 이메일 카드 & (5) 돌아가는 곳 카드 */}
        <div style={bottomGridStyle}>
          {/* (4) 이메일 카드 */}
          <section style={cardStyle}>
            <div style={channelIconStyle}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 style={channelTitleStyle}>이메일</h2>
            <p style={channelDescStyle}>가장 확실한 방법입니다. 무엇이든 편하게 보내 주세요.</p>
            <a href="mailto:stylealist@gmail.com" style={emailLinkStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>stylealist@gmail.com</span>
            </a>
          </section>

          {/* (5) 돌아가는 곳 카드 (인프라 링크) */}
          <section style={cardStyle}>
            <div style={channelIconStyle}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <h2 style={channelTitleStyle}>돌아가는 곳</h2>
            <p style={channelDescStyle}>로그인 없이 바로 열리는 것부터 적어 두었습니다.</p>
            <div style={infraListStyle}>
              {infraLinks.map((item, idx) => (
                <div key={idx} style={infraItemStyle}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={infraLinkStyle}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: "3px" }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <div style={infraContentStyle}>
                      <span style={infraNameStyle}>{item.title}</span>
                      <span style={infraUrlStyle}>{item.url}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div style={infraNoteBoxStyle}>
              허브 · 공개 API 목록 · 게이트웨이 · Eureka · 로그인 화면은 바로 열리고,
              QFieldCloud · ArgoCD · Jenkins · 쿠버네티스 대시보드는 로그인이 필요합니다.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

const containerStyle = {
  flex: 1,
  width: "100%",
  padding: "2.5rem 1.5rem 4.5rem",
  boxSizing: "border-box",
};

const innerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box",
};

const heroStyle = {
  textAlign: "center",
  marginBottom: "2.75rem",
  paddingBottom: "2rem",
  borderBottom: "1px solid #e2e8f0",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 14px",
  borderRadius: "9999px",
  fontSize: "0.825rem",
  fontWeight: 600,
  letterSpacing: "0.02em",
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #dbeafe",
  marginBottom: "1rem",
};

const heroTitleStyle = {
  fontSize: "1.9rem",
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.35,
  marginBottom: "1rem",
  letterSpacing: "-0.02em",
};

const heroDescStyle = {
  fontSize: "1.02rem",
  color: "#64748b",
  lineHeight: 1.75,
  maxWidth: "780px",
  margin: "0 auto",
  wordBreak: "keep-all",
};

const leadCardStyle = {
  display: "flex",
  gap: "1.75rem",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "1.75rem",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
  marginBottom: "2rem",
  alignItems: "center",
  flexWrap: "wrap",
};

const leadAvatarWrapStyle = {
  flexShrink: 0,
  width: "84px",
  height: "84px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
};

const leadInfoStyle = {
  flex: 1,
  minWidth: "260px",
};

const leadRoleBadgeStyle = {
  display: "inline-block",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#2563eb",
  background: "#eff6ff",
  border: "1px solid #dbeafe",
  padding: "2px 10px",
  borderRadius: "9999px",
  marginBottom: "0.4rem",
};

const leadNameStyle = {
  fontSize: "1.35rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "0.25rem",
};

const leadPositionStyle = {
  fontSize: "0.88rem",
  fontWeight: 600,
  color: "#64748b",
  marginBottom: "0.75rem",
};

const leadQuoteStyle = {
  fontSize: "0.9rem",
  color: "#334155",
  lineHeight: 1.65,
  borderLeft: "3px solid #2563eb",
  paddingLeft: "12px",
  margin: 0,
  wordBreak: "keep-all",
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "1.6rem",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
  marginBottom: "1.75rem",
};

const channelIconStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "#eff6ff",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "0.85rem",
};

const channelTitleStyle = {
  fontSize: "1.15rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "0.35rem",
};

const channelDescStyle = {
  fontSize: "0.86rem",
  color: "#64748b",
  lineHeight: 1.5,
  marginBottom: "1.1rem",
  wordBreak: "keep-all",
};

const highlightLinkStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "0.85rem 1rem",
  marginBottom: "1.25rem",
  border: "1px solid #dbeafe",
  borderRadius: "10px",
  background: "#eff6ff",
  textDecoration: "none",
  color: "#1e40af",
  transition: "background 0.18s ease, transform 0.18s ease",
};

const highlightLinkHoverStyle = {
  background: "#dbeafe",
  transform: "translateY(-1px)",
};

const highlightTextWrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
};

const highlightTitleStyle = {
  fontSize: "0.88rem",
  fontWeight: 700,
  color: "#1e40af",
};

const highlightDescStyle = {
  fontSize: "0.8rem",
  color: "#64748b",
  wordBreak: "keep-all",
  lineHeight: 1.45,
};

const repoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "10px 1.25rem",
};

const repoItemStyle = {
  display: "flex",
};

const repoLinkStyle = {
  display: "inline-flex",
  alignItems: "flex-start",
  gap: "7px",
  textDecoration: "none",
  color: "#2563eb",
  fontSize: "0.85rem",
  lineHeight: 1.4,
};

const repoContentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const repoNameStyle = {
  fontWeight: 600,
  wordBreak: "break-all",
};

const repoNoteStyle = {
  fontSize: "0.78rem",
  color: "#94a3b8",
  wordBreak: "keep-all",
};

const bottomGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "1.25rem",
};

const emailLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#2563eb",
  textDecoration: "none",
  padding: "0.5rem 0",
};

const infraListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "1rem",
};

const infraItemStyle = {
  display: "flex",
};

const infraLinkStyle = {
  display: "inline-flex",
  alignItems: "flex-start",
  gap: "7px",
  textDecoration: "none",
  color: "#2563eb",
  fontSize: "0.85rem",
  lineHeight: 1.4,
};

const infraContentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const infraNameStyle = {
  fontWeight: 600,
  color: "#0f172a",
};

const infraUrlStyle = {
  fontSize: "0.78rem",
  color: "#64748b",
  wordBreak: "break-all",
};

const infraNoteBoxStyle = {
  marginTop: "0.75rem",
  padding: "0.75rem 0.95rem",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  color: "#64748b",
  fontSize: "0.8rem",
  lineHeight: 1.5,
};
