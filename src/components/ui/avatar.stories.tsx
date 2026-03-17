import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"

const meta = {
  title: "Components/UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="프로필 사진" />
      <AvatarFallback>김철수</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url.example.com/image.png" />
      <AvatarFallback>조민준</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <p className="text-xs text-gray-600 mt-2">Small (h-8)</p>
      </div>

      <div className="text-center">
        <Avatar size="md">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <p className="text-xs text-gray-600 mt-2">Medium (h-10)</p>
      </div>

      <div className="text-center">
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <p className="text-xs text-gray-600 mt-2">Large (h-12)</p>
      </div>

      <div className="text-center">
        <Avatar size="xl">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
        <p className="text-xs text-gray-600 mt-2">XLarge (h-16)</p>
      </div>
    </div>
  ),
}

export const AvatarGroup: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-3">담당팀 (3명)</p>
        <div className="flex -space-x-2">
          <Avatar size="md">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>김철수</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>이영희</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>박민준</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">담당자 그룹</p>
        <div className="flex -space-x-3">
          <Avatar size="lg">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>김철수</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>이영희</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>박민준</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>+2</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Avatar size="md">
            <AvatarImage src="https://github.com/shadcn.png" alt="작업담당자" />
            <AvatarFallback>김철수</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">수시업무 #WO-2026-001</p>
            <p className="text-sm text-gray-600">담당자: 김철수 (설비팀)</p>
            <p className="text-sm text-gray-600">에어컨 정비 및 점검</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">완료</span>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Avatar size="md">
            <AvatarImage src="https://github.com/shadcn.png" alt="작업담당자" />
            <AvatarFallback>이영희</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">수시업무 #WO-2026-002</p>
            <p className="text-sm text-gray-600">담당자: 이영희 (전기팀)</p>
            <p className="text-sm text-gray-600">조명 회로 점검 및 교체</p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">진행중</span>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Avatar size="md">
            <AvatarImage src="https://invalid.example.com/image.png" />
            <AvatarFallback>박민준</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">수시업무 #WO-2026-003</p>
            <p className="text-sm text-gray-600">담당자: 박민준 (보일러팀)</p>
            <p className="text-sm text-gray-600">보일러 정기 점검</p>
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">대기중</span>
        </div>
      </div>
    </div>
  ),
}
