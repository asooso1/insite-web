# insite-web 종합 검토 및 수정 계획서

> 작성일: 2026-03-11
> 검토 범위: 보안, 구현 품질, 디자인 시스템, V1 호환성, 문서/규칙
> 검토 방법: 정적 코드 분석, OWASP Top 10, 유저 관점 UX 검토

---

## 1. 보안 이슈 (Security Issues)

### 🔴 CRITICAL (즉시 수정 필요)

#### S-1. Open Redirect 취약점
- **위치**: `src/components/forms/login-form.tsx:64-65`
- **문제**: `?redirect=https://evil.com` 파라미터를 검증 없이 `router.push()` 실행
- **영향**: 피싱 공격, 사용자 악성 사이트 유도
- **수정방향**: 내부 경로(`/`로 시작)만 허용, `javascript:` 등 프로토콜 차단

#### S-2. JWT_SECRET 하드코딩 폴백 (middleware.ts)
- **위치**: `src/middleware.ts:98`
- **코드**: `const secret = process.env.JWT_SECRET ?? "development-secret-key-32chars!!";`
- **문제**: JWT_SECRET 미설정 시 고정 문자열로 폴백 → 프로덕션 환경에서 JWT 위조 가능
- **영향**: 인증 완전 우회, 임의 JWT 발급 가능
- **참고**: `.env.local`은 git 커밋 이력 없음 (gitignore 정상 작동 중)
- **수정**:
  ```typescript
  // 금지
  const secret = process.env.JWT_SECRET ?? "development-secret-key-32chars!!";

  // 수정
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
  const secret = process.env.JWT_SECRET;
  ```

### 🟠 HIGH (1주일 내 수정)

#### S-3. RichTextEditor URL 주입 취약점 (XSS)
- **위치**: `src/components/third-party/rich-text-editor.tsx:118-135`
- **문제**: `window.prompt()`로 받은 URL을 검증 없이 링크/이미지로 삽입 (`javascript:` 허용)
- **수정**: URL 유효성 검사 (`http:`/`https:` 프로토콜만 허용)

#### S-4. DOMPurify XSS CVE (GHSA-v2wj-7wpq-c8vv)
- **위치**: `package.json` - `dompurify ^3.3.1`
- **문제**: 3.1.3~3.3.1 버전에 XSS 취약점, RichTextViewer가 HTML 샌이타이징 없이 렌더링
- **수정**: `dompurify@^3.4.0` 업그레이드 + RichTextViewer에 DOMPurify.sanitize() 적용

#### S-5. 메뉴 API URL 파라미터 주입
- **위치**: `src/app/api/services/menus/route.ts:16`
- **문제**: `buildingId` 파라미터 URL 인코딩 없이 백엔드 URL에 직접 연결
- **수정**: `URLSearchParams.set()` 사용

#### S-6. 로그인 엔드포인트 Rate Limiting 미적용
- **위치**: `src/app/api/auth/login/route.ts`
- **문제**: 브루트포스/크레덴셜 스터핑 공격 무방비
- **수정**: `@upstash/ratelimit` 적용 (15분 내 5회 제한)

### 🟡 MEDIUM (2주일 내 수정)

#### S-7. CORS Origin 검증 부재
- **위치**: 모든 API 라우트
- **문제**: Origin 헤더 미검증, 명시적 CORS 설정 없음

#### S-8. 로그인 폼 입력값 whitespace 미제거
- **위치**: `src/lib/validations/auth.ts`
- **문제**: `min(1)` 검증이 공백 문자열 허용 (`"   "` 유효)
- **수정**: `.transform(val => val.trim()).refine(...)` 추가

#### S-9. 미들웨어 JWT 만료 미검증
- **위치**: `src/middleware.ts:149-165`
- **문제**: 쿠키 존재 여부만 확인, 만료된 토큰으로 보호 페이지 접근 가능
- **수정**: 미들웨어에서 클라이언트사이드 만료 체크 추가

### 🔵 LOW (1달 내 개선)

