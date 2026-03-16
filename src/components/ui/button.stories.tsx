import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

const meta = {
  title: "Components/UI/Button",
  component: Button,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "버튼",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "보조 버튼",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "삭제",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "테두리 버튼",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "유령 버튼",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "링크 버튼",
    variant: "link",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button size="sm">작은 버튼</Button>
      <Button size="default">기본 버튼</Button>
      <Button size="lg">큰 버튼</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: "비활성화",
    disabled: true,
  },
};

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      로딩 중...
    </Button>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">기본 (Default)</h3>
        <Button>기본 버튼</Button>
        <Button disabled>비활성화</Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">보조 (Secondary)</h3>
        <Button variant="secondary">보조 버튼</Button>
        <Button variant="secondary" disabled>
          비활성화
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">위험 (Destructive)</h3>
        <Button variant="destructive">삭제</Button>
        <Button variant="destructive" disabled>
          비활성화
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">테두리 (Outline)</h3>
        <Button variant="outline">테두리 버튼</Button>
        <Button variant="outline" disabled>
          비활성화
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">유령 (Ghost)</h3>
        <Button variant="ghost">유령 버튼</Button>
        <Button variant="ghost" disabled>
          비활성화
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">링크 (Link)</h3>
        <Button variant="link">링크 버튼</Button>
        <Button variant="link" disabled>
          비활성화
        </Button>
      </div>
    </div>
  ),
};
