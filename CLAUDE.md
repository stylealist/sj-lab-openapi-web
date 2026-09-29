# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

sj-lab 저장소를 넘나드는 작업의 총괄 기준 저장소는 `C:\developer\workspace\sj-lab`입니다.
전체 구조·API 계약은 그 저장소의 `docs/system-architecture.md`, 로컬 포트·기동 순서는 `docs/dev-environment.md`를 봅니다.

## 프로젝트 개요

공개 API 활용 페이지입니다. React 18 + Webpack(빌드 도구 구성은 `sj-lab-hub`와 같음), 라우터 없음,
스타일은 전부 인라인 style 객체(`xxxStyle`, 파일 하단 배치)입니다. 운영은 `sj-lab.co.kr/openapi/`,
로컬은 4100 포트입니다.

## 반드시 지킬 것

- **화면은 서버의 카탈로그(`GET /open-api/catalog`)로 그립니다.** API 목록·설명·파라미터·예시를 이 저장소에
  하드코딩하지 말 것 — 문서와 실제가 어긋납니다. 새 API가 늘면 `sj-lab-openapi`의 `api-catalog.json`만 고치면
  이 페이지에 자동으로 나타납니다.
- **API 호출 주소는 두 가지입니다.** 실제 호출은 `getApiBaseUrl()`(로컬은 빈 문자열 → webpack 프록시),
  화면·샘플 코드에 보여 주는 주소는 `getPublicBaseUrl()`(로컬도 `http://localhost:8100/open-api`)입니다.
  **화면에 프록시 주소(4100)를 보여 주지 말 것** — 밖에서 그 주소로는 부를 수 없습니다.
- **로컬 CORS는 webpack 프록시로 해결합니다**(`devServer.proxy`의 `/open-api`). 게이트웨이 CORS 목록에
  4100을 추가하는 방식으로 바꾸지 말 것 — 운영에는 없는 오리진입니다. 백엔드만 따로 띄워 확인할 때는
  `OPENAPI_PROXY_TARGET`으로 대상을 바꿉니다.
- **로그인 게이트 스크립트는 `public/index.html` 안에 인라인으로 유지할 것.** `HtmlWebpackPlugin`이 템플릿을
  그대로 복사하므로 별도 `public/*.js`는 `npm run build` 결과에 포함되지 않습니다. 같은 로직이 `sj-lab-hub`의
  `public/index.html`, `sj-lab-mapservice`의 `js/auth-gate.js`에도 있습니다 — **셋 중 하나를 고치면 나머지도 고칠 것.**
- **발급받은 키를 브라우저에 저장하지 말 것.** 화면 상태(`App.js`의 `apiKey`)로만 들고 있습니다 — `localStorage`에 넣으면 같은 브라우저를 쓰는 다른 사람에게 그대로 남습니다.
- 키 영역은 `GET /keys/status`의 `ready`가 참일 때만 목록·발급을 보여 줍니다. 준비되지 않은 환경에서 발급 버튼을 눌러도 503만 나오므로 상태 확인을 건너뛰지 말 것.
- 인라인 style 객체에서 `border`와 `borderColor`를 섞어 쓰지 말 것. 선택 상태를 `...baseStyle` 위에 덮어쓸 때
  `borderColor`만 바꾸면 React가 "shorthand 충돌" 경고를 냅니다 — 항상 `border` 한 줄로 덮어씁니다(2026-09-29 실제 발생).
- 응답 본문은 `prettyPrint()`가 길이를 잘라 보여 줍니다(기본 20,000자). 이 상한을 없애면 큰 GeoJSON에서
  브라우저가 멈춥니다.
- 검증은 `npm start` 후 브라우저(또는 헤드리스)로 직접 확인합니다. 테스트 프레임워크는 없습니다.

## 파일 구성

| 파일 | 역할 |
|---|---|
| `src/App.js` | 헤더 · 사이드바(API 목록) · 본문 배치, 카탈로그 로딩 |
| `src/components/ApiDetail.js` | 고른 API의 설명 · 파라미터 표 · 실행해 보기 · 응답 |
| `src/components/CodeSamples.js` | curl / JavaScript / Python 샘플 코드 |
| `src/components/KeyPanel.js` | 내 API 키 — 발급·목록·사용량·폐기, 실행에 쓸 키 고르기 |
| `src/api.js` | 주소 계산, 호출, 크기·시간 측정, 보기 좋게 출력 |
| `public/index.html` | 로그인 게이트(인라인) + 초기 로딩 화면 |
| `public/favicon.svg` | 허브 OpenAPI 카드와 같은 보라 그라데이션. 카드 색을 바꾸면 같이 고칠 것 |

## 현재 범위와 남은 작업

- **문서 + 실행해 보기 + 샘플 코드 + 내 API 키**까지입니다. 남은 것은 허브 카드 열기와 배포입니다.
- 허브(`sj-lab-hub`)의 OpenAPI 카드는 아직 `isAvailable: false`입니다. 배포 단계에서 엽니다.
