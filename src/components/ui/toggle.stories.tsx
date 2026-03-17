import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import React from "react";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-3">기본 토글</p>
        <div className="flex gap-2">
          <Toggle aria-label="텍스트 강조">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="텍스트 기울임">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="텍스트 밑줄">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  ),
};

export const Pressed = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-3">활성 상태</p>
        <div className="flex gap-2">
          <Toggle defaultPressed aria-label="텍스트 강조">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle defaultPressed aria-label="텍스트 기울임">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="텍스트 밑줄">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  ),
};

export const Disabled = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-3">비활성 상태</p>
        <div className="flex gap-2">
          <Toggle disabled aria-label="텍스트 강조 (비활성)">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle disabled defaultPressed aria-label="텍스트 기울임 (비활성, 활성상태)">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle disabled aria-label="텍스트 밑줄 (비활성)">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  ),
};

export const WithIcon = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-3">아이콘 전용 토글</p>
        <div className="flex gap-2 border rounded p-2 bg-muted/20">
          <Toggle aria-label="왼쪽 정렬">
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="중앙 정렬">
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="오른쪽 정렬">
            <AlignRight className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">아이콘 + 텍스트 토글</p>
        <div className="flex gap-2">
          <Toggle aria-label="알림 활성화">
            <Bell className="mr-2 h-4 w-4" />
            알림
          </Toggle>
          <Toggle defaultPressed aria-label="저장">
            <Save className="mr-2 h-4 w-4" />
            저장됨
          </Toggle>
        </div>
      </div>
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-3">소형 (sm)</p>
        <div className="flex gap-2">
          <Toggle size="sm" aria-label="소형 강조">
            <Bold className="h-3 w-3" />
          </Toggle>
          <Toggle size="sm" defaultPressed aria-label="소형 기울임">
            <Italic className="h-3 w-3" />
          </Toggle>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">기본 (default)</p>
        <div className="flex gap-2">
          <Toggle aria-label="기본 강조">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle defaultPressed aria-label="기본 기울임">
            <Italic className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">대형 (lg)</p>
        <div className="flex gap-2">
          <Toggle size="lg" aria-label="대형 강조">
            <Bold className="h-5 w-5" />
          </Toggle>
          <Toggle size="lg" defaultPressed aria-label="대형 기울임">
            <Italic className="h-5 w-5" />
          </Toggle>
        </div>
      </div>
    </div>
  ),
};

export const ToggleGroup = {
  render: () => {
    const [selectedAlign, setSelectedAlign] = React.useState("left");
    const [selectedFormats, setSelectedFormats] = React.useState<string[]>(["bold"]);

    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold mb-3">정렬 (단일 선택)</p>
          <div className="flex gap-1 border rounded p-1 bg-muted/20 w-fit">
            <Toggle
              size="sm"
              pressed={selectedAlign === "left"}
              onPressedChange={() => setSelectedAlign("left")}
              aria-label="왼쪽 정렬"
              title="왼쪽 정렬"
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={selectedAlign === "center"}
              onPressedChange={() => setSelectedAlign("center")}
              aria-label="중앙 정렬"
              title="중앙 정렬"
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={selectedAlign === "right"}
              onPressedChange={() => setSelectedAlign("right")}
              aria-label="오른쪽 정렬"
              title="오른쪽 정렬"
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            선택됨: {selectedAlign === "left" ? "왼쪽" : selectedAlign === "center" ? "중앙" : "오른쪽"}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">텍스트 포맷 (다중 선택)</p>
          <div className="flex gap-1 border rounded p-1 bg-muted/20 w-fit">
            <Toggle
              size="sm"
              pressed={selectedFormats.includes("bold")}
              onPressedChange={(pressed) => {
                setSelectedFormats(
                  pressed
                    ? [...selectedFormats, "bold"]
                    : selectedFormats.filter((f) => f !== "bold")
                );
              }}
              aria-label="강조"
              title="강조 (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={selectedFormats.includes("italic")}
              onPressedChange={(pressed) => {
                setSelectedFormats(
                  pressed
                    ? [...selectedFormats, "italic"]
                    : selectedFormats.filter((f) => f !== "italic")
                );
              }}
              aria-label="기울임"
              title="기울임 (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={selectedFormats.includes("underline")}
              onPressedChange={(pressed) => {
                setSelectedFormats(
                  pressed
                    ? [...selectedFormats, "underline"]
                    : selectedFormats.filter((f) => f !== "underline")
                );
              }}
              aria-label="밑줄"
              title="밑줄 (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            선택됨: {selectedFormats.length > 0 ? selectedFormats.join(", ") : "없음"}
          </p>
        </div>
      </div>
    );
  },
};

// 추가 아이콘 컴포넌트 (lucide-react에서 가져오지 못한 경우 대체)
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21h3.4" />
    </svg>
  );
}

function Save(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
