# UI 대규모 업그레이드 계획 (v3 - 최종)

> 기존 csp-web 대비 insite-web UI를 상당한 수준으로 업그레이드
> Architect APPROVED + Critic REJECT → 타입명/Enum 오류 수정 + 구체 명세 보강

**작성일:** 2026-02-23 | **버전:** v3 (최종)
**변경 내역:** 타입명 4개 수정, FacilityState 5개→8개 수정, WorkOrderState 1개 수정, empty-state 구체 명세, search-filter-bar 구체 명세, page-header 위치 변경

---

## 요구사항 요약

| # | 요구사항 | 검증 방법 |
|---|---------|----------|
| R1 | 현재 작업물 커밋 + 롤백 가능 브랜치 | `git log --oneline -5` SHA 확인 |
| R2 | UI 대규모 업그레이드 (csp-web 대비 시각 완성도) | `/ui-preview` Before/After 비교 |
| R3 | Mock 데이터로 동작하는 환경 | `/ui-preview` 전 컴포넌트 렌더링 |
| R4 | `/ui-preview` 테스트 페이지 생성 | 10개+ 섹션 접근 및 렌더링 |

---

## "상당한 수준의 UI 업그레이드" 구체적 정의

| 항목 | 현재 상태 | 목표 상태 |
|------|----------|----------|
| Header | `bg-[var(--bg-header)]` 단순 배경 | `backdrop-blur-sm` + glassmorphism 효과 |
| Card | `shadow-sm` 단일 그림자 | `hover:shadow-md transition-shadow` 인터랙티브 |
| KPI Card 아이콘 | `bg-primary/10` 단색 배경 | gradient-brand-soft 그라데이션 컨테이너 |
| StatusBadge | generic 상태 (pending/inProgress) | 도메인 실제 Enum 값 직접 매핑 |
| 목록 상태 탭 | `<button>` 날 태그 직접 사용 | shadcn `Tabs` 컴포넌트로 교체 |
| 테이블 헤더 | 스타일 없는 기본 th | `bg-muted/50 sticky top-0` 고정 헤더 |
| 사이드바 활성 항목 | accent 배경만 | `border-l-[3px] border-primary` 강조선 |
| EmptyState 아이콘 | `bg-muted rounded-full p-4` 단색 | gradient-brand-soft + rounded-2xl + shadow |
| SearchFilterBar | 필터 항상 표시 | 토글 버튼으로 접기/펼치기 |
| 페이지 헤더 | 없음 또는 단순 h1 | 아이콘 + 제목 + 설명 + 통계 인라인 |

---

## 수용 기준 (10개 — 모두 검증 가능)

- [ ] `git log --oneline -5` 출력에서 "UI 업그레이드 전 상태 보존" 커밋 SHA 확인
- [ ] `git branch` 에서 `feature/ui-upgrade` 현재 위치 확인
- [ ] `curl -s http://localhost:3000/ui-preview` → HTTP 200 (개발서버)
- [ ] Chrome DevTools → Elements에서 `data-section` 속성 10개+ 확인
- [ ] `/ui-preview` 데이터 테이블에서 작업지시 Mock 50개 행 렌더링 확인
- [ ] `/work-orders` 접근 → 기존 목록/필터/페이지네이션 정상 동작
- [ ] `/facilities` 접근 → 기존 목록/필터/페이지네이션 정상 동작
- [ ] 다크모드 클래스 토글 → `/ui-preview` 전체 색상 정상 전환
- [ ] `npm run build` → 오류 없이 완료
- [ ] `npm run type-check` → TypeScript 오류 0개

---

## 구현 단계 (파일 수준 최종 명세)

### Phase 0: 안전 커밋 및 브랜치 설정

```bash
git add -A
git commit -m "chore: UI 업그레이드 전 상태 보존 (롤백 포인트)"
git checkout -b feature/ui-upgrade
```

**검증:** `git log --oneline -3` → 커밋 확인

---

### Phase 1: Mock 데이터 레이어 구축

**위치:** `src/mocks/data/` (기존 MSW `src/mocks/` 통합, 프로덕션 번들 분리)

**생성 파일 (타입 참조 — 실제 파일에서 확인된 인터페이스명):**

