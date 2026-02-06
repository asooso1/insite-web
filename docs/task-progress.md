# insite-web 마이그레이션 작업 진행 현황

> 최종 업데이트: 2026-02-06

## 📊 전체 진행 상황

| Phase | 상태 | 진행률 | 설명 |
|-------|------|--------|------|
| Phase 0 | ⏳ 대기 | 50% | 사전 준비 및 분석 (DB/API 접근 필요) |
| Phase 1 | 🔄 진행중 | 95% | 기반 구축 |
| Phase 2A | ⏳ 대기 | 0% | 핵심 데이터 컴포넌트 |
| Phase 2B | ⏳ 대기 | 0% | 위젯 프레임워크 및 서드파티 |
| Phase 3 | ⏳ 대기 | 0% | FMS 파일럿 |
| Phase 4 | ⏳ 대기 | 0% | 추가 CRUD 모듈 |
| Phase 5 | ⏳ 대기 | 0% | 대시보드 위젯 구현 |
| Phase 6 | ⏳ 대기 | 0% | 복잡 모듈 |
| Phase 7 | ⏳ 대기 | 0% | 모바일 및 최종 조정 |
| Phase 8 | ⏳ 대기 | 0% | QA 및 런칭 |

**상태 범례:** ✅ 완료 | 🔄 진행중 | ⏳ 대기 | ❌ 차단됨

---

## Phase 0: 사전 준비 및 분석

### 0.0 프로젝트 초기화
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| 프로젝트 디렉토리 생성 | ✅ | 2026-02-06 | - | `/Volumes/jinseok-SSD-1tb/00_insite/insite-web` |
| Git 저장소 초기화 | ✅ | 2026-02-06 | - | |
| CLAUDE.md 작성 | ✅ | 2026-02-06 | - | 개발 규칙 정의 |
| task-progress.md 작성 | ✅ | 2026-02-06 | - | 이 파일 |

### 0.1 csp-was API 감사
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **API 감사 준비 문서 작성** | ✅ | 2026-02-06 | - | `docs/phase-0/api-audit.md` |
| OpenAPI 스펙 추출 (`/v3/api-docs/v1-definition`) | ⏳ | - | - | csp-was 실행 필요 |
| 72개 REST 컨트롤러 엔드포인트 카탈로그 작성 | ⏳ | - | - | |
| csp-web 템플릿(583개) → csp-was API 매핑 문서 | ⏳ | - | - | |
| 핵심 DTO TypeScript 타입 정의 초안 | ⏳ | - | - | |
| Java Enum → TypeScript const 매핑표 | ⏳ | - | - | |
| API 응답 구조 분석 | ⏳ | - | - | code, message, data 패턴 |

### 0.2 Prisma 스키마 설계 준비
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **Prisma 스키마 설계 문서 작성** | ✅ | 2026-02-06 | - | `docs/phase-0/prisma-schema-design.md` |
| csp-web DB 스키마 분석 | ⏳ | - | - | menu, role_menu, product_menu 등 |
| PostgreSQL 접속 정보 확보 | ⏳ | - | - | |
| `prisma db pull` 실행 | ⏳ | - | - | 기존 스키마 introspection |
| MenuService.aside() 포팅 설계서 | ✅ | 2026-02-06 | - | 문서 내 포함 |
| HttpInterceptor.postHandle() 포팅 설계서 | ✅ | 2026-02-06 | - | 문서 내 포함 |
| DashboardService.getDashboardDTO() 포팅 설계서 | ✅ | 2026-02-06 | - | 문서 내 포함 |

### 0.3 인프라 결정
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **인프라 결정 문서 작성** | ✅ | 2026-02-06 | - | `docs/phase-0/infrastructure-decisions.md` |
| 배포 플랫폼 결정 | ⏳ | - | - | AWS Amplify / Vercel / ECS |
| csp-was CORS 설정 확인 | ⏳ | - | - | Next.js 도메인 추가 계획 |
| CI OpenAPI 스펙 갱신 파이프라인 설계 | ✅ | 2026-02-06 | - | 문서 내 포함 |
| 도메인/서브도메인 결정 | ⏳ | - | - | |

### 0.4 성능 베이스라인 측정
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| **성능 베이스라인 문서 작성** | ✅ | 2026-02-06 | - | `docs/phase-0/performance-baseline.md` |
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
| 커스텀 컴포넌트 6개 생성 | ⏳ | - | - | Chip, Loader, KPICard 등 |

### 1.3 레이아웃
| 태스크 | 상태 | 완료일 | 담당 | 비고 |
|--------|------|--------|------|------|
| AppShell | ✅ | 2026-02-06 | - | 반응형 레이아웃 |
| Header | ✅ | 2026-02-06 | - | 사용자 정보, 테마 토글 |
| Sidebar | ✅ | 2026-02-06 | - | 250px/64px 반응형 |
| GNB | ⏳ | - | - | |
| Footer | ⏳ | - | - | |
| Command Palette | ⏳ | - | - | |
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
| Playwright 설정 | ⏳ | - | - | |
| MSW 설정 | ⏳ | - | - | |
| Sentry 설정 | ⏳ | - | - | |
| GA4 설정 | ⏳ | - | - | |
| CI/CD 파이프라인 | ⏳ | - | - | |

---

## 커밋 이력

| 날짜 | 커밋 메시지 | Phase |
|------|------------|-------|
| 2026-02-06 | `chore: 프로젝트 초기화 및 개발 규칙 문서 작성` | Phase 0 |
| 2026-02-06 | `docs: Phase 0 분석 문서 작성 (API 감사, Prisma 스키마, 인프라, 성능)` | Phase 0 |
| 2026-02-06 | `feat: Phase 1 기반 구축 - Next.js 15, shadcn/ui, 디자인 시스템, Zustand` | Phase 1 |
| 2026-02-06 | `feat: Phase 1 인증 및 API 레이어 구현` | Phase 1 |

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

- [마이그레이션 계획서](../../../migration-plan.md)
- [개발 규칙 (CLAUDE.md)](../.claude/CLAUDE.md)
- [기존 csp-web](../../../csp-web/)

### Phase 0 문서
- [API 감사 문서](./phase-0/api-audit.md)
- [Prisma 스키마 설계](./phase-0/prisma-schema-design.md)
- [인프라 결정 문서](./phase-0/infrastructure-decisions.md)
- [성능 베이스라인](./phase-0/performance-baseline.md)
