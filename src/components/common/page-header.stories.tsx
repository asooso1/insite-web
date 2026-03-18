import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

const meta = {
  title: "Components/Common/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    title: "페이지 제목",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "작업 목록",
  },
};

export const WithDescription: Story = {
  args: {
    title: "시설 관리",
    description: "건물의 모든 시설을 관리하고 모니터링합니다.",
  },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader
      title="작업 목록"
      description="진행 중인 모든 작업을 확인합니다."
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          작업 등록
        </Button>
      }
    />
  ),
};

export const WithBackButton: Story = {
  render: () => (
    <PageHeader
      title="작업 상세"
      description="작업 #001 - 에어컨 정비"
    />
  ),
};

export const WithStats: Story = {
  render: () => (
    <PageHeader
      title="대시보드"
      description="에너지 관리 시스템"
      stats={[
        { label: "에너지 사용", value: "1,234 kWh" },
        { label: "비용 절감", value: "$2,340" },
        { label: "작업 완료", value: "85%" },
      ]}
    />
  ),
};

export const Full: Story = {
  render: () => (
    <PageHeader
      title="시설 상세"
      description="건물 A / 3층 에어컨"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            편집
          </Button>
          <Button>저장</Button>
        </div>
      }
      stats={[
        { label: "상태", value: "운영중" },
        { label: "마지막 점검", value: "2026-03-15" },
      ]}
    />
  ),
};

export const MobileResponsive: Story = {
  render: () => (
    <PageHeader
      title="모바일 최적화 헤더"
      description="작은 화면에서도 잘 보입니다"
      actions={
        <Button size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      }
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">제목만</h3>
        <PageHeader title="제목" />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">제목 + 설명</h3>
        <PageHeader title="제목" description="이것은 설명입니다" />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">제목 + 통계</h3>
        <PageHeader
          title="대시보드"
          stats={[
            { label: "총 작업", value: "123" },
            { label: "완료", value: "85" },
          ]}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">제목 + 액션</h3>
        <PageHeader
          title="작업"
          actions={<Button size="sm">등록</Button>}
        />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-3">전체 구성</h3>
        <PageHeader
          title="완전한 헤더"
          description="모든 요소가 포함되어 있습니다"
          actions={<Button size="sm">액션</Button>}
          stats={[{ label: "상태", value: "활성" }]}
        />
      </div>
    </div>
  ),
};
