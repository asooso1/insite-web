# 디자인 시스템 규칙

적용 대상: `**/*.tsx`, `src/components/**`

---

## ⚠️ 강제 규칙: Storybook Stories 의무

### 컴포넌트 사용 시
> **기존 컴포넌트를 사용하기 전에 반드시 해당 Stories 파일을 읽어야 한다.**

```
# 순서
1. src/components/{category}/{name}.stories.tsx 파일 Read
2. Stories에서 올바른 props/패턴 확인
3. 확인한 패턴 그대로 구현
```

Stories 파일을 읽지 않고 컴포넌트를 사용하는 것은 **금지**. 잘못된 props 사용, 패턴 불일치, 접근성 누락의 주요 원인이다.

### 컴포넌트 생성 시
> **새 재사용 컴포넌트를 만든 즉시 Stories 파일도 함께 생성해야 한다. Stories 없는 컴포넌트는 미완성이다.**

```
# 필수 Stories 구성
- Default: 가장 기본적인 사용 예제
- 주요 variant/상태: 2개 이상
- 엣지케이스: 빈 상태, 비활성, 에러 등
- 실제 사용 맥락 (InContext): 실제 페이지에서 어떻게 쓰이는지
```

### 위반 시나리오 (즉시 수정 대상)
```typescript
// ❌ Stories 확인 없이 추측으로 사용
<StatusBadge variant="success" label="완료" />  // 잘못된 props

// ✅ Stories 읽고 실제 API 확인 후 사용
// status-badge.stories.tsx 읽기 → status prop 확인
<StatusBadge status="COMPLETE" />
```

---

## 컴포넌트 카탈로그

### UI 기본 (`src/components/ui/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `Button` | UI/Button | 액션 버튼 (variant: default/destructive/outline/secondary/ghost/link) |
| `Input` | UI/Input | 텍스트 입력 |
| `Textarea` | UI/Textarea | 멀티라인 입력 |
| `Select` | UI/Select | 드롭다운 선택 |
| `Checkbox` | UI/Checkbox | 체크박스 |
| `Switch` | UI/Switch | 토글 스위치 |
| `Tabs` | UI/Tabs | 탭 네비게이션 |
| `Dialog` | UI/Dialog | 모달 다이얼로그 |
| `AlertDialog` | UI/AlertDialog | 확인 다이얼로그 (삭제 등 위험 액션) |
| `Badge` | UI/Badge | 인라인 배지 (variant: default/secondary/destructive/outline) |
| `Card` | UI/Card | 카드 컨테이너 |
| `Skeleton` | UI/Skeleton | 로딩 스켈레톤 |
| `Pagination` | UI/Pagination | 페이지네이션 |
| `Label` | UI/Label | 폼 필드 레이블 |
| `DropdownMenu` | UI/DropdownMenu | 드롭다운 메뉴 (컨텍스트 메뉴, 액션 메뉴) |
| `Tooltip` | UI/Tooltip | 툴팁 |
| `Separator` | UI/Separator | 구분선 (가로/세로) |
| `Accordion` | UI/Accordion | 아코디언 |
| `Breadcrumb` | UI/Breadcrumb | 경로 탐색 (3단계 이상) |
| `Table` | UI/Table | 기본 HTML 테이블 래퍼 (단순 표 용도만) |
| `Popover` | UI/Popover | 팝오버 (필터, 미니폼 등) |
| `ScrollArea` | UI/ScrollArea | 커스텀 스크롤 영역 |
| `Command` | UI/Command | 검색/명령 팔레트 |
| `Toggle` | UI/Toggle | 토글 버튼 |
| `ToggleGroup` | UI/ToggleGroup | 토글 그룹 (뷰 전환, 다중 선택) |
| `Avatar` | UI/Avatar | 사용자 아바타 (이미지 + 이니셜 폴백) |
| `Progress` | UI/Progress | 진행 상태 바 (variant: default/success/warning/error) |
| `Alert` | UI/Alert | 인라인 알림 (variant: default/destructive/warning/success/info) |
| `Sheet` | UI/Sheet | 슬라이드 패널 (side: right/left/bottom/top) |
| `Slider` | UI/Slider | 범위 슬라이더 (단일값/범위) |
| `NumberInput` | UI/NumberInput | 숫자 증감 입력 (-/+ 버튼) |
| `RadioGroup` | UI/RadioGroup | 라디오 그룹 |
| `AspectRatio` | UI/AspectRatio | 비율 고정 컨테이너 |
| `Sonner` | UI/Sonner | 토스트 알림 (sonner 라이브러리) |

