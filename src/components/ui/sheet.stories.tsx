import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "./sheet"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "Components/UI/Sheet",
  component: Sheet,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">사이드 패널 열기</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>사이드 패널</SheetTitle>
            <SheetDescription>오른쪽에서 슬라이드로 나타나는 사이드 패널입니다.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">패널 내용이 여기에 들어갑니다.</p>
          </div>
          <SheetFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              닫기
            </Button>
            <Button onClick={() => setOpen(false)}>저장</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  },
}

export const Left: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen} side="left">
        <SheetTrigger asChild>
          <Button variant="outline">왼쪽 패널</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>왼쪽 사이드 패널</SheetTitle>
            <SheetDescription>왼쪽에서 슬라이드로 나타납니다.</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm">네비게이션 메뉴나 필터가 여기에 들어갈 수 있습니다.</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  },
}

export const Bottom: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen} side="bottom">
        <SheetTrigger asChild>
          <Button variant="outline">아래쪽 패널</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>하단 사이드 패널</SheetTitle>
            <SheetDescription>아래쪽에서 슬라이드로 나타납니다.</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm">모바일 환경에서 필터나 옵션 선택이 좋습니다.</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  },
}

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">수시업무 생성</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>새 수시업무</SheetTitle>
            <SheetDescription>빌딩 시설물 유지보수 작업을 추가합니다.</SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="작업 제목" />
            </div>
            <div>
              <Label htmlFor="description">설명</Label>
              <Input id="description" placeholder="작업 설명" />
            </div>
            <div>
              <Label htmlFor="location">위치</Label>
              <Input id="location" placeholder="시설 위치" />
            </div>
          </form>
          <SheetFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>생성</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  },
}

export const LargeContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">긴 콘텐츠</Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>긴 콘텐츠 패널</SheetTitle>
            <SheetDescription>스크롤 가능한 많은 내용을 포함합니다.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i}>
                <h3 className="font-semibold">섹션 {i + 1}</h3>
                <p className="text-sm text-muted-foreground">
                  이 섹션에는 빌딩의 시설 정보, 유지보수 이력, 에너지 사용량 등의 데이터가 표시될 수 있습니다.
                </p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    )
  },
}

export const InContext: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">수시업무 상세</h2>
          <p className="text-sm text-muted-foreground">
            제목: 에어컨 필터 교체 | 상태: 진행중 | 우선순위: 높음
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>작업 세부사항 편집</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>수시업무 편집</SheetTitle>
              <SheetDescription>작업의 세부사항을 수정합니다.</SheetDescription>
            </SheetHeader>
            <form className="space-y-4 py-4">
              <div>
                <Label htmlFor="wo-title">제목</Label>
                <Input id="wo-title" defaultValue="에어컨 필터 교체" />
              </div>
              <div>
                <Label htmlFor="wo-priority">우선순위</Label>
                <Input id="wo-priority" defaultValue="높음" />
              </div>
              <div>
                <Label htmlFor="wo-assigned">담당자</Label>
                <Input id="wo-assigned" placeholder="담당자 선택" />
              </div>
              <div>
                <Label htmlFor="wo-notes">메모</Label>
                <Input id="wo-notes" placeholder="작업 메모" />
              </div>
            </form>
            <SheetFooter>
              <Button onClick={() => setOpen(false)} variant="outline">
                취소
              </Button>
              <Button onClick={() => setOpen(false)}>저장</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}
