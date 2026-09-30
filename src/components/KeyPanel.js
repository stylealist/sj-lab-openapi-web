import React, { useEffect, useState } from "react";
import { fetchKeyStatus, fetchMyKeys, issueKey, revokeKey } from "../api";

/**
 * 내 API 키 영역. 키를 발급하면 원문은 **그때 한 번만** 보여 준다(서버에 해시만 남는다).
 * 키 기능이 준비되지 않은 환경에서는 안내만 보여 주고, 공개 API 호출은 그대로 쓸 수 있다.
 */
function KeyPanel({ selectedKey, onSelectKey }) {
  const [status, setStatus] = useState(null);
  const [keys, setKeys] = useState([]);
  const [issued, setIssued] = useState(null);
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadKeys = () => {
    fetchMyKeys()
      .then((data) => setKeys(data ? data.items : []))
      .catch((error) => setMessage(error.message));
  };

  useEffect(() => {
    fetchKeyStatus().then((data) => {
      setStatus(data);
      if (data.ready) loadKeys();
    });
  }, []);

  const handleIssue = async () => {
    setBusy(true);
    setMessage("");
    try {
      const created = await issueKey(label);
      setIssued(created);
      setLabel("");
      loadKeys();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async (keyId, keyPrefix) => {
    if (!window.confirm(keyPrefix + " 키를 지울까요? 이 키로는 더 이상 부를 수 없습니다.")) return;
    setBusy(true);
    setMessage("");
    try {
      await revokeKey(keyId);
      if (issued && issued.keyId === keyId) setIssued(null);
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

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>내 API 키</h2>
      <p style={mutedStyle}>
        키를 붙여 부르면 호출이 기록되고 하루 한도가 적용됩니다. 키 없이도 부를 수 있습니다.
        키는 <strong>계정당 1개</strong>입니다.
      </p>

      {/* 계정당 1개라, 이미 있으면 발급 영역을 감춘다 — 눌러도 서버가 409 만 돌려준다.
          새로 받으려면 아래 목록에서 폐기하면 이 영역이 다시 나타난다. */}
      {keys.length === 0 ? (
        <div style={issueRowStyle}>
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="키 이름 (예: 테스트용)"
            style={inputStyle}
          />
          <button type="button" style={primaryButtonStyle} onClick={handleIssue} disabled={busy}>
            키 발급
          </button>
        </div>
      ) : (
        <p style={mutedStyle}>
          이미 발급한 키가 있습니다. 새로 받으려면 아래에서 폐기한 뒤 다시 발급하세요.
        </p>
      )}

      {issued && (
        <div style={issuedBoxStyle}>
          <div style={issuedNoticeStyle}>{issued.notice}</div>
          <code style={issuedKeyStyle}>{issued.apiKey}</code>
          <button
            type="button"
            style={ghostButtonStyle}
            onClick={() => navigator.clipboard.writeText(issued.apiKey)}
          >
            복사
          </button>
        </div>
      )}

      {message && <p style={errorStyle}>{message}</p>}

      {keys.length === 0 ? (
        <p style={mutedStyle}>아직 발급한 키가 없습니다.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>키</th>
              <th style={thStyle}>이름</th>
              <th style={thStyle}>오늘 사용</th>
              <th style={thStyle}>마지막 사용</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key.keyId}>
                <td style={tdStyle}>
                  <code>{key.keyPrefix}…</code>
                </td>
                <td style={tdStyle}>{key.label}</td>
                <td style={tdStyle}>
                  {key.todayCount} / {key.dailyQuota}
                </td>
                <td style={tdStyle}>{key.lastUsedAt || "-"}</td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    style={ghostButtonStyle}
                    onClick={() => handleRevoke(key.keyId, key.keyPrefix)}
                    disabled={busy}
                  >
                    지우기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={useKeyRowStyle}>
        <label style={useKeyLabelStyle}>
          실행해 보기에 쓸 키
          <input
            type="text"
            value={selectedKey}
            onChange={(event) => onSelectKey(event.target.value)}
            placeholder="발급받은 키를 붙여 넣으면 호출에 함께 보냅니다"
            style={{ ...inputStyle, marginLeft: "0.5rem", minWidth: "320px" }}
          />
        </label>
        {issued && (
          <button type="button" style={ghostButtonStyle} onClick={() => onSelectKey(issued.apiKey)}>
            방금 발급한 키 쓰기
          </button>
        )}
      </div>
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

const issueRowStyle = { display: "flex", gap: "0.5rem", margin: "0.8rem 0" };

const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0.45rem 0.6rem",
  fontSize: "0.85rem",
  color: "#0f172a",
  minWidth: "220px",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "0.45rem 1rem",
  fontSize: "0.86rem",
  cursor: "pointer",
};

const ghostButtonStyle = {
  background: "#ffffff",
  color: "#475569",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0.35rem 0.6rem",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const issuedBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "0.7rem 0.8rem",
  marginBottom: "0.8rem",
};

const issuedNoticeStyle = { width: "100%", fontSize: "0.82rem", color: "#1d4ed8" };

const issuedKeyStyle = {
  flex: 1,
  minWidth: "260px",
  background: "#0f172a",
  color: "#e2e8f0",
  borderRadius: "6px",
  padding: "0.45rem 0.6rem",
  fontSize: "0.8rem",
  wordBreak: "break-all",
};

const errorStyle = { fontSize: "0.85rem", color: "#b91c1c", margin: "0.4rem 0" };

const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginTop: "0.6rem" };

const thStyle = {
  textAlign: "left",
  color: "#64748b",
  fontWeight: 500,
  fontSize: "0.75rem",
  padding: "0.4rem 0.5rem",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = { padding: "0.5rem", borderBottom: "1px solid #f1f5f9", color: "#334155" };

const useKeyRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  flexWrap: "wrap",
  marginTop: "0.9rem",
  paddingTop: "0.8rem",
  borderTop: "1px solid #f1f5f9",
};

const useKeyLabelStyle = { fontSize: "0.85rem", color: "#334155", display: "flex", alignItems: "center" };
