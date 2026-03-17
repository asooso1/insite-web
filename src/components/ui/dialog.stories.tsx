import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

const meta = {
  title: "Components/UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>대화상자 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>기본 대화상자</DialogTitle>
          <DialogDescription>
            이것은 기본 대화상자의 예입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            대화상자의 내용이 여기 표시됩니다.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            취소
          </Button>
          <Button onClick={() => {}}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>폼 대화상자 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보 입력</DialogTitle>
          <DialogDescription>
            아래 정보를 입력하고 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름 *
            </label>
            <Input
              id="name"
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일 *
            </label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            취소
          </Button>
          <Button onClick={() => {}}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AlertDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">삭제 확인</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            취소
          </Button>
          <Button variant="destructive" onClick={() => {}}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>닫기 버튼 없음</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>닫기 버튼이 없는 대화상자</DialogTitle>
          <DialogDescription>
            우측 상단의 X 버튼이 표시되지 않습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            버튼을 클릭하여 대화상자를 닫아야 합니다.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => {}}>완료</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FullScreenDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>전체화면 대화상자</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>전체화면 대화상자</DialogTitle>
          <DialogDescription>
            더 많은 내용을 표시할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">섹션 1</h3>
            <p className="text-sm text-muted-foreground">
              전체화면 대화상자에서는 더 많은 콘텐츠를 표시할 수 있습니다.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">섹션 2</h3>
            <p className="text-sm text-muted-foreground">
              긴 폼이나 많은 정보를 포함할 수 있습니다.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">섹션 3</h3>
            <p className="text-sm text-muted-foreground">
              필요에 따라 높이를 조정할 수 있습니다.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            취소
          </Button>
          <Button onClick={() => {}}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const NestedDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>중첩 대화상자</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>부모 대화상자</DialogTitle>
          <DialogDescription>
            중첩된 대화상자를 열 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                자식 대화상자 열기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>자식 대화상자</DialogTitle>
                <DialogDescription>
                  부모 대화상자 위에 표시됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  중첩된 대화상자의 내용입니다.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => {}}>닫기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DialogFooter>
          <Button onClick={() => {}}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ControlledDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>제어형 대화상자</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>제어형 대화상자</DialogTitle>
          <DialogDescription>
            상태를 제어할 수 있는 대화상자입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            대화상자가 열려있습니다.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            취소
          </Button>
          <Button onClick={() => {}}>완료</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
