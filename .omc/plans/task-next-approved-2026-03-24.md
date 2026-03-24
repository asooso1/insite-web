# insite-web 다음 단계 구현 태스크리스트

> 기준: docs/ux-analysis/00-gap-analysis-report.md GAP 분석 결과
> 작성일: 2026-03-23
> 현재 상태: Phase 1-9 완료 (~72% 구현)
> 목표: Phase 10-11 포함 전체 기능 완성

---

## 요약 대시보드

| Phase | 기간 | 태스크 수 | 총 공수 | 핵심 목표 |
|-------|------|---------|---------|---------|
| **A (즉시)** | 1-3주 | 7 | ~3주 | 빠른 UX 개선, 낮은 리스크 |
| **B (단기)** | 4-9주 | 6 | ~5주 | 사용자 생산성 급등 |
| **C (중기)** | 10-20주 | 7 | ~10주 | 고급 기능 + 신규 모듈 기초 |
| **D (장기)** | 21-46주 | 5 | ~20주 | BEMS/BECM/FEMS 완전 구현 |
| **합계** | **~6-12개월** | **25** | **~38주** | **v1 완전 대체** |

### 전체 타임라인 (2026년)

```
2026년
│
├─ Q2 (4월~6월): Phase A + Phase B 시작
│  ├─ 주차 1-3:  Phase A (KPI, 엑셀, 페이지크기, Tooltip, 검증, A11y)
│  ├─ 주차 4-7:  Phase B-1 (nuqs, 벌크 액션 설계)
│  └─ 주차 8-13: Phase B-2 (알림, 권한관리, CSV, 월간보고서)
│
├─ Q3 (7월~9월): Phase C 핵심
│  ├─ 주차 1-6:  감사 로그, 알림 센터, SSE
│  ├─ 주차 7-10: 온보딩, 시스템 로그
│  └─ 주차 11-13: BEMS 기초 설계 + 프로토타입
│
└─ Q4 (10월~12월): Phase C 완료 + Phase D 착수
   ├─ 주차 1-4:  BEMS 에너지 대시보드
   ├─ 주차 5-9:  BEMS 상세 분석 + BECM 파일럿
   └─ 주차 10-13: FEMS 기초 + 2027 계획
```

---

## Phase A: 즉시 구현 (1-3주)

> **특징**: 영향도 높음 / 난이도 낮음 / ROI 빠름
> **담당**: Junior-Middle 개발자 1명
> **선행 조건**: 없음 (기존 컴포넌트 활용)

---

### A-01 대시보드 KPI 통계 카드

| 항목 | 내용 |
|------|------|
| **난이도** | 🟢 Low |
| **우선순위** | P1 |
| **예상 공수** | 3-5일 |
| **의존성** | 없음 |

**목적**: 관리자가 현황을 한눈에 파악할 수 있는 KPI 요약 제공

**주요 파일**:
- `src/app/(modules)/dashboard/page.tsx` — PageHeader.stats 추가
- `src/app/api/dashboard/stats/route.ts` — 통계 API (신규)
- `src/lib/hooks/use-dashboard.ts` — 통계 쿼리 훅 추가

**구현 내용**:
- PageHeader `stats` prop으로 오늘 작업 현황 표시 (전체/진행중/완료/긴급)
- KpiCard 컴포넌트로 주요 모듈별 현황 표시
- 기존 `src/components/data-display/kpi-card.tsx` Stories 확인 후 활용

**수용 기준 (Acceptance Criteria)**:
- [ ] 대시보드 상단에 KPI 카드 4개 이상 표시됨
- [ ] 각 카드에 숫자 + 전일 대비 증감 표시
- [ ] 데이터 로딩 중 Skeleton 표시
- [ ] 빈 데이터 시 EmptyState 표시

**리스크**:
- 백엔드 집계 API 없을 경우 → 기존 목록 API에서 count 추출 (프런트 집계 fallback)
- 완화: 먼저 GET /api/workorder/v1/list 파라미터 확인 후 구현

---

### A-02 모든 목록 페이지 엑셀 다운로드 표준화

| 항목 | 내용 |
|------|------|
| **난이도** | 🟢 Low |
| **우선순위** | P1 |
| **예상 공수** | 5-7일 |
| **의존성** | 없음 |

**목적**: 관리자/시니어 사용자의 데이터 추출 효율화

**주요 파일**:
- `src/lib/api/excel-export.ts` — 공용 엑셀 유틸 (신규 or 기존 확장)
- 각 목록 page.tsx — FilterBar의 `rightSlot`에 다운로드 버튼 추가
- 대상 모듈: work-orders, facilities, users, clients, materials, boards, patrols

**구현 내용**:
- 공용 `useExcelDownload(apiFn, filename)` 훅 생성
- 전체 데이터 다운로드 (size=10000) vs 현재 필터 적용 두 가지 모드
- `try/finally`로 DOM 정리 보장 (error-handling.md 패턴 준수)

**수용 기준**:
- [ ] 모든 목록 페이지 FilterBar 우측에 "엑셀 다운로드" 버튼 존재
- [ ] 클릭 시 .xlsx 파일 자동 다운로드
- [ ] 다운로드 중 버튼 비활성화 + 로딩 표시
- [ ] 실패 시 toast.error 표시

**리스크**:
- 대용량 데이터(10000+행) 시 메모리 부족 → 페이지별 청크 다운로드 대안 준비
- 완화: 최대 5000행 제한 + 경고 메시지

