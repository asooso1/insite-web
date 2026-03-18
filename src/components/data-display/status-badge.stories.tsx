import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "./status-badge";

const meta = {
  title: "Components/DataDisplay/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["completed", "inProgress", "pending", "cancelled", "medium"],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: "completed",
  },
};

export const InProgress: Story = {
  args: {
    status: "inProgress",
  },
};

export const Pending: Story = {
  args: {
    status: "pending",
  },
};

export const Cancelled: Story = {
  args: {
    status: "cancelled",
  },
};

export const Warning: Story = {
  args: {
    status: "medium",
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="completed" />
      <StatusBadge status="inProgress" />
      <StatusBadge status="pending" />
      <StatusBadge status="cancelled" />
      <StatusBadge status="medium" />
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <p className="font-medium">작업 #001</p>
          <p className="text-sm text-gray-600">에어컨 정비</p>
        </div>
        <StatusBadge status="completed" />
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <p className="font-medium">작업 #002</p>
          <p className="text-sm text-gray-600">조명 점검</p>
        </div>
        <StatusBadge status="inProgress" />
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <p className="font-medium">작업 #003</p>
          <p className="text-sm text-gray-600">보일러 정비</p>
        </div>
        <StatusBadge status="pending" />
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <p className="font-medium">작업 #004</p>
          <p className="text-sm text-gray-600">필터 교체</p>
        </div>
        <StatusBadge status="medium" />
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <p className="font-medium">작업 #005</p>
          <p className="text-sm text-gray-600">창 수리</p>
        </div>
        <StatusBadge status="cancelled" />
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">성공/완료</h3>
        <StatusBadge status="completed" />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold mb-3">진행중</h3>
        <StatusBadge status="inProgress" />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold mb-3">대기중</h3>
        <StatusBadge status="pending" />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold mb-3">경고</h3>
        <StatusBadge status="medium" />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold mb-3">취소됨</h3>
        <StatusBadge status="cancelled" />
      </div>
    </div>
  ),
};
