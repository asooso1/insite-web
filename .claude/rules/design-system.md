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

전체 목록은 `/component-catalog` 스킬 참조. 자주 쓰는 컴포넌트:

| 상황 | 컴포넌트 | 경로 |
|------|---------|------|
| 목록 테이블 | `DataTable` | `data-display/data-table` |
| 상태 배지 | `StatusBadge` | `data-display/status-badge` |
| 빈/에러 상태 | `EmptyState` | `data-display/empty-state` |
| 페이지 헤더 | `PageHeader` | `common/page-header` |
| 필터 | `FilterBar` | `common/filter-bar` |
| 폼 필드 | `FormField` | `forms/form-field` |
| 삭제 확인 | `AlertDialog` | `ui/alert-dialog` |

---

## StatusBadge 사용 패턴

직접 색상 클래스 사용 **금지**. `StatusBadge` 컴포넌트만 사용.

**지원 status 값:**
- 수시업무: `WRITE` / `ISSUE` / `PROCESSING` / `REQ_COMPLETE` / `COMPLETE` / `CANCEL`
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

## Storybook 활용

컴포넌트 사용 전: `src/components/{category}/{name}.stories.tsx` 파일을 먼저 읽어 올바른 props 확인.
새 컴포넌트 생성 후: 동일 경로에 `.stories.tsx` 파일 생성 필수 (Default + 주요 variant + InContext).
Stories 상세 구조: `/component-catalog` 스킬 참조.

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
