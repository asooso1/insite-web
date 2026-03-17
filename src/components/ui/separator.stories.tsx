import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

const meta = {
  title: "Components/UI/Separator",
  component: Separator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <h3 className="text-sm font-semibold">섹션 1</h3>
        <p className="text-sm text-muted-foreground">위의 콘텐츠</p>
      </div>
      <Separator {...args} />
      <div>
        <h3 className="text-sm font-semibold">섹션 2</h3>
        <p className="text-sm text-muted-foreground">아래의 콘텐츠</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex gap-4">
      <div>
        <h3 className="text-sm font-semibold">왼쪽</h3>
        <p className="text-sm text-muted-foreground">좌측 콘텐츠</p>
      </div>
      <Separator {...args} className="h-auto" />
      <div>
        <h3 className="text-sm font-semibold">오른쪽</h3>
        <p className="text-sm text-muted-foreground">우측 콘텐츠</p>
      </div>
    </div>
  ),
};

export const WithText: StoryObj = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">작업 목록</h3>
        <ul className="space-y-2 text-sm">
          <li>작업 1</li>
          <li>작업 2</li>
          <li>작업 3</li>
        </ul>
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 transform">
          <div className="bg-background relative flex justify-center text-xs font-medium text-muted-foreground">
            <span className="px-2">또는</span>
          </div>
        </div>
        <Separator />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">추가 작업</h3>
        <ul className="space-y-2 text-sm">
          <li>추가 작업 1</li>
          <li>추가 작업 2</li>
        </ul>
      </div>
    </div>
  ),
};

export const InCard: StoryObj = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>시설 정보</CardTitle>
        <CardDescription>시설 상세 정보</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">시설명</p>
            <p className="text-sm text-muted-foreground">강남 센터 HVAC</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">상태</p>
            <p className="text-sm text-muted-foreground">운영 중</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">위치</p>
            <p className="text-sm text-muted-foreground">옥상</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const InMenu: StoryObj = {
  render: () => (
    <Card className="w-full max-w-xs">
      <CardContent className="p-0">
        <div className="space-y-0">
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted">
            편집
          </button>
          <Separator />
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted">
            복사
          </button>
          <Separator />
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted">
            보관
          </button>
          <Separator />
          <button className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
            삭제
          </button>
        </div>
      </CardContent>
    </Card>
  ),
};

export const BetweenItems: StoryObj = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-0">
        {["항목 1", "항목 2", "항목 3", "항목 4"].map((item, index) => (
          <div key={item}>
            <div className="p-3 text-sm">{item}</div>
            {index < 3 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const WithButtons: StoryObj = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-0 rounded-lg border overflow-hidden">
        <Button variant="ghost" className="w-full justify-start rounded-none">
          저장
        </Button>
        <Separator />
        <Button variant="ghost" className="w-full justify-start rounded-none">
          다시 로드
        </Button>
        <Separator />
        <Button variant="ghost" className="w-full justify-start rounded-none">
          내보내기
        </Button>
      </div>
    </div>
  ),
};
