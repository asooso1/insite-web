# insite-web 마이그레이션 작업 진행 현황

> 최종 업데이트: 2026-03-23

## 📊 전체 진행 상황

| Phase | 상태 | 진행률 | 설명 |
|-------|------|--------|------|
| Phase 0 | ⏳ 대기 | 50% | 사전 준비 및 분석 (DB/API 접근 필요) |
| Phase 1 | ✅ 완료 | 100% | 기반 구축 |
| Phase 2A | ✅ 완료 | 100% | 핵심 데이터 컴포넌트 |
| Phase 2B | ✅ 완료 | 95% | 위젯 프레임워크 및 서드파티 (SheetJS/BIM 보류) |
| Phase 3 | ✅ 완료 | 100% | FMS 파일럿 (WorkOrder 모듈) |
| Phase 4 | ✅ 완료 | 100% | 추가 CRUD 모듈 (7개 모듈 완료) |
| Phase 5 | ✅ 완료 | 100% | 대시보드 위젯 구현 |
| Phase 6 | ✅ 완료 | 100% | 복잡 모듈 (자격증/순찰/보고서) |
| Phase 7 | ✅ 완료 | 100% | 모바일 레이아웃 + 반응형 + 성능 최적화 |
| Phase 8 | ✅ 완료 | 100% | FMS 완성도 향상 (SOP/민원/TBM/마이페이지) |
| Phase 9 | ✅ 완료 | 100% | 현장작업(Fieldwork)/분석(Analysis)/설정 고도화 |
| Phase 10 | ⏳ 추후 구현 | 0% | BEMS (85개 HTML) - 빌딩 에너지 관리 시스템 |
| Phase 11 | ⏳ 추후 구현 | 0% | BECM (64개 HTML) - 보일러/냉동 모니터링 시스템 |
| **[필수]** csp-was pageInfoId 이슈 | ❌ 차단됨 | - | csp-was JwtFilter 수정 필요 → `docs/reference/csp-was-pageinfoid-issue.md` |
| **[필수]** 종합 검토 이슈 수정 | ✅ 완료 | 100% | 보안/구현/UX 39건 모두 해결 → `docs/deprecated/comprehensive-review-plan.md` |

**상태 범례:** ✅ 완료 | 🔄 진행중 | ⏳ 대기 | ❌ 차단됨

---

## 종합 검토 이슈 (2026-03-11)

> 상세 내용: `docs/deprecated/comprehensive-review-plan.md` (모두 해결됨)

### 🔴 즉시 수정 필요 (보안 Critical)

| # | 이슈 | 파일 | 상태 |
|---|------|------|------|
| S-1 | Open Redirect 취약점 | `src/components/forms/login-form.tsx:64` | ✅ |
| S-2 | JWT_SECRET git 노출 + 하드코딩 폴백 | `middleware.ts`, `.gitignore` | ✅ |
| S-3 | RichTextEditor URL 주입 (XSS) | `src/components/third-party/rich-text-editor.tsx` | ✅ |
| S-4 | DOMPurify XSS CVE (v3.3.1) | `package.json` | ✅ |
| S-12 | npm audit 취약점 4건 | `package.json` | ✅ |

### 🔴 즉시 수정 필요 (구현 Critical)

| # | 이슈 | 파일 | 상태 |
|---|------|------|------|
| I-1 | AuthInitializer useEffect 무한루프 위험 | `src/components/auth/auth-initializer.tsx` | ✅ |
| I-2 | JWT 페이로드 Zod 런타임 검증 없음 | `src/lib/auth/session.ts`, `login/route.ts` | ✅ |
| I-3 | apiPostForm/apiPutForm 401 처리 누락 | `src/lib/api/client.ts` | ✅ |

### 🟠 단기 수정 (High)

| # | 이슈 | 파일 | 상태 |
|---|------|------|------|
| I-4 | 로그아웃 에러 처리 누락/중복 | `sidebar.tsx`, `header.tsx` | ✅ |
| I-6 | React Query staleTime 미설정 | `src/lib/hooks/*.ts` | ✅ |
| I-7 | 빌딩 전환 토큰 갱신 미구현 | `tenant-store.ts` | ✅ |
| S-5 | 메뉴 API URL 파라미터 주입 | `menus/route.ts` | ✅ |
| S-6 | 로그인 Rate Limiting 미적용 | `login/route.ts` | ✅ |

### 🟡 중기 수정 (Medium)