#### S-10. CSP(Content Security Policy) 헤더 미설정
- **위치**: `next.config.ts`
- **수정**: `headers()` 함수에 CSP 헤더 추가

#### S-11. console.error 프로덕션 민감정보 노출
- **위치**: `src/lib/api/error-handler.ts:54, 78`
- **수정**: 개발 환경에서만 로그, 프로덕션은 Sentry 등 모니터링 서비스로

#### S-12. npm audit 취약점 (4건)
```
1. dompurify 3.1.3-3.3.1 (MODERATE) - XSS       → npm install dompurify@^3.4.0
2. minimatch ≤3.1.3 (HIGH)           - ReDoS     → npm audit fix
3. ajv <6.14.0 (MODERATE)           - ReDoS     → npm audit fix
4. rollup 4.0.0-4.58.0 (HIGH)       - Path Traversal → npm audit fix
```

---

## 2. 구현 품질 이슈 (Implementation Issues)

### 🔴 CRITICAL

#### I-1. AuthInitializer 경쟁 상태 (Race Condition)
- **위치**: `src/components/auth/auth-initializer.tsx:14-27`
- **문제**: `useEffect` 의존성에 `[isAuthenticated, setAuth]` 포함
  → Zustand 함수 참조 변경 시 무한 재실행 위험
- **수정**: `useRef`로 1회 실행 보장, 의존성 배열 `[]`로 변경

#### I-2. JWT 페이로드 런타임 검증 없음
- **위치**: `src/lib/auth/session.ts:26, 38`, `src/app/api/auth/login/route.ts:51`
- **문제**: `as unknown as JWTPayload` 강제 캐스팅 → 백엔드 구조 변경 시 무음 오류
- **수정**: Zod 스키마로 JWT 페이로드 런타임 검증

#### I-3. apiPostForm/apiPutForm 401 처리 누락
- **위치**: `src/lib/api/client.ts:173-237`
- **문제**: 파일 업로드 중 토큰 만료 시 `handleAuthExpired()` 미호출 → 비일관적 인증 상태
- **수정**: 401 응답 처리 로직 추가

### 🟠 HIGH

#### I-4. 로그아웃 에러 처리 누락 (사이드바/헤더 중복)
- **위치**: `src/components/layout/sidebar.tsx:570-574`, `src/components/layout/header.tsx:109-113`
- **문제**: fetch 실패 시 예외 미처리, 동일 로직 중복
- **수정**: 공용 `performLogout()` 유틸 추출 + try/finally 패턴

#### I-5. 미들웨어 토큰 만료 미검증
- **위치**: `src/middleware.ts`
- **문제**: 쿠키 존재만 확인, 만료 토큰으로 보호 페이지 접근 가능

#### I-6. React Query staleTime 미설정
- **위치**: `src/lib/hooks/` (대부분의 훅)
- **문제**: `staleTime` 기본값 0 → 페이지 이동마다 불필요한 API 재요청
- **수정**: 목록 30초, 상세 60초 표준화

#### I-7. 빌딩 전환 토큰 갱신 미구현
- **위치**: `src/lib/stores/tenant-store.ts`
- **문제**: V1에서 빌딩 전환 시 `PUT /api/account/token`으로 새 토큰 발급, V2는 미구현
- **영향**: 다중 빌딩 관리자의 권한 불일치

### 🟡 MEDIUM

#### I-8. 파일 다운로드 DOM 정리 누락
- **위치**: `src/lib/hooks/use-work-orders.ts:251-265`
- **문제**: 다운로드 실패 시 `<a>` 태그 DOM에 잔류
- **수정**: try/finally로 removeChild 보장

#### I-9. TenantStore localStorage 지속성 재검토
- **위치**: `src/lib/stores/tenant-store.ts:31-62`
- **문제**: 빌딩 ID가 localStorage에 지속 → 빌딩 ID 조작 가능성
- **수정**: 백엔드 권한 검증에 의존한다는 내용 명시적 주석 추가

