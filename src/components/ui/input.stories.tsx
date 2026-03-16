import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Search } from "lucide-react";

const meta = {
  title: "Components/UI/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
  },
};

export const WithValue: Story = {
  args: {
    value: "입력된 값",
    placeholder: "텍스트를 입력하세요",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성화된 입력",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: "오류가 있는 입력",
    "aria-invalid": true,
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input placeholder="검색..." className="pl-10" />
    </div>
  ),
};

export const DifferentTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">텍스트</label>
        <Input type="text" placeholder="텍스트를 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">이메일</label>
        <Input type="email" placeholder="이메일@example.com" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">비밀번호</label>
        <Input type="password" placeholder="비밀번호를 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">숫자</label>
        <Input type="number" placeholder="숫자를 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">날짜</label>
        <Input type="date" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">시간</label>
        <Input type="time" />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">기본 상태</h3>
        <Input placeholder="기본 입력" />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">포커스 상태</h3>
        <Input placeholder="포커스된 입력" autoFocus />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">비활성화 상태</h3>
        <Input placeholder="비활성화된 입력" disabled />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">오류 상태</h3>
        <Input placeholder="오류가 있는 입력" aria-invalid="true" />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">값이 있는 상태</h3>
        <Input value="값이 입력되었습니다" onChange={() => {}} />
      </div>
    </div>
  ),
};
