# 컴포넌트 패턴 표준

적용 대상: `**/*.tsx`

---

## 목록 페이지 패턴

```
page.tsx (목록)
├── PageHeader (title + description + icon + stats + actions)
├── FilterBar (FilterDef[] 선언형 필터 — tabs/date-range/select/search)
├── DataTable (columns + data + loading + pagination)
└── 페이지네이션 (DataTable 내장 또는 별도)
```

### 표준 구현 템플릿

```typescript
"use client";
import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { DataTable, type ColumnDef } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { useModuleList } from "@/lib/hooks/use-module";

// ── 상수 ──────────────────────────────────────────────────────
const STATE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "WRITE", label: "작성" },
  { value: "ISSUE", label: "발행" },
];

const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "state", options: STATE_OPTIONS },
  { type: "date-range", fromKey: "dateFrom", toKey: "dateTo" },
  { type: "search", key: "keyword", placeholder: "검색어를 입력하세요" },
];

const INITIAL_FILTERS = { state: "", dateFrom: "", dateTo: "", keyword: "" };

// ── 컬럼 정의 ──────────────────────────────────────────────────
const columns: ColumnDef<ModuleItem>[] = [
  { accessorKey: "id", header: "No", size: 60 },
  { accessorKey: "name", header: "제목", size: 200 },
  {
    accessorKey: "state",
    header: "상태",
    cell: ({ row }) => <StatusBadge status={row.original.state} />,
    size: 100,
  },
];

// ── 컴포넌트 ──────────────────────────────────────────────────
export default function ModulePage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const { data, isLoading, isError, refetch } = useModuleList(filters);

  const handleFilterChange = (key: string, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const handleFilterReset = () => setFilters(INITIAL_FILTERS);

  if (isError) return <EmptyState type="error" onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="모듈 목록"
        description="모듈 설명"
        icon={Wrench}
        actions={
          <Button asChild size="sm">
            <Link href="/module/new"><Plus className="mr-1 h-4 w-4" />새 등록</Link>
          </Button>
        }
      />
      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        pagination
        pageSize={20}
      />
    </div>
  );
}
```

**필수 사항:**
- `DataTable` 컴포넌트 사용 (`<table>` 직접 사용 금지)
- `FilterBar` 컴포넌트 사용 (직접 Input/Tabs/Select 구성 금지)
- `StatusBadge` 컴포넌트 사용 (직접 색상 클래스 금지)
- 빈 데이터: `<EmptyState type="no-data">` + 등록 유도 버튼
- 에러: `<EmptyState type="error" onRetry={refetch}>` + 재시도 버튼

---

## 상세 페이지 패턴

```
[id]/page.tsx (상세, Server Component)
├── PageHeader (title + actions: [BackButton, EditButton, DeleteButton])
├── Tabs (기본정보 / 관련데이터1 / 관련데이터2)
│   ├── TabsTrigger
│   └── TabsContent
│       └── InfoPanel (레이블-값 목록)
└── 삭제: AlertDialog 확인 후 실행
```

```typescript
// [id]/page.tsx
import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailActions } from "./_components/detail-actions"; // Client Component

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await getModuleDetail(Number(params.id));

  return (
    <div className="space-y-4">
      <PageHeader
        title={item.name}
        actions={<DetailActions id={item.id} />}
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">기본정보</TabsTrigger>
          <TabsTrigger value="related">관련 데이터</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InfoPanel
            items={[
              { label: "상태", value: <StatusBadge status={item.state} /> },
              { label: "등록일", value: item.createdAt },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 폼 페이지 패턴

```
new/page.tsx 또는 [id]/edit/page.tsx
├── PageHeader (title + actions: [BackButton])
└── _components/{module}-form.tsx (Client Component)
    ├── React Hook Form + Zod 스키마
    ├── FormField (label + input + error)
    ├── 취소 버튼 (router.back())
    └── 저장 버튼 (isPending 로딩 상태)
```

```typescript
// _components/module-form.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/error-handler";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  // ...
});

