import type { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  HelpCircle,
  Info,
  AlertCircle,
  Settings,
  Save,
  Trash2,
  Copy,
} from "lucide-react";

const meta = {
  title: "Components/UI/Tooltip",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            마우스 올려보기
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>이것은 툴팁입니다</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Top: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex justify-center pt-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">위쪽</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>위쪽에 표시되는 툴팁</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const Bottom: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex justify-center pb-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">아래쪽</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>아래쪽에 표시되는 툴팁</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const Left: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex justify-end pr-48">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">왼쪽</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>왼쪽에 표시되는 툴팁</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const Right: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex justify-start pl-48">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">오른쪽</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>오른쪽에 표시되는 툴팁</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const WithButton: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold">저장 버튼</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm">
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>변경사항을 저장합니다 (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">삭제 버튼</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>이 항목을 삭제합니다</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
};

export const IconTooltip: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>정보</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>경고: 주의가 필요합니다</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>도움말</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>설정</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const LongContent: StoryObj = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">긴 내용</Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>
            이것은 더 긴 설명입니다. 여러 줄의 텍스트를 포함할 수 있으며,
            사용자에게 더 자세한 정보를 제공할 수 있습니다.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Delay: StoryObj = {
  render: () => (
    <TooltipProvider delayDuration={500}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold">0ms 지연 (기본)</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge>즉시 표시</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>마우스를 올리면 즉시 표시</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">500ms 지연</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary">지연 표시</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>500ms 후에 표시</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
};

export const ActionButtons: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-2 rounded-lg border p-3">
        <span className="text-sm">작업지시 ID: #12345</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>복사</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const MultipleTooltips: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">상태:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge>진행 중</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>현재 작업이 진행 중입니다</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">우선순위:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive">높음</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>즉시 처리가 필요합니다</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">담당자:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline">김홍길</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>담당자: kim.hong.gil@example.com</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
};