#### I-10. 사이드바 서브메뉴 ARIA 속성 누락
- **위치**: `src/components/layout/sidebar.tsx:443, 485`
- **문제**: `aria-controls` 미설정, 서브메뉴 리스트 `role="list"` 누락
- **영향**: 접근성 불량, 스크린리더 사용자 혼란

#### I-11. 정적 메뉴 URL 매핑 확장성 문제
- **위치**: `src/lib/utils/menu-url-mapper.ts`
- **문제**: 29개 경로 하드코딩 → 새 모듈 추가 시 코드 배포 필수
- **개선 방향**: 백엔드 메뉴 API가 프론트엔드 경로 포함하도록 협의

---

## 3. 디자인 시스템 이슈 (Design System Issues)

### 일관성 문제

#### D-1. 목록 페이지 패턴 불일치
- **문제**: 일부 모듈은 DataTable, 일부는 카드 레이아웃 혼용
- **영향**: 유저가 모듈마다 다른 UX 패턴 학습 필요
- **기준**: DataTable을 모든 목록 페이지 표준으로 통일

#### D-2. 로딩/에러/빈 상태 처리 불일치
- **문제**: 일부는 Skeleton, 일부는 Spinner, 일부는 처리 없음
- **기준**:
  - 초기 로딩: Skeleton (컨텐츠 구조 반영)
  - 추가 로딩: Spinner (소형)
  - 에러: EmptyState with 오류 메시지 + 재시도 버튼
  - 빈 데이터: EmptyState with 등록 유도 버튼

#### D-3. 페이지 헤더 불일치
- **문제**: PageHeader 컴포넌트가 일부 페이지에서 미사용
- **기준**: 모든 모듈 페이지에 PageHeader 통일 사용

#### D-4. 폼 제출 UX 패턴 불일치
- **문제**: 성공/실패 피드백이 toast, alert, 콘솔 등 혼재
- **기준**: Sonner toast를 모든 폼 피드백 표준으로

#### D-5. 삭제 확인 다이얼로그 미표준화
- **문제**: 일부는 AlertDialog, 일부는 `confirm()` 사용
- **기준**: AlertDialog 컴포넌트 전용 사용

### 디자인 토큰 빈약함

#### D-6. 일관된 색상 시스템 부재
- **문제**: 상태 색상이 각 컴포넌트마다 하드코딩 (예: `text-green-600`, `text-blue-500`)
- **개선**: CSS 변수 기반 시맨틱 토큰 정의 (`--status-active`, `--status-inactive` 등)

#### D-7. 타이포그래피 계층 미정의
- **문제**: 폰트 크기/굵기가 각 컴포넌트마다 임의로 설정됨
- **개선**: Tailwind 커스텀 유틸리티 클래스 정의

#### D-8. 간격(Spacing) 비일관성
- **문제**: `p-4`, `p-6`, `p-3` 등 다양한 패딩 혼재
- **기준**: 카드 패딩 `p-6`, 섹션 패딩 `p-4`, 폼 필드 gap `gap-4`

---

## 4. V1 호환성 및 기능 갭 (User Perspective)

### 블로킹 이슈

#### V-1. pageInfoId 권한 체계 미구현 (BLOCKER)
- **참조**: `docs/csp-was-pageinfoid-issue.md`
- **문제**: csp-was JwtFilter가 JWT 검증 후 pageInfoId 기반 URL 권한 체크
- **현상**: 대부분의 비즈니스 API가 401 반환 (유효한 JWT에도 불구)
- **해결**: csp-was JwtFilter 수정 필요 - 백엔드 작업 필요

### 미구현 주요 기능 (V1 대비)

#### V-2. 빌딩 전환 시 토큰 갱신 미구현
- V1: `PUT /api/account/token` → 새 토큰으로 권한 재계산
- V2: Zustand state만 변경, 토큰 갱신 없음
- **영향**: 다중 빌딩 관리자 권한 오작동

#### V-3. BEMS/BECM 모듈 미구현 (추후 구현 예정)
- V1: BEMS 85개 화면, BECM 64개 화면
- V2: Phase 10-11으로 연기됨
- **영향**: 에너지 관리 업무 V1 병행 필수