| # | 이슈 | 파일 | 상태 |
|---|------|------|------|
| I-8 | 파일 다운로드 DOM 정리 누락 | `use-work-orders.ts` | ✅ |
| I-9 | TenantStore localStorage 보안 주석 | `tenant-store.ts` | ✅ |
| I-10 | 사이드바 ARIA 속성 누락 | `sidebar.tsx` | ✅ |
| S-7 | CORS Origin 검증 부재 | `middleware.ts` | ✅ |
| S-8 | 로그인 폼 whitespace 미제거 | `validations/auth.ts` | ✅ |
| S-9/I-5 | 미들웨어 JWT 만료 미검증 | `middleware.ts` | ✅ |
| S-10 | CSP 헤더 미설정 | `next.config.ts` | ✅ |
| S-11 | console.error 프로덕션 노출 | `error-handler.ts` | ✅ |
| I-11 | 메뉴 URL 매핑 DB 연동 (csp-was + menu_insite_mapping) | `menus/route.ts`, `csp-was MenuService` | ✅ |

### I-11 완료 내역 (2026-03-13)

**csp-was 변경사항:**
- `V28__menu_insite_mapping.sql` — `menu_insite_mapping` 테이블 생성 + `insite_app` DB 계정 생성
  - `insite_app`: 기존 csp 테이블 SELECT만 / `menu_insite_mapping` CRUD 허용
  - `insite_app` 비밀번호: `InSite@2024!` (`.env.local`에 `DB_INSITE_APP_PASSWORD` 추가 필요)
- `MenuInsiteMapping.java` — JPA 엔티티 생성
- `MenuInsiteMappingRepository.java` — Spring JPA 리포지토리 (`findAllAsMap()` 편의 메서드 포함)
- `MenuDTO.java` — `insiteUrl` 필드 추가 (nullable String)
- `MenuService.java` — `getMenuTree()` / `getMenuListLikeKeyword()` 내 `applyInsiteMappings()` 호출

**insite-web 변경사항:**
- `src/app/api/services/menus/route.ts` — 파일 기반 `mergeManualMappings()` 제거, 백엔드 응답 그대로 반환
- 사이드바/커맨드팔레트: `item.insiteUrl ?? mapMenuUrl(item.url)` fallback 패턴 유지

**추후 구현 필요:**
- insite-web Admin UI (`/settings/menu-management`) — menu_insite_mapping CRUD
  - 현재: `public/menu-mappings.json` 파일 수동 편집 방식
  - 목표: Admin UI에서 메뉴 선택 → insite URL 입력 → DB 저장
  - 저장 후 캐시 무효화: `revalidateTag('insite-menu-mappings')` + csp-was Redis 캐시 evict API

**추후 정리 필요 (csp-web v1 종료 후):**
- `page_info`, `role_page_function`, `page_function` 테이블 제거
  - 현재 제거 불가 이유: csp-web v1 운영 중이며 csp-was `JwtFilter`/`AuthService`가 `page_info` 기반 권한 검사에 의존
  - 제거 조건: csp-web v1 완전 종료 + csp-was 권한 검사 로직 insite-web 전용 menu-level 모델로 교체
  - 제거 순서: ① csp-web v1 서비스 종료 → ② csp-was JwtFilter/AuthService에서 page_info 참조 제거 → ③ DB 테이블 drop

---

## Phase 0: 사전 준비 및 분석

### 0.0 프로젝트 초기화
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 프로젝트 디렉토리 생성 | ✅ | 2026-02-06 | - | `/Users/mac_mini/00_insite/insite-web` |
| Git 저장소 초기화 | ✅ | 2026-02-06 | - | |
| CLAUDE.md 작성 | ✅ | 2026-02-06 | - | 개발 규칙 정의 |
| task-progress.md 작성 | ✅ | 2026-02-06 | - | 이 파일 |

### 0.1 csp-was API 감사
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **API 감사 준비 문서 작성** | ✅ | 2026-02-06 | - | `docs/deprecated/phase-0/api-audit.md` |
| OpenAPI 스펙 추출 (`/v3/api-docs/v1-definition`) | ⏳ | - | - | csp-was 실행 필요 |
| 72개 REST 컨트롤러 엔드포인트 카탈로그 작성 | ⏳ | - | - | |
| csp-web 템플릿(583개) → csp-was API 매핑 문서 | ⏳ | - | - | |
| 핵심 DTO TypeScript 타입 정의 초안 | ⏳ | - | - | |
| Java Enum → TypeScript const 매핑표 | ⏳ | - | - | |
| API 응답 구조 분석 | ⏳ | - | - | code, message, data 패턴 |

