import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { FileText, Settings, Users, BarChart3, Plus } from "lucide-react";

const meta = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <Command className="w-full max-w-sm rounded-md border">
      <CommandInput placeholder="명령어나 페이지를 검색하세요..." />
      <CommandList>
        <CommandEmpty>결과를 찾을 수 없습니다.</CommandEmpty>
        <CommandGroup heading="제안">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>작업 지시</span>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithGroups = {
  render: () => (
    <Command className="w-full max-w-sm rounded-md border">
      <CommandInput placeholder="검색..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        <CommandGroup heading="시설 관리">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>시설 목록</span>
          </CommandItem>
          <CommandItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>새 시설 등록</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="사용자">
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <span>사용자 관리</span>
          </CommandItem>
          <CommandItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>사용자 추가</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="시스템">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </CommandItem>
          <CommandItem>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>로그 및 통계</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const SearchFiltering = {
  render: () => {
    return (
      <Command className="w-full max-w-sm rounded-md border">
        <CommandInput placeholder="시설, 작업, 사용자를 검색..." />
        <CommandList>
          <CommandEmpty>일치하는 결과가 없습니다.</CommandEmpty>
          <CommandGroup heading="시설 검색 결과">
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>중앙 냉난방기 (A동 1층)</span>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>실내기 - B동 (3층)</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="작업 지시 검색 결과">
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>WO-2024-001: 필터 교체</span>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>WO-2024-002: 정기 점검</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

export const Empty = {
  render: () => (
    <Command className="w-full max-w-sm rounded-md border">
      <CommandInput placeholder="검색..." />
      <CommandList>
        <CommandEmpty className="py-8 text-center">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 font-medium">검색 결과가 없습니다</p>
            <p>다른 검색어를 시도해보세요</p>
          </div>
        </CommandEmpty>
      </CommandList>
    </Command>
  ),
};

export const CommandPalette = {
  render: () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          커맨드 팔레트 (Cmd+K를 눌러 활성화)
        </p>
        <Command className="w-full max-w-2xl rounded-md border shadow-lg">
          <CommandInput
            placeholder="명령어 검색... (예: 작업 생성, 사용자 추가)"
            className="text-base"
          />
          <CommandList className="max-h-[500px]">
            <CommandEmpty>
              <div className="py-8 text-center text-sm text-muted-foreground">
                일치하는 명령어가 없습니다.
              </div>
            </CommandEmpty>
            <CommandGroup heading="자주 사용하는 기능">
              <CommandItem>
                <Plus className="mr-2 h-4 w-4" />
                <span className="flex-1">새로운 작업 지시 생성</span>
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">Ctrl</span>+<span>N</span>
                </kbd>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span className="flex-1">설정 열기</span>
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">Ctrl</span>+<span>,</span>
                </kbd>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="네비게이션">
              <CommandItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>작업 목록으로 이동</span>
              </CommandItem>
              <CommandItem>
                <Users className="mr-2 h-4 w-4" />
                <span>사용자 관리로 이동</span>
              </CommandItem>
              <CommandItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>대시보드로 이동</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
  },
};
