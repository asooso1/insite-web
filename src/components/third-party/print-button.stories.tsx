import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import { PrintButton, PrintContainer, usePrint } from "./print-button";

const meta = {
  title: "Components/ThirdParty/PrintButton",
  component: PrintButton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PrintButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 콘텐츠
const reportContent = `
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h1>작업 보고서</h1>
    <p><strong>보고 날짜:</strong> 2026년 3월 17일</p>
    <p><strong>작업 내용:</strong> 빌딩 A 정기점검</p>
    <ul>
      <li>외부 점검 완료</li>
      <li>전기 시스템 점검 완료</li>
      <li>설비 점검 완료</li>
    </ul>
    <p><strong>이상 사항:</strong> 없음</p>
  </div>
`;

const invoiceContent = `
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h2>청구서</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #ccc;">
        <th style="text-align: left; padding: 10px;">항목</th>
        <th style="text-align: right; padding: 10px;">금액</th>
      </tr>
      <tr>
        <td style="padding: 10px;">설비 점검비</td>
        <td style="text-align: right; padding: 10px;">500,000원</td>
      </tr>
      <tr>
        <td style="padding: 10px;">부품 비용</td>
        <td style="text-align: right; padding: 10px;">250,000원</td>
      </tr>
      <tr style="border-top: 2px solid #333;">
        <td style="padding: 10px;"><strong>합계</strong></td>
        <td style="text-align: right; padding: 10px;"><strong>750,000원</strong></td>
      </tr>
    </table>
  </div>
`;

export const Default: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <PrintButton contentRef={printRef} documentTitle="보고서" label="인쇄" />
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <h2 className="text-xl font-bold mb-4">작업 보고서</h2>
          <p className="mb-2">작업 일시: 2026년 3월 17일</p>
          <p className="mb-2">작업 내용: 정기점검</p>
          <p>상태: 완료</p>
        </div>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <PrintButton
          contentRef={printRef}
          documentTitle="에너지 보고서"
          label="인쇄하기"
          variant="default"
        />
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <h2 className="text-xl font-bold mb-4">에너지 사용량 보고</h2>
          <p className="mb-2">월: 3월 2026</p>
          <p className="mb-2">전력: 4,200 kWh</p>
          <p className="mb-2">가스: 2,400 m³</p>
          <p>수도: 800 m³</p>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <PrintButton
          contentRef={printRef}
          documentTitle="보고서"
          label="인쇄"
          disabled={true}
        />
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <p>이 콘텐츠는 인쇄할 수 없습니다.</p>
        </div>
      </div>
    );
  },
};

export const IconOnly: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <PrintButton
            contentRef={printRef}
            documentTitle="보고서"
            iconOnly={true}
          />
          <span className="text-sm text-muted-foreground">아이콘 버튼</span>
        </div>
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <h2 className="text-xl font-bold mb-4">작업 보고서</h2>
          <p>아이콘 버튼으로 인쇄할 수 있습니다.</p>
        </div>
      </div>
    );
  },
};

export const VariantOutline: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <PrintButton
          contentRef={printRef}
          documentTitle="청구서"
          label="인쇄"
          variant="outline"
        />
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <h2 className="text-xl font-bold mb-4">청구서</h2>
          <p className="mb-2">청구 날짜: 2026년 3월 17일</p>
          <p className="mb-2">금액: 750,000원</p>
          <p>상태: 미지급</p>
        </div>
      </div>
    );
  },
};

export const VariantSecondary: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <PrintButton
          contentRef={printRef}
          documentTitle="통계"
          label="내보내기"
          variant="secondary"
        />
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <h2 className="text-xl font-bold mb-4">월별 통계</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>총 작업: 48건</li>
            <li>완료: 42건</li>
            <li>진행중: 6건</li>
          </ul>
        </div>
      </div>
    );
  },
};

export const PrintContainer_Default: Story = {
  render: () => {
    return (
      <PrintContainer documentTitle="작업 보고서" buttonPosition="top-right">
        <div className="p-8 bg-white">
          <h1 className="text-2xl font-bold mb-4">작업 보고서</h1>
          <p className="mb-4">
            작업 일시: <strong>2026년 3월 17일</strong>
          </p>
          <div className="space-y-3">
            <h3 className="font-semibold">작업 내용:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>시설 외부 점검</li>
              <li>전기 시스템 점검</li>
              <li>설비 유지보수</li>
            </ul>
          </div>
          <p className="mt-4">
            상태: <strong className="text-green-600">완료</strong>
          </p>
        </div>
      </PrintContainer>
    );
  },
};