---

### A-03 DataTable 페이지 크기 선택

| 항목 | 내용 |
|------|------|
| **난이도** | 🟢 Low |
| **우선순위** | P1 |
| **예상 공수** | 2-3일 |
| **의존성** | 없음 |

**목적**: 시니어 사용자 데이터 밀도 조절 (현재 고정 20행 → 선택 가능)

**주요 파일**:
- `src/components/data-display/data-table.tsx` — pageSize 선택 UI 추가
- `src/components/data-display/data-table.stories.tsx` — Stories 업데이트

**구현 내용**:
- DataTable 하단 페이지네이션에 "행 수: [10 ▼]" Select 추가
- 옵션: 10 / 20 / 50 / 100
- 선택 변경 시 페이지 1로 리셋
- localStorage에 선호 페이지 크기 저장 (세션 유지)

**수용 기준**:
- [ ] 모든 DataTable 하단에 페이지 크기 Select 표시
- [ ] 10/20/50/100 옵션 선택 가능
- [ ] 선택 후 해당 개수만큼 행 표시
- [ ] 새로고침 후 마지막 선택값 복원

**리스크**:
- localStorage 사용 → 규칙상 토큰 저장 금지이나 UI 설정은 허용 범위
- 100행 시 API 요청 크기 증가 → 기존 API size 파라미터 범위 확인 필요

---

### A-04 FilterBar Tooltip 추가

| 항목 | 내용 |
|------|------|
| **난이도** | 🟢 Low |
| **우선순위** | P1 |
| **예상 공수** | 3-5일 |
| **의존성** | 없음 |

**목적**: 주니어 사용자의 필터 기능 이해도 향상

**주요 파일**:
- `src/components/common/filter-bar.tsx` — FilterDef에 `tooltip` prop 추가
- `src/components/common/filter-bar.stories.tsx` — Stories 업데이트
- 각 목록 page.tsx — FILTER_DEFS에 tooltip 텍스트 추가

**구현 내용**:
- FilterDef 타입에 `tooltip?: string` 추가
- 필터 레이블 우측에 `<Tooltip><HelpCircle /></Tooltip>` 추가
- Tooltip 컴포넌트는 기존 `src/components/ui/tooltip.tsx` 활용

**수용 기준**:
- [ ] FilterDef에 tooltip 지정 시 ? 아이콘 표시
- [ ] 마우스 오버 시 설명 텍스트 표시
- [ ] 키보드 접근 가능 (tabIndex + aria-describedby)

**리스크**: 낮음 (기존 Tooltip 컴포넌트 재활용)

---

### A-05 공용 Zod 스키마 라이브러리 구축

| 항목 | 내용 |
|------|------|
| **난이도** | 🟢 Low |
| **우선순위** | P1 |
| **예상 공수** | 3-5일 |
| **의존성** | 없음 |

**목적**: 모듈별 상이한 폼 검증 로직 표준화, QA 테스트 신뢰성 향상

**주요 파일**:
- `src/lib/validations/common.ts` — 공용 Zod 스키마 (신규)
- `src/lib/validations/index.ts` — 도메인별 스키마 export
- 기존 폼 파일들 — import 경로 변경

**구현 내용**:
```typescript
// 공용 스키마 예시
export const requiredString = z.string().min(1, "필수 입력 항목입니다.");
export const optionalString = z.string().optional();
export const positiveInt = z.number().int().positive("0보다 큰 숫자를 입력해주세요.");
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식으로 입력해주세요.");
export const phoneNumber = z.string().regex(/^0\d{9,10}$/, "올바른 전화번호를 입력해주세요.");
```

**수용 기준**:
- [ ] `src/lib/validations/common.ts` 파일 존재
- [ ] 10개 이상 공용 스키마 정의
- [ ] 기존 최소 3개 이상 폼에서 공용 스키마 import 확인
- [ ] 각 스키마의 에러 메시지가 한국어로 통일

**리스크**: 낮음 (기존 폼 리팩토링은 점진적으로 진행)

---

### A-06 Aria-label 전체 검토 및 적용

| 항목 | 내용 |
|------|------|
| **난이도** | 🟢 Low |
| **우선순위** | P1 |
| **예상 공수** | 3-5일 |
| **의존성** | 없음 |

**목적**: WCAG 2.1 AA 접근성 준수, 스크린 리더 지원

**주요 파일**:
- `src/components/**/*.tsx` — 아이콘 버튼 aria-label 추가
- 우선: DataTable 액션 버튼, PageHeader 버튼, FilterBar 리셋 버튼

**구현 내용**:
- `grep -r 'aria-label' src/components/` 로 현황 파악
- `<Button>` 아이콘 전용 버튼에 `aria-label` 추가
- `<X aria-hidden="true" />` 아이콘 숨김 처리

**수용 기준**:
- [ ] 아이콘 전용 버튼 100% aria-label 적용
- [ ] Chrome DevTools Accessibility 탭에서 오류 0건
- [ ] 주요 모달 aria-haspopup="dialog" 적용

**리스크**: 낮음 (기계적 작업, 로직 변경 없음)

---

### A-07 에러 메시지 명확성 개선

| 항목 | 내용 |
|------|------|
| **난이도** | 🟢 Low |
| **우선순위** | P1 |
| **예상 공수** | 5-7일 |
| **의존성** | ⚠️ **A-05 완료 후 착수** (A-05 없이 폼 검증 에러 메시지 구체화 불가) |