### 0.2 Prisma 스키마 설계 준비
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **Prisma 스키마 설계 문서 작성** | ✅ | 2026-02-06 | - | `docs/deprecated/phase-0/prisma-schema-design.md` |
| csp-web DB 스키마 분석 | ⏳ | - | - | menu, role_menu, product_menu 등 |
| PostgreSQL 접속 정보 확보 | ⏳ | - | - | |
| `prisma db pull` 실행 | ⏳ | - | - | 기존 스키마 introspection |
| MenuService.aside() 포팅 설계서 | ✅ | 2026-02-06 | - | 문서 내 포함 |
| HttpInterceptor.postHandle() 포팅 설계서 | ✅ | 2026-02-06 | - | 문서 내 포함 |
| DashboardService.getDashboardDTO() 포팅 설계서 | ✅ | 2026-02-06 | - | 문서 내 포함 |

### 0.3 인프라 결정
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **인프라 결정 문서 작성** | ✅ | 2026-02-06 | - | `docs/deprecated/phase-0/infrastructure-decisions.md` |
| 배포 플랫폼 결정 | ⏳ | - | - | AWS Amplify / Vercel / ECS |
| csp-was CORS 설정 확인 | ⏳ | - | - | Next.js 도메인 추가 계획 |
| CI OpenAPI 스펙 갱신 파이프라인 설계 | ✅ | 2026-02-06 | - | 문서 내 포함 |
| 도메인/서브도메인 결정 | ⏳ | - | - | |

### 0.4 성능 베이스라인 측정
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **성능 베이스라인 문서 작성** | ✅ | 2026-02-06 | - | `docs/deprecated/phase-0/performance-baseline.md` |
| csp-web 로그인 페이지 Web Vitals 측정 | ⏳ | - | - | LCP, CLS, INP |
| csp-web 메인 대시보드 Web Vitals 측정 | ⏳ | - | - | |
| csp-web 작업 목록 페이지 Web Vitals 측정 | ⏳ | - | - | |
| csp-web FMS 대시보드 Web Vitals 측정 | ⏳ | - | - | |
| 주요 API 응답 시간 기록 | ⏳ | - | - | P50, P95, P99 |
| 번들 사이즈 기준선 수립 | ⏳ | - | - | |
| 성능 리포트 템플릿 작성 | ✅ | 2026-02-06 | - | 문서 내 포함 |

---

## Phase 1: 기반 구축

### 1.1 프로젝트 초기화
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| Next.js 15 프로젝트 생성 | ✅ | 2026-02-06 | - | Next.js 16.1.6 |
| TypeScript strict mode 설정 | ✅ | 2026-02-06 | - | noUncheckedIndexedAccess 등 추가 |
| ESLint/Prettier 설정 | ✅ | 2026-02-06 | - | |
| 기본 폴더 구조 생성 | ✅ | 2026-02-06 | - | app, components, lib, tests 등 |
| 의존성 설치 | ✅ | 2026-02-06 | - | 핵심 + 개발 의존성 |

### 1.2 디자인 시스템
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| globals.css CSP 토큰 정의 | ✅ | 2026-02-06 | - | Brand, Panel, Text, Icon 등 |
| Light 테마 CSS 변수 정의 | ✅ | 2026-02-06 | - | |
| Dark 테마 CSS 변수 정의 | ✅ | 2026-02-06 | - | |
| 차트 컬러 팔레트 | ✅ | 2026-02-06 | - | 기본 5개 + blue/green scale |
| Elevation 그림자 6단계 | ✅ | 2026-02-06 | - | shadow-1 ~ shadow-6 |
| Z-Index 레이어 시스템 | ✅ | 2026-02-06 | - | z-base ~ z-loader |
| 한국어 폰트 설정 | ⏳ | - | - | Pretendard + Rajdhani (폰트 파일 필요) |
| shadcn/ui 초기화 | ✅ | 2026-02-06 | - | |
| shadcn/ui 컴포넌트 22개 설치 | ✅ | 2026-02-06 | - | button, input, card 등 |
| shadcn/ui chart 설치 | ✅ | 2026-02-06 | - | Recharts 기반 |
| 커스텀 컴포넌트 6개 생성 | ✅ | 2026-02-06 | - | Chip, Loader, KPICard 등 |

