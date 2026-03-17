import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterIcon, Info } from "lucide-react";
import React from "react";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">팝오버 열기</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>팝오버 제목</PopoverTitle>
          <PopoverDescription>
            이것은 기본 팝오버 컴포넌트입니다. 버튼을 클릭하면 활성화됩니다.
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-4 text-sm">
          팝오버는 추가 정보나 옵션을 표시할 때 유용합니다.
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">사용자 정보 추가</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PopoverHeader>
            <PopoverTitle>사용자 정보</PopoverTitle>
            <PopoverDescription>
              새로운 사용자 정보를 입력하세요.
            </PopoverDescription>
          </PopoverHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">이름</Label>
              <Input id="name" placeholder="사용자 이름 입력" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">이메일</Label>
              <Input id="email" type="email" placeholder="이메일 주소 입력" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm">역할</Label>
              <Input id="role" placeholder="사용자 역할 입력" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                저장
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};

export const FilterPopover = {
  render: () => {
    const [filters, setFilters] = React.useState({
      facility: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <FilterIcon className="mr-2 h-4 w-4" />
            필터
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PopoverHeader>
            <PopoverTitle>필터 설정</PopoverTitle>
            <PopoverDescription>
              조건을 입력하여 목록을 필터링합니다.
            </PopoverDescription>
          </PopoverHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="facility-filter" className="text-sm">시설</Label>
              <Input
                id="facility-filter"
                placeholder="시설명 검색"
                value={filters.facility}
                onChange={(e) =>
                  setFilters({ ...filters, facility: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter" className="text-sm">상태</Label>
              <select
                id="status-filter"
                className="w-full px-2 py-2 rounded border bg-white text-sm"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">전체</option>
                <option value="pending">대기</option>
                <option value="processing">처리중</option>
                <option value="completed">완료</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="date-from" className="text-sm">시작일</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to" className="text-sm">종료일</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    facility: "",
                    status: "",
                    dateFrom: "",
                    dateTo: "",
                  })
                }
              >
                초기화
              </Button>
              <Button size="sm">적용</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};

export const Placement = {
  render: () => (
    <div className="flex flex-col items-start gap-12 p-8 bg-slate-50 min-h-screen">
      <div className="flex items-end gap-4">
        <p className="text-sm font-medium text-muted-foreground min-w-20">Top:</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">상단 배치</Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-56">
            <div className="text-sm">
              <p className="font-medium">상단 배치</p>
              <p className="text-xs text-muted-foreground mt-1">
                팝오버가 트리거 위에 표시됩니다.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-muted-foreground min-w-20">Right:</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">우측 배치</Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-56">
            <div className="text-sm">
              <p className="font-medium">우측 배치</p>
              <p className="text-xs text-muted-foreground mt-1">
                팝오버가 트리거 오른쪽에 표시됩니다.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-muted-foreground min-w-20">Bottom:</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">하단 배치</Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="w-56">
            <div className="text-sm">
              <p className="font-medium">하단 배치</p>
              <p className="text-xs text-muted-foreground mt-1">
                팝오버가 트리거 아래에 표시됩니다.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-muted-foreground min-w-20">Left:</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">좌측 배치</Button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-56">
            <div className="text-sm">
              <p className="font-medium">좌측 배치</p>
              <p className="text-xs text-muted-foreground mt-1">
                팝오버가 트리거 왼쪽에 표시됩니다.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};
