import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Components/UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-12 w-12 rounded-full",
  },
};

export const Text: Story = {
  args: {
    className: "h-4 w-full rounded",
  },
};

export const Card: Story = {
  render: () => (
    <div className="rounded-lg border border-gray-200 p-6 space-y-4">
      <Skeleton className="h-6 w-1/3 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 flex-1 rounded" />
        <Skeleton className="h-10 flex-1 rounded" />
      </div>
    </div>
  ),
};

export const TableRow: Story = {
  render: () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border border-gray-200 p-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
          <Skeleton className="h-6 w-20 rounded" />
        </div>
      ))}
    </div>
  ),
};

export const Dashboard: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-4">
            <Skeleton className="h-4 w-3/4 rounded mb-3" />
            <Skeleton className="h-8 w-1/2 rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-6 w-1/4 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-4">원형 (프로필 이미지)</h3>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">사각형 (카드)</h3>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">텍스트 줄</h3>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-sm font-semibold mb-4">테이블 셀</h3>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 flex-1 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </div>
    </div>
  ),
};