| 파일 | 참조 타입 | 소스 파일 | Mock 개수 |
|------|---------|---------|---------|
| `src/mocks/data/work-orders.ts` | `WorkOrderListDTO` | `src/lib/types/work-order.ts` | 50개 |
| `src/mocks/data/facilities.ts` | `FacilityListDTO` | `src/lib/types/facility.ts` | 30개 |
| `src/mocks/data/users.ts` | `AccountDTO` | `src/lib/types/user.ts` | 20개 |
| `src/mocks/data/clients.ts` | `CompanyDTO` | `src/lib/types/client.ts` | 10개 |
| `src/mocks/data/materials.ts` | `MaterialDTO` | `src/lib/types/material.ts` | 30개 |
| `src/mocks/data/dashboard.ts` | `WorkOrderStatusWidget`, `NoticeWidgetItem`, `ScheduleItem` | `src/lib/types/dashboard.ts` | KPI 4개, 월별 12개 |
| `src/mocks/data/notices.ts` | `NoticeListDTO` | `src/lib/types/board.ts` | 20개 |
| `src/mocks/data/mock-utils.ts` | — | — | 유틸 (ID, 날짜, 랜덤) |
| `src/mocks/data/index.ts` | — | — | 전체 re-export |

**WorkOrder Mock 상태 분산 (50개):**
`WRITE`:8, `ISSUE`:10, `PROCESSING`:15, `REQ_COMPLETE`:8, `COMPLETE`:7, `CANCEL`:2
*(WorkOrderState enum: `src/lib/types/work-order.ts:14-21` 기준)*

**번들 보호:** `/ui-preview` 페이지에서 동적 import 사용:
```typescript
// ui-preview/page.tsx (Server Component)
const { mockWorkOrders } = process.env.NODE_ENV === 'development'
  ? await import('@/mocks/data/work-orders')
  : { mockWorkOrders: [] };
```

**검증:** `npx tsc --noEmit` → Mock 파일 타입 오류 없음

---

### Phase 2a: Design Tokens 추가 (기존 값 변경 없음)

**파일:** `src/app/globals.css` (`:root` 블록 하단에 추가, 기존 변수 일절 수정 금지)

```css
/* ==================== UI 업그레이드 추가 토큰 ==================== */
/* 카드 그림자 */
--shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06);
--shadow-panel: 0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.08);
/* 브랜드 그라데이션 */
--gradient-brand: linear-gradient(135deg, #0064FF 0%, #4B90FF 100%);
--gradient-brand-soft: linear-gradient(135deg, rgba(0,100,255,0.12) 0%, rgba(75,144,255,0.06) 100%);
--gradient-success: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
--gradient-warning: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
--gradient-danger: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
--gradient-neutral: linear-gradient(135deg, #64748B 0%, #475569 100%);
/* 헤더 블러 */
--backdrop-header: saturate(180%) blur(10px);
--bg-header-upgrade: rgba(255,255,255,0.80);
```

`.dark` 블록 하단에 추가:
```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.15);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.20);
--shadow-panel: 0 0 0 1px rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.20);
--bg-header-upgrade: rgba(15,15,20,0.80);
```

**검증:** `npm run build` 성공 + 기존 페이지 시각 미변화 (토큰만 추가)

---

### Phase 2b: 8개 컴포넌트 스타일 업그레이드

#### 2b-1. `src/components/layout/header.tsx`
**변경:** 배경을 새 헤더 토큰으로 교체 (line 72 기준)
- `bg-[var(--bg-header)]` → `bg-[var(--bg-header-upgrade)]`
- 기존 `backdrop-blur-sm` **제거** 후 `[backdrop-filter:var(--backdrop-header)]` **교체** (중복 적용 금지)
- `border-b border-border` → `border-b border-border/50`
- **주의:** `backdrop-blur-sm`을 유지하면서 `[backdrop-filter:...]`를 추가하지 말 것 — 교체임

#### 2b-2. `src/components/layout/sidebar.tsx`
**변경:** 활성 메뉴 항목 강조선 추가
- 활성 Link: `border-l-[3px] border-primary pl-[13px]` + `bg-sidebar-accent/60` (기존 bg-sidebar-accent 교체)
- 비활성 Link: `border-l-[3px] border-transparent pl-[13px]` (정렬 유지)
- 모든 Link: `transition-colors duration-150` 추가