**목적**: 주니어 사용자의 오류 복구 능력 향상

**주요 파일**:
- `src/lib/api/error-handler.ts` — 에러 메시지 개선
- `src/lib/validations/common.ts` — 검증 에러 메시지 구체화

**구현 내용**:
- 폼 에러: "필수 항목" → "시설명을 입력해주세요. (최대 100자)"
- API 에러: 404 "데이터를 찾을 수 없습니다." + 목록으로 돌아가기 링크
- 네트워크 에러: "인터넷 연결을 확인해주세요." + 재시도 버튼

**수용 기준**:
- [ ] 필드 에러에 필드명 포함
- [ ] API 404 시 홈/목록 복귀 안내
- [ ] 네트워크 오류 시 재시도 옵션 제공

**리스크**: 낮음

---

## Phase B: 단기 구현 (4-9주)

> **특징**: 영향도 높음 / 난이도 중간-높음 / 사용자 생산성 급등
> **담당**: Middle 개발자 1-2명
> **선행 조건**: Phase A 완료 권장 (독립 구현 가능)

---

### B-01 필터 상태 URL 저장 (nuqs 전환)

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P1 |
| **예상 공수** | 1-2주 |
| **의존성** | 없음 (Phase A와 독립) |

**목적**: 필터 상태 보존으로 시니어 사용자 효율 대폭 향상

**주요 파일**:
- 모든 목록 page.tsx — `useState` → `useQueryState` (nuqs) 교체
- `src/lib/hooks/use-*.ts` — 필터 파라미터 타입 정의
- 대상: work-orders, facilities, users, clients, materials, boards, patrols, fieldwork

**구현 내용**:
```typescript
// 변경 전
const [filters, setFilters] = useState(INITIAL_FILTERS);

// 변경 후 (nuqs)
import { useQueryState, parseAsString } from 'nuqs';
const [state, setState] = useQueryState('state', parseAsString.withDefault(''));
const [keyword, setKeyword] = useQueryState('keyword', parseAsString.withDefault(''));
```
- `NuqsAdapter` Provider를 root layout에 추가
- 뒤로가기 시 필터 복원 자동 지원

**수용 기준**:
- [ ] 필터 선택 후 URL에 쿼리스트링 반영 (예: `?state=PROCESSING&keyword=테스트`)
- [ ] 상세 페이지 → 뒤로가기 시 동일 필터 상태 복원
- [ ] URL 직접 입력/공유 시 해당 필터 적용
- [ ] 필터 초기화 시 URL 쿼리스트링도 제거

**리스크**:
- 기존 useState 기반 코드와의 호환성 충돌 가능
- 완화: 모듈별 점진적 마이그레이션, PR당 2-3개 모듈씩 처리
- **SSR 하이드레이션 충돌**: `useQueryState`는 클라이언트 전용 → 모든 필터 페이지 `"use client"` 경계 명시 필수
- **NuqsAdapter 위치**: `src/app/(modules)/layout.tsx` 에 추가 (root layout은 불필요한 범위 확대)
- **React Query queryKey 동기화**: 필터 변경 시 queryKey에 파라미터 반드시 포함 필요
  ```typescript
  // ✅ 올바른 패턴 - 필터가 queryKey에 포함돼야 캐시 정확히 무효화
  queryKey: workOrderKeys.list({ state, keyword, ...params })
  ```
- **착수 전 PoC 필수**: work-orders 모듈 1개로 nuqs PoC 검증 후 전체 마이그레이션 진행

---

### B-02 벌크 액션 (DataTable 행 선택 + 일괄 처리)

| 항목 | 내용 |
|------|------|
| **난이도** | 🔴 High |
| **우선순위** | P2 |
| **예상 공수** | 2-3주 |
| **의존성** | 없음 |

**목적**: 시니어 사용자의 반복 작업 시간 50% 단축

**주요 파일**:
- `src/components/data-display/data-table.tsx` — 행 선택 기능 추가
- `src/components/data-display/data-table.stories.tsx` — Stories 업데이트
- `src/components/data-display/bulk-action-bar.tsx` — 선택된 행 액션 바 (신규)
- 각 목록 page.tsx — 벌크 삭제/상태변경 핸들러 추가

**구현 내용**:
- DataTable에 `enableRowSelection?: boolean` prop 추가
- TanStack Table의 `useRowSelection` 활용
- 선택 시 하단 고정 액션 바 표시 (N개 선택 | 삭제 | 상태 변경 | 취소)
- 배치 삭제 API 호출 (단일 API vs 병렬 API 검토)

**수용 기준**:
- [ ] DataTable 각 행 좌측에 체크박스 표시
- [ ] 헤더 체크박스로 전체 선택/해제
- [ ] 1개 이상 선택 시 하단 액션 바 표시
- [ ] 배치 삭제 후 목록 자동 갱신
- [ ] 배치 상태변경 (최소 work-orders에서 동작 확인)

**리스크**:
- 백엔드 배치 API 미지원 시 → 병렬 Promise.all로 대체 (성능 저하 위험)
- 완화: 먼저 csp-was 컨트롤러에서 배치 API 존재 확인
- DataTable 대규모 수정으로 기존 기능 회귀 위험
- 완화: Stories 기반 컴포넌트 테스트 강화

---

### B-03 알림 센터 (Notification Center)

