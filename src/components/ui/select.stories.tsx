import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./select";

const meta = {
  title: "Components/UI/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="옵션을 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">옵션 1</SelectItem>
        <SelectItem value="option2">옵션 2</SelectItem>
        <SelectItem value="option3">옵션 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="카테고리를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>빌딩</SelectLabel>
          <SelectItem value="building1">빌딩 A</SelectItem>
          <SelectItem value="building2">빌딩 B</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>시설</SelectLabel>
          <SelectItem value="facility1">시설 1</SelectItem>
          <SelectItem value="facility2">시설 2</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="비활성화됨" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">옵션 1</SelectItem>
        <SelectItem value="option2">옵션 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithPlaceholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="상태를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">활성</SelectItem>
        <SelectItem value="inactive">비활성</SelectItem>
        <SelectItem value="pending">대기중</SelectItem>
        <SelectItem value="archived">보관됨</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithInitialValue: Story = {
  render: () => (
    <Select defaultValue="medium">
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="small">작음</SelectItem>
        <SelectItem value="medium">중간</SelectItem>
        <SelectItem value="large">큼</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">기본 상태</h3>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="옵션을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">옵션 1</SelectItem>
            <SelectItem value="option2">옵션 2</SelectItem>
            <SelectItem value="option3">옵션 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">선택된 값</h3>
        <Select defaultValue="option2">
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">옵션 1</SelectItem>
            <SelectItem value="option2">옵션 2</SelectItem>
            <SelectItem value="option3">옵션 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">비활성화 상태</h3>
        <Select disabled>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="비활성화됨" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">옵션 1</SelectItem>
            <SelectItem value="option2">옵션 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">그룹 포함</h3>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>그룹 A</SelectLabel>
              <SelectItem value="a1">항목 A1</SelectItem>
              <SelectItem value="a2">항목 A2</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>그룹 B</SelectLabel>
              <SelectItem value="b1">항목 B1</SelectItem>
              <SelectItem value="b2">항목 B2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">많은 옵션</h3>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }).map((_, i) => (
              <SelectItem key={i} value={`option-${i}`}>
                옵션 {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">소형 선택</label>
        <Select>
          <SelectTrigger className="w-[180px]" size="sm">
            <SelectValue placeholder="소형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">작은 옵션</SelectItem>
            <SelectItem value="tiny">매우 작은 옵션</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">기본 선택</label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="기본" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">기본 옵션</SelectItem>
            <SelectItem value="normal">일반 옵션</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};