#### 2b-3. `src/components/data-display/kpi-card.tsx`
**변경 (파일 내 구체 라인):**
- `line 66` Card className 추가: `shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200`
- `line 85` 아이콘 컨테이너: `bg-primary/10` → `bg-[var(--gradient-brand-soft)]` (Tailwind arbitrary value 사용)

#### 2b-4. `src/components/data-display/status-badge.tsx`
**변경:** 도메인 실제 Enum 값 variant 추가 (기존 generic variant 유지)
```typescript
// 작업지시 실제 상태 (WorkOrderState: src/lib/types/work-order.ts:14-21)
WRITE: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
ISSUE: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
REQ_COMPLETE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
COMPLETE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
CANCEL: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
// 시설 실제 상태 (FacilityState: src/lib/types/facility.ts:14-23) — 8개 전체
BEFORE_CONSTRUCT: "bg-slate-100 text-slate-600 ...",
ONGOING_CONSTRUCT: "bg-violet-100 text-violet-700 ...",
END_CONSTRUCT: "bg-indigo-100 text-indigo-700 ...",
BEFORE_OPERATING: "bg-sky-100 text-sky-700 ...",
ONGOING_OPERATING: "bg-green-100 text-green-700 ...",
END_OPERATING: "bg-slate-100 text-slate-600 ...",
DISCARD: "bg-gray-100 text-gray-400 ...",
NOW_CHECK: "bg-amber-100 text-amber-700 ...",
```
**dotColors, statusLabels에도 동일하게 추가 (status-badge.tsx:37-68 패턴 반복)**

#### 2b-5. `src/components/data-display/info-panel.tsx`
**변경:**
- InfoPanel wrapper: `shadow-[var(--shadow-panel)]` + `border border-border/60` 추가
- InfoItem label (찾아서 적용): `text-xs font-medium text-muted-foreground uppercase tracking-wide` (csp-web label-text10 재현)

#### 2b-6. `src/components/data-display/empty-state.tsx`
**현재 상태 (파일 확인 완료):**
- `line 43`: `"mb-4 rounded-full bg-muted p-4"` — 단색 원형 아이콘 컨테이너
- `line 44`: `"h-8 w-8 text-muted-foreground"` — 작은 회색 아이콘

**구체적 변경:**
- `line 43`: `"mb-4 rounded-full bg-muted p-4"` → `"mb-4 rounded-2xl bg-[var(--gradient-brand-soft)] p-5 shadow-[var(--shadow-card)]"`
- `line 44`: `"h-8 w-8 text-muted-foreground"` → `"h-10 w-10 text-primary"`
- `line 46`: h3 → `"mb-1 text-lg font-semibold text-foreground"` 유지 (변경 없음)

#### 2b-7. `src/components/data-display/data-table.tsx`
**변경:** TableHead 셀에 고정 헤더 스타일 추가
- TableHead의 `<th>` 셀: `bg-muted/50 sticky top-0 backdrop-blur-sm` 추가
- **금지:** `data-table.tsx:195` VirtualTableBody rows에 transition/animation/translate 절대 추가 금지 (useVirtualizer 충돌)

#### 2b-8. `src/components/forms/search-filter-bar.tsx`
**현재 상태 (파일 확인 완료):**
- `FilterConfig` 배열로 필터 설정을 받음 (line 34-45)
- `SearchFilterBarProps`에 `filters?: FilterConfig[]` (line 53)
- 필터가 있으면 항상 표시됨

**구체적 변경:**
- `SearchFilterBarProps`에 `showFilterToggle?: boolean` prop 추가 (기본값 false)
- `showFilterToggle=true` 일 때: "필터" 버튼 + `ChevronDown` 아이콘 표시, 클릭 시 필터 패널 토글
- 필터 패널 wrapper: `border border-border/60 rounded-lg p-3 mt-2` + `transition-all duration-200`
- 접힌 상태: `hidden` / 펼친 상태: `flex flex-wrap gap-2`
- 기존 `filters` prop 동작 (항상 표시) 유지 (`showFilterToggle`가 false일 때 기존과 동일)

**검증 (Phase 2b):**
- `npm run build` 성공
- `/work-orders`, `/facilities` 기존 기능 동일 동작

---

