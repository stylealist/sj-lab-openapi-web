import React, { useEffect, useState } from "react";
import { fetchKeyStatus, fetchMyKeys, revokeKey } from "../api";

/**
 * 내 API 키 영역. 계정마다 키 1개가 자동으로 배정되고, 그 값을 그대로 보여 준다
 * (2026-10-01부터 원문을 저장한다 — 본인이 언제든 보고 복사할 수 있어야 해서).
 * 만들기 버튼은 없다. 유출됐을 때 바꾸는 길만 아래에 한 줄로 남겨 둔다.
 * 키 기능이 준비되지 않은 환경에서는 안내만 보여 준다.
 */
function KeyPanel({ selectedKey, onSelectKey, usageTick }) {
  const [status, setStatus] = useState(null);
  const [keys, setKeys] = useState([]);
  const [issued, setIssued] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // 서버는 키가 없으면 목록을 줄 때 한 개를 자동으로 배정하고, 그때 원문(issued)을 함께 준다.
  // 원문 컬럼이 있는 DB 라면 그다음부터는 목록 항목 자체에 원문이 들어 있다.
  const loadKeys = () => {
    fetchMyKeys()
      .then((data) => {
        setKeys(data ? data.items : []);
        if (data && data.issued) setIssued(data.issued);
      })
      .catch((error) => setMessage(error.message));
  };

  useEffect(() => {
    fetchKeyStatus().then((data) => {
      setStatus(data);
      if (data.ready) loadKeys();
    });
  }, []);

  // 실행해 보기로 호출할 때마다 App 이 usageTick 을 올린다. 그때 목록을 다시 읽어
  // "오늘 사용"을 갱신한다 — 다시 읽지 않으면 호출해도 0 그대로라 키가 안 쓰이는 것처럼 보인다.
  useEffect(() => {
    if (usageTick && status && status.ready) loadKeys();
  }, [usageTick]);

  // 내 키를 실행해 보기에 자동으로 물려 준다 — 사용자가 어디에 붙여 넣을 일이 없어야 한다.
  // 원문을 모르는 환경(원문 컬럼 없는 DB)에서는 비워 두고, 그때는 로그인 토큰으로 호출된다.
  useEffect(() => {
    const mine = keys.length > 0 ? keys[0] : null;
    const value = (mine && mine.apiKey) || (issued && issued.apiKey) || "";
    if (value && value !== selectedKey) onSelectKey(value);
  }, [keys, issued]);

  /**
   * 키 다시 만들기. 쓰던 키를 폐기하면 목록을 다시 읽을 때 서버가 새 키를 배정하고
   * 그 응답에 원문이 실려 온다(loadKeys 가 받아 화면에 띄운다).
   * 원문을 잊었을 때 쓰는 경로다 — 쓰던 키는 즉시 못 쓰게 된다.
   */
  const handleReissue = async (keyId, keyPrefix) => {
    if (!window.confirm(keyPrefix + " 키를 버리고 새 키를 받을까요? 지금 키로는 더 이상 부를 수 없습니다."))
      return;
    setBusy(true);
    setMessage("");
    try {
      await revokeKey(keyId);
      setIssued(null);
      onSelectKey("");
      loadKeys();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (!status) return null;

  if (!status.ready) {
    return (
      <div style={cardStyle}>
        <h2 style={titleStyle}>내 API 키</h2>
        <p style={mutedStyle}>{status.message}</p>
      </div>
    );
  }

  // 계정당 1개다. 목록이 아니라 "내 키 하나"를 보여 주는 화면이라 첫 항목만 쓴다.
  const myKey = keys.length > 0 ? keys[0] : null;
  // 원문은 DB 에 저장된 값(key_plain)이 우선이고, 없으면 막 배정받아 응답으로 받은 값을 쓴다.
  const plain = (myKey && myKey.apiKey) || (issued && issued.apiKey) || "";
  const usedRatio = myKey && myKey.dailyQuota > 0 ? myKey.todayCount / myKey.dailyQuota : 0;

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>내 API 키</h2>

      {message && <p style={errorStyle}>{message}</p>}

      {!myKey ? (
        <p style={mutedStyle}>키를 준비하는 중입니다…</p>
      ) : (
        <>
          {/* 1) 키 값 — 잘리지 않게 전체를 보여 주고 복사만 제공한다(만들기 버튼 없음) */}
          <div style={keyBoxStyle}>
            <span style={keyBoxLabelStyle}>키</span>
            {plain ? (
              <>
                <code style={keyValueStyle}>{plain}</code>
                <button
                  type="button"
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(plain);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? "복사했습니다" : "복사"}
                </button>
              </>
            ) : (
              <code style={keyValueStyle}>{myKey.keyPrefix}…</code>
            )}
          </div>

          {/* 원문을 모르는 경우(키 값을 저장하기 전에 만들어진 키). 이때는 주소·샘플 코드에도
              키가 들어가지 않으므로, 어떻게 하면 값이 보이는지 알려 준다. */}
          {!plain && (
            <p style={noPlainNoteStyle}>
              이 키는 <strong>값을 저장하기 전에 만들어졌습니다</strong> — 그래서 앞자리만 보입니다.
              아래 <strong>새 키로 바꾸기</strong>를 누르면 값이 보이는 키로 교체됩니다(지금 키는 더 이상 쓸 수 없게 됩니다).
            </p>
          )}

          {/* 2) 오늘 사용량 — 숫자와 막대를 함께 */}
          <div style={usageRowStyle}>
            <span style={usageTextStyle}>
              오늘 <strong style={usageNumStyle}>{myKey.todayCount}</strong> / {myKey.dailyQuota} 회
            </span>
            <span style={usageBarOuterStyle}>
              <span
                style={{
                  ...usageBarInnerStyle,
                  width: Math.min(100, Math.round(usedRatio * 100)) + "%",
                }}
              />
            </span>
            <span style={usageMetaStyle}>마지막 사용 {myKey.lastUsedAt || "없음"}</span>
          </div>

          {/* 쓰는 법을 여기 또 적지 않는다 — 각 API 아래 "샘플 코드"에 이 키가 들어간
              curl · JavaScript · Python 이 이미 나온다(중복이라 걷어냈다). */}
          <p style={mutedStyle}>
            이 화면의 <strong>실행해 보기</strong>는 이 키를 자동으로 붙여 보냅니다.
            다른 서버·프로그램에서 부를 때는 위 키를 복사해 쓰세요 — 각 API의 <strong>샘플 코드</strong>에
            이 키가 들어간 형태로 나옵니다.
          </p>

          {/* 키 바꾸기 — 눈에 띄지 않게 한 줄로. 유출됐을 때 바꿀 길은 남겨 둔다 */}
          <button
            type="button"
            style={reissueLinkStyle}
            onClick={() => handleReissue(myKey.keyId, myKey.keyPrefix)}
            disabled={busy}
          >
            키가 유출됐다면 — 새 키로 바꾸기
          </button>
        </>
      )}
    </div>
  );
}

