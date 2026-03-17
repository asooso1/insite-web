import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "Components/UI/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "기본 배지",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "보조 배지",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "위험 배지",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "테두리 배지",
    variant: "outline",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>기본</Badge>
      <Badge variant="secondary">보조</Badge>
      <Badge variant="destructive">위험</Badge>
      <Badge variant="outline">테두리</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">작업 상태</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>대기중</Badge>
          <Badge variant="secondary">완료</Badge>
          <Badge variant="destructive">취소됨</Badge>
          <Badge variant="outline">진행중</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">시설 상태</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>운영중</Badge>
          <Badge variant="secondary">유지보수</Badge>
          <Badge variant="destructive">폐쇄</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">우선순위</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>낮음</Badge>
          <Badge variant="outline">중간</Badge>
          <Badge variant="destructive">높음</Badge>
        </div>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">작업 #001</h4>
          <Badge>진행중</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">빌딩 A 에어컨 정비</p>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">작업 #002</h4>
          <Badge variant="secondary">완료</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">조명 LED 교체</p>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">작업 #003</h4>
          <Badge variant="destructive">취소됨</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">보일러 점검</p>
      </div>
    </div>
  ),
};