#### V-4. 현장작업자 모바일 앱 기능 부재
- V1: 26개 모바일 화면 (대시보드, 출퇴근, 위치추적)
- V2: 모바일 레이아웃만 존재, 기능 미구현

#### V-5. 데이터 이력/타임라인 미구현
- V1: 각 모듈 변경 이력 추적
- V2: 작업지시만 타임라인 있음, 나머지 모듈 미구현

#### V-6. 분석 모듈 고급 기능 갭
- V1: 상세 에너지 분석, 40+ 필터, 실시간 차트
- V2: 기본 통계/트렌드만 구현

### URL/메뉴 구조 변경 (유저 충격)

#### V-7. 메뉴 URL 정적 매핑 동기화 문제
- 백엔드 메뉴 변경 시 프론트엔드 코드 배포 없이 반영 불가
- `src/lib/utils/menu-url-mapper.ts` 29개 경로 하드코딩

---

## 5. 문서/프로젝트 룰 정리

### 현재 .claude/rules/ 파일 현황 분석

| 파일 | 현황 | 조치 |
|------|------|------|
| coding-style.md | 양호, 실제 코드와 대체로 일치 | 보안 항목 추가 필요 |
| git-workflow.md | 양호 | 유지 |
| testing.md | 불완전 - 실제 테스트 거의 없음 | 현실화 필요 |
| performance.md | 양호, staleTime 기준 추가 필요 | 업데이트 필요 |
| security.md | 불완전 - 발견된 이슈들 반영 안됨 | 대폭 업데이트 필요 |

### docs → rules로 격상 필요한 내용

#### R-1. 인증 아키텍처 규칙 (신규 파일: auth.md)
- JWT 처리 패턴 (서명 검증 vs 만료 체크)
- Zod 스키마 검증 의무화 (JWT 페이로드, API 응답)
- 토큰 저장 규칙 (httpOnly 쿠키만, localStorage 금지)
- URL redirect 보안 (내부 경로만)

#### R-2. 에러 처리 표준 (신규 파일: error-handling.md)
- API 에러: `handleApiError()` 사용 의무화
- 사용자 피드백: Sonner toast 통일
- 로그아웃: try/finally 패턴 필수
- 파일 다운로드: DOM 정리 의무화
- 삭제 확인: AlertDialog 전용

#### R-3. 보안 체크리스트 강화 (security.md 업데이트)
현재 security.md에 누락된 항목:
- URL redirect 파라미터 검증 (내부 경로만 허용)
- RichText URL 입력 검증 (http/https만 허용)
- JWT 페이로드 Zod 검증 적용
- Rate limiting 적용 (인증 엔드포인트)
- CORS Origin 검증 (API 라우트)
- CSP 헤더 설정 확인
- npm audit 취약점 0건 유지

#### R-4. React Query 표준 (performance.md 추가)
- 목록 쿼리: `staleTime: 30 * 1000` (30초) 필수
- 상세 쿼리: `staleTime: 60 * 1000` (1분) 필수
- 실시간성 중요: `staleTime: 0` (주석으로 이유 명시)
- `refetchOnWindowFocus: false` (불필요한 재요청 방지)

#### R-5. 컴포넌트 패턴 표준 (신규 파일: component-patterns.md)
- 목록 페이지: DataTable + Skeleton + EmptyState
- 상세 페이지: InfoPanel + 탭 구조
- 폼 페이지: React Hook Form + Zod
- 접근성: ARIA 속성 체크리스트

#### R-6. 모듈별 CLAUDE.md 표준화
표준 구조 정의:
```
# {모듈명} 모듈

## 구현 상태
## 핵심 파일
## API 엔드포인트
## 알려진 이슈
```

---

## 6. 우선순위 실행 계획

### Phase A: 보안 긴급 수정 (이번 주)

