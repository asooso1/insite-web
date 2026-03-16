import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FilterBar, type FilterDef } from "./filter-bar";

// ============================================================================
// 공통 옵션 정의
// ============================================================================

const STATE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "WRITE", label: "작성" },
  { value: "ISSUE", label: "발행" },
  { value: "PROCESSING", label: "처리중" },
  { value: "COMPLETE", label: "완료" },
  { value: "CANCEL", label: "취소" },
];

const SEARCH_CODE_OPTIONS = [
  { value: "title", label: "업무명" },
  { value: "writer", label: "작성자" },
  { value: "handler", label: "처리자" },
];

// ============================================================================
// Wrapper (useState 필요)
// ============================================================================

function FilterBarWrapper({ filters }: { filters: FilterDef[] }) {
  const initial: Record<string, string> = {};
  filters.forEach((f) => {
    if (f.type === "date-range") {
      initial[f.fromKey] = "";
      initial[f.toKey] = "";
    } else {
      initial[f.key] = "";
    }
  });

  const [values, setValues] = useState<Record<string, string>>(initial);

  return (
    <FilterBar
      filters={filters}
      values={values}
      onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
      onReset={() => setValues(initial)}
    />
  );
}

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Components/Common/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "목록 페이지 표준 필터 컴포넌트. FilterDef 배열로 선언적으로 구성하며 tabs/date-range/select/search 타입을 지원합니다.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

export const TabsOnly: Story = {
  render: () => (
    <FilterBarWrapper
      filters={[{ type: "tabs", key: "state", options: STATE_OPTIONS }]}
    />
  ),
};

export const WithSearch: Story = {
  render: () => (
    <FilterBarWrapper
      filters={[
        { type: "tabs", key: "state", options: STATE_OPTIONS },
        { type: "search", key: "keyword", placeholder: "업무명 검색..." },
      ]}
    />
  ),
};

export const WithDateRange: Story = {
  render: () => (
    <FilterBarWrapper
      filters={[
        { type: "tabs", key: "state", options: STATE_OPTIONS },
        { type: "date-range", fromKey: "dateFrom", toKey: "dateTo" },
        { type: "search", key: "keyword", placeholder: "검색어 입력..." },
      ]}
    />
  ),
};

export const Full: Story = {
  render: () => (
    <FilterBarWrapper
      filters={[
        { type: "tabs", key: "state", options: STATE_OPTIONS },
        { type: "date-range", fromKey: "dateFrom", toKey: "dateTo" },
        {
          type: "select",
          key: "searchCode",
          options: SEARCH_CODE_OPTIONS,
        },
        { type: "search", key: "keyword", placeholder: "검색어를 입력하세요" },
      ]}
    />
  ),
};

export const WithRightSlot: Story = {
  name: "엑셀 다운로드 버튼 (rightSlot)",
  render: () => {
    const [values, setValues] = useState({ keyword: "" });
    const filters: FilterDef[] = [
      { type: "search", key: "keyword", placeholder: "검색어 입력..." },
    ];
    return (
      <FilterBar
        filters={filters}
        values={values}
        onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        onReset={() => setValues({ keyword: "" })}
        rightSlot={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>
        }
      />
    );
  },
};

export const SearchOnly: Story = {
  render: () => (
    <FilterBarWrapper
      filters={[{ type: "search", key: "keyword", placeholder: "시설명 검색..." }]}
    />
  ),
};
