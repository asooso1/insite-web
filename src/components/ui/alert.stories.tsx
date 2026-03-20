import type { Meta, StoryObj } from "@storybook/react"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "./button"

const meta = {
  title: "Components/UI/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "warning", "success", "info"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "default",
    children: (
      <>
        <AlertTitle>안내</AlertTitle>
        <AlertDescription>
          새로운 업데이트가 있습니다. 확인하시겠습니까?
        </AlertDescription>
      </>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>기본</AlertTitle>
        <AlertDescription>기본 알림 메시지입니다.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>오류</AlertTitle>
        <AlertDescription>
          작업 저장에 실패했습니다. 잠시 후 다시 시도해주세요.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>경고</AlertTitle>
        <AlertDescription>
          이 작업은 되돌릴 수 없습니다. 정말 계속하시겠습니까?
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>성공</AlertTitle>
        <AlertDescription>작업이 성공적으로 완료되었습니다.</AlertDescription>
      </Alert>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>정보</AlertTitle>
        <AlertDescription>
          시스템 점검이 예정되어 있습니다. 오전 10시-12시
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>현장 접근 안내</AlertTitle>
        <AlertDescription>
          B동 현장으로의 접근은 안전모와 안전 조끼 착용이 필수입니다.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>유지보수 예정</AlertTitle>
        <AlertDescription>
          오늘 오후 2시-4시에 시스템 점검이 예정되어 있습니다.
          예상치 못한 중단이 발생할 수 있습니다.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>작업 완료</AlertTitle>
        <AlertDescription>
          에어컨 정기 점검이 완료되었습니다. 결과 보고서는 내일 전달 예정입니다.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertTitle>에너지 절감 캠페인</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          이번 분기에 에너지 절감 캠페인을 실시합니다:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-0">
          <li>실내 온도를 여름 26°C, 겨울 20°C 유지</li>
          <li>사용하지 않는 전등 자동 소등</li>
          <li>엘리베이터 대신 계단 이용 권장</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
}

export const Dismissible: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) {
      return (
        <Button onClick={() => setIsVisible(true)} size="sm">
          알림 다시 표시
        </Button>
      )
    }

    return (
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>시스템 점검 예정</AlertTitle>
        <AlertDescription className="flex items-start justify-between gap-4">
          <span>
            오후 2시-4시에 시스템 점검이 예정되어 있습니다. 중단이 발생할 수
            있습니다.
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsVisible(false)}
            aria-label="알림 닫기"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    )
  },
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>수시업무 완료됨</AlertTitle>
        <AlertDescription>
          수시업무 #WO-2026-001 &quot;에어컨 정기 점검&quot;이 완료되었습니다.
          담당자: 김철수 | 완료일: 2026-03-17
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>예정된 점검</AlertTitle>
        <AlertDescription>
          B동 3층 HVAC 시스템 점검이 내일 오전 9시에 예정되어 있습니다.
          현장 접근이 제한될 수 있습니다.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>유지보수 기한 임박</AlertTitle>
        <AlertDescription>
          보일러 정기 점검이 3일 내에 만료됩니다. 즉시 예약해주세요.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>시설 결함 보고</AlertTitle>
        <AlertDescription>
          A동 1층 조명에서 접촉 불량이 발견되었습니다. 안전 문제이므로
          즉시 확인이 필요합니다.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