### Phase 3: 미들웨어 + 페이지 레벨 업그레이드

#### 3-0. `src/middleware.ts` 수정 (line 8-16)
**변경:** `/ui-preview` 개발 전용 공개 경로 추가
```typescript
const PUBLIC_PATHS = [
  "/login",
  "/id-find",
  "/password-change",
  "/guest",
  "/m",
  "/api/auth/login",
  "/api/auth/refresh",
  ...(process.env.NODE_ENV === "development" ? ["/ui-preview"] : []),
];
```

#### 3-1. `src/components/common/page-header.tsx` (신규 생성)
**위치:** `src/components/common/` (재사용 컴포넌트, `layout/` 싱글턴과 분리 — Architect 권고)
**인터페이스:**
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  stats?: { label: string; value: number | string; variant?: "default" | "muted" }[];
  actions?: ReactNode;
  className?: string;
}
```
**시각 목표:** 아이콘(primary/10 배경) + 제목(text-xl font-semibold) + 설명(text-sm text-muted-foreground) + 우측 stats 배지 + actions

#### 3-2. work-orders/page.tsx 상태 탭 교체
**파일:** `src/app/(modules)/work-orders/page.tsx`
**현재:** `line 347-361` — `STATE_TABS.map()` 내 `<button>` 직접 사용
**변경:** shadcn `Tabs` / `TabsList` / `TabsTrigger` 로 교체
```typescript
// 기존 useState 로직 유지 (line 251, 287-289)
// Tabs의 value → state, onValueChange → handleStateChange 바인딩
// TabsTrigger value 빈 문자열 처리: "ALL" 로 변경 후 API 호출 시 undefined 변환
```

#### 3-3. facilities/page.tsx 상태 탭 교체
**파일:** `src/app/(modules)/facilities/page.tsx`
**현재:** `line 281-295` — `<button>` 직접 사용
**변경:** 3-2와 동일 패턴 적용

#### 3-4. work-orders/[id]/page.tsx InfoItem 통합
**파일:** `src/app/(modules)/work-orders/[id]/page.tsx`
**현재:** `line 154-172` — 인라인 `InfoItem` 컴포넌트 중복 정의
**변경:** `src/components/data-display/info-panel.tsx`의 `InfoItem` import로 교체

---

### Phase 4: `/ui-preview` 테스트 페이지 생성

**파일:**
- `src/app/ui-preview/layout.tsx` (신규 — AppShell 제외, Root Layout Providers 상속)
- `src/app/ui-preview/page.tsx` (신규 — Server Component)

**ui-preview/layout.tsx:**
```typescript
export default function UIPreviewLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm px-6 py-3">
        <h1 className="font-semibold">UI Preview — insite-web</h1>
      </nav>
      <main className="container mx-auto px-6 py-8 space-y-16">{children}</main>
    </div>
  );
}
```

**ui-preview/page.tsx 섹션 (data-section 속성 10개):**

| # | data-section | 내용 | Mock 사용 |
|---|-------------|------|----------|
| 1 | `colors` | 브랜드/상태/그라데이션/중립 팔레트 | ✗ |
| 2 | `typography` | 폰트 스케일 + 웨이트 전시 | ✗ |
| 3 | `badges` | StatusBadge 전체 Enum 값 (WorkOrderState 6개 + FacilityState 8개) | ✗ |
| 4 | `kpi-cards` | KPICard 4개 (dashboard Mock) | ✓ |
| 5 | `data-table` | DataTable 50개 작업지시 Mock | ✓ |
| 6 | `filter-bar` | SearchFilterBar + 토글 필터 인터랙티브 | ✓ |
| 7 | `info-panel` | InfoPanel 시설 상세 Mock (2컬럼) | ✓ |
| 8 | `charts` | BarChart + LineChart (대시보드 Mock) | ✓ |
| 9 | `forms` | Input, Select, DatePicker, FileUpload 갤러리 | ✗ |
| 10 | `empty-states` | EmptyState 3종 (NoData, NoSearchResults, ErrorState) | ✗ |

---

## 파일 변경 요약

| Phase | 파일 | 작업 | 라인 수 추정 |
|-------|------|-----|------------|
| Phase 1 | `src/mocks/data/` 9개 파일 | 신규 | ~500줄 |
| Phase 2a | `src/app/globals.css` | 추가 (~30줄) | +30줄 |
| Phase 2b | `src/components/layout/header.tsx` | 수정 | ~3줄 변경 |
| Phase 2b | `src/components/layout/sidebar.tsx` | 수정 | ~8줄 변경 |
| Phase 2b | `src/components/data-display/kpi-card.tsx` | 수정 | ~4줄 변경 |
| Phase 2b | `src/components/data-display/status-badge.tsx` | 수정 (variant 14개 추가) | ~50줄 추가 |
| Phase 2b | `src/components/data-display/info-panel.tsx` | 수정 | ~5줄 변경 |
| Phase 2b | `src/components/data-display/empty-state.tsx` | 수정 (line 43-44) | ~2줄 변경 |
| Phase 2b | `src/components/data-display/data-table.tsx` | 수정 (헤더만) | ~3줄 변경 |
| Phase 2b | `src/components/forms/search-filter-bar.tsx` | 수정 (토글 추가) | ~30줄 추가 |
| Phase 3 | `src/middleware.ts` | 수정 (line 8-16) | ~3줄 추가 |
| Phase 3 | `src/components/common/page-header.tsx` | 신규 | ~60줄 |
| Phase 3 | `src/app/(modules)/work-orders/page.tsx` | 수정 (Tabs 교체) | ~20줄 변경 |
| Phase 3 | `src/app/(modules)/facilities/page.tsx` | 수정 (Tabs 교체) | ~20줄 변경 |
| Phase 3 | `src/app/(modules)/work-orders/[id]/page.tsx` | 수정 (InfoItem 통합) | ~5줄 변경 |
| Phase 4 | `src/app/ui-preview/layout.tsx` | 신규 | ~20줄 |
| Phase 4 | `src/app/ui-preview/page.tsx` | 신규 | ~200줄 |
| **합계** | **17개 파일** | **9 신규 + 8 수정** | **~950줄** |

---

## 리스크 및 완화

| 리스크 | 심각도 | 완화 |
|--------|--------|------|
| globals.css → 기존 컴포넌트 깨짐 | 높음 | Phase 2a: 기존 값 변경 절대 금지, 신규만 추가 |
| DataTable VirtualTableBody 애니메이션 | 높음 | 명시적 금지: line 195 rows에 transition 적용 안 함 |
| `/ui-preview` 프로덕션 노출 | 중간 | middleware.ts NODE_ENV 개발 전용 게이트 |
| Mock 데이터 프로덕션 번들 오염 | 중간 | dynamic import + NODE_ENV 조건부 (Phase 1 번들 보호 섹션) |
| 탭 교체 시 상태 로직 깨짐 | 중간 | 기존 useState 로직 유지, Tabs의 value/onValueChange 바인딩만 변경 |
| TypeScript 타입 오류 | 낮음 | satisfies로 Mock 파일 검증 + npx tsc --noEmit |
| STATE_TABS 빈 문자열 Radix 경고 | 낮음 | "ALL" 으로 변경 후 API 호출 시 `value === "ALL" ? undefined : value` 변환 |

---

## Changelog (v2 → v3)

- **[수정] Mock 타입명 4개:** UserListDTO→AccountDTO, ClientListDTO→CompanyDTO, MaterialListDTO→MaterialDTO, DashboardDTO→WorkOrderStatusWidget/NoticeWidgetItem/ScheduleItem
- **[수정] FacilityState Enum 8개:** OPERATING 등 잘못된 이름 → 실제 코드 기준 (BEFORE_CONSTRUCT, ONGOING_CONSTRUCT, END_CONSTRUCT, BEFORE_OPERATING, ONGOING_OPERATING, END_OPERATING, DISCARD, NOW_CHECK)
- **[수정] WorkOrderState 1개:** COMPLETE_REQUEST → REQ_COMPLETE
- **[추가] empty-state.tsx 구체 명세:** line 43-44 정확한 className 변경 명시
- **[추가] search-filter-bar.tsx 구체 명세:** showFilterToggle prop + 토글 패널 className 명시
- **[변경] page-header 위치:** `src/components/layout/` → `src/components/common/` (Architect 권고)
- **[추가] STATE_TABS "ALL" 변환 로직** 리스크에 명시