export function ModuleForm({ defaultValues }: { defaultValues?: Partial<FormValues> }) {
  const router = useRouter();
  const { mutate, isPending } = useAddModule();

  const form = useForm({ resolver: zodResolver(schema), defaultValues });

  async function onSubmit(data: FormValues) {
    try {
      await mutate(data);
      toast.success("등록되었습니다.");
      router.push("/module");
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="이름" required error={form.formState.errors.name?.message}>
          <Input aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
        </FormField>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
```

**필수 사항:**
- React Hook Form + Zod 스키마 조합 필수
- 성공: `toast.success("등록/수정되었습니다.")`
- 실패: `handleApiError(error)`
- 필수 필드: `label` 끝에 `*` 표시 (`required` prop)
- 삭제: `AlertDialog` 사용 (`window.confirm` 금지)

---

## React Query 표준 설정

```typescript
// 목록 쿼리
useQuery({
  queryKey: moduleKeys.list(params),
  queryFn: () => getModuleList(params),
  staleTime: 30 * 1000,        // 30초 필수
});

// 상세 쿼리
useQuery({
  queryKey: moduleKeys.detail(id),
  queryFn: () => getModuleDetail(id),
  enabled: id > 0,
  staleTime: 60 * 1000,        // 1분 필수
});

// 실시간성이 중요한 경우
useQuery({
  staleTime: 0, // 의도적 설정임을 주석으로 명시
});
```

**staleTime 기준:**
| 쿼리 유형 | staleTime |
|-----------|-----------|
| 목록 | `30 * 1000` (30초) |
| 상세 | `60 * 1000` (1분) |
| 정적 데이터(빌딩 목록 등) | `Infinity` |
| 실시간 필요 | `0` + 주석 |

**QueryClient 전역 설정 (`src/components/providers/query-provider.tsx`):**
```typescript
refetchOnWindowFocus: false  // 탭 전환 시 불필요한 재요청 방지
retry: 1                     // 실패 시 1회만 재시도
```

---

## 색상/상태 시스템

**StatusBadge 사용 기준:**
| 상태 의미 | StatusBadge status |
|---------|-------------------|
| 활성/정상/완료 | `completed` / `ONGOING_OPERATING` / `COMPLETE` |
| 비활성/중단/취소 | `cancelled` / `CANCEL` |
| 진행중/처리중 | `inProgress` / `PROCESSING` |
| 대기/작성 | `pending` / `WRITE` |
| 경고/긴급 | `high` / `urgent` |

**직접 색상 클래스 사용 금지:**
```typescript
// ❌ 금지
<span className="text-green-600">운영중</span>
<div className="bg-red-100 text-red-700">오류</div>

// ✅ 허용
<StatusBadge status="ONGOING_OPERATING" />
<StatusBadge status="urgent" />
```

---

## 폼 필드 간격 표준

```typescript
<form className="space-y-4">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <FormField label="제목" required><Input {...} /></FormField>
    <FormField label="상태"><Select {...} /></FormField>
  </div>
  <FormField label="내용"><Textarea {...} /></FormField>
</form>
```

---

## DataTable 컬럼 정렬 기준

| 열 유형 | 정렬 | 방법 |
|--------|------|-----|
| 텍스트 | 좌측 (기본) | - |
| 숫자/금액 | 우측 | `meta: { className: "text-right" }` |
| 상태 배지 | 중앙 | `meta: { className: "text-center" }` |
| 날짜 | 좌측 | `className="text-muted-foreground"` |

---

## 접근성 (A11y) 필수 속성

```typescript
// 아이콘 전용 버튼
<Button aria-label="삭제">
  <Trash2 className="h-4 w-4" aria-hidden="true" />
</Button>

// 서브메뉴 버튼
<button aria-expanded={isOpen} aria-controls={`submenu-${id}`}>
<div id={`submenu-${id}`} role="list">

// 모달 트리거
<button aria-haspopup="dialog">

// 현재 페이지 링크
<Link aria-current={isActive ? "page" : undefined}>
```

---

## 체크리스트

- [ ] 목록: `DataTable` + `FilterBar` + `PageHeader` 사용
- [ ] 상세: `InfoPanel` + `Tabs` + `PageHeader` 구조
- [ ] 폼: `React Hook Form` + `Zod` + `toast` 피드백
- [ ] 삭제: `AlertDialog` 사용
- [ ] staleTime 설정됨 (목록 30s, 상세 60s)
- [ ] `StatusBadge` 컴포넌트 사용 (직접 색상 금지)
- [ ] ARIA 속성 적용됨
- [ ] 새 컴포넌트 → Stories 파일 생성