### 데이터 표시 (`src/components/data-display/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `DataTable` | DataDisplay/DataTable | 목록 테이블 (TanStack Table 기반, 페이지네이션/정렬/선택 내장) |
| `DataTableToolbar` | DataDisplay/DataTableToolbar | DataTable 상단 툴바 |
| `StatusBadge` | DataDisplay/StatusBadge | 상태 배지 (도메인 상태 매핑) |
| `EmptyState` | DataDisplay/EmptyState | 빈/에러/검색없음 상태 |
| `KpiCard` | DataDisplay/KpiCard | KPI 수치 카드 |
| `InfoPanel` | DataDisplay/InfoPanel | 레이블-값 목록 패널 |
| `Chip` | DataDisplay/Chip | 태그/칩 |
| `StatWidget` | DataDisplay/StatWidget | 통계 위젯 |
| `Loader` | DataDisplay/Loader | 로딩 스피너 |

### 공통 (`src/components/common/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `PageHeader` | Common/PageHeader | 페이지 헤더 (제목+설명+아이콘+통계+액션) |
| `FilterBar` | Common/FilterBar | 목록 페이지 필터 (tabs/date-range/select/search) |

### 폼 (`src/components/forms/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `FormField` | Forms/FormField | 레이블+입력+에러 래퍼 (폼의 기본 단위) |
| `DatePicker` | Forms/DatePicker | 날짜 선택 |
| `FileUpload` | Forms/FileUpload | 파일 업로드 |
| `CascadingSelect` | Forms/CascadingSelect | 계층형 선택 (빌딩→층→구역 등) |
| `MultiSelect` | Forms/MultiSelect | 다중 선택 (검색 가능, 칩 표시) |
| `Combobox` | Forms/Combobox | 검색 가능한 단일 선택 드롭다운 |

### 차트 (`src/components/charts/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `AreaChart` | Charts/AreaChart | 영역 차트 (에너지 추이 등) |
| `BarChart` | Charts/BarChart | 막대 차트 |
| `LineChart` | Charts/LineChart | 선 차트 |
| `PieChart` | Charts/PieChart | 파이/도넛 차트 |

### 서드파티 (`src/components/third-party/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `RichTextEditor` | ThirdParty/RichTextEditor | 리치 텍스트 편집기 |
| `Calendar` | ThirdParty/Calendar | 달력/일정 |
| `PrintButton` | ThirdParty/PrintButton | 인쇄 버튼 |

---

## FilterBar 표준 패턴

목록 페이지의 필터는 반드시 `FilterBar` 컴포넌트를 사용한다.

```typescript
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";

// 1. 필터 정의 (파일 상단 상수로 선언)
const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "state", options: STATE_OPTIONS },
  { type: "date-range", fromKey: "dateFrom", toKey: "dateTo" },
  { type: "select", key: "searchCode", options: SEARCH_CODE_OPTIONS },
  { type: "search", key: "keyword", placeholder: "검색어를 입력하세요" },
];

// 2. 초기값 (tabs의 첫 option.value, 나머지 빈 문자열)
const INITIAL_FILTERS = { state: "", dateFrom: "", dateTo: "", searchCode: "title", keyword: "" };

// 3. 페이지 컴포넌트
function Page() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => setFilters(INITIAL_FILTERS);

  return (
    <FilterBar
      filters={FILTER_DEFS}
      values={filters}
      onChange={handleFilterChange}
      onReset={handleFilterReset}
      rightSlot={<Button variant="outline" size="sm">엑셀 다운로드</Button>}
    />
  );
}
```

