import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type ColumnDef } from "./data-table";

// ============================================================================
// 예시 데이터 타입
// ============================================================================

interface Facility {
  id: number;
  name: string;
  location: string;
  state: string;
  manager: string;
  createdAt: string;
}

// ============================================================================
// 예시 데이터
// ============================================================================

const SAMPLE_DATA: Facility[] = [
  { id: 1, name: "중앙 공조기", location: "B1 기계실", state: "운영중", manager: "김민준", createdAt: "2024-01-15" },
  { id: 2, name: "비상 발전기", location: "B2 전기실", state: "점검중", manager: "이서연", createdAt: "2024-02-20" },
  { id: 3, name: "소방 펌프", location: "B1 소방실", state: "운영중", manager: "박지훈", createdAt: "2024-03-10" },
  { id: 4, name: "냉각탑 A", location: "옥상", state: "운영중", manager: "최수아", createdAt: "2024-03-25" },
  { id: 5, name: "엘리베이터 1호", location: "로비", state: "고장", manager: "정도현", createdAt: "2024-04-01" },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

const columns: ColumnDef<Facility>[] = [
  {
    accessorKey: "id",
    header: "No",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
    size: 60,
  },
  {
    accessorKey: "name",
    header: "시설명",
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.original.name}</span>
    ),
    size: 160,
  },
  {
    accessorKey: "location",
    header: "위치",
    size: 120,
  },
  {
    accessorKey: "state",
    header: "상태",
    cell: ({ row }) => {
      const state = row.original.state;
      const colorMap: Record<string, string> = {
        운영중: "bg-green-100 text-green-700",
        점검중: "bg-yellow-100 text-yellow-700",
        고장: "bg-red-100 text-red-700",
      };
      return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorMap[state] ?? "bg-gray-100 text-gray-600"}`}>
          {state}
        </span>
      );
    },
    size: 90,
  },
  {
    accessorKey: "manager",
    header: "담당자",
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: "등록일",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.createdAt}</span>
    ),
    size: 110,
  },
];

const columnsUnknown = columns as unknown as ColumnDef<unknown>[];

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Components/Data Display/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "TanStack Table 기반의 고기능 데이터 테이블. 페이지네이션, 정렬, 선택, 가상 스크롤을 지원합니다.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  args: {
    columns: columnsUnknown,
    data: SAMPLE_DATA as unknown[],
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    columns: columnsUnknown,
    data: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns: columnsUnknown,
    data: [],
    loading: false,
  },
};

export const WithPagination: Story = {
  args: {
    columns: columnsUnknown,
    data: SAMPLE_DATA as unknown[],
    loading: false,
    pagination: true,
    pageSize: 3,
  },
};

export const Striped: Story = {
  args: {
    columns: columnsUnknown,
    data: SAMPLE_DATA as unknown[],
    loading: false,
    variant: "striped",
  },
};
