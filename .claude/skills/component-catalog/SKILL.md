---
name: component-catalog
description: insite-web 전체 컴포넌트 카탈로그 및 Storybook 가이드. 새 컴포넌트 도입 또는 어떤 컴포넌트가 있는지 확인할 때 사용.
allowed-tools: Read, Glob
---

# 컴포넌트 카탈로그

$ARGUMENTS

## UI 기본 (`src/components/ui/`)

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

## 데이터 표시 (`src/components/data-display/`)

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

## 공통 (`src/components/common/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `PageHeader` | Common/PageHeader | 페이지 헤더 (제목+설명+아이콘+통계+액션) |
| `FilterBar` | Common/FilterBar | 목록 페이지 필터 (tabs/date-range/select/search) |

## 폼 (`src/components/forms/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `FormField` | Forms/FormField | 레이블+입력+에러 래퍼 (폼의 기본 단위) |
| `DatePicker` | Forms/DatePicker | 날짜 선택 |
| `FileUpload` | Forms/FileUpload | 파일 업로드 |
| `CascadingSelect` | Forms/CascadingSelect | 계층형 선택 (빌딩→층→구역 등) |
| `MultiSelect` | Forms/MultiSelect | 다중 선택 (검색 가능, 칩 표시) |
| `Combobox` | Forms/Combobox | 검색 가능한 단일 선택 드롭다운 |

## 차트 (`src/components/charts/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `AreaChart` | Charts/AreaChart | 영역 차트 (에너지 추이 등) |
| `BarChart` | Charts/BarChart | 막대 차트 |
| `LineChart` | Charts/LineChart | 선 차트 |
| `PieChart` | Charts/PieChart | 파이/도넛 차트 |

## 서드파티 (`src/components/third-party/`)

| 컴포넌트 | Story 경로 | 주요 용도 |
|---------|------------|---------|
| `RichTextEditor` | ThirdParty/RichTextEditor | 리치 텍스트 편집기 |
| `Calendar` | ThirdParty/Calendar | 달력/일정 |
| `PrintButton` | ThirdParty/PrintButton | 인쇄 버튼 |

---

## Storybook Stories 작성 가이드

### Stories 파일 구조

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

### Stories 파일 위치

| 컴포넌트 위치 | Stories 위치 |
|-------------|------------|
| `src/components/ui/foo.tsx` | `src/components/ui/foo.stories.tsx` |
| `src/components/common/bar.tsx` | `src/components/common/bar.stories.tsx` |
| `src/components/data-display/baz.tsx` | `src/components/data-display/baz.stories.tsx` |
| `src/components/forms/qux.tsx` | `src/components/forms/qux.stories.tsx` |
| `src/components/charts/chart.tsx` | `src/components/charts/chart.stories.tsx` |

```bash
npm run storybook   # http://localhost:6006
```
