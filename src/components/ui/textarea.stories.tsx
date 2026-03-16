import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "여기에 텍스트를 입력하세요",
  },
};

export const WithValue: Story = {
  args: {
    value: "이것은 입력된 값입니다.\n여러 줄을 작성할 수 있습니다.",
    placeholder: "여기에 텍스트를 입력하세요",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성화된 텍스트 영역",
    disabled: true,
    value: "수정할 수 없습니다",
    onChange: () => {},
  },
};

export const Error: Story = {
  args: {
    placeholder: "오류가 있는 입력",
    "aria-invalid": true,
  },
};

export const Resizable: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">설명 (크기 조절 가능)</label>
      <Textarea
        placeholder="마우스로 우측 아래 모서리를 드래그하여 크기를 조절할 수 있습니다"
        className="resize"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">기본 상태</h3>
        <Textarea placeholder="기본 텍스트 영역" />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">포커스 상태</h3>
        <Textarea placeholder="포커스된 텍스트 영역" autoFocus />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">비활성화 상태</h3>
        <Textarea placeholder="비활성화된 텍스트 영역" disabled />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">오류 상태</h3>
        <Textarea placeholder="오류가 있는 입력" aria-invalid="true" />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">값이 있는 상태</h3>
        <Textarea
          value="값이 입력되었습니다"
          onChange={() => {}}
        />
      </div>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">작은 크기</label>
        <Textarea placeholder="작은 텍스트 영역" className="h-20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">표준 크기</label>
        <Textarea placeholder="표준 텍스트 영역" className="h-32" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">큰 크기</label>
        <Textarea placeholder="큰 텍스트 영역" className="h-48" />
      </div>
    </div>
  ),
};