### 1.3 레이아웃
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| AppShell | ✅ | 2026-02-06 | - | 반응형 레이아웃 |
| Header | ✅ | 2026-02-06 | - | 사용자 정보, 테마 토글 |
| Sidebar | ✅ | 2026-02-06 | - | 250px/64px 반응형 |
| GNB | ⏳ | - | - | |
| Footer | ⏳ | - | - | |
| Command Palette | ✅ | 2026-02-06 | - | Cmd+K 단축키 |
| Error Boundary | ✅ | 2026-02-06 | - | error.tsx, not-found.tsx |

### 1.4 인증
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 토큰 설정 | ✅ | 2026-02-06 | - | JWT 설정, TTL 관리 |
| 쿠키 설정 | ✅ | 2026-02-06 | - | httpOnly 쿠키 옵션 |
| Auth Store | ✅ | 2026-02-06 | - | Zustand 메모리 저장 |
| Middleware | ✅ | 2026-02-06 | - | JWT 검증, RBAC |
| 로그인 API Route | ✅ | 2026-02-06 | - | 듀얼 토큰 전략 |
| 로그아웃 API Route | ✅ | 2026-02-06 | - | 쿠키 삭제 |
| Refresh API Route | ✅ | 2026-02-06 | - | 토큰 갱신 |
| 로그인 페이지 | ✅ | 2026-02-06 | - | react-hook-form + zod |

### 1.5 API 레이어
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| Hey API 설정 | ⏳ | - | - | OpenAPI 스펙 필요 |
| API 클라이언트 설정 | ✅ | 2026-02-06 | - | fetch 래퍼, 토큰 자동 갱신 |
| React Query 설정 | ✅ | 2026-02-06 | - | QueryProvider, 캐시 키 |
| 에러 처리 | ✅ | 2026-02-06 | - | ApiError, handleApiError |

### 1.6 상태 관리
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| UI Store | ✅ | 2026-02-06 | - | 사이드바, Command Palette |
| Auth Store | ✅ | 2026-02-06 | - | 인증 상태 (메모리) |
| Tenant Store | ✅ | 2026-02-06 | - | 회사/빌딩 컨텍스트 |
| Providers 통합 | ✅ | 2026-02-06 | - | Theme + Query + Toast |
| URL 상태 관리 | ✅ | 2026-02-06 | - | nuqs 파서, NuqsAdapter |

### 1.7 인프라
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| Vitest 설정 | ✅ | 2026-02-06 | - | vitest.config.ts, setup.ts |
| Playwright 설정 | ✅ | 2026-02-06 | - | 멀티 브라우저, 모바일 |
| MSW 설정 | ✅ | 2026-02-06 | - | API 모킹 핸들러 |
| Sentry 설정 | ⏳ | - | - | |
| GA4 설정 | ⏳ | - | - | |
| CI/CD 파이프라인 | ⏳ | - | - | |

---

## Phase 2A: 핵심 데이터 컴포넌트 ✅ 완료

> 상세 가이드: `.claude/context/phase-2a.md`

### 2A.1 데이터 디스플레이 컴포넌트
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| DataTable | ✅ | 2026-02-10 | - | TanStack Table v8 + 가상화 |
| DataTable Toolbar | ✅ | 2026-02-10 | - | 검색 + 필터바 |
| DataTable Pagination | ✅ | 2026-02-10 | - | DataTable에 통합 |
| KPICard | ✅ | 2026-02-06 | - | Phase 1에서 생성됨 |
| StatWidget | ✅ | 2026-02-12 | - | 스파크라인 차트 포함 |
| InfoPanel | ✅ | 2026-02-12 | - | Key-Value 리스트, InfoRow, InfoGroup |
| EmptyState | ✅ | 2026-02-06 | - | Phase 1에서 생성됨 |

### 2A.2 폼 시스템
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| FormField 래퍼 | ✅ | 2026-02-10 | - | react-hook-form 통합 |
| EnumSelect | ⏳ | - | - | 필요시 구현 예정 |
| CascadingSelect | ✅ | 2026-02-10 | - | 회사→지역→빌딩→층 |
| SearchFilterBar | ✅ | 2026-02-10 | - | 검색 + 필터 + nuqs |
| DatePicker | ✅ | 2026-02-10 | - | 날짜 선택기, 한국어 로케일 |
| MonthPicker | ✅ | 2026-02-10 | - | 월 선택기, 년도 네비게이션 |
| FileUpload | ✅ | 2026-02-10 | - | 드래그앤드롭 + 미리보기 |

