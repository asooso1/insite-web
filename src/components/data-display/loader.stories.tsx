import type { Meta, StoryObj } from "@storybook/react";
import { Loader, FullPageLoader as FullPageLoaderComponent, InlineLoader } from "./loader";

const meta = {
  title: "Components/Data Display/Loader",
  component: Loader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <Loader size="sm" />
        <span className="text-xs text-muted-foreground">작은 (4x4)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Loader size="md" />
        <span className="text-xs text-muted-foreground">중간 (6x6)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Loader size="lg" />
        <span className="text-xs text-muted-foreground">큼 (8x8)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Loader size="xl" />
        <span className="text-xs text-muted-foreground">매우 큼 (12x12)</span>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">기본 색상</h3>
        <div className="flex items-center gap-6">
          <Loader size="md" />
          <span className="text-sm text-muted-foreground">기본 색상 로더</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">커스텀 색상 (className)</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Loader size="md" className="text-primary" />
            <span className="text-sm">주요 색상</span>
          </div>
          <div className="flex items-center gap-4">
            <Loader size="md" className="text-green-600" />
            <span className="text-sm">성공 색상</span>
          </div>
          <div className="flex items-center gap-4">
            <Loader size="md" className="text-red-600" />
            <span className="text-sm">오류 색상</span>
          </div>
          <div className="flex items-center gap-4">
            <Loader size="md" className="text-blue-600" />
            <span className="text-sm">정보 색상</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">인라인 로더 - 메시지 없음</h3>
        <div className="border rounded-lg p-8 bg-muted/50">
          <InlineLoader />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">인라인 로더 - 메시지 포함</h3>
        <div className="border rounded-lg p-8 bg-muted/50">
          <InlineLoader message="데이터를 불러오는 중..." />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">테이블 로딩 시뮬레이션</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="border-b p-4 bg-muted">
            <p className="font-medium">테이블 콘텐츠</p>
          </div>
          <InlineLoader message="테이블을 불러오는 중..." />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">커스텀 클래스</h3>
        <div className="border rounded-lg p-8 bg-muted/50">
          <InlineLoader
            message="업로드 중..."
            className="py-12"
          />
        </div>
      </div>
    </div>
  ),
};

export const FullPage: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">전체 페이지 로더 (스크린샷)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        아래는 전체 페이지 로더가 어떻게 보이는지 보여줍니다.
      </p>

      <div className="border rounded-lg h-96 bg-background relative flex items-center justify-center">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <Loader size="xl" />
            <p className="text-sm text-muted-foreground">데이터를 불러오는 중...</p>
          </div>
        </div>
        <div className="text-center text-muted-foreground">
          페이지 콘텐츠
        </div>
      </div>
    </div>
  ),
};

export const FullPageLoaderStory: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">FullPageLoader 컴포넌트</h3>
      <p className="text-sm text-muted-foreground mb-4">
        전체 화면을 덮는 로더 (주로 페이지 로드 시에 사용)
      </p>

      <div className="border rounded-lg h-96 bg-background relative flex items-center justify-center overflow-hidden">
        <FullPageLoaderComponent message="페이지를 로드하는 중..." />
        <div className="text-center text-muted-foreground z-0">
          페이지 콘텐츠 (로더 아래)
        </div>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">폼 로딩 상태</h3>
        <div className="border rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">제목</label>
              <div className="h-10 bg-muted rounded-md animate-pulse" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">설명</label>
              <div className="h-24 bg-muted rounded-md animate-pulse" />
            </div>
            <div className="flex justify-center py-4">
              <Loader size="md" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">목록 로딩 상태</h3>
        <div className="border rounded-lg p-6">
          <InlineLoader message="작업 목록을 불러오는 중..." />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">모달 로딩 상태</h3>
        <div className="border rounded-lg p-6 relative h-48 bg-muted/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background rounded-lg shadow-lg p-8 flex flex-col items-center gap-4">
              <Loader size="lg" />
              <p className="text-sm text-muted-foreground">처리 중...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
