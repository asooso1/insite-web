import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { List, Grid3x3, Calendar } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

const meta = {
  title: "Components/UI/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState("list")
    return (
      <ToggleGroup type="single" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="list">목록</ToggleGroupItem>
        <ToggleGroupItem value="grid">그리드</ToggleGroupItem>
        <ToggleGroupItem value="table">테이블</ToggleGroupItem>
      </ToggleGroup>
    )
  },
}

export const Multiple: Story = {
  render: () => {
    const [values, setValues] = useState(["bold"])
    return (
      <ToggleGroup type="multiple" value={values} onValueChange={setValues}>
        <ToggleGroupItem value="bold">굵게</ToggleGroupItem>
        <ToggleGroupItem value="italic">기울임</ToggleGroupItem>
        <ToggleGroupItem value="underline">밑줄</ToggleGroupItem>
      </ToggleGroup>
    )
  },
}

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState("list")
    return (
      <ToggleGroup type="single" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="list" aria-label="목록 보기">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="그리드 보기">
          <Grid3x3 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="calendar" aria-label="캘린더 보기">
          <Calendar className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">작은 크기</p>
        <ToggleGroup type="single" defaultValue="sm" size="sm">
          <ToggleGroupItem value="sm">작음</ToggleGroupItem>
          <ToggleGroupItem value="sm2">작음</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">기본 크기</p>
        <ToggleGroup type="single" defaultValue="default">
          <ToggleGroupItem value="default">기본</ToggleGroupItem>
          <ToggleGroupItem value="default2">기본</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">큰 크기</p>
        <ToggleGroup type="single" defaultValue="lg" size="lg">
          <ToggleGroupItem value="lg">큼</ToggleGroupItem>
          <ToggleGroupItem value="lg2">큼</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
}

export const ViewSwitcher: Story = {
  render: () => {
    const [view, setView] = useState("list")
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">작업지시 목록</h3>
          <ToggleGroup type="single" value={view} onValueChange={setView}>
            <ToggleGroupItem value="list" aria-label="목록 보기">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="그리드 보기">
              <Grid3x3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="캘린더 보기">
              <Calendar className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="rounded-lg border p-4 min-h-60 flex items-center justify-center text-muted-foreground">
          {view === "list" && "목록 뷰: 작업지시가 행 형식으로 표시됩니다."}
          {view === "grid" && "그리드 뷰: 작업지시가 카드 형식으로 표시됩니다."}
          {view === "calendar" && "캘린더 뷰: 작업지시가 달력 형식으로 표시됩니다."}
        </div>
      </div>
    )
  },
}

export const Outline: Story = {
  render: () => {
    const [value, setValue] = useState("week")
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium">기간 선택 (Outline)</p>
        <ToggleGroup type="single" value={value} onValueChange={setValue} variant="outline">
          <ToggleGroupItem value="day">일일</ToggleGroupItem>
          <ToggleGroupItem value="week">주간</ToggleGroupItem>
          <ToggleGroupItem value="month">월간</ToggleGroupItem>
          <ToggleGroupItem value="year">연간</ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
  },
}