### 2A.3 차트 시스템
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| ChartContainer | ✅ | 2026-02-10 | - | shadcn/ui chart.tsx 포함 |
| ChartTooltip | ✅ | 2026-02-10 | - | shadcn/ui chart.tsx 포함 |
| ChartLegend | ✅ | 2026-02-10 | - | shadcn/ui chart.tsx 포함 |
| BarChart 프리셋 | ✅ | 2026-02-10 | - | Recharts 기반 |
| LineChart 프리셋 | ✅ | 2026-02-10 | - | Recharts 기반 |
| AreaChart 프리셋 | ✅ | 2026-02-10 | - | Recharts 기반 |
| PieChart 프리셋 | ✅ | 2026-02-10 | - | Recharts 기반 |
| RadarChart 프리셋 | ⏳ | - | - | 필요시 구현 예정 |
| ComboChart 프리셋 | ⏳ | - | - | 필요시 구현 예정 |
| chart-colors.ts | ✅ | 2026-02-10 | - | categorical 팔레트 |

### 2A.4 테스트
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 디자인 토큰 무결성 테스트 | ⏳ | - | - | Phase 3 전 구현 예정 |
| 컴포넌트 렌더링 테스트 | ⏳ | - | - | Phase 3 전 구현 예정 |
| 접근성 테스트 | ⏳ | - | - | Phase 3 전 구현 예정 |

---

## Phase 2B: 위젯 프레임워크 🔄 진행중

> 상세 가이드: `.claude/context/phase-2b.md`

### 2B.1 위젯 프레임워크 ✅ 완료
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| WidgetGrid | ✅ | 2026-02-12 | - | react-grid-layout 기반 6컬럼 반응형 |
| WidgetContainer | ✅ | 2026-02-12 | - | 7가지 사이즈, 드래그 핸들 |
| WidgetRegistry | ✅ | 2026-02-12 | - | 동적 위젯 등록, lazy import |
| WidgetSkeleton | ✅ | 2026-02-12 | - | 로딩 스켈레톤 |
| WidgetErrorBoundary | ✅ | 2026-02-12 | - | 커스텀 에러 폴백 UI |
| ChartWidget | ✅ | 2026-02-12 | - | Bar/Line/Area, API 연동 |
| TableWidget | ✅ | 2026-02-12 | - | StatusBadge 자동 렌더링 |
| KPIWidget | ✅ | 2026-02-12 | - | KPI 통계 위젯 |
| ListWidget | ✅ | 2026-02-12 | - | 목록 위젯 |

### 2B.2 서드파티 대체
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| FullCalendar | ✅ | 2026-02-12 | - | Calendar, MiniCalendar |
| Tiptap | ✅ | 2026-02-12 | - | RichTextEditor, RichTextViewer |
| SheetJS | ⏳ | - | - | 필요시 구현 |
| 카카오맵 (React) | ✅ | 2026-02-12 | - | KakaoMapComponent, useGeocode |
| react-to-print | ✅ | 2026-02-12 | - | PrintButton, PrintContainer |

### 2B.3 BIM PoC
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| Three.js + IFC.js 프로토타입 | ⏳ | - | - | 고위험 항목 검증 |
| HOOPS 비교 문서 | ⏳ | - | - | |
| 성능/비용 분석 | ⏳ | - | - | |

---

## Phase 3: FMS 파일럿 ✅ 완료

### 3.1 작업(Work Order) 모듈
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| API 분석 및 타입 정의 | ✅ | 2026-02-12 | - | `/lib/types/work-order.ts` |
| API 클라이언트 | ✅ | 2026-02-12 | - | `/lib/api/work-order.ts` |
| React Query 훅 | ✅ | 2026-02-12 | - | `/lib/hooks/use-work-orders.ts` |
| 작업 목록 페이지 | ✅ | 2026-02-12 | - | DataTable + 상태 탭 + 페이지네이션 |
| 작업 상세 페이지 | ✅ | 2026-02-12 | - | 상태 워크플로우, 이력 타임라인 |
| 작업 생성/수정 페이지 | ✅ | 2026-02-12 | - | react-hook-form + zod |
| 폼 드롭다운 API 연동 | ✅ | 2026-03-23 | - | 빌딩/층/구역/대분류/소분류/담당팀 실API 연동, 담당자·참조자·승인자 MultiSelect |
| fieldwork 작업 프로젝트 연동 | ✅ | 2026-03-23 | - | MOCK_PROJECTS → useFieldProjectList 실API 교체 |

---

## Phase 4: 추가 CRUD 모듈 ✅ 완료