**FilterDef 타입 정리:**

| type | 필수 props | 선택 props |
|------|-----------|-----------|
| `tabs` | `key`, `options` | - |
| `select` | `key`, `options` | `placeholder`, `allLabel` |
| `search` | `key` | `placeholder` |
| `date-range` | `fromKey`, `toKey` | `fromPlaceholder`, `toPlaceholder` |

---

## PageHeader 표준 패턴

```typescript
import { PageHeader } from "@/components/common/page-header";
import { Wrench } from "lucide-react";

// 목록 페이지
<PageHeader
  title="작업지시 목록"
  description="빌딩 시설물 유지보수 작업을 관리합니다"
  icon={Wrench}
  stats={[
    { label: "전체", value: 128 },
    { label: "진행중", value: 12, variant: "muted" },
  ]}
  actions={
    <Button asChild>
      <Link href="/work-orders/new">새 작업지시</Link>
    </Button>
  }
/>

// 상세 페이지 (뒤로가기 버튼은 클라이언트 컴포넌트로 분리)
<PageHeader title="작업지시 상세" />
```

---

## StatusBadge 사용 패턴

직접 색상 클래스 사용 **금지**. `StatusBadge` 컴포넌트만 사용.

```typescript
import { StatusBadge } from "@/components/data-display/status-badge";

// ❌ 금지
<span className="text-green-600 bg-green-100">운영중</span>

// ✅ 도메인 상태 직접 사용 (WorkOrderState, FacilityState enum 값)
<StatusBadge status="COMPLETE" />
<StatusBadge status="ONGOING_OPERATING" />

// ✅ 제네릭 상태 (도메인 enum이 없는 경우)
<StatusBadge status="pending" />    // 대기
<StatusBadge status="inProgress" /> // 진행중
<StatusBadge status="completed" />  // 완료
<StatusBadge status="cancelled" />  // 취소
```

**지원 status 값:**
- 작업지시: `WRITE` / `ISSUE` / `PROCESSING` / `REQ_COMPLETE` / `COMPLETE` / `CANCEL`
- 시설: `BEFORE_CONSTRUCT` / `ONGOING_CONSTRUCT` / `END_CONSTRUCT` / `BEFORE_OPERATING` / `ONGOING_OPERATING` / `END_OPERATING` / `DISCARD` / `NOW_CHECK`
- 제네릭: `pending` / `inProgress` / `completed` / `cancelled` / `low` / `medium` / `high` / `urgent`

---

## 상태 표현 패턴

**4가지 상태 필수 처리:**
```typescript
// 목록 페이지
if (isLoading) return <DataTableSkeleton columns={5} rows={10} />;
if (isError)   return <EmptyState type="error" onRetry={refetch} />;
if (!data?.length) return <EmptyState type="no-data" />;
// 정상 렌더링
```

**EmptyState type 구분:**
- `"no-data"` - 데이터 없음 + 등록 유도 버튼
- `"no-results"` - 검색 결과 없음 + 필터 초기화 버튼
- `"error"` - 에러 + 재시도 버튼

**스켈레톤 높이 표준:**
| 컴포넌트 | 높이 |
|---------|------|
| 테이블 행 | `h-10` |
| 카드 제목 | `h-5` |
| 카드 내용 | `h-4` |
| KPI 수치 | `h-9` |

---

## 컴포넌트 사용 원칙

**금지 패턴:**
```typescript
// ❌ 직접 색상 클래스로 상태 표현
<span className="text-green-600 bg-green-100">운영중</span>

// ❌ raw input checkbox
<input type="checkbox" className="h-4 w-4" />

// ❌ raw <table> 태그
<table><tbody><tr>...</tr></tbody></table>
```

