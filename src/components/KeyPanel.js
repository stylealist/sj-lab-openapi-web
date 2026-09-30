import React, { useEffect, useState } from "react";
import { fetchKeyStatus, fetchMyKeys, revokeKey } from "../api";

/**
 * 내 API 키 영역. 키를 발급하면 원문은 **그때 한 번만** 보여 준다(서버에 해시만 남는다).
 * 키 기능이 준비되지 않은 환경에서는 안내만 보여 주고, 공개 API 호출은 그대로 쓸 수 있다.
 */
function KeyPanel({ selectedKey, onSelectKey, usageTick }) {
  const [status, setStatus] = useState(null);
  const [keys, setKeys] = useState([]);
  const [issued, setIssued] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // 서버는 키가 없으면 목록을 줄 때 한 개를 자동으로 배정하고, 그때만 원문(issued)을 함께 준다.
  // 원문은 저장되지 않으니 이 한 번을 놓치면 다시 볼 수 없다 — 받으면 바로 화면에 띄우고 골라 둔다.
  const loadKeys = () => {
    fetchMyKeys()
      .then((data) => {
        setKeys(data ? data.items : []);
        if (data && data.issued) {
          setIssued(data.issued);
          onSelectKey(data.issued.apiKey);
        }
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

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>내 API 키</h2>
      <p style={mutedStyle}>
        키는 <strong>계정마다 1개</strong>가 자동으로 배정됩니다. 이 화면의 <strong>실행해 보기는
        로그인만으로 동작</strong>하고, 호출은 아래 사용량에 기록됩니다.
        키 원문은 <strong>밖에서 curl·코드로 부를 때</strong> 쓰며, 배정되는 순간에만 한 번 보여 드립니다.
      </p>

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

      {/* 키를 고르는 자리. 표 아래가 아니라 위에 둔다 — 실행해 보기가 이 값을 쓰기 때문에
          여기서 비어 있으면 키 없이 호출되고 사용량도 오르지 않는다. */}
      {/* 키 원문을 굳이 넣지 않아도 로그인 토큰으로 호출된다. 원문을 아는 사람(방금 배정받았거나
          복사해 둔 경우)은 여기에 넣어 그 키로 부르는지 확인할 수 있다. */}
      {keys.length > 0 && (
        <div style={useKeyRowStyle}>
          <label style={useKeyLabelStyle}>
            키 원문으로 호출(선택)
            <input
              type="text"
              value={selectedKey}
              onChange={(event) => onSelectKey(event.target.value)}
              placeholder="비워 두면 로그인 상태로 호출합니다"
              style={{ ...inputStyle, marginLeft: "0.5rem", minWidth: "320px" }}
            />
          </label>
          {issued && issued.apiKey !== selectedKey && (
            <button type="button" style={ghostButtonStyle} onClick={() => onSelectKey(issued.apiKey)}>
              배정된 키 넣기
            </button>
          )}
          {selectedKey ? (
            <span style={keyOnStyle}>이 키로 호출합니다 · 사용량에 반영됩니다</span>
          ) : (
            <span style={keyOnStyle}>로그인 상태로 호출합니다 · 사용량에 반영됩니다</span>
          )}
        </div>
      )}

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
                    onClick={() => handleReissue(key.keyId, key.keyPrefix)}
                    disabled={busy}
                  >
                    키 다시 만들기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0.45rem 0.6rem",
  fontSize: "0.85rem",
  color: "#0f172a",
  minWidth: "220px",
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

const keyOnStyle = { fontSize: "0.8rem", color: "#1e40af", fontWeight: 500 };

const keyOffStyle = { fontSize: "0.8rem", color: "#b45309" };
