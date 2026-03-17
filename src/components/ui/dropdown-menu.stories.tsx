import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";
import { Button } from "./button";
import {
  Settings,
  Save,
  Copy,
  Trash2,
  AlertCircle,
  ChevronRight,
  Home,
  Building2,
  Users,
} from "lucide-react";

const meta = {
  title: "Components/UI/DropdownMenu",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">메뉴 열기</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>작업 메뉴</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>저장</DropdownMenuItem>
        <DropdownMenuItem>복사</DropdownMenuItem>
        <DropdownMenuItem>붙여넣기</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithIcons: StoryObj = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          설정
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>시설 관리</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Save className="mr-2 h-4 w-4" />
          저장
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          복사
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSubMenu: StoryObj = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">보기</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>표시 옵션</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ChevronRight className="mr-2 h-4 w-4" />
            정렬
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>이름순</DropdownMenuItem>
            <DropdownMenuItem>최근순</DropdownMenuItem>
            <DropdownMenuItem>크기순</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ChevronRight className="mr-2 h-4 w-4" />
            필터
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>활성</DropdownMenuItem>
            <DropdownMenuItem>비활성</DropdownMenuItem>
            <DropdownMenuItem>모두 보기</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSeparator: StoryObj = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">작업</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>편집</DropdownMenuLabel>
          <DropdownMenuItem>편집</DropdownMenuItem>
          <DropdownMenuItem>미리보기</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>내보내기</DropdownMenuLabel>
          <DropdownMenuItem>PDF로 내보내기</DropdownMenuItem>
          <DropdownMenuItem>엑셀로 내보내기</DropdownMenuItem>
          <DropdownMenuItem>인쇄</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>기타</DropdownMenuLabel>
          <DropdownMenuItem>보관</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Destructive: StoryObj = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">위험 작업</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>작업 상태</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>진행 중</DropdownMenuItem>
        <DropdownMenuItem>대기 중</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-destructive">위험 작업</DropdownMenuLabel>
        <DropdownMenuItem variant="destructive">
          <AlertCircle className="mr-2 h-4 w-4" />
          모두 삭제
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">취소</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const CheckboxItems: StoryObj = {
  render: function Render() {
    const [checks, setChecks] = useState<Record<string, boolean>>({
      alarm: true,
      email: false,
      sms: true,
    });

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">알림 설정</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>알림 수신</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={checks.alarm}
            onCheckedChange={(checked) =>
              setChecks((prev) => ({ ...prev, alarm: checked as boolean }))
            }
          >
            앱 알림
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={checks.email}
            onCheckedChange={(checked) =>
              setChecks((prev) => ({ ...prev, email: checked as boolean }))
            }
          >
            이메일 알림
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={checks.sms}
            onCheckedChange={(checked) =>
              setChecks((prev) => ({ ...prev, sms: checked as boolean }))
            }
          >
            SMS 알림
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const RadioGroup: StoryObj = {
  render: function Render() {
    const [selected, setSelected] = useState("facilities");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">보기 선택</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>모듈 선택</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
            <DropdownMenuRadioItem value="facilities">
              <Building2 className="mr-2 h-4 w-4" />
              시설 관리
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="workorders">
              <Save className="mr-2 h-4 w-4" />
              작업지시
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="users">
              <Users className="mr-2 h-4 w-4" />
              사용자 관리
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const LocationMenu: StoryObj = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Home className="mr-2 h-4 w-4" />
          건물 선택
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>건물</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>본사</DropdownMenuLabel>
          <DropdownMenuItem inset>강남 센터</DropdownMenuItem>
          <DropdownMenuItem inset>중고 빌딩</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>지점</DropdownMenuLabel>
          <DropdownMenuItem inset>부산 센터</DropdownMenuItem>
          <DropdownMenuItem inset>대구 센터</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