| 항목 | 내용 |
|------|------|
| **난이도** | 🔴 High |
| **우선순위** | P2 |
| **예상 공수** | 2-3주 |
| **의존성** | B-01 또는 독립 구현 가능 |

**목적**: 관리자가 중요 사항을 놓치지 않도록 실시간 알림 제공

**주요 파일**:
- `src/components/layout/header.tsx` — Bell 아이콘 + 배지 추가
- `src/components/notifications/notification-center.tsx` — 알림 패널 (신규)
- `src/app/api/notifications/route.ts` — 알림 API (신규)
- `src/lib/hooks/use-notifications.ts` — 알림 쿼리 훅 (신규)

**구현 내용**:
- Header에 Bell 아이콘 + 미읽음 수 배지
- Popover로 알림 목록 표시 (최근 20개)
- 알림 클릭 시 해당 페이지로 이동
- "모두 읽음" 처리 기능
- 알림 유형: 긴급 작업 배정, 미승인 항목, 점검 마감 임박

**수용 기준**:
- [ ] Header에 Bell 아이콘과 미읽음 수 배지 표시
- [ ] 배지 클릭 시 알림 목록 Popover 표시
- [ ] 각 알림 클릭 시 관련 페이지로 이동
- [ ] 읽음 처리 후 배지 수 감소
- [ ] 알림 없을 때 "새 알림이 없습니다" 표시

**리스크**:
- 백엔드 알림 API 미존재 시 → 구현 범위 재조정 필요
- 완화: 먼저 csp-was에서 알림 관련 API 존재 여부 확인 후 착수
- 실시간 폴링 (30초 간격) vs SSE — 초기엔 폴링으로 시작

---

### B-04 권한 관리 UI

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P2 |
| **예상 공수** | 1-2주 |
| **의존성** | 없음 |

**목적**: 시스템 관리자가 사용자 역할을 UI에서 직접 관리

**주요 파일**:
- `src/app/(modules)/users/[id]/edit/page.tsx` — 역할 선택 UI 추가
- `src/app/(modules)/settings/roles/page.tsx` — 역할 목록/관리 (신규)
- `src/lib/api/user.ts` — 역할 수정 API 추가

**구현 내용**:
- 사용자 수정 페이지에 "역할" 섹션 추가
- 역할 목록 체크박스 형태로 표시
- csp-was의 역할 조회 API 활용 (`GET /api/services/roles`)

**수용 기준**:
- [ ] 사용자 수정 페이지에 역할 선택 UI 존재
- [ ] 역할 변경 저장 후 해당 사용자 재로그인 시 반영
- [ ] 역할별 접근 가능 메뉴 설명 표시

