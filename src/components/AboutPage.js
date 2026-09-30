import React, { useState } from "react";

function AboutPage({ onGoDocs }) {
  const [isLogHovered, setIsLogHovered] = useState(false);
  const [isDocsHovered, setIsDocsHovered] = useState(false);

  const metrics = [
    {
      val: "12개",
      label: "열어 둔 API",
      desc: "모두 조회용입니다. 데이터를 바꾸는 API는 열지 않았습니다",
    },
    {
      val: "3묶음",
      label: "갈래",
      desc: "공공데이터 6종 · 시설물 3종 · 행정구역 3단계",
    },
    {
      val: "하루 1,000회",
      label: "키 하나의 기본 한도",
      desc: "넘으면 잠시 막힙니다. 키 없이도 부를 수 있습니다",
    },
    {
      val: "3가지",
      label: "바로 복사하는 샘플 코드",
      desc: "curl · JavaScript · Python",
    },
  ];

  const stages = [
    {
      step: "1단계 · 현장",
      title: "앱으로 현장 시설물 기록",
      repo: "infra-manage-app",
      desc: "현장에서 사진 · 음성 · 영상과 점검 결과를 남깁니다",
    },
    {
      step: "2단계 · 동기화",
      title: "올라온 조사 결과 받아오기",
      repo: "sj-qfieldsync",
      desc: "주기적으로 확인해 바뀐 것만 데이터베이스에 넣습니다",
    },
    {
      step: "3단계 · 데이터",
      title: "지도에 필요한 만큼만 내려주기",
      repo: "mapservice-rest",
      desc: "보고 있는 화면 범위만 골라 GeoJSON으로 만듭니다",
    },
    {
      step: "4단계 · 공개",
      title: "밖에서 부를 수 있게 열기",
      repo: "sj-lab-openapi",
      desc: "목록에 적어 둔 주소와 파라미터만 통과시키고 답을 그대로 전달합니다",
    },
  ];

  const features = [
    {
      title: "화면이 API 목록을 따라간다",
      desc: "이 화면은 서버가 주는 API 목록을 읽어 그립니다. API가 늘어도 이 페이지를 고치지 않아도 항목이 함께 늘어납니다",
    },
    {
      title: "바로 눌러 보기",
      desc: "파라미터를 채우고 실행하면 상태 · 걸린 시간 · 크기 · 응답 본문을 이 자리에서 보여 줍니다",
    },
    {
      title: "값이 들어간 샘플 코드",
      desc: "지금 입력한 값이 그대로 들어간 curl · JavaScript · Python 코드를 복사해 갈 수 있습니다",
    },
    {
      title: "내 키와 사용량",
      desc: "로그인하면 키를 발급받아 호출에 붙일 수 있고, 오늘 얼마나 썼는지 볼 수 있습니다. 키 원문은 보관하지 않습니다",
    },
    {
      title: "화면 범위만 받아오기",
      desc: "전국 데이터를 통째로 내려주지 않고 보고 있는 영역만 골라 줍니다. 많을 때는 화면 전체에 고르게 퍼진 표본을 줍니다",
    },
    {
      title: "공공데이터 6종",
      desc: "편의점 · 버스정류장 · CCTV · 약국 · 병원 · 관공서를 같은 형식으로 부를 수 있습니다",
    },
  ];

  const techGroups = [
    {
      title: "이 화면",
      badges: ["React 18", "Webpack", "인라인 스타일", "라우터 없음"],
    },
    {
      title: "공개 API 서버",
      badges: [
        "Spring Boot 3.3",
        "Java 17",
        "카탈로그 JSON",
        "RestTemplate 중계",
        "API 키(SHA-256)",
        "사용량 기록",
      ],
    },
    {
      title: "플랫폼",
      badges: [
        "Spring Cloud Gateway",
        "Eureka",
        "PostgreSQL 17",
        "PostGIS 3.4",
        "MyBatis",
        "JWT 로그인",
        "k3s",
        "Helm",
        "ArgoCD",
        "Jenkins",
        "Docker",
        "nginx",
      ],
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        {/* (1) 머리 영역 */}
        <header style={heroStyle}>
          <div style={badgeStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>SJ-LAB OpenAPI</span>
          </div>
          <h1 style={heroTitleStyle}>모아 둔 지도 · 시설물 데이터를 그대로 가져다 쓰도록</h1>
          <p style={heroDescStyle}>
            현장에서 모은 시설물 데이터와 공공데이터를 밖에서도 쓸 수 있게 열어 둔 곳입니다.
            문서를 읽고, 이 화면에서 바로 호출해 보고, 그 값이 들어간 코드를 복사해 가면 됩니다.
          </p>
          <div style={heroActionsStyle}>
            <a
              href="https://claude.ai/artifact/HhEYu2UmxSko5h8uef7hB9"
              target="_blank"
              rel="noopener noreferrer"
              style={isLogHovered ? { ...secondaryBtnStyle, ...secondaryBtnHoverStyle } : secondaryBtnStyle}
              onMouseEnter={() => setIsLogHovered(true)}
              onMouseLeave={() => setIsLogHovered(false)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 2" />
                <path d="M3.05 11a9 9 0 1 1 .5 4" />
                <polyline points="3 4 3 11 10 11" />
              </svg>
              <span>개발 변경 로그 보기</span>
            </a>
            <button
              type="button"
              onClick={onGoDocs}
              style={isDocsHovered ? { ...primaryBtnStyle, ...primaryBtnHoverStyle } : primaryBtnStyle}
              onMouseEnter={() => setIsDocsHovered(true)}
              onMouseLeave={() => setIsDocsHovered(false)}
            >
              <span>API 문서로 가기</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </header>

        {/* (2) 숫자 카드 4개 */}
        <section style={sectionStyle}>
          <div style={metricsGridStyle}>
            {metrics.map((m, idx) => (
              <div key={idx} style={metricCardStyle}>
                <div style={metricValStyle}>{m.val}</div>
                <div style={metricLabelStyle}>{m.label}</div>
                <div style={metricDescStyle}>{m.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* (3) 데이터가 어디서 오는지 — 단계 카드 4개 */}
        <section style={sectionStyle}>
          <div style={sectionTitleWrapStyle}>
            <div style={sectionIconStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h2 style={sectionTitleStyle}>데이터가 어디서 오는지</h2>
          </div>
          <div style={cardsGridStyle}>
            {stages.map((stage, idx) => (
              <div key={idx} style={stageCardStyle}>
                <div style={stageStepBadgeStyle}>{stage.step}</div>
                <div style={stageTitleStyle}>{stage.title}</div>
                <div style={stageRepoBadgeStyle}>{stage.repo}</div>
                <p style={stageDescStyle}>{stage.desc}</p>
              </div>
            ))}
          </div>
          <div style={stageNoteBoxStyle}>
            지금 보고 있는 이 화면(sj-lab-openapi-web)이 4단계의 목록을 읽어 그려진다.
          </div>
        </section>

        {/* (4) 이런 것들을 할 수 있습니다 — 기능 카드 6개 */}
        <section style={sectionStyle}>
          <div style={sectionTitleWrapStyle}>
            <div style={sectionIconStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 style={sectionTitleStyle}>이런 것들을 할 수 있습니다</h2>
          </div>
          <div style={cardsGridStyle}>
            {features.map((feat, idx) => (
              <div key={idx} style={featureCardStyle}>
                <div style={featureIconBoxStyle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <h3 style={featureTitleStyle}>{feat.title}</h3>
                <p style={featureDescStyle}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* (5) 쓰는 기술 — 배지 목록을 세 묶음으로 */}
        <section style={sectionStyle}>
          <div style={sectionTitleWrapStyle}>
            <div style={sectionIconStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h2 style={sectionTitleStyle}>쓰는 기술</h2>
          </div>
          <div style={techGridStyle}>
            {techGroups.map((group, idx) => (
              <div key={idx} style={techCardStyle}>
                <div style={techGroupTitleStyle}>{group.title}</div>
                <div style={techBadgesWrapStyle}>
                  {group.badges.map((b, bIdx) => (
                    <span key={bIdx} style={techBadgeStyle}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* (6) 맨 아래 안내 상자 */}
        <div style={noticeBoxStyle}>
          데이터를 바꾸는 API 와 사진 · 음성 · 영상 첨부는 열지 않았습니다. 조회만 가능합니다.
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

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

const heroActionsStyle = {
  marginTop: "1.5rem",
  display: "flex",
  justifyContent: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
};

const primaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
  color: "#ffffff",
  border: "1px solid #1e40af",
  padding: "0.55rem 1.15rem",
  borderRadius: "999px",
  fontSize: "0.88rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(37, 99, 235, 0.2)",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
};

const primaryBtnHoverStyle = {
  transform: "translateY(-1px)",
  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
};

const secondaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "#ffffff",
  color: "#1e40af",
  border: "1px solid #dbeafe",
  padding: "0.55rem 1.15rem",
  borderRadius: "999px",
  fontSize: "0.88rem",
  fontWeight: 600,
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
  transition: "background 0.18s ease, transform 0.18s ease",
};

const secondaryBtnHoverStyle = {
  background: "#eff6ff",
  transform: "translateY(-1px)",
};

const sectionStyle = {
  marginBottom: "2.75rem",
};

const sectionTitleWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "1.25rem",
};

const sectionIconStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: "#eff6ff",
  color: "#2563eb",
  flexShrink: 0,
};

const sectionTitleStyle = {
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#0f172a",
  margin: 0,
};

const metricsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.25rem",
};

const metricCardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "1.4rem 1.2rem",
  textAlign: "center",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
};

const metricValStyle = {
  fontSize: "1.85rem",
  fontWeight: 800,
  color: "#1e40af",
  lineHeight: 1.2,
  marginBottom: "0.35rem",
  fontFamily: "Poppins, Inter, sans-serif",
};

const metricLabelStyle = {
  fontSize: "0.92rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "0.35rem",
};

const metricDescStyle = {
  fontSize: "0.8rem",
  color: "#64748b",
  lineHeight: 1.45,
  wordBreak: "keep-all",
};

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "1.25rem",
};

const stageCardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "1.4rem",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
};

const stageStepBadgeStyle = {
  alignSelf: "flex-start",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#2563eb",
  background: "#dbeafe",
  padding: "2px 8px",
  borderRadius: "6px",
  marginBottom: "0.65rem",
};

const stageTitleStyle = {
  fontSize: "1.02rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "0.5rem",
  lineHeight: 1.35,
};

const stageRepoBadgeStyle = {
  display: "inline-block",
  alignSelf: "flex-start",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#1e40af",
  background: "#eff6ff",
  border: "1px solid #dbeafe",
  borderRadius: "4px",
  padding: "2px 6px",
  marginBottom: "0.7rem",
  fontFamily: "SFMono-Regular, Consolas, monospace",
};

const stageDescStyle = {
  fontSize: "0.85rem",
  color: "#64748b",
  lineHeight: 1.55,
  margin: 0,
  wordBreak: "keep-all",
};

const stageNoteBoxStyle = {
  marginTop: "1rem",
  padding: "0.85rem 1.1rem",
  background: "#eff6ff",
  border: "1px solid #dbeafe",
  borderRadius: "10px",
  color: "#1e40af",
  fontSize: "0.85rem",
  lineHeight: 1.5,
  fontWeight: 500,
};

const featureCardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "1.4rem",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
  display: "flex",
  flexDirection: "column",
};

const featureIconBoxStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  background: "#eff6ff",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "0.85rem",
};

const featureTitleStyle = {
  fontSize: "0.98rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "0.45rem",
  lineHeight: 1.35,
};

const featureDescStyle = {
  fontSize: "0.85rem",
  color: "#64748b",
  lineHeight: 1.55,
  margin: 0,
  wordBreak: "keep-all",
};

const techGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.25rem",
};

const techCardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "1.35rem",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
};

const techGroupTitleStyle = {
  fontSize: "0.92rem",
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: "0.85rem",
};

const techBadgesWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
};

const techBadgeStyle = {
  fontSize: "0.78rem",
  fontWeight: 500,
  background: "#f8fafc",
  color: "#0f172a",
  border: "1px solid #e2e8f0",
  padding: "4px 8px",
  borderRadius: "6px",
};

const noticeBoxStyle = {
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  color: "#334155",
  borderRadius: "10px",
  padding: "1rem 1.25rem",
  fontSize: "0.88rem",
  lineHeight: 1.6,
  textAlign: "center",
};
