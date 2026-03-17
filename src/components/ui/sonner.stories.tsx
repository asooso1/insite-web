import type { Meta, StoryObj } from "@storybook/react"
import { Toaster } from "./sonner"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => toast("안녕하세요! 이것은 기본 토스트입니다.")}
      >
        기본 토스트 표시
      </Button>
    </>
  ),
}

export const Success: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => toast.success("시설이 등록되었습니다.")}
        variant="default"
      >
        성공 토스트 표시
      </Button>
    </>
  ),
}

export const Error: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => toast.error("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")}
        variant="destructive"
      >
        에러 토스트 표시
      </Button>
    </>
  ),
}

export const Warning: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => toast.warning("주의: 이 작업은 되돌릴 수 없습니다.")}
        variant="outline"
      >
        경고 토스트 표시
      </Button>
    </>
  ),
}

export const Info: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => toast.info("정보: 새로운 작업이 할당되었습니다.")}
        variant="secondary"
      >
        정보 토스트 표시
      </Button>
    </>
  ),
}

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast("파일 저장이 완료되었습니다.", {
            action: {
              label: "되돌리기",
              onClick: () => toast.success("저장이 취소되었습니다."),
            },
          })
        }
      >
        액션 버튼이 있는 토스트
      </Button>
    </>
  ),
}

export const PromiseLoading: Story = {
  render: () => {
    const handlePromise = (): void => {
      const promise = new Promise<{ message: string }>(resolve =>
        setTimeout(() => resolve({ message: "완료!" }), 2000)
      )
      toast.promise(
        promise,
        {
          loading: "처리 중입니다...",
          success: "작업이 완료되었습니다!",
          error: "작업 중 오류가 발생했습니다.",
        }
      )
    }

    return (
      <>
        <Toaster />
        <Button onClick={handlePromise}>
          Promise 토스트 표시
        </Button>
      </>
    )
  },
}

export const InContext: Story = {
  render: () => {
    const handleSave = (): void => {
      const promise = new Promise<null>(resolve =>
        setTimeout(() => resolve(null), 1500)
      )
      toast.promise(
        promise,
        {
          loading: "저장 중...",
          success: "시설 정보가 저장되었습니다.",
          error: "저장 중 오류가 발생했습니다.",
        }
      )
    }

    return (
      <>
        <Toaster />
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">시설 정보 저장</h3>
            <p className="text-sm text-muted-foreground mb-4">
              아래 버튼을 클릭하여 시설 정보를 저장합니다.
            </p>
            <Button onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </>
    )
  },
}