export const PrintContainer_LeftPosition: Story = {
  render: () => {
    return (
      <PrintContainer
        documentTitle="에너지 보고서"
        buttonPosition="top-left"
      >
        <div className="p-8 bg-white">
          <h1 className="text-2xl font-bold mb-4">에너지 월간 보고서</h1>
          <p className="mb-4">기간: 2026년 3월 1일 ~ 31일</p>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">항목</th>
                <th className="border p-2 text-right">사용량</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">전력</td>
                <td className="border p-2 text-right">4,200 kWh</td>
              </tr>
              <tr>
                <td className="border p-2">가스</td>
                <td className="border p-2 text-right">2,400 m³</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PrintContainer>
    );
  },
};

export const PrintContainer_BottomPosition: Story = {
  render: () => {
    return (
      <PrintContainer
        documentTitle="청구서"
        buttonPosition="bottom-right"
        buttonLabel="내보내기"
      >
        <div className="p-8 bg-white">
          <h1 className="text-2xl font-bold mb-6">청구서</h1>
          <div className="space-y-4 mb-8">
            <p>청구 날짜: 2026년 3월 1일</p>
            <p>납부 기한: 2026년 3월 15일</p>
          </div>
          <table className="w-full border-collapse border mb-6">
            <tbody>
              <tr>
                <td className="border p-2">설비 점검비</td>
                <td className="border p-2 text-right">500,000원</td>
              </tr>
              <tr>
                <td className="border p-2">부품 비용</td>
                <td className="border p-2 text-right">250,000원</td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td className="border p-2">합계</td>
                <td className="border p-2 text-right">750,000원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PrintContainer>
    );
  },
};

export const UsePrintHook: Story = {
  render: () => {
    const { printRef, handlePrint } = usePrint({
      documentTitle: "통계 보고서",
      onAfterPrint: () => console.log("인쇄 완료"),
    });

    return (
      <div className="space-y-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          커스텀 버튼으로 인쇄
        </button>
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <h2 className="text-xl font-bold mb-4">분기별 통계</h2>
          <ul className="space-y-2">
            <li>1분기: 15건</li>
            <li>2분기: 18건</li>
            <li>3분기: 22건</li>
            <li>4분기: 20건</li>
          </ul>
        </div>
      </div>
    );
  },
};

export const ComplexDocument: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <PrintButton
          contentRef={printRef}
          documentTitle="상세 보고서"
          label="인쇄"
          variant="default"
        />
        <div ref={printRef} className="border p-8 bg-white rounded-md space-y-6">
          <h1 className="text-3xl font-bold">빌딩 유지보수 보고서</h1>

          <section>
            <h2 className="text-xl font-semibold mb-3">기본 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">빌딩명</p>
                <p className="font-semibold">빌딩 A</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">보고 날짜</p>
                <p className="font-semibold">2026년 3월 17일</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">점검 항목</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">항목</th>
                  <th className="border p-2 text-left">상태</th>
                  <th className="border p-2 text-left">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">외부 구조</td>
                  <td className="border p-2">정상</td>
                  <td className="border p-2">-</td>
                </tr>
                <tr>
                  <td className="border p-2">전기 시스템</td>
                  <td className="border p-2">정상</td>
                  <td className="border p-2">-</td>
                </tr>
                <tr>
                  <td className="border p-2">설비</td>
                  <td className="border p-2">점검필요</td>
                  <td className="border p-2">좌측 펌프 교체 필요</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">결론</h2>
            <p>전반적으로 양호한 상태이며, 설비의 일부 부품 교체가 필요합니다.</p>
          </section>
        </div>
      </div>
    );
  },
};

export const WithCallback: Story = {
  render: () => {
    const [status, setStatus] = useState<string>("");
    const printRef = useRef<HTMLDivElement>(null);

    const handleBeforePrint = async () => {
      setStatus("인쇄 준비 중...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    };

    const handleAfterPrint = () => {
      setStatus("인쇄 완료!");
      setTimeout(() => setStatus(""), 3000);
    };

    return (
      <div className="space-y-4">
        <PrintButton
          contentRef={printRef}
          documentTitle="콜백 테스트"
          label="인쇄"
          onBeforePrint={handleBeforePrint}
          onAfterPrint={handleAfterPrint}
        />
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <h2 className="text-xl font-bold mb-4">인쇄 콜백 테스트</h2>
          <p>인쇄 전후 콜백이 실행됩니다.</p>
        </div>
        {status && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
            {status}
          </div>
        )}
      </div>
    );
  },
};

export const SizeVariants: Story = {
  render: () => {
    const printRef = useRef<HTMLDivElement>(null);
    return (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <PrintButton
            contentRef={printRef}
            size="sm"
            label="소형"
            variant="outline"
          />
          <PrintButton
            contentRef={printRef}
            size="default"
            label="기본"
            variant="outline"
          />
          <PrintButton
            contentRef={printRef}
            size="lg"
            label="대형"
            variant="outline"
          />
        </div>
        <div ref={printRef} className="border p-6 bg-white rounded-md">
          <p>버튼 크기가 다양합니다.</p>
        </div>
      </div>
    );
  },
};