**리스크**:
- csp-was role 수정 API 미확인 → 먼저 API 존재 여부 확인 필수
- 완화: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/` 확인

---

### B-05 CSV 대량 사용자 등록

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P2 |
| **예상 공수** | 1-2주 |
| **의존성** | 없음 |

**목적**: 시스템 관리자의 대량 사용자 등록 효율화

**주요 파일**:
- `src/app/(modules)/users/import/page.tsx` — CSV 업로드 페이지 (신규)
- `src/app/api/users/import/route.ts` — CSV 파싱 + 배치 등록 API (신규)
- `src/components/forms/file-upload.tsx` — 기존 FileUpload 컴포넌트 활용

**구현 내용**:
- CSV 템플릿 다운로드 기능
- FileUpload로 CSV 업로드 → 미리보기 표시 (샘플 10행)
- 유효성 검사 결과 표시 (오류 행 하이라이트)
- 확인 후 일괄 등록 실행

**수용 기준**:
- [ ] CSV 템플릿 다운로드 가능
- [ ] CSV 업로드 후 미리보기 10행 표시
- [ ] 오류 행 (이메일 중복, 필수값 누락) 하이라이트
- [ ] 정상 행만 선별하여 등록 가능

**리스크**:
- 백엔드 배치 등록 API 미존재 시 → Next.js API Route에서 순차 등록
- 완화: 100명 이상 시 진행률 표시 UX 필요

---

### B-06 월간 보고서 자동 생성

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P2 |
| **예상 공수** | 2주 |
| **의존성** | A-02 (엑셀 다운로드 공용 유틸) |

**목적**: 현장 관리자의 월말 보고서 작성 자동화

**주요 파일**:
- `src/app/(modules)/reports/monthly/page.tsx` — 월간 보고서 페이지 (신규)
- `src/app/api/reports/monthly/route.ts` — 월간 집계 API (신규)
- `src/lib/api/report.ts` — 보고서 API 클라이언트

**구현 내용**:
- 월 선택 → 해당 월 통계 집계 (작업 현황, 시설 점검, 자재 사용)
- 차트로 추이 시각화
- 엑셀 또는 PDF 다운로드

**수용 기준**:
- [ ] 월 선택 후 해당 월 통계 표시
- [ ] 작업 완료율, 평균 처리 시간, 미처리 건수 포함
- [ ] 엑셀 다운로드 정상 동작

**리스크**:
- 데이터 집계 쿼리 성능 → 월별 사전 집계 또는 캐시 필요
- 완화: React Query staleTime을 Infinity로 설정 (당일 내 재요청 방지)

---

## Phase C: 중기 구현 (10-20주)

> **특징**: 영향도 매우 높음 / 난이도 높음 / 기반 마련 필요
> **담당**: Middle-Senior 개발자 2-3명
> **선행 조건**: Phase A 완료, Phase B 일부 완료

---

### C-01 감사 로그 (Audit Log)

| 항목 | 내용 |
|------|------|
| **난이도** | 🔴 High |
| **우선순위** | P2 |
| **예상 공수** | 2-3주 |
| **의존성** | 없음 (독립 구현) |

**목적**: 규정 준수(Compliance) 및 보안 감사 지원

**주요 파일**:
- `src/app/(modules)/settings/audit-logs/page.tsx` — 감사 로그 조회 (신규)
- `src/app/api/audit-logs/route.ts` — 조회 API
- `src/lib/types/audit-log.ts` — 타입 정의
- `src/lib/hooks/use-audit-logs.ts` — 쿼리 훅

**구현 내용**:
- 변경 이력 조회 (누가 / 언제 / 무엇을 / 어떻게)
- 필터: 사용자, 모듈, 날짜 범위, 액션 유형
- Before/After 값 비교 뷰
- 엑셀 내보내기

**수용 기준**:
- [ ] 설정 > 감사 로그 메뉴 접근 가능 (관리자 권한)
- [ ] 생성/수정/삭제 이벤트 모두 기록
- [ ] 사용자/날짜/모듈별 필터링 동작
- [ ] 30일 이상 이력 조회 가능

**리스크**:
- 백엔드 감사 로그 API 미존재 → 구현 불가 (가장 큰 리스크)
- 완화: csp-was 감사 로그 API 존재 여부 사전 확인 필수
- 대안: 프런트엔드에서 변경 이벤트를 별도 DB에 저장 (복잡도 증가)

---

### C-02 실시간 SSE 업데이트 (Server-Sent Events)

| 항목 | 내용 |
|------|------|
| **난이도** | 🔴 High |
| **우선순위** | P3 |
| **예상 공수** | 2-3주 |
| **의존성** | B-03 (알림 센터) |

**목적**: 대시보드 실시간 자동 갱신, 알림 즉시 수신

**주요 파일**:
- `src/app/api/dashboard/stream/route.ts` — SSE 엔드포인트 (신규)
- `src/lib/hooks/use-sse.ts` — SSE 커넥션 관리 훅 (신규)
- `src/app/(modules)/dashboard/page.tsx` — SSE 연동

**구현 내용**:
```typescript
// Next.js 15 App Router SSE (메모리 누수 방지 패턴 적용)
export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      let interval: NodeJS.Timeout;
      let timeout: NodeJS.Timeout;

      const cleanup = () => {
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
        try { controller.close(); } catch {}
      };

      // 30분 타임아웃 (장시간 연결 메모리 누수 방지)
      timeout = setTimeout(cleanup, 30 * 60 * 1000);

      interval = setInterval(() => {
        try {
          const data = JSON.stringify({ type: 'dashboard-update', timestamp: Date.now() });
          controller.enqueue(`data: ${data}\n\n`);
        } catch {
          cleanup(); // enqueue 실패 시 즉시 정리
        }
      }, 30000);

      // 클라이언트 연결 종료 시 즉시 정리
      request.signal.addEventListener('abort', cleanup);
    }
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  });
}
```

**수용 기준**:
- [ ] 대시보드에서 SSE 연결 자동 수립
- [ ] 데이터 변경 시 30초 이내 대시보드 자동 갱신
- [ ] 네트워크 재연결 시 자동 재구독
- [ ] 컴포넌트 언마운트 시 연결 정리 (메모리 누수 없음)
- [ ] 개발 도구에서 메모리 사용량 증가 없음 (30분 이상)

**리스크**:
- csp-was가 SSE 직접 지원 안 함 → Next.js API Route가 중간 레이어 역할
- 서버 메모리 누수 (오래된 연결 정리 누락)
- 완화: AbortController + cleanup 패턴 필수 적용

---

### C-03 온보딩 투어

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P4 |
| **예상 공수** | 1-2주 |
| **의존성** | Phase A 완료 후 진행 권장 |

**목적**: 신규 사용자의 학습 곡선 단축

**주요 파일**:
- `src/components/onboarding/onboarding-tour.tsx` — 투어 컴포넌트 (신규)
- `src/lib/hooks/use-onboarding.ts` — 투어 상태 관리
- `src/app/(modules)/dashboard/page.tsx` — 투어 진입점

**구현 내용**:
- react-joyride 또는 driver.js 라이브러리 활용
- 최초 로그인 시 자동 투어 시작 (건너뛰기 가능)
- 투어 완료 여부 서버에 저장 (재방문 시 미표시)
- 단계: 대시보드 → 작업 목록 → 작업 등록 → 프로필 설정

**수용 기준**:
- [ ] 최초 로그인 시 투어 자동 시작
- [ ] "건너뛰기" 클릭 시 즉시 종료
- [ ] 투어 완료 후 재표시 안 됨 (서버 저장)
- [ ] 헬프 버튼으로 언제든 재시작 가능

**리스크**:
- 신규 라이브러리 도입 → 번들 크기 증가
- 완화: dynamic import로 지연 로딩

---

### C-04 시스템 로그 조회

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P3 |
| **예상 공수** | 1-2주 |
| **의존성** | C-01 (감사 로그) 기반 UI 재활용 |

**목적**: IT 관리자의 시스템 오류/접근 로그 추적

**주요 파일**:
- `src/app/(modules)/settings/system-logs/page.tsx` — 시스템 로그 페이지 (신규)

**수용 기준**:
- [ ] 에러 로그 조회 (날짜 범위 필터)
- [ ] 사용자 접근 로그 조회
- [ ] 로그 레벨(ERROR/WARN/INFO) 필터

**리스크**:
- 백엔드 로그 API 미존재 가능성 → csp-was 확인 필수

---

### C-05 BEMS 에너지 대시보드 기초

| 항목 | 내용 |
|------|------|
| **난이도** | ⚫ Very High |
| **우선순위** | P3 |
| **예상 공수** | 3-4주 |
| **의존성** | C-02 (SSE), Phase B 완료 후 착수 |

**목적**: BEMS Phase D 구현의 기반 마련 및 MVP 제공

**주요 파일**:
- `src/app/(modules)/bems/page.tsx` — BEMS 메인 대시보드 (신규)
- `src/lib/types/bems.ts` — 에너지 데이터 타입
- `src/lib/api/bems.ts` — BEMS API 클라이언트
- `src/lib/hooks/use-bems.ts` — React Query 훅

**구현 내용 (MVP)**:
- 전력/가스/수도 사용량 현황 (오늘 / 이번 달 / 전월 대비)
- 기본 라인 차트 (시간대별 전력 사용량)
- 기존 `src/components/charts/line-chart.tsx` 활용

**수용 기준**:
- [ ] BEMS 메뉴 접근 시 에너지 현황 표시
- [ ] 전력/가스/수도 사용량 KPI 카드 3개
- [ ] 오늘/이번달 시계열 차트 표시
- [ ] 데이터 없을 시 EmptyState 표시

**리스크**:
- ⚠️ **차트 라이브러리 선택 미결정 — C-05 착수 전 결정 필수**
  - Recharts: 번들 크기 작음, React 친화적, 커스터마이징 제한
  - ECharts (echarts-for-react): 대용량 데이터 성능 우수, 100개+ 차트 타입, 번들 크기 큼 (~1MB)
  - **에너지 데이터 특성상(시계열 대용량) ECharts 권장**, 단 동적 import 필수
  - **C-05 착수 전 벤치마크 테스트 실행 후 결정** (1,000+ 포인트 렌더링 성능 비교)
- csp-was BEMS API 미존재 → 설계 전 API 스펙 확인 필수
- 실시간 데이터 구조가 기존 모듈과 상이 → 타입 정의에 충분한 시간 투자
- 완화: csp-was 컨트롤러에서 BEMS 관련 API 목록 선 확인

---

### C-06 FEMS 소방 설비 관리 기초

| 항목 | 내용 |
|------|------|
| **난이도** | 🔴 High |
| **우선순위** | P3 |
| **예상 공수** | 3-4주 |
| **의존성** | Phase B 완료 후 착수 |

**목적**: 법적 의무 사항인 소방 설비 관리 v2 구현

**주요 파일**:
- `src/app/(modules)/fems/` — 신규 모듈 디렉토리
- `src/lib/types/fems.ts` — 소방 설비 타입
- `src/lib/api/fems.ts` — FEMS API 클라이언트

**구현 내용 (MVP)**:
- 소방 설비 목록 (스프링클러, 소화기, 비상구)
- 정기점검 일정 조회
- 점검 기록 입력 (기본 폼)

**수용 기준**:
- [ ] 소방 설비 목록 CRUD 동작
- [ ] 정기점검 일정 캘린더 표시
- [ ] 점검 기록 등록 가능

**리스크**:
- csp-was FEMS API 스펙 미확인 → 설계 전 확인 필수
- 법적 요구사항 변동 → 유연한 스키마 설계 필요

---

### C-07 검색 자동완성

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P2 |
| **예상 공수** | 1주 |
| **의존성** | 없음 |

**목적**: 시니어 사용자의 검색 효율 향상

**주요 파일**:
- `src/components/forms/search-input.tsx` — 자동완성 SearchInput (신규 or 수정)
- `src/lib/hooks/use-search-history.ts` — 검색 이력 관리

**구현 내용**:
- 최근 검색어 localStorage 저장 (최대 10개)
- 입력 시 Combobox로 이력 제안
- 검색어 삭제 기능

**수용 기준**:
- [ ] 검색 입력 시 최근 검색어 드롭다운 표시
- [ ] 제안 클릭 시 검색 실행
- [ ] 각 제안 우측 X 버튼으로 삭제 가능

**리스크**: 낮음 (로컬 저장소 기반, 백엔드 API 불필요)

---

## Phase D: 장기 구현 (21-46주)

> **특징**: 새로운 모듈 / 매우 높은 복잡도 / 별도 기획 및 설계 필요
> **담당**: Senior 개발자 2-3명 + 데이터 엔지니어
> **선행 조건**: Phase A-C 완료, BEMS/BECM/FEMS API 스펙 확정

---

### D-01 BEMS 완전 구현 (85개 화면)

| 항목 | 내용 |
|------|------|
| **난이도** | ⚫ Very High |
| **우선순위** | P3 |
| **예상 공수** | 6-8주 |
| **의존성** | C-05 (BEMS 기초) |

**목적**: 빌딩 에너지 전체 관리 시스템 v2 완전 구현

**세부 구현 범위**:

| 서브모듈 | 화면 수 | 공수 |
|---------|--------|------|
| 에너지 대시보드 (전력/가스/수도/증기) | 5개 | 1주 |
| 에너지 상세 분석 (시간대/월별/연간) | 12개 | 2주 |
| 설비별 에너지 소비 분석 | 15개 | 1.5주 |
| 에너지 보고서 및 예측 | 20개 | 2주 |
| 설정 및 알림 (타겟/임계값) | 10개 | 1주 |
| 외부 기후 데이터 연동 | 3개 | 0.5주 |

**주요 파일**:
- `src/app/(modules)/bems/` — 전체 모듈 (서브 라우트 포함)
- `src/lib/types/bems.ts` — 에너지 타입 완성
- `src/components/charts/` — 에너지 특화 차트 컴포넌트

**수용 기준**:
- [ ] v1 BEMS 85개 화면 대비 90% 이상 기능 구현
- [ ] 실시간 에너지 데이터 표시 (30초 갱신)
- [ ] 전력/가스/수도/증기 각각 일별/월별/연별 차트
- [ ] 에너지 절감 목표 대비 진행률 표시
- [ ] 이상 사용량 알림 (임계값 초과 시 Bell 배지)
- [ ] 에너지 보고서 엑셀 다운로드

**리스크**:
- 시계열 데이터 대량 처리 성능 저하
  - 완화: Virtual scrolling, 데이터 집계(aggregation) API 요구
- 차트 렌더링 성능 (Recharts vs ECharts 검토 필요)
  - 완화: Canvas 기반 ECharts 채택 검토
- API 데이터 구조 불일치
  - 완화: 어댑터 패턴으로 API 응답 → 화면 모델 변환 레이어 구성

---

### D-02 BECM 실시간 모니터링 (64개 화면)

| 항목 | 내용 |
|------|------|
| **난이도** | 🔴 High |
| **우선순위** | P3 |
| **예상 공수** | 4-6주 |
| **의존성** | D-01 (BEMS) 일부 기반 재활용 |

**목적**: 냉난방 설비 실시간 운영 상태 모니터링

**세부 구현 범위**:
- 보일러/냉동기 실시간 상태 모니터링 (온도/압력/유량)
- 설비 런타임 추적 (가동/정지/대기)
- 유지보수 일정 관리
- 에러 로그 및 알림
- 성능 분석 (효율성/에너지 소비)

**수용 기준**:
- [ ] 설비 목록에서 실시간 상태 표시
- [ ] 임계값 초과 시 즉시 알림
- [ ] 유지보수 이력 조회 및 등록
- [ ] 설비별 월간 성능 보고서

**리스크**:
- ⚠️ **WebSocket 아키텍처 미결정 — D-02 착수 전 설계 문서 필수**
  - Next.js API Route는 stateless → 영속적 WebSocket 연결 불가
  - 선택지: socket.io 별도 서버 / Vercel 엣지 런타임 / 외부 Pusher/Ably 서비스
  - **D-02 착수 전 아키텍처 설계 문서 작성 및 리뷰 필수** (별도 태스크로 분리 권장)
- MQTT/WebSocket 실시간 센서 데이터 → 새로운 기술 스택
  - 완화: WebSocket 전용 훅 개발, 연결 관리 패턴 수립
- 다대다 설비-센서 매핑 복잡도
  - 완화: 설계 단계에서 ER 다이어그램 먼저 작성

---

### D-03 FEMS 완전 구현 (50개 화면)

| 항목 | 내용 |
|------|------|
| **난이도** | 🔴 High |
| **우선순위** | P3 |
| **예상 공수** | 4-5주 |
| **의존성** | C-06 (FEMS 기초) |

**목적**: 법적 의무 소방 관리 완전 디지털화

**세부 구현 범위**:
- 소방 설비 전체 목록 CRUD
- 정기점검 스케줄 관리 (캘린더 뷰)
- 점검 기록 상세 입력 (동적 체크리스트)
- AFDIS 센서 상태 모니터링
- 소방 보고서 자동 생성 (법령 양식)
- 규정 관리 (법령 버전별 체크리스트)

**수용 기준**:
- [ ] v1 FEMS 50개 화면 대비 90% 기능 구현
- [ ] 법령 양식 기반 점검 보고서 PDF 생성
- [ ] AFDIS 센서 실시간 상태 표시
- [ ] 점검 마감일 임박 알림 (7일 전)

**리스크**:
- 법령 변경 대응 → 동적 체크리스트 설계 필수
- PDF 생성 라이브러리 선택 (pdfkit, puppeteer, jspdf)
  - 완화: 서버사이드 PDF 생성 (Next.js API Route) 권장

---

### D-04 키보드 단축키 시스템

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P4 |
| **예상 공수** | 1-2주 |
| **의존성** | Phase A 완료 |

**목적**: 파워 유저 생산성 극대화

**주요 파일**:
- `src/lib/hooks/use-keyboard-shortcuts.ts` — 단축키 시스템
- `src/components/help/keyboard-shortcut-help.tsx` — 도움말 모달

**구현 내용**:
- `Ctrl+N`: 새 항목 등록
- `Ctrl+E`: 현재 항목 편집
- `Ctrl+Backspace`: 뒤로가기
- `?`: 단축키 도움말 모달
- `Esc`: 모달 닫기 / 필터 초기화

**수용 기준**:
- [ ] Ctrl+N으로 현재 모듈 등록 페이지 이동
- [ ] ? 키로 단축키 목록 모달 표시
- [ ] macOS (⌘) / Windows (Ctrl) 자동 구분

**리스크**: 낮음 (브라우저 기본 단축키 충돌 확인 필요)

---

### D-05 E2E 테스트 완성 (Playwright)

| 항목 | 내용 |
|------|------|
| **난이도** | 🟡 Medium |
| **우선순위** | P4 |
| **예상 공수** | 2-3주 |
| **의존성** | Phase A-C 완료 후 (기능 안정화 이후) |

**목적**: 릴리스 회귀 방지, QA 자동화

**주요 파일**:
- `tests/e2e/` — Playwright 테스트 스위트
- `.github/workflows/e2e.yml` — CI/CD 자동화

**구현 내용**:
- 핵심 플로우 테스트: 로그인 → 작업 등록 → 수정 → 삭제
- 각 모듈 기본 CRUD 스모크 테스트
- 필터 + 페이지네이션 동작 테스트

**수용 기준**:
- [ ] 10개 이상 핵심 플로우 E2E 테스트
- [ ] CI에서 PR시 자동 실행
- [ ] 실패 시 스크린샷 자동 첨부

**리스크**: 낮음 (기능 안정화 후 진행이므로 실패 확률 낮음)

---

## 전체 의존성 그래프

```
Phase A (독립)
├── A-01 KPI
├── A-02 엑셀 ◄─────────────────────── B-06 월간보고서
├── A-03 페이지크기
├── A-04 Tooltip
├── A-05 Zod 검증 ◄─ A-07 에러메시지
└── A-06 Aria-label

