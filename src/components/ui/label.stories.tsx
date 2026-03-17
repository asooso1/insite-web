import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { Switch } from "./switch";

const meta = {
  title: "Components/UI/Label",
  component: Label,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "라벨 텍스트",
    htmlFor: "input-id",
  },
};

export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="name">
        이름 <span className="text-destructive">*</span>
      </Label>
      <Input id="name" placeholder="이름을 입력하세요" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="disabled-input" className="opacity-50">
        비활성화된 필드
      </Label>
      <Input id="disabled-input" disabled placeholder="수정 불가" />
    </div>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">
          이메일 <span className="text-destructive">*</span>
        </Label>
        <Input id="email" type="email" placeholder="example@example.com" />
        <p className="text-xs text-muted-foreground">example@insite.com 형식으로 입력하세요</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">전화번호</Label>
        <Input id="phone" type="tel" placeholder="010-0000-0000" />
      </div>
    </div>
  ),
};

export const FormLayout: Story = {
  render: () => (
    <form className="space-y-4 max-w-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">
            이름 <span className="text-destructive">*</span>
          </Label>
          <Input id="firstName" placeholder="홍" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">
            성 <span className="text-destructive">*</span>
          </Label>
          <Input id="lastName" placeholder="길동" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="buildingName">
          건물명 <span className="text-destructive">*</span>
        </Label>
        <Input id="buildingName" placeholder="예: 강남 센터" />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Checkbox id="terms" />
          <span className="font-normal">약관에 동의합니다</span>
        </Label>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Switch id="notifications" />
          <span className="font-normal">알림 수신</span>
        </Label>
      </div>
    </form>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Checkbox id="admin" defaultChecked />
          <span className="font-normal">관리자 권한</span>
        </Label>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Checkbox id="editor" defaultChecked />
          <span className="font-normal">편집 권한</span>
        </Label>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Checkbox id="viewer" />
          <span className="font-normal">조회 권한</span>
        </Label>
      </div>
    </div>
  ),
};

export const WithSwitch: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <Label htmlFor="maintenance-mode" className="cursor-pointer">
          유지보수 모드
        </Label>
        <Switch id="maintenance-mode" defaultChecked />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <Label htmlFor="notifications" className="cursor-pointer">
          알림 활성화
        </Label>
        <Switch id="notifications" />
      </div>
    </div>
  ),
};
