import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Chip } from "./chip";
import { Tag, AlertCircle, CheckCircle, Info } from "lucide-react";

const meta = {
  title: "Components/Data Display/Chip",
  component: Chip,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "error", "info", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "기본 칩",
    variant: "default",
  },
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">기본 색상</h3>
        <div className="flex flex-wrap gap-2">
          <Chip variant="default">기본</Chip>
          <Chip variant="primary">주요</Chip>
          <Chip variant="secondary">보조</Chip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">상태 색상</h3>
        <div className="flex flex-wrap gap-2">
          <Chip variant="success">성공</Chip>
          <Chip variant="warning">경고</Chip>
          <Chip variant="error">오류</Chip>
          <Chip variant="info">정보</Chip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">테두리</h3>
        <div className="flex flex-wrap gap-2">
          <Chip variant="outline">테두리</Chip>
          <Chip variant="outline">태그</Chip>
          <Chip variant="outline">라벨</Chip>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">작은 크기</h3>
        <div className="flex flex-wrap gap-2">
          <Chip size="sm" variant="primary">
            작음
          </Chip>
          <Chip size="sm" variant="success">
            완료
          </Chip>
          <Chip size="sm" variant="warning">
            진행중
          </Chip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">중간 크기 (기본)</h3>
        <div className="flex flex-wrap gap-2">
          <Chip size="md" variant="primary">
            중간
          </Chip>
          <Chip size="md" variant="success">
            완료
          </Chip>
          <Chip size="md" variant="warning">
            진행중
          </Chip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">큰 크기</h3>
        <div className="flex flex-wrap gap-2">
          <Chip size="lg" variant="primary">
            큼
          </Chip>
          <Chip size="lg" variant="success">
            완료
          </Chip>
          <Chip size="lg" variant="warning">
            진행중
          </Chip>
        </div>
      </div>
    </div>
  ),
};

export const WithClose: Story = {
  render: () => {
    const [chips, setChips] = useState(["React", "TypeScript", "Storybook"]);

    const handleRemove = (index: number): void => {
      setChips(chips.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">선택된 기술 (삭제 버튼 포함)</h3>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <Chip
              key={chip}
              variant="primary"
              onRemove={() => handleRemove(index)}
            >
              {chip}
            </Chip>
          ))}
        </div>
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">아이콘 포함</h3>
        <div className="flex flex-wrap gap-2">
          <Chip variant="success" icon={<CheckCircle className="h-3 w-3" />}>
            완료됨
          </Chip>
          <Chip variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
            주의
          </Chip>
          <Chip variant="info" icon={<Info className="h-3 w-3" />}>
            정보
          </Chip>
          <Chip variant="primary" icon={<Tag className="h-3 w-3" />}>
            태그
          </Chip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">아이콘 + 삭제 버튼</h3>
        <div className="flex flex-wrap gap-2">
          <Chip
            variant="success"
            icon={<CheckCircle className="h-3 w-3" />}
            onRemove={() => {}}
          >
            완료됨
          </Chip>
          <Chip
            variant="warning"
            icon={<AlertCircle className="h-3 w-3" />}
            onRemove={() => {}}
          >
            주의
          </Chip>
          <Chip
            variant="info"
            icon={<Info className="h-3 w-3" />}
            onRemove={() => {}}
          >
            정보
          </Chip>
        </div>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => {
    const [selectedTags, setSelectedTags] = useState<string[]>(["태그1", "태그2"]);
    const allTags = ["태그1", "태그2", "태그3", "태그4", "태그5"];

    const toggleTag = (tag: string): void => {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">선택 가능한 태그 그룹</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="cursor-pointer"
              >
                <Chip
                  variant={selectedTags.includes(tag) ? "primary" : "outline"}
                >
                  {tag}
                </Chip>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">카테고리 칩 그룹</h3>
          <div className="flex flex-wrap gap-2">
            <Chip variant="default">필터</Chip>
            <Chip variant="primary">활성</Chip>
            <Chip variant="secondary">비활성</Chip>
            <Chip variant="success">승인</Chip>
            <Chip variant="error">거절</Chip>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">작업 상태 칩 그룹</h3>
          <div className="flex flex-wrap gap-2">
            <Chip variant="success" icon={<CheckCircle className="h-3 w-3" />}>
              완료 (3)
            </Chip>
            <Chip variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
              진행중 (5)
            </Chip>
            <Chip variant="error">취소됨 (1)</Chip>
            <Chip variant="info">대기중 (2)</Chip>
          </div>
        </div>
      </div>
    );
  },
};

export const Contextual: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">작업 #001</h4>
          <Chip variant="success" size="sm">
            완료
          </Chip>
        </div>
        <p className="text-sm text-muted-foreground mb-3">빌딩 A 에어컨 정비</p>
        <div className="flex flex-wrap gap-1">
          <Chip size="sm" variant="outline">
            HVAC
          </Chip>
          <Chip size="sm" variant="outline">
            정기 점검
          </Chip>
          <Chip size="sm" variant="outline">
            우선순위: 중
          </Chip>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">작업 #002</h4>
          <Chip variant="warning" size="sm">
            진행중
          </Chip>
        </div>
        <p className="text-sm text-muted-foreground mb-3">조명 LED 교체</p>
        <div className="flex flex-wrap gap-1">
          <Chip size="sm" variant="outline">
            전기
          </Chip>
          <Chip size="sm" variant="outline">
            에너지 절감
          </Chip>
          <Chip size="sm" variant="outline">
            우선순위: 높음
          </Chip>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">작업 #003</h4>
          <Chip variant="error" size="sm">
            취소됨
          </Chip>
        </div>
        <p className="text-sm text-muted-foreground mb-3">보일러 점검</p>
        <div className="flex flex-wrap gap-1">
          <Chip size="sm" variant="outline">
            보일러
          </Chip>
          <Chip size="sm" variant="outline">
            난방
          </Chip>
          <Chip size="sm" variant="outline">
            우선순위: 낮음
          </Chip>
        </div>
      </div>
    </div>
  ),
};