**필수 패턴:**
```typescript
// ✅ StatusBadge
<StatusBadge status="ONGOING_OPERATING" />

// ✅ shadcn/ui Checkbox
<Checkbox checked={...} onCheckedChange={...} />

// ✅ DataTable
<DataTable columns={columns} data={data} loading={isLoading} />
```

**섀도우 통일 (CSS 변수 사용):**
```typescript
// ❌ Tailwind 직접
className="shadow-sm"

// ✅ CSS 변수 (globals.css 정의)
className="shadow-[var(--shadow-card)]"   // 카드
className="shadow-[var(--shadow-panel)]"  // 패널
```

---

## 타이포그래피 스케일

참조: `src/stories/design-system/Typography.stories.tsx`

| 요소 | 클래스 |
|------|--------|
| 페이지 제목 | `text-xl font-semibold` |
| 섹션 제목 | `text-base font-semibold` |
| 카드 제목 | `text-base font-semibold` |
| 필드 레이블 | `text-sm font-medium` |
| 헬퍼/에러 텍스트 | `text-xs text-muted-foreground` |
| KPI 수치 | `text-2xl font-bold tabular-nums` |

---

## 컬러 토큰

참조: `src/stories/design-system/Colors.stories.tsx`

직접 Tailwind 색상(`blue-600`, `green-500`) 사용 금지. CSS 변수 토큰 사용:

```typescript
// ❌ Tailwind 하드코딩
className="text-blue-600 bg-blue-50"

// ✅ CSS 변수 토큰
className="text-primary bg-primary/10"
className="text-muted-foreground bg-muted"
className="text-foreground bg-background"
```

---

## 반응형 브레이크포인트

- 모바일: `< lg` (1024px 미만) → 드로어 사이드바
- 데스크톱: `lg+` (1024px 이상) → 고정 사이드바

**`lg:` 기준 통일** — `sm:`, `md:` 혼용 금지 (단, 카드 패딩 `p-4 md:p-6`은 허용)

---

## 접근성 (WCAG 2.1 AA)

```typescript
// 아이콘 전용 버튼 — aria-label 필수
<Button aria-label="삭제"><Trash2 aria-hidden="true" /></Button>

// 서브메뉴
<button aria-expanded={open} aria-controls={`submenu-${id}`}>
<div id={`submenu-${id}`} role="list">

// 현재 페이지 링크
<Link aria-current={isActive ? "page" : undefined}>

// 모달 트리거
<button aria-haspopup="dialog">
```

**다크모드 대비율:**
```typescript
// ❌ opacity 축소로 대비 부족 (WCAG 실패)
dark:bg-blue-900/30 dark:text-blue-400

// ✅ 불투명 배경으로 대비 확보 (4.5:1 이상)
dark:bg-blue-900 dark:text-blue-300
```

---

## 애니메이션

```typescript
// ✅ prefers-reduced-motion 확인 후 적용
import { useMotionPreference } from "@/lib/hooks/use-motion-preference";

const { prefersReducedMotion } = useMotionPreference();
<div className={prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-top-2"}>
```

---

## 네비게이션 패턴

**상세 페이지 뒤로가기:** PageHeader는 Server Component이므로 별도 클라이언트 버튼으로 처리

```typescript
// _components/back-button.tsx (Client Component)
"use client";
export function BackButton() {
  const router = useRouter();
  return <Button variant="ghost" size="sm" onClick={() => router.back()}>← 목록으로</Button>;
}

// [id]/page.tsx
<PageHeader title="작업 상세" actions={<BackButton />} />
```

**Breadcrumb:** 3단계 이상 계층 구조 (`src/components/ui/breadcrumb.tsx`)

---

## Storybook 활용 가이드

### 컴포넌트 사용 전 (필수)