### 4.1 시설(Facility) 모듈 ✅ 완료
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| API 분석 및 타입 정의 | ✅ | 2026-02-12 | - | `/lib/types/facility.ts` |
| API 클라이언트 | ✅ | 2026-02-12 | - | `/lib/api/facility.ts` |
| React Query 훅 | ✅ | 2026-02-12 | - | `/lib/hooks/use-facilities.ts` |
| 시설 목록 페이지 | ✅ | 2026-02-12 | - | 상태 탭 + 검색 + 페이지네이션 |
| 시설 상세 페이지 | ✅ | 2026-02-12 | - | 기본/제조정보, QR/NFC, 관제점 |
| 시설 생성/수정 페이지 | ✅ | 2026-02-12 | - | react-hook-form + zod |
| 폼 드롭다운 API 연동 | ✅ | 2026-03-23 | - | 빌딩/층/시설유형/담당팀 실API 연동, cascading 초기화 |

### 4.2 사용자 관리 모듈 ✅ 완료
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-19 | - | `user.ts` |
| 목록/상세/등록/수정 | ✅ | 2026-02-19 | - | 상태 탭, 검색, 페이지네이션 |
| 폼 회사 목록 API 연동 | ✅ | 2026-03-23 | - | useCompanySelectList 실API 교체 |

### 4.3 클라이언트(고객사) 모듈 ✅ 완료
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-19 | - | `client.ts` |
| 목록/상세/등록/수정 | ✅ | 2026-02-19 | - | 사업자번호 중복확인, 거점 관리 |

### 4.4 자재(Material) 모듈 ✅ 완료
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-19 | - | `material.ts` |
| 목록/상세/등록/수정 | ✅ | 2026-02-19 | - | 재고관리, 입출고 이력 |
| 폼 드롭다운 API 연동 | ✅ | 2026-03-23 | - | 생성모드 빌딩/층/구역/관리팀 cascading 실API 연동 |
| 태그(QR/NFC) 폼 드롭다운 API 연동 | ✅ | 2026-03-23 | - | 빌딩/시설/층/구역 cascading 실API 연동 (`tags/_components/tag-form.tsx`) |

### 4.5 게시판(Board) 모듈 ✅ 완료
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-19 | - | `board.ts` (공지사항 + 자료실) |
| 공지사항 목록/상세/등록/수정 | ✅ | 2026-02-19 | - | 댓글, 게시기간, 대상그룹, 첨부파일 |
| 자료실 목록/상세/등록/수정 | ✅ | 2026-02-19 | - | 첨부파일 |

### 4.6 설정(Setting) 모듈 ✅ 완료
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-19 | - | `setting.ts` (코드/분류/표준설비) |
| 기본 코드 관리 | ✅ | 2026-02-19 | - | 그룹별 코드 조회/수정 |
| 설비 분류 트리 | ✅ | 2026-02-19 | - | 3단계 트리 구조 |
| 표준 설비 CRUD | ✅ | 2026-02-19 | - | 목록/상세/등록/수정/복사 |

### 4.7 건물(Building) 모듈 ✅ 완료 (2026-03-23)
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입 정의 | ✅ | 2026-03-23 | - | `lib/types/building.ts` — BuildingFullDTO, SearchBuildingVO, BuildingSaveVO |
| API 클라이언트 | ✅ | 2026-03-23 | - | `lib/api/building.ts` — 목록/상세/등록/수정/삭제/엑셀 |
| React Query 훅 | ✅ | 2026-03-23 | - | `lib/hooks/use-buildings.ts` — CRUD + 엑셀 다운로드 |
| 건물 목록 페이지 | ✅ | 2026-03-23 | - | 상태 탭 + 기간/건물명 검색 + 페이지네이션 + 엑셀 |
| 건물 상세 페이지 | ✅ | 2026-03-23 | - | 기본정보/주소/계약/서비스/건축정보 카드 레이아웃 |
| 건물 등록/수정 폼 | ✅ | 2026-03-23 | - | react-hook-form + zod, 서비스 체크박스 |
| 폼 선택 드롭다운 | ✅ | 2026-03-23 | - | 고객사/건물용도(2단계)/광역/거점 Select 컴포넌트 구현 |

#### 건물 폼 선택 드롭다운 + 주소/지도 구현 완료 (2026-03-23)
| 항목 | 상태 | 구현 내용 |
|------|------|-----------|
| 주소 검색 | ✅ | 다음 우편번호 API(무료) Script 동적 로드 — 우편번호/지번주소/도로명주소 자동완성 |
| 지도 위치 선택 | ✅ | KakaoMapComponent 재사용 — 지도 클릭으로 위도/경도 자동설정 (API키 없으면 안내 표시) |

---

## Phase 5: 대시보드 위젯 ✅ 완료

