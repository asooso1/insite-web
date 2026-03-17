import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle, FileText, Settings } from "lucide-react";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>이것은 기본 아코디언입니까?</AccordionTrigger>
        <AccordionContent>
          네, 이것은 기본 아코디언 컴포넌트입니다. 클릭하여 콘텐츠를 확장하거나 축소할 수
          있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>아코디언을 사용할 때는?</AccordionTrigger>
        <AccordionContent>
          공간을 절약하고 관련 콘텐츠를 그룹화할 때 아코디언을 사용합니다. 사용자는
          필요한 섹션만 확장할 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>여러 항목을 동시에 열 수 있나요?</AccordionTrigger>
        <AccordionContent>
          기본 아코디언은 한 번에 하나의 항목만 열 수 있습니다. 다중 열림이 필요하면
          Multiple 스토리를 참고하세요.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Single = {
  render: () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>단일 열림 모드</AccordionTrigger>
        <AccordionContent>
          이 모드에서는 한 번에 하나의 항목만 열 수 있습니다. 다른 항목을 열면 이전
          항목이 자동으로 닫힙니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>접힘 가능</AccordionTrigger>
        <AccordionContent>collapsible 옵션을 사용하면 열려 있는 항목을 다시 클릭해서 닫을 수 있습니다.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple = {
  render: () => (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>첫 번째 항목</AccordionTrigger>
        <AccordionContent>
          다중 열림 모드에서는 여러 항목을 동시에 열 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>두 번째 항목</AccordionTrigger>
        <AccordionContent>
          각 항목을 독립적으로 제어할 수 있으므로 유연한 UI를 제공합니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>세 번째 항목</AccordionTrigger>
        <AccordionContent>
          이 스타일의 아코디언은 여러 섹션의 정보를 한눈에 비교할 때 유용합니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithIcons = {
  render: () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          문서 가이드
        </AccordionTrigger>
        <AccordionContent>
          작업 지시서, 매뉴얼, 기술 자료 등의 문서를 확인할 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          설정
        </AccordionTrigger>
        <AccordionContent>
          시설 설정, 권한 설정, 알림 설정 등을 조정할 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          자주 묻는 질문
        </AccordionTrigger>
        <AccordionContent>
          시스템 사용 중 자주 발생하는 질문과 해결 방법을 안내합니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ = {
  render: () => (
    <Accordion type="single" collapsible className="w-full space-y-2">
      <AccordionItem value="faq-1">
        <AccordionTrigger className="font-semibold">
          작업을 생성한 후 수정할 수 있나요?
        </AccordionTrigger>
        <AccordionContent>
          네, 작업이 발행 전까지는 수정할 수 있습니다. 발행 후에는 시스템 관리자만
          수정 가능합니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-2">
        <AccordionTrigger className="font-semibold">
          시설 정보는 누가 수정할 수 있나요?
        </AccordionTrigger>
        <AccordionContent>
          시설 정보는 해당 건물의 시설 담당자 이상의 권한자가 수정할 수 있습니다.
          관리자 권한이 필요한 항목도 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-3">
        <AccordionTrigger className="font-semibold">
          완료된 작업 기록은 삭제할 수 있나요?
        </AccordionTrigger>
        <AccordionContent>
          아니요, 감사 기록 유지를 위해 완료된 작업은 삭제할 수 없습니다. 필요시 시스템
          관리자에게 문의하세요.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-4">
        <AccordionTrigger className="font-semibold">
          건물 간 작업 할당은 가능한가요?
        </AccordionTrigger>
        <AccordionContent>
          작업은 현재 선택된 건물 내에서만 생성 및 할당됩니다. 다른 건물의 작업을
          보려면 건물을 전환하세요.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
