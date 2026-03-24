import type { Meta, StoryObj } from "@storybook/react";
import { BulkActionBar } from "./bulk-action-bar";

const meta = {
  title: "DataDisplay/BulkActionBar",
  component: BulkActionBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedCount: 3,
    onClear: () => console.log("선택 해제"),
    actions: [
      {
        label: "일괄 승인",
        onClick: () => console.log("승인"),
      },
      {
        label: "일괄 취소",
        onClick: () => console.log("취소"),
        variant: "destructive",
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    selectedCount: 5,
    onClear: () => console.log("선택 해제"),
    actions: [
      {
        label: "일괄 승인",
        onClick: () => console.log("승인"),
        loading: true,
        disabled: true,
      },
      {
        label: "일괄 취소",
        onClick: () => console.log("취소"),
        variant: "destructive",
        loading: false,
        disabled: true,
      },
    ],
  },
};

export const SingleAction: Story = {
  args: {
    selectedCount: 1,
    onClear: () => console.log("선택 해제"),
    actions: [
      {
        label: "삭제",
        onClick: () => console.log("삭제"),
        variant: "destructive",
      },
    ],
  },
};

export const LargeSelection: Story = {
  args: {
    selectedCount: 87,
    onClear: () => console.log("선택 해제"),
    actions: [
      {
        label: "일괄 처리",
        onClick: () => console.log("처리"),
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    selectedCount: 2,
    onClear: () => console.log("선택 해제"),
    actions: [
      {
        label: "일괄 승인",
        onClick: () => console.log("승인"),
        disabled: true,
      },
      {
        label: "일괄 취소",
        onClick: () => console.log("취소"),
        variant: "destructive",
        disabled: true,
      },
    ],
  },
};