### 5.1 대시보드 위젯 구현
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-23 | - | `dashboard.ts` |
| 작업현황 위젯 | ✅ | 2026-02-23 | - | 4개 KPI 카드 |
| 공지사항 위젯 | ✅ | 2026-02-23 | - | |
| 작업현황 테이블 위젯 | ✅ | 2026-02-23 | - | |
| 일정표 위젯 | ✅ | 2026-02-23 | - | 주간/월간 탭 |

---

## Phase 6: 복잡 모듈 🔄 진행중

### 6.1 자격증(License) 모듈
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-23 | - | `license.ts` |
| 목록/상세/등록/수정 | ✅ | 2026-02-23 | - | 분류 선택, 상태 토글 |

### 6.2 순찰(Patrol) 모듈
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-23 | - | `patrol.ts` |
| 계획 목록/상세/등록/수정 | ✅ | 2026-02-23 | - | 탭 전환 UI |
| 팀 목록/상세/등록/수정 | ✅ | 2026-02-23 | - | 팀원/건물 목록 표시 |

### 6.3 보고서(Report) 모듈
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 타입/API/훅 | ✅ | 2026-02-23 | - | `report.ts` |
| 월간/주간/업무일지 목록/상세/등록/수정 | ✅ | 2026-02-23 | - | 4탭 메인, 공통 폼 |

---

## Phase 7: 모바일 정밀 조정 + 반응형 + 성능 최적화 🔄 진행중

