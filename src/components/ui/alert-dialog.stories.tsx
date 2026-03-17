import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogMedia,
} from "./alert-dialog";
import { Button } from "./button";
import { AlertCircle, Trash2, LogOut } from "lucide-react";

const meta = {
  title: "Components/UI/AlertDialog",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">확인 대화 열기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>확인</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업을 계속하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DeleteConfirm: StoryObj = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>시설 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 시설을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};

export const DestructiveAction: StoryObj = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">위험한 작업</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <AlertCircle className="h-6 w-6 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>작업 취소 확인</AlertDialogTitle>
          <AlertDialogDescription>
            진행 중인 작업을 취소하시겠습니까? 저장되지 않은 모든 변경사항이 손실됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>작업 계속</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            취소
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const WithDescription: StoryObj = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">자세한 설명과 함께</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>수시업무 완료 처리</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업지시를 완료 상태로 변경하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            완료 처리 시 다음이 수행됩니다:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>수시업무 상태가 완료로 변경됩니다</li>
            <li>시설 현황이 자동 업데이트됩니다</li>
            <li>담당자에게 알림이 전송됩니다</li>
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction>완료 처리</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const LogoutConfirm: StoryObj = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그아웃</AlertDialogTitle>
          <AlertDialogDescription>
            현재 계정에서 로그아웃하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>계속 로그인</AlertDialogCancel>
          <AlertDialogAction>로그아웃</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const SmallSize: StoryObj = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          소형 다이얼로그
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>확인</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 진행하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
