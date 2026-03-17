import type { Meta, StoryObj } from "@storybook/react";

function TypographyShowcase() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="mb-8 text-2xl font-semibold">타이포그래피 스케일</h2>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Display (32px, Semibold)</p>
            <p className="text-display">빌딩 에너지 관리 시스템</p>
            <p className="text-xs text-gray-500 mt-2">클래스: text-display</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Heading 1 (24px, Semibold)</p>
            <h1 className="text-h1">작업 목록</h1>
            <p className="text-xs text-gray-500 mt-2">클래스: text-h1</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Heading 2 (20px, Semibold)</p>
            <h2 className="text-h2">기본정보</h2>
            <p className="text-xs text-gray-500 mt-2">클래스: text-h2</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Heading 3 (16px, Semibold)</p>
            <h3 className="text-h3">필터 설정</h3>
            <p className="text-xs text-gray-500 mt-2">클래스: text-h3</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Body Large (15px, Normal)</p>
            <p className="text-body-lg">이것은 본문 대형 텍스트입니다. 주요 콘텐츠를 표시할 때 사용됩니다.</p>
            <p className="text-xs text-gray-500 mt-2">클래스: text-body-lg</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Body Base (14px, Normal)</p>
            <p className="text-body-base">이것은 표준 본문 텍스트입니다. 대부분의 UI 텍스트가 이 크기를 사용합니다.</p>
            <p className="text-xs text-gray-500 mt-2">클래스: text-body-base</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Body Small (13px, Normal)</p>
            <p className="text-body-sm">이것은 본문 소형 텍스트입니다. 보조 정보나 작은 설명에 사용됩니다.</p>
            <p className="text-xs text-gray-500 mt-2">클래스: text-body-sm</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Caption (12px, Normal)</p>
            <p className="text-caption">이것은 캡션 텍스트입니다. 보조 메타데이터나 설명에 사용됩니다.</p>
            <p className="text-xs text-gray-500 mt-2">클래스: text-caption</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">Label (11px, Semibold, Uppercase)</p>
            <p className="text-label">작업 상태</p>
            <p className="text-xs text-gray-500 mt-2">클래스: text-label</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="mb-6 text-xl font-semibold">KPI / 숫자 표시</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded border border-gray-200 p-4 bg-white dark:bg-slate-950">
            <p className="text-xs font-medium text-gray-600 mb-2">에너지 사용량</p>
            <p className="text-4xl font-semibold font-display">1,234</p>
            <p className="text-xs text-gray-500 mt-1">kWh</p>
          </div>
          <div className="rounded border border-gray-200 p-4 bg-white dark:bg-slate-950">
            <p className="text-xs font-medium text-gray-600 mb-2">CO2 배출량</p>
            <p className="text-4xl font-semibold font-display">567</p>
            <p className="text-xs text-gray-500 mt-1">kg</p>
          </div>
          <div className="rounded border border-gray-200 p-4 bg-white dark:bg-slate-950">
            <p className="text-xs font-medium text-gray-600 mb-2">작업 완료율</p>
            <p className="text-4xl font-semibold font-display">89%</p>
            <p className="text-xs text-gray-500 mt-1">진행 중</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="mb-6 text-xl font-semibold">Font Features</h3>
        <div className="space-y-4">
          <div className="rounded border border-gray-200 p-4 bg-white dark:bg-slate-950">
            <p className="text-xs font-medium text-gray-600 mb-2">Pretendard Font (기본)</p>
            <p className="text-lg">이것은 Pretendard 폰트로 표시됩니다. 한글과 영문 모두 깔끔하게 표시됩니다.</p>
            <p className="text-body-sm text-gray-500 mt-2">font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif</p>
          </div>
          <div className="rounded border border-gray-200 p-4 bg-white dark:bg-slate-950">
            <p className="text-xs font-medium text-gray-600 mb-2">Display Font (숫자/KPI용)</p>
            <p className="font-display text-lg">숫자나 KPI는 font-display 클래스를 사용합니다: 123,456 | $1,234.56</p>
            <p className="text-body-sm text-gray-500 mt-2">font-family: Pretendard, system-ui, sans-serif | feature-settings: "tnum"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Design System/Typography",
  component: TypographyShowcase,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Complete typography scale for the insite-web application. Includes all text styles from Display (32px) to Label (11px), plus font features and KPI number display guidelines.",
      },
    },
  },
} satisfies Meta<typeof TypographyShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <TypographyShowcase />,
};