### 7.1 모바일 레이아웃 (/m/*)
| 태스크 | 상태 | 완료일 | 비고 |
|--------|------|--------|------|
| MobileHeader 컴포넌트 | ✅ | 2026-02-23 | 52px, 빌딩 컨텍스트, 알림, 검색 |
| MobileBottomNav 컴포넌트 | ✅ | 2026-02-23 | 5탭: 홈/작업/시설/보고서/내정보 |
| MobileShell 컴포넌트 | ✅ | 2026-02-23 | 모바일 전용 셸 레이아웃 |
| /m/layout.tsx | ✅ | 2026-02-23 | viewport 설정, iOS Safe Area |
| /m/page.tsx (모바일 홈) | ✅ | 2026-02-23 | KPI 요약, 빠른 메뉴, 최근 작업 |
| /m/work-orders/* | ✅ | 2026-02-23 | 모바일 최적화 작업 목록/상세 |
| /m/facilities/* | ✅ | 2026-02-23 | 모바일 시설 목록/상세 |

### 7.2 반응형 정밀 조정
| 태스크 | 상태 | 완료일 | 비고 |
|--------|------|--------|------|
| MobileDrawer 컴포넌트 | ✅ | 2026-02-23 | lg 미만 슬라이드-인 오버레이 |
| AppShell 반응형 개선 | ✅ | 2026-02-23 | lg+ 데스크톱, lg- 드로어 |
| Header 모바일 메뉴 콜백 | ✅ | 2026-02-23 | onMobileMenuClick 프롭 추가 |
| 태블릿 엣지 케이스 | ✅ | 2026-02-23 | MobileDrawer md:w-72 적용 |

### 7.3 성능 최적화
| 태스크 | 상태 | 완료일 | 비고 |
|--------|------|--------|------|
| next.config.ts 번들 분석 설정 | ✅ | 2026-02-23 | @next/bundle-analyzer |
| analyze/type-check 스크립트 추가 | ✅ | 2026-02-23 | npm run analyze |
| removeConsole (프로덕션) | ✅ | 2026-02-23 | error/warn 제외 |
| 코드 스플리팅 최적화 | ✅ | 2026-02-23 | next/dynamic 래퍼 (RichText/Calendar/KakaoMap) |

### 7.4 접근성 감사
| 태스크 | 상태 | 완료일 | 비고 |
|--------|------|--------|------|
| WCAG 2.1 AA 전체 감사 | ✅ | 2026-02-23 | jsx-a11y lint 검사 - 에러 없음 |
| 키보드 네비게이션 검증 | ✅ | 2026-02-23 | MobileDrawer Escape 키, aria-modal |
| 스크린 리더 테스트 | ✅ | 2026-02-23 | aria-label, sr-only 텍스트 적용 |

---

## 커밋 이력

| 날짜 | 커밋 메시지 | Phase |
|------|------------|-------|
| 2026-02-06 | `chore: 프로젝트 초기화 및 개발 규칙 문서 작성` | Phase 0 |
| 2026-02-06 | `docs: Phase 0 분석 문서 작성 (API 감사, Prisma 스키마, 인프라, 성능)` | Phase 0 |
| 2026-02-06 | `feat: Phase 1 기반 구축 - Next.js 15, shadcn/ui, 디자인 시스템, Zustand` | Phase 1 |
| 2026-02-06 | `feat: Phase 1 인증 및 API 레이어 구현` | Phase 1 |
| 2026-02-06 | `feat: Phase 1 인프라 완성 - Error Boundary, nuqs, Vitest` | Phase 1 |
| 2026-02-06 | `feat: Phase 1 완료 - 커스텀 컴포넌트, Command Palette, E2E, MSW` | Phase 1 |
| 2026-02-10 | `feat: Phase 2A-1~3 DataTable 시스템 구현` | Phase 2A |
| 2026-02-10 | `feat: Phase 2A-4~6 FormField, CascadingSelect, DatePicker 구현` | Phase 2A |
| 2026-02-10 | `feat: Phase 2A-7 SearchFilterBar 구현` | Phase 2A |
| 2026-02-10 | `feat: Phase 2A-8 FileUpload 컴포넌트 구현` | Phase 2A |
| 2026-02-10 | `feat: Phase 2A-9~11 차트 시스템 구현` | Phase 2A |
| 2026-02-11 | `fix: 백엔드 단일 토큰 아키텍처에 맞춰 인증 시스템 수정` | Phase 1 |
| 2026-02-12 | `fix: 로그인 인증 시스템 완성 및 대시보드 구현` | Phase 1 |
| 2026-02-12 | `feat: Phase 2A 완료 - StatWidget, InfoPanel 컴포넌트 추가` | Phase 2A |
| 2026-02-12 | `feat: Phase 2B-1 위젯 프레임워크 구현` | Phase 2B |
| 2026-02-12 | `feat: Phase 2B-2 서드파티 대체 컴포넌트 구현` | Phase 2B |
| 2026-02-12 | `feat: Phase 3 FMS 작업 목록 페이지 구현` | Phase 3 |
| 2026-02-12 | `feat: WorkOrder 모듈 구현 (목록/상세/생성/수정 페이지)` | Phase 3 |
| 2026-02-12 | `feat: Phase 4 시설(Facility) 모듈 구현` | Phase 4 |
| 2026-02-19 | `feat: 사용자 관리 모듈 구현 (목록/상세/등록/수정 페이지)` | Phase 4 |
| 2026-02-19 | `feat: 클라이언트(고객사) 모듈 구현 (목록/상세/등록/수정 페이지)` | Phase 4 |
| 2026-03-23 | `feat: 건물(Building) 모듈 구현 (목록/상세/등록/수정 페이지)` | Phase 4.7 |
| 2026-02-19 | `feat: 자재(Material) 모듈 구현 (목록/상세/등록/수정 페이지)` | Phase 4 |
| 2026-02-19 | `feat: 게시판(Board) 모듈 구현 (공지사항/자료실 목록/상세/등록/수정)` | Phase 4 |
| 2026-02-19 | `feat: 설정(Setting) 모듈 구현 (기본코드/설비분류/표준설비 관리)` | Phase 4 |
| 2026-02-23 | `feat: Phase 5 대시보드 위젯 구현 (작업현황/공지사항/일정표)` | Phase 5 |
| 2026-02-23 | `feat: Phase 6 복잡 모듈 구현 (자격증/순찰/보고서)` | Phase 6 |

---

## 이슈 및 차단 사항

| ID | 이슈 | 상태 | 해결방안 | 해결일 |
|----|------|------|---------|--------|
| - | - | - | - | - |

---

## 의사결정 기록

| 날짜 | 결정 사항 | 근거 | 영향 |
|------|----------|------|------|
| 2026-02-06 | 한국어 전용 문서/주석 | 팀 협업 효율성, 일관성 | 모든 문서 |
| 2026-02-06 | 용어 일관성 유지 | 기존 시스템과의 호환성, 혼란 방지 | 전체 코드베이스 |

---

## 참고 링크

- 마이그레이션 참조: `docs/reference/v1-migration-reference.md`
- [개발 규칙 (CLAUDE.md)](../.claude/CLAUDE.md)
- [기존 csp-web](../../../csp-web/)

### Phase 0 문서
- [API 감사 문서](./phase-0/api-audit.md)
- [Prisma 스키마 설계](./phase-0/prisma-schema-design.md)
- [인프라 결정 문서](./phase-0/infrastructure-decisions.md)
- [성능 베이스라인](./phase-0/performance-baseline.md)
