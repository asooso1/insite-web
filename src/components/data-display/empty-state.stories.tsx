import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/DataDisplay/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["no-data", "no-results", "error"],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoData: Story = {
  args: {
    type: "no-data",
    title: "데이터가 없습니다",
    description: "아직 등록된 데이터가 없습니다. 새로운 데이터를 등록해주세요.",
  },
};

export const NoResults: Story = {
  args: {
    type: "no-results",
    title: "검색 결과가 없습니다",
    description: "검색 조건에 맞는 데이터가 없습니다. 다른 검색 조건을 시도해보세요.",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    title: "데이터를 불러올 수 없습니다",
    description: "요청을 처리하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },
};

export const NoDataWithAction: Story = {
  render: () => (
    <EmptyState
      type="no-data"
      title="작업이 없습니다"
      description="새 작업을 등록하여 시작하세요."
      action={<Button>작업 등록</Button>}
    />
  ),
};

export const NoResultsWithAction: Story = {
  render: () => (
    <EmptyState
      type="no-results"
      title="검색 결과가 없습니다"
      description="다른 검색어나 필터를 시도해보세요."
      action={<Button variant="outline">필터 초기화</Button>}
    />
  ),
};

export const ErrorWithAction: Story = {
  render: () => (
    <EmptyState
      type="error"
      title="오류가 발생했습니다"
      description="데이터를 로드하는 중 문제가 발생했습니다."
      action={<Button>재시도</Button>}
    />
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-sm font-semibold mb-6">데이터 없음</h3>
        <EmptyState
          type="no-data"
          title="데이터가 없습니다"
          description="등록된 데이터가 없습니다."
          action={<Button>데이터 등록</Button>}
        />
      </div>

      <div className="border-t pt-12">
        <h3 className="text-sm font-semibold mb-6">검색 결과 없음</h3>
        <EmptyState
          type="no-results"
          title="검색 결과가 없습니다"
          description="조건에 맞는 데이터를 찾지 못했습니다."
          action={<Button variant="outline">필터 초기화</Button>}
        />
      </div>

      <div className="border-t pt-12">
        <h3 className="text-sm font-semibold mb-6">오류</h3>
        <EmptyState
          type="error"
          title="오류가 발생했습니다"
          description="데이터를 불러오는 중 문제가 발생했습니다."
          action={<Button>재시도</Button>}
        />
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">작업 목록 - 데이터 없음</h3>
        <EmptyState
          type="no-data"
          title="아직 작업이 없습니다"
          description="새 작업을 등록하여 시작하세요."
          action={<Button>작업 등록</Button>}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">시설 검색 - 결과 없음</h3>
        <EmptyState
          type="no-results"
          title="검색 조건에 맞는 시설이 없습니다"
          description="다른 검색 조건을 시도해보세요."
          action={<Button variant="outline">조건 초기화</Button>}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">데이터 로드 - 오류</h3>
        <EmptyState
          type="error"
          title="데이터를 불러올 수 없습니다"
          description="네트워크 연결을 확인하고 다시 시도해주세요."
          action={<Button>새로고침</Button>}
        />
      </div>
    </div>
  ),
};
