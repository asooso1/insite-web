import type { Meta, StoryObj } from "@storybook/react";

function ElevationShowcase() {
  const shadows = [
    { level: 1, className: "shadow-1", description: "아이콘, 작은 UI 요소" },
    { level: 2, className: "shadow-2", description: "토글, 드롭다운" },
    { level: 3, className: "shadow-3", description: "카드, 패널" },
    { level: 4, className: "shadow-4", description: "모달 배경" },
    { level: 5, className: "shadow-5", description: "팝오버, 토스트" },
    { level: 6, className: "shadow-6", description: "최상위 레이어" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="mb-8 text-2xl font-semibold">Elevation (그림자) 레벨</h2>
        <p className="mb-8 text-gray-600">
          elevation 레벨은 UI 계층 구조를 시각적으로 표현합니다. 더 높은 레벨은 더 강한 그림자를 가집니다.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shadows.map((shadow) => (
            <div key={shadow.level} className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-600">Level {shadow.level}</p>
              <div
                className={`${shadow.className} h-24 rounded-lg border border-gray-200 bg-white p-4 flex items-center justify-center`}
              >
                <p className="text-sm font-medium text-gray-700">Elevation {shadow.level}</p>
              </div>
              <p className="text-xs text-gray-600">{shadow.description}</p>
              <p className="text-xs font-mono text-gray-500">클래스: {shadow.className}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="mb-6 text-xl font-semibold">사용 예시</h3>

        <div className="space-y-8">
          <div>
            <p className="mb-3 text-sm font-semibold">카드 (shadow-3)</p>
            <div className="shadow-3 rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm font-semibold mb-2">빌딩 정보</p>
              <p className="text-sm text-gray-600">본사 빌딩</p>
              <p className="text-sm text-gray-500">서울시 강남구</p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">모달 (shadow-4)</p>
            <div className="shadow-4 rounded-lg bg-white p-6 border border-gray-200">
              <p className="text-sm font-semibold mb-4">작업 등록</p>
              <form className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">제목</label>
                  <input type="text" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="작업 제목을 입력하세요" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">설명</label>
                  <textarea className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="작업 설명을 입력하세요" rows={3} />
                </div>
              </form>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">팝오버/토스트 (shadow-5)</p>
            <div className="shadow-5 rounded-lg bg-white p-4 border border-gray-200 max-w-xs">
              <p className="text-xs font-semibold text-green-600 mb-1">성공</p>
              <p className="text-sm text-gray-700">작업이 정상적으로 저장되었습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="mb-6 text-xl font-semibold">추가 그림자 토큰</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold">Card Shadow</p>
            <div
              className="h-20 rounded-lg border border-gray-200 bg-white"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
              }}
            />
            <p className="text-xs text-gray-600 mt-2">--shadow-card</p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Card Shadow Hover</p>
            <div
              className="h-20 rounded-lg border border-gray-200 bg-white transition"
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)",
              }}
            />
            <p className="text-xs text-gray-600 mt-2">--shadow-card-hover</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="mb-6 text-xl font-semibold">Z-Index 레이어</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">--z-base: 1</span> 기본 콘텐츠</p>
          <p><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">--z-dropdown: 50</span> 드롭다운 메뉴</p>
          <p><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">--z-sticky: 100</span> 고정 헤더/사이드바</p>
          <p><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">--z-overlay: 200</span> 오버레이</p>
          <p><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">--z-modal: 300</span> 모달 다이얼로그</p>
          <p><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">--z-toast: 400</span> 토스트 알림</p>
          <p><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">--z-loader: 500</span> 로더</p>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Design System/Elevation",
  component: ElevationShowcase,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Shadow and elevation system for visual hierarchy. Includes 6 elevation levels, card shadows, and z-index layering guidelines.",
      },
    },
  },
} satisfies Meta<typeof ElevationShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <ElevationShowcase />,
};
