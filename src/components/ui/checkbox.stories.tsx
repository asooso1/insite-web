import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Components/UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="font-normal cursor-pointer">
        약관에 동의합니다
      </Label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" />
        <Label htmlFor="notifications" className="font-normal cursor-pointer">
          이메일 알림 받기
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="sms" />
        <Label htmlFor="sms" className="font-normal cursor-pointer">
          SMS 알림 받기
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="push" defaultChecked />
        <Label htmlFor="push" className="font-normal cursor-pointer">
          푸시 알림 받기
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" disabled />
        <Label htmlFor="newsletter" className="font-normal cursor-pointer text-gray-500">
          뉴스레터 구독 (사용 불가)
        </Label>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">기본 상태</h3>
        <Checkbox />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">선택됨</h3>
        <Checkbox defaultChecked />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">비활성화</h3>
        <Checkbox disabled />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">선택됨 + 비활성화</h3>
        <Checkbox defaultChecked disabled />
      </div>
    </div>
  ),
};
