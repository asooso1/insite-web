import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "./progress"
import { useState, useEffect } from "react"
import { Button } from "./button"

const meta = {
  title: "Components/UI/Progress",
  component: Progress,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 10 },
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error"],
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 50,
    variant: "default",
  },
}

export const Success: Story = {
  args: {
    value: 75,
    variant: "success",
  },
}

export const Warning: Story = {
  args: {
    value: 45,
    variant: "warning",
  },
}

export const Error: Story = {
  args: {
    value: 25,
    variant: "error",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">기본 (파랑)</p>
        <Progress value={60} variant="default" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">성공 (초록)</p>
        <Progress value={100} variant="success" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">경고 (주황)</p>
        <Progress value={45} variant="warning" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">오류 (빨강)</p>
        <Progress value={-1} variant="error" />
      </div>
    </div>
  ),
}

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 5
        })
      }, 200)
      return () => clearInterval(timer)
    }, [])

    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">작업 진행률</p>
            <p className="text-sm font-semibold">{progress}%</p>
          </div>
          <Progress value={progress} variant="default" />
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setProgress(0)}
        >
          초기화
        </Button>
      </div>
    )
  },
}

export const WorkOrderProgress: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-sm">수시업무 #WO-2026-001: 에어컨 정비</p>
          <p className="text-sm text-gray-600">75% 완료</p>
        </div>
        <Progress value={75} variant="success" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-sm">작업지시 #WO-2026-002: 조명 교체</p>
          <p className="text-sm text-gray-600">45% 진행중</p>
        </div>
        <Progress value={45} variant="warning" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-sm">수시업무 #WO-2026-003: 보일러 점검</p>
          <p className="text-sm text-gray-600">0% 대기중</p>
        </div>
        <Progress value={0} variant="default" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-sm">수시업무 #WO-2026-004: 창 수리</p>
          <p className="text-sm text-gray-600">미납기 - 연장 필요</p>
        </div>
        <Progress value={20} variant="error" />
      </div>
    </div>
  ),
}