Phase B (대부분 독립)
├── B-01 nuqs
├── B-02 벌크액션
├── B-03 알림센터 ◄──────────────────── C-02 SSE
├── B-04 권한관리
├── B-05 CSV 등록
└── B-06 월간보고서 ◄── A-02 엑셀

Phase C (B 일부 선행)
├── C-01 감사로그
├── C-02 SSE ◄── B-03 알림센터
├── C-03 온보딩
├── C-04 시스템로그 ◄── C-01 감사로그
├── C-05 BEMS 기초 ◄── C-02 SSE
├── C-06 FEMS 기초
└── C-07 검색 자동완성

Phase D (C 완료 후)
├── D-01 BEMS 완전 ◄── C-05 BEMS기초
├── D-02 BECM ◄── D-01 BEMS 일부재활용
├── D-03 FEMS 완전 ◄── C-06 FEMS기초
├── D-04 단축키
└── D-05 E2E 테스트
```

---

## 전체 리스크 레지스터

| ID | 리스크 | 발생 확률 | 영향도 | 완화 전략 | 관련 태스크 |
|----|--------|---------|--------|---------|----------|
| R-01 | csp-was API 미존재 (알림, 감사로그, BEMS) | High | Very High | 착수 전 API 스펙 확인 필수 | B-03, C-01, C-05 |
| R-02 | nuqs 기존 필터 호환성 충돌 | Medium | High | 모듈별 점진적 마이그레이션 | B-01 |
| R-03 | 벌크 액션 배치 API 미지원 | Medium | High | Promise.all 병렬 대체 | B-02 |
| R-04 | SSE 서버 메모리 누수 | Medium | High | AbortController + cleanup 패턴 | C-02 |
| R-05 | BEMS 시계열 데이터 성능 | High | High | ECharts 검토, 집계 API 요구 | D-01 |
| R-06 | DataTable 대규모 수정 회귀 | Medium | High | Stories 기반 테스트 강화 | B-02 |
| R-07 | FEMS 법령 변경 대응 | Medium | Medium | 동적 체크리스트 아키텍처 | D-03 |
| R-08 | 권한 수정 API 미존재 | Medium | Medium | 먼저 csp-was 컨트롤러 확인 | B-04 |
| R-09 | 엑셀 대용량 메모리 부족 | Low | Medium | 5000행 제한 + 청크 다운로드 | A-02 |
| R-10 | 온보딩 라이브러리 번들 증가 | Low | Low | dynamic import 지연 로딩 | C-03 |

---

## 착수 전 사전 확인 체크리스트

Phase C/D 착수 전 반드시 확인:

- [ ] **csp-was 알림 API** 존재 여부 확인 (`/api/notifications` 또는 유사)
- [ ] **csp-was 감사 로그 API** 존재 여부 확인
- [ ] **csp-was BEMS API** 스펙 확인 (엔드포인트, 응답 형식)
- [ ] **csp-was BECM API** 스펙 확인
- [ ] **csp-was FEMS API** 스펙 확인
- [ ] **csp-was 벌크 삭제 API** 존재 여부 확인 (B-02 착수 전)
- [ ] **csp-was 역할 수정 API** 존재 여부 확인 (B-04 착수 전)

확인 방법:
```bash
# csp-was 컨트롤러 목록 확인
ls /Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/
```

---

## 개발 추정 요약

| Phase | 태스크 수 | 예상 공수 | 스토리 포인트 | 권장 담당 |
|-------|---------|---------|------------|---------|
| A | 7 | 3주 | ~30 SP | Junior-Middle 1명 |
| B | 6 | 5주 | ~70 SP | Middle 1-2명 |
| C | 7 | 10주 | ~90 SP | Middle-Senior 2명 |
| D | 5 | 20주 | ~130 SP | Senior 2-3명 + 데이터엔지니어 |
| **합계** | **25** | **~38주** | **~320 SP** | |

> **참고**: 단독 개발 시 약 9-12개월, 2명 병렬 시 약 5-7개월 예상
