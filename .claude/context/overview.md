# 마이그레이션 개요

> 이 문서는 전체 마이그레이션 계획의 요약입니다. 상세 내용은 각 Phase별 문서를 참조하세요.

## 프로젝트 목표

Spring Boot + Thymeleaf + Vue.js 기반 **csp-web**(BFF)을 **Next.js 15**로 완전 마이그레이션.
- csp-was(REST API 백엔드)는 그대로 유지 (CORS 1줄만 변경)
- 메뉴/권한/대시보드 설정은 Next.js API Routes + Prisma로 직접 DB 접근

## 아키텍처

```
현재:  브라우저 → csp-web (Thymeleaf SSR) → csp-was (REST API)
목표:  브라우저 → insite-web (Next.js 15) → csp-was (REST API)
                 insite-web → Prisma → PostgreSQL (메뉴/권한/대시보드)
```

## Phase 진행 상황

| Phase | 이름 | 상태 | 진행률 |
|-------|------|------|--------|
| 0 | 사전 준비 및 분석 | ⏳ 대기 | 50% |
| 1 | 기반 구축 | ✅ 완료 | 100% |
| **2A** | **핵심 데이터 컴포넌트** | **⏳ 다음** | 0% |
| 2B | 위젯 프레임워크 + 서드파티 | ⏳ 대기 | 0% |
| 3 | FMS 파일럿 | ⏳ 대기 | 0% |
| 4 | 추가 CRUD 모듈 | ⏳ 대기 | 0% |
| 5 | 대시보드 위젯 구현 | ⏳ 대기 | 0% |
| 6 | 복잡 모듈 | ⏳ 대기 | 0% |
| 7 | 모바일 + 접근성 | ⏳ 대기 | 0% |
| 8 | QA 및 런칭 | ⏳ 대기 | 0% |

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript (strict) |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 상태관리 | Zustand (클라이언트) + TanStack Query (서버) |
| 폼 | react-hook-form + zod |
| 테스트 | Vitest + Playwright + MSW |

## 핵심 참조 경로

- 기존 csp-web: `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/`
- 기존 csp-was: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/`
- 상세 마이그레이션 계획: `/Volumes/jinseok-SSD-1tb/00_insite/migration-plan.md`

## 다음 단계

현재 **Phase 2A: 핵심 데이터 컴포넌트**를 시작해야 합니다.
상세 태스크는 `.claude/context/phase-2a.md`를 참조하세요.
