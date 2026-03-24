# insite-web 문서 구조

> 최종 정리: 2026-03-24

## 디렉토리 구조

```
docs/
├── README.md                  ← 이 파일 (문서 인덱스)
├── task-progress.md           ← 전체 진행 현황 (Single Source of Truth)
├── task-next.md               ← 다음 단계 로드맵 (Phase A~D)
│
├── reference/                 ← 개발 시 참조하는 살아있는 문서
│   ├── csp-was-api-spec.md    # csp-was 컨트롤러별 API 전체 스펙
│   ├── v1-api-reference.md    # v1(csp-web) HTML에서 추출한 API 호출 패턴
│   ├── v1-module-map.md       # v1 모듈 33개 상세 (HTML 파일 매핑)
│   ├── v1-modules-summary.md  # v1 vs v2 모듈 체크리스트 요약
│   ├── v1-gap-analysis.md     # v1 vs v2 기능 GAP 분석 (22개 미구현)
│   ├── csp-was-pageinfoid-issue.md  # [차단] pageInfoId 권한 이슈
│   └── upgrade-notes.md       # 패키지 메이저 업그레이드 이력
│
└── deprecated/                ← 완료/대체된 문서 (삭제 금지, 히스토리 보존)
    ├── README.md              # 폐기 사유 목록
    ├── comprehensive-review-plan.md   # 39건 보안/구현 이슈 → 모두 해결
    ├── browser-testing-tasklist.md    # v1 vs v2 브라우저 비교 → 완료
    ├── backend-changes.md             # 초기 백엔드 변경 요청 → 반영됨
    ├── phase-0/                       # Phase 0 초기 분석 (미완성/결정 완료)
    ├── ux-analysis/                   # UX 분석 → task-next.md에 반영 완료
    └── root-analysis/                 # 일회성 감사/분석 보고서 → 개선 반영 완료
```

---

## 활성 문서 (2개)

| 문서 | 용도 | 업데이트 주기 |
|------|------|-------------|
| `task-progress.md` | Phase 1~9 완료 현황, 종합검토 이슈 이력 | 매 Phase 완료 시 |
| `task-next.md` | Phase A~D 로드맵 (25개 태스크, ~38주) | 태스크 시작/완료 시 |

## 참조 문서 (7개)

| 문서 | 용도 | 사용 시점 |
|------|------|----------|
| `reference/csp-was-api-spec.md` | 백엔드 API 전체 목록 | 새 모듈 구현 시 |
| `reference/v1-api-reference.md` | v1 API 호출 패턴 | v1 동작 재현 시 |
| `reference/v1-module-map.md` | v1 모듈 상세 (585 HTML) | BEMS/BECM 구현 시 |
| `reference/v1-modules-summary.md` | v1 vs v2 모듈 체크리스트 | 진행률 확인 시 |
| `reference/v1-gap-analysis.md` | 미구현 22개 모듈 GAP | Phase D 계획 시 |
| `reference/csp-was-pageinfoid-issue.md` | pageInfoId 차단 이슈 | csp-was 수정 협의 시 |
| `reference/upgrade-notes.md` | 패키지 업그레이드 이력 | 의존성 문제 발생 시 |

## 개발 규칙 (.claude/rules/)

코드 작성 규칙은 `docs/`가 아닌 `.claude/rules/`에서 관리합니다.

| 규칙 파일 | 내용 |
|----------|------|
| `api-auth.md` | API 인증 패턴 (Bearer 토큰, 쿠키) |
| `auth.md` | JWT 처리, 토큰 저장, 인증 상태 |
| `building-context.md` | buildingId 자동 주입 |
| `coding-style.md` | TypeScript/React 코딩 규칙 |
| `component-patterns.md` | 목록/상세/폼 페이지 표준 |
| `design-system.md` | 컴포넌트 카탈로그, 상태 표현, 접근성 |
| `error-handling.md` | API 에러 처리, toast, 로그아웃 |
| `git-workflow.md` | 커밋/PR 규칙 |
| `menu-system.md` | 메뉴 & 권한 3계층 |
| `performance.md` | React Query staleTime, 최적화 |
| `security.md` | OWASP 보안 체크리스트 |
| `testing.md` | TDD, 커버리지 80% |
