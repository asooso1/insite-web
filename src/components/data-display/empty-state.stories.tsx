import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle, Search, FileX, Inbox } from "lucide-react";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Components/DataDisplay/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    title: "데이터가 없습니다",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoData: Story = {
  args: {
    icon: Inbox,
    title: "데이터가 없습니다",
    description: "아직 등록된 데이터가 없습니다. 새로운 데이터를 등록해주세요.",
  },
};

export const NoResults: Story = {
  args: {
    icon: Search,
    title: "검색 결과가 없습니다",
    description: "검색 조건에 맞는 데이터가 없습니다. 다른 검색 조건을 시도해보세요.",
  },
};

export const Error: Story = {
  args: {
    icon: AlertCircle,
    title: "데이터를 불러올 수 없습니다",
    description: "요청을 처리하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    action: { label: "다시 시도", onClick: () => {} },
  },
};

export const NoDataWithAction: Story = {
  args: {
    icon: FileX,
    title: "작업이 없습니다",
    description: "새 작업을 등록하여 시작하세요.",
    action: { label: "작업 등록", onClick: () => {} },
  },
};

export const NoResultsWithAction: Story = {
  args: {
    icon: Search,
    title: "검색 결과가 없습니다",
    description: "다른 검색어나 필터를 시도해보세요.",
    action: { label: "필터 초기화", onClick: () => {} },
  },
};

export const ErrorWithAction: Story = {
  args: {
    icon: AlertCircle,
    title: "오류가 발생했습니다",
    description: "데이터를 로드하는 중 문제가 발생했습니다.",
    action: { label: "재시도", onClick: () => {} },
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-sm font-semibold mb-6">데이터 없음</h3>
        <EmptyState
          icon={Inbox}
          title="데이터가 없습니다"
          description="등록된 데이터가 없습니다."
          action={{ label: "데이터 등록", onClick: () => {} }}
        />
      </div>

      <div className="border-t pt-12">
        <h3 className="text-sm font-semibold mb-6">검색 결과 없음</h3>
        <EmptyState
          icon={Search}
          title="검색 결과가 없습니다"
          description="조건에 맞는 데이터를 찾지 못했습니다."
          action={{ label: "필터 초기화", onClick: () => {} }}
        />
      </div>

      <div className="border-t pt-12">
        <h3 className="text-sm font-semibold mb-6">오류</h3>
        <EmptyState
          icon={AlertCircle}
          title="오류가 발생했습니다"
          description="데이터를 불러오는 중 문제가 발생했습니다."
          action={{ label: "재시도", onClick: () => {} }}
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
          icon={FileX}
          title="아직 작업이 없습니다"
          description="새 작업을 등록하여 시작하세요."
          action={{ label: "작업 등록", onClick: () => {} }}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">시설 검색 - 결과 없음</h3>
        <EmptyState
          icon={Search}
          title="검색 조건에 맞는 시설이 없습니다"
          description="다른 검색 조건을 시도해보세요."
          action={{ label: "조건 초기화", onClick: () => {} }}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">데이터 로드 - 오류</h3>
        <EmptyState
          icon={AlertCircle}
          title="데이터를 불러올 수 없습니다"
          description="네트워크 연결을 확인하고 다시 시도해주세요."
          action={{ label: "새로고침", onClick: () => {} }}
        />
      </div>
    </div>
  ),
};