```
# AI 에이전트 / 개발자 모두 동일하게 적용
1. 위 카탈로그에서 컴포넌트 확인
2. src/components/{category}/{name}.stories.tsx 파일 Read
3. Stories에서 props API, variant, 올바른 사용 패턴 확인
4. 확인된 패턴 그대로 구현
```

### 컴포넌트 생성 후 (필수)

Stories 파일 구조:
```typescript
// src/components/{category}/{name}.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./component-name";

const meta = {
  title: "Category/ComponentName",  // 카탈로그 경로와 일치
  component: ComponentName,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { /* 기본값 */ } };
export const WithVariant: Story = { /* 주요 variant */ };
export const EdgeCase: Story = { /* 비활성/에러/빈 상태 */ };
export const InContext: Story = { render: () => (/* 실제 사용 맥락 */) };
```

**Stories 파일 위치 규칙:**
| 컴포넌트 위치 | Stories 위치 |
|-------------|------------|
| `src/components/ui/foo.tsx` | `src/components/ui/foo.stories.tsx` |
| `src/components/common/bar.tsx` | `src/components/common/bar.stories.tsx` |
| `src/components/data-display/baz.tsx` | `src/components/data-display/baz.stories.tsx` |
| `src/components/forms/qux.tsx` | `src/components/forms/qux.stories.tsx` |
| `src/components/charts/chart.tsx` | `src/components/charts/chart.stories.tsx` |
| `src/components/third-party/lib.tsx` | `src/components/third-party/lib.stories.tsx` |

### Storybook 실행

```bash
npm run storybook   # http://localhost:6006
```

---

## 체크리스트

### Stories 의무 (최우선)
- [ ] 사용한 모든 컴포넌트의 `.stories.tsx` 파일을 먼저 읽었음
- [ ] 새로 만든 컴포넌트에 `.stories.tsx` 파일 생성 완료
- [ ] Stories에 Default + 주요 variant + InContext 포함

### 컴포넌트 사용
- [ ] 상태 배지: `StatusBadge` 컴포넌트 사용 (직접 색상 클래스 금지)
- [ ] 체크박스: `Checkbox` 컴포넌트 사용 (raw `<input type="checkbox">` 금지)
- [ ] 테이블: `DataTable` 컴포넌트 사용 (raw `<table>` 금지 — 단순 표는 `Table` 허용)
- [ ] 필터: `FilterBar` 컴포넌트 사용 (FILTER_DEFS 선언형 패턴)
- [ ] 확인 다이얼로그: `AlertDialog` 사용 (`window.confirm` 금지)
- [ ] 드롭다운: `DropdownMenu` 사용
- [ ] 폼 필드: `FormField` 래퍼 사용 (label + input + error 묶음)
- [ ] 다중 선택: `MultiSelect` 사용 (일반 select 중복 금지)
- [ ] 검색 선택: `Combobox` 사용 (긴 목록 검색 필요 시)
- [ ] 슬라이드 패널: `Sheet` 사용 (모바일 상세/폼 패널)
- [ ] 인라인 알림: `Alert` 사용 (`toast` 아닌 페이지 내 메시지)
- [ ] 사용자 아바타: `Avatar` 사용
- [ ] 진행률: `Progress` 사용
- [ ] 라디오: `RadioGroup` 사용 (raw `<input type="radio">` 금지)
- [ ] 숫자 입력: `NumberInput` 사용 (증감 필요 시)

### 상태 처리
- [ ] 로딩/빈/에러 3가지 상태 모두 처리됨
- [ ] 로딩: `Skeleton` 또는 `Loader` 사용
- [ ] 빈/에러: `EmptyState` 사용

### 접근성 / 시각
- [ ] 아이콘 전용 버튼: `aria-label` 포함
- [ ] 다크모드 대비율: `opacity` 축소 없음 (4.5:1 이상)
- [ ] 반응형: `lg:` 기준 통일
- [ ] 애니메이션: `useMotionPreference` 확인
- [ ] 상세 페이지: 뒤로가기 버튼 포함
