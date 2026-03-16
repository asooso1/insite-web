import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Settings, User, Bell } from "lucide-react";

const meta = {
  title: "Components/UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">탭 1</TabsTrigger>
        <TabsTrigger value="tab2">탭 2</TabsTrigger>
        <TabsTrigger value="tab3">탭 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            이것은 첫 번째 탭의 내용입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            이것은 두 번째 탭의 내용입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            이것은 세 번째 탭의 내용입니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          계정
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          알림
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          설정
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="p-4">
          <h3 className="font-semibold mb-2">계정 정보</h3>
          <p className="text-sm text-muted-foreground">
            사용자 계정 관련 정보를 여기에 표시합니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="p-4">
          <h3 className="font-semibold mb-2">알림 설정</h3>
          <p className="text-sm text-muted-foreground">
            알림 관련 설정을 여기에 표시합니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4">
          <h3 className="font-semibold mb-2">사용자 설정</h3>
          <p className="text-sm text-muted-foreground">
            기타 설정을 여기에 표시합니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="details">상세정보</TabsTrigger>
        <TabsTrigger value="history">이력</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            개요 탭 내용
          </p>
        </div>
      </TabsContent>
      <TabsContent value="details">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            상세정보 탭 내용
          </p>
        </div>
      </TabsContent>
      <TabsContent value="history">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            이력 탭 내용
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">활성</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          비활성화
        </TabsTrigger>
        <TabsTrigger value="another">다른 탭</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            이 탭은 선택 가능합니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="disabled">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            이 탭은 비활성화되어 있습니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="another">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            다른 탭입니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="vertical1" orientation="vertical">
      <TabsList className="flex-col h-auto w-fit">
        <TabsTrigger value="vertical1" className="justify-start">
          세로 탭 1
        </TabsTrigger>
        <TabsTrigger value="vertical2" className="justify-start">
          세로 탭 2
        </TabsTrigger>
        <TabsTrigger value="vertical3" className="justify-start">
          세로 탭 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="vertical1">
        <div className="p-4">
          <h3 className="font-semibold mb-2">세로 탭 1</h3>
          <p className="text-sm text-muted-foreground">
            세로 방향 탭 레이아웃의 첫 번째 콘텐츠입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="vertical2">
        <div className="p-4">
          <h3 className="font-semibold mb-2">세로 탭 2</h3>
          <p className="text-sm text-muted-foreground">
            세로 방향 탭 레이아웃의 두 번째 콘텐츠입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="vertical3">
        <div className="p-4">
          <h3 className="font-semibold mb-2">세로 탭 3</h3>
          <p className="text-sm text-muted-foreground">
            세로 방향 탭 레이아웃의 세 번째 콘텐츠입니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="line1">
      <TabsList variant="line">
        <TabsTrigger value="line1">라인 탭 1</TabsTrigger>
        <TabsTrigger value="line2">라인 탭 2</TabsTrigger>
        <TabsTrigger value="line3">라인 탭 3</TabsTrigger>
      </TabsList>
      <TabsContent value="line1">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            라인 스타일의 첫 번째 탭입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="line2">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            라인 스타일의 두 번째 탭입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="line3">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            라인 스타일의 세 번째 탭입니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
