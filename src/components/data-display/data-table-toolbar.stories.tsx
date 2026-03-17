import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTableToolbar, type FilterConfig } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

// ============================================================================
// 타입 및 모의 데이터
// ============================================================================

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "시설 점검",
    status: "진행중",
    priority: "높음",
    assignee: "김철수",
    dueDate: "2026-03-20",
  },
  {
    id: "2",
    title: "보고서 작성",
    status: "대기중",
    priority: "중간",
    assignee: "이영희",
    dueDate: "2026-03-25",
  },
  {
    id: "3",
    title: "데이터 분석",
    status: "완료",
    priority: "낮음",
    assignee: "박민준",
    dueDate: "2026-03-15",
  },
  {
    id: "4",
    title: "회의 준비",
    status: "진행중",
    priority: "높음",
    assignee: "정수진",
    dueDate: "2026-03-18",
  },
];

// ============================================================================
// Storybook 메타
// ============================================================================

const meta: Meta<typeof DataTableToolbar> = {
  title: "DataDisplay/DataTableToolbar",
  component: DataTableToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "DataTable의 검색, 필터, 컬럼 가시성 토글을 관리하는 툴바 컴포넌트입니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTableToolbar>;

// ============================================================================
// 헬퍼 함수
// ============================================================================

function createMockTable(data: Task[]) {
  const columnHelper = createColumnHelper<Task>();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      header: "제목",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: "상태",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("priority", {
      header: "우선순위",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("assignee", {
      header: "담당자",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("dueDate", {
      header: "마감일",
      cell: (info) => info.getValue(),
    }),
  ];

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
}

// ============================================================================
// Stories
// ============================================================================

/**
 * 기본 툴바 (검색만)
 */
export const Default: Story = {
  render: () => {
    const table = createMockTable(mockTasks);

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          테이블 검색 기능만 활성화된 기본 툴바입니다.
        </div>
        <DataTableToolbar
          table={table}
          enableGlobalSearch={true}
          searchPlaceholder="작업 검색..."
        />
      </div>
    );
  },
};

/**
 * 필터 포함
 */
export const WithFilters: Story = {
  render: () => {
    const table = createMockTable(mockTasks);

    const filters: FilterConfig[] = [
      {
        columnId: "status",
        label: "상태",
        placeholder: "전체 상태",
        options: [
          { label: "진행중", value: "진행중" },
          { label: "대기중", value: "대기중" },
          { label: "완료", value: "완료" },
        ],
      },
      {
        columnId: "priority",
        label: "우선순위",
        placeholder: "전체 우선순위",
        options: [
          { label: "높음", value: "높음" },
          { label: "중간", value: "중간" },
          { label: "낮음", value: "낮음" },
        ],
      },
    ];

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          상태와 우선순위 필터가 추가된 툴바입니다.
        </div>
        <DataTableToolbar
          table={table}
          enableGlobalSearch={true}
          searchPlaceholder="작업 검색..."
          filters={filters}
        />
      </div>
    );
  },
};

/**
 * 검색 포함
 */
export const WithSearch: Story = {
  render: () => {
    const table = createMockTable(mockTasks);

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          전역 검색 기능이 활성화된 툴바입니다.
        </div>
        <DataTableToolbar
          table={table}
          enableGlobalSearch={true}
          searchPlaceholder="제목, 담당자 등으로 검색..."
          enableColumnVisibility={true}
        />
      </div>
    );
  },
};

/**
 * 액션 버튼 포함
 */
export const WithActions: Story = {
  render: () => {
    const table = createMockTable(mockTasks);

    const actionButtons = (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          내보내기
        </Button>
        <Button size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          새 작업
        </Button>
      </div>
    );

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          오른쪽에 액션 버튼이 추가된 툴바입니다.
        </div>
        <DataTableToolbar
          table={table}
          enableGlobalSearch={true}
          searchPlaceholder="검색..."
          enableColumnVisibility={true}
          actions={actionButtons}
        />
      </div>
    );
  },
};

/**
 * 전체 기능 포함
 */
export const Complete: Story = {
  render: () => {
    const table = createMockTable(mockTasks);

    const filters: FilterConfig[] = [
      {
        columnId: "status",
        label: "상태",
        options: [
          { label: "진행중", value: "진행중" },
          { label: "대기중", value: "대기중" },
          { label: "완료", value: "완료" },
        ],
      },
      {
        columnId: "priority",
        label: "우선순위",
        options: [
          { label: "높음", value: "높음" },
          { label: "중간", value: "중간" },
          { label: "낮음", value: "낮음" },
        ],
      },
    ];

    const actionButtons = (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          내보내기
        </Button>
        <Button size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          새 작업
        </Button>
      </div>
    );

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          검색, 필터, 컬럼 가시성, 액션 버튼이 모두 포함된 완전한 툴바입니다.
        </div>
        <DataTableToolbar
          table={table}
          enableGlobalSearch={true}
          searchPlaceholder="제목, 담당자, 날짜로 검색..."
          filters={filters}
          enableColumnVisibility={true}
          actions={actionButtons}
          debounceDelay={300}
        />
        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
          <p>활성 필터가 있으면 위에 표시되며, 각 필터의 X 버튼으로 개별 제거가 가능합니다.</p>
        </div>
      </div>
    );
  },
};

/**
 * 컬럼 검색만 (전역 검색 대신)
 */
export const ColumnSearch: Story = {
  render: () => {
    const table = createMockTable(mockTasks);

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          특정 컬럼(제목)에 대한 검색만 활성화된 툴바입니다.
        </div>
        <DataTableToolbar
          table={table}
          searchColumnId="title"
          searchPlaceholder="작업 제목 검색..."
          enableColumnVisibility={true}
        />
      </div>
    );
  },
};

/**
 * 컬럼 가시성 토글만
 */
export const ColumnVisibilityOnly: Story = {
  render: () => {
    const table = createMockTable(mockTasks);

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          컬럼 가시성 토글 버튼만 표시되는 최소한의 툴바입니다.
        </div>
        <DataTableToolbar
          table={table}
          enableColumnVisibility={true}
        />
      </div>
    );
  },
};

/**
 * 필터 활성화 상태 시뮬레이션
 */
export const WithActiveFilters: Story = {
  render: () => {
    const [data] = useState(mockTasks);
    const table = createMockTable(data);

    // 필터 시뮬레이션: 상태 필터 적용
    const filters: FilterConfig[] = [
      {
        columnId: "status",
        label: "상태",
        options: [
          { label: "진행중", value: "진행중" },
          { label: "대기중", value: "대기중" },
          { label: "완료", value: "완료" },
        ],
      },
      {
        columnId: "priority",
        label: "우선순위",
        options: [
          { label: "높음", value: "높음" },
          { label: "중간", value: "중간" },
          { label: "낮음", value: "낮음" },
        ],
      },
    ];

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          필터가 적용된 상태를 표시합니다. 활성 필터가 아래에 칩으로 표시됩니다.
        </div>
        <DataTableToolbar
          table={table}
          enableGlobalSearch={true}
          searchPlaceholder="검색..."
          filters={filters}
          enableColumnVisibility={true}
        />
        <div className="mt-4 p-3 bg-muted rounded text-sm">
          현재 필터 상태: <code className="bg-background px-2 py-1 rounded">status=진행중</code>
        </div>
      </div>
    );
  },
};