export default KeyPanel;

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "1.1rem 1.25rem",
  marginBottom: "1rem",
};

const titleStyle = {
  fontFamily: "Poppins, Inter, sans-serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: "0.4rem",
};

const mutedStyle = { fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6 };

const keyBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  flexWrap: "wrap",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "10px",
  padding: "0.7rem 0.9rem",
  margin: "0.6rem 0",
};

const keyBoxLabelStyle = {
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  color: "#1e40af",
  textTransform: "uppercase",
};

const keyValueStyle = {
  flex: 1,
  minWidth: "260px",
  fontFamily: "SFMono-Regular, Consolas, monospace",
  fontSize: "0.86rem",
  color: "#0f172a",
  wordBreak: "break-all",
};

const copyButtonStyle = {
  border: "1px solid #2563eb",
  background: "#ffffff",
  color: "#1e40af",
  borderRadius: "6px",
  padding: "0.32rem 0.7rem",
  fontSize: "0.8rem",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const usageRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  flexWrap: "wrap",
  margin: "0.5rem 0 0.9rem",
};

const usageTextStyle = { fontSize: "0.85rem", color: "#334155", whiteSpace: "nowrap" };

const usageNumStyle = { color: "#1e40af", fontSize: "1rem" };

const usageBarOuterStyle = {
  flex: 1,
  minWidth: "120px",
  height: "6px",
  background: "#e2e8f0",
  borderRadius: "999px",
  overflow: "hidden",
};

const usageBarInnerStyle = {
  display: "block",
  height: "100%",
  background: "linear-gradient(90deg, #2563eb, #1e3a8a)",
};

const usageMetaStyle = { fontSize: "0.78rem", color: "#94a3b8", whiteSpace: "nowrap" };

const noPlainNoteStyle = {
  fontSize: "0.82rem",
  color: "#b45309",
  background: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  padding: "0.55rem 0.7rem",
  margin: "0 0 0.6rem",
  lineHeight: 1.6,
};

const reissueLinkStyle = {
  border: "none",
  background: "none",
  padding: 0,
  marginTop: "0.8rem",
  fontSize: "0.78rem",
  color: "#94a3b8",
  textDecoration: "underline",
  cursor: "pointer",
};
const errorStyle = { fontSize: "0.85rem", color: "#b91c1c", margin: "0.4rem 0" };

