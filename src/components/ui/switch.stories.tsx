import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta = {
  title: "Components/UI/Switch",
  component: Switch,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch id="notifications" defaultChecked />
        <label
          htmlFor="notifications"
          className="text-sm font-medium cursor-pointer"
        >
          알림 활성화
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="darkmode" />
        <label htmlFor="darkmode" className="text-sm font-medium cursor-pointer">
          다크 모드
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="autoupdate" disabled defaultChecked />
        <label
          htmlFor="autoupdate"
          className="text-sm font-medium cursor-pointer opacity-50"
        >
          자동 업데이트 (비활성화)
        </label>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch size="sm" defaultChecked />
          <span className="text-sm text-muted-foreground">소형</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch size="default" defaultChecked />
          <span className="text-sm text-muted-foreground">기본</span>
        </div>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch defaultChecked />
        <label className="text-sm font-medium">
          기능 활성화 (제어 가능)
        </label>
      </div>
      <div className="text-sm text-muted-foreground">
        이 스위치는 사용자 상호작용으로 제어됩니다.
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">기본 상태 (OFF)</h3>
        <Switch />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">활성화 (ON)</h3>
        <Switch defaultChecked />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">비활성화 (OFF)</h3>
        <Switch disabled />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">비활성화 (ON)</h3>
        <Switch disabled defaultChecked />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">라벨과 함께</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Switch id="setting1" />
            <label htmlFor="setting1" className="text-sm font-medium">
              설정 1
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="setting2" defaultChecked />
            <label htmlFor="setting2" className="text-sm font-medium">
              설정 2
            </label>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <h3 className="font-semibold">알림 설정</h3>
      <div className="space-y-3 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">이메일 알림</label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">푸시 알림</label>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">마케팅 이메일</label>
          <Switch />
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        <p>각 설정은 독립적으로 제어 가능합니다.</p>
      </div>
    </div>
  ),
};