| # | 태스크 | 파일 | 난이도 |
|---|--------|------|--------|
| A-1 | Open Redirect 수정 | `login-form.tsx` | 하 |
| A-2 | .env git 제거 + .gitignore | `.gitignore` + git history | 중 |
| A-3 | JWT_SECRET 하드코딩 폴백 제거 | `middleware.ts` | 하 |
| A-4 | RichTextEditor URL 검증 추가 | `rich-text-editor.tsx` | 하 |
| A-5 | DOMPurify 업그레이드 + 적용 | `package.json` + RichTextViewer | 하 |
| A-6 | npm audit fix | `package.json` | 하 |

### Phase B: 구현 안정성 (이번 주)

| # | 태스크 | 파일 | 난이도 |
|---|--------|------|--------|
| B-1 | AuthInitializer race condition | `auth-initializer.tsx` | 하 |
| B-2 | JWT Zod 런타임 검증 | `session.ts`, `login/route.ts` | 중 |
| B-3 | apiPostForm 401 처리 | `client.ts` | 하 |
| B-4 | 로그아웃 공통 유틸 추출 | `sidebar.tsx`, `header.tsx` | 하 |
| B-5 | React Query staleTime 표준화 | `src/lib/hooks/*.ts` | 중 |
| B-6 | 미들웨어 토큰 만료 체크 | `middleware.ts` | 하 |

### Phase C: 보안 강화 (다음 주)

| # | 태스크 | 파일 | 난이도 |
|---|--------|------|--------|
| C-1 | 메뉴 API URL 인코딩 | `menus/route.ts` | 하 |
| C-2 | Rate Limiting 적용 | `login/route.ts` | 중 |
| C-3 | 입력값 whitespace 정리 | `validations/auth.ts` | 하 |
| C-4 | CSP 헤더 설정 | `next.config.ts` | 중 |
| C-5 | CORS Origin 검증 | API 라우트 전체 | 중 |

### Phase D: UX 일관성 (다음 주)

| # | 태스크 | 파일 | 난이도 |
|---|--------|------|--------|
| D-1 | 로딩/에러/빈 상태 표준화 | 전 모듈 | 중 |
| D-2 | 폼 피드백 toast 통일 | 전 모듈 | 하 |
| D-3 | AlertDialog 표준화 | 전 모듈 | 하 |
| D-4 | 파일 다운로드 DOM 정리 | `use-work-orders.ts` 등 | 하 |
| D-5 | 사이드바 ARIA 속성 | `sidebar.tsx` | 하 |

### Phase E: V1 호환성 (백엔드 협력 필요)

| # | 태스크 | 파일 | 난이도 |
|---|--------|------|--------|
| E-1 | pageInfoId 백엔드 수정 요청 | csp-was JwtFilter.java | 백엔드 |
| E-2 | 빌딩 전환 토큰 갱신 | `tenant-store.ts` + API | 중 |

### Phase F: 문서 정비 (이번 달)

| # | 태스크 | 파일 | 난이도 |
|---|--------|------|--------|
| F-1 | auth.md 신규 작성 | `.claude/rules/auth.md` | 하 |
| F-2 | error-handling.md 신규 작성 | `.claude/rules/error-handling.md` | 하 |
| F-3 | security.md 업데이트 | `.claude/rules/security.md` | 하 |
| F-4 | performance.md 업데이트 | `.claude/rules/performance.md` | 하 |
| F-5 | component-patterns.md 신규 | `.claude/rules/component-patterns.md` | 하 |
| F-6 | 모듈별 CLAUDE.md 표준화 | 전 모듈 | 중 |

---

## 7. 총 이슈 요약

| 카테고리 | Critical | High | Medium | Low | 합계 |
|---------|---------|------|--------|-----|------|
| 보안 | 2 | 4 | 3 | 3 | **12** |
| 구현 품질 | 3 | 5 | 4 | 0 | **12** |
| 디자인 시스템 | 0 | 5 | 3 | 0 | **8** |
| V1 호환성 | 1 | 3 | 3 | 0 | **7** |
| **합계** | **6** | **17** | **13** | **3** | **39** |

---

*이 문서는 2026-03-11 종합 검토 결과를 바탕으로 작성되었습니다.*
*구현 우선순위: 보안 → 안정성 → UX → 문서 순서로 진행합니다.*
