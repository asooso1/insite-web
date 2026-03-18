import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CascadingSelect, type CascadeLevelConfig, type CascadeOption } from "./cascading-select";
import { Button } from "@/components/ui/button";

// ============================================================================
// 타입 및 스키마
// ============================================================================

const cascadeSchema = z.object({
  level1: z.string().optional(),
  level2: z.string().optional(),
  level3: z.string().optional(),
  company: z.string().optional(),
  region: z.string().optional(),
  building: z.string().optional(),
});

type CascadeFormValues = z.infer<typeof cascadeSchema>;

// ============================================================================
// 모의 데이터 및 API 함수
// ============================================================================

// 2단계 데이터
const mockLevel1Data: Record<string, CascadeOption[]> = {
  null: [
    { label: "카테고리 A", value: "cat-a" },
    { label: "카테고리 B", value: "cat-b" },
    { label: "카테고리 C", value: "cat-c" },
  ],
  "cat-a": [
    { label: "항목 A1", value: "a1" },
    { label: "항목 A2", value: "a2" },
  ],
  "cat-b": [
    { label: "항목 B1", value: "b1" },
    { label: "항목 B2", value: "b2" },
    { label: "항목 B3", value: "b3" },
  ],
  "cat-c": [
    { label: "항목 C1", value: "c1" },
  ],
};

// 3단계 데이터
const mockLevel2Data: Record<string, CascadeOption[]> = {
  a1: [
    { label: "세부 A1-1", value: "a1-1" },
    { label: "세부 A1-2", value: "a1-2" },
  ],
  a2: [
    { label: "세부 A2-1", value: "a2-1" },
  ],
  b1: [
    { label: "세부 B1-1", value: "b1-1" },
    { label: "세부 B1-2", value: "b1-2" },
    { label: "세부 B1-3", value: "b1-3" },
  ],
  b2: [
    { label: "세부 B2-1", value: "b2-1" },
  ],
  b3: [],
  c1: [
    { label: "세부 C1-1", value: "c1-1" },
    { label: "세부 C1-2", value: "c1-2" },
  ],
};

const fetchLevel1Options = async (parentValue: string | null): Promise<CascadeOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLevel1Data[parentValue ?? "null"] || [];
};

const fetchLevel2Options = async (parentValue: string | null): Promise<CascadeOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLevel2Data[parentValue || ""] || [];
};

// ============================================================================
// Storybook 메타
// ============================================================================

const meta: Meta<typeof CascadingSelect> = {
  title: "Forms/CascadingSelect",
  component: CascadingSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "다중 레벨 종속 선택 컴포넌트. 상위 값이 변경되면 하위 값이 자동으로 초기화되고 새로운 옵션을 로드합니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CascadingSelect>;

// ============================================================================
// 공통 헬퍼
// ============================================================================

function CascadeFormWrapper({
  children,
  onSubmit,
}: {
  children: (form: ReturnType<typeof useForm<CascadeFormValues>>) => React.ReactNode;
  onSubmit?: (data: CascadeFormValues) => void;
}) {
  const form = useForm<CascadeFormValues>({
    resolver: zodResolver(cascadeSchema),
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit || (() => {}))}
      className="space-y-4 max-w-2xl"
    >
      {children(form)}
      <Button type="submit" size="sm">
        제출
      </Button>
    </form>
  );
}

// ============================================================================
// Stories
// ============================================================================

/**
 * 기본 2단계 캐스케이딩 선택
 */
export const Default: Story = {
  render: () => {
    const levels: CascadeLevelConfig<CascadeFormValues>[] = [
      {
        name: "level1",
        label: "1단계",
        placeholder: "1단계를 선택하세요",
        queryKeyPrefix: "level1",
        queryFn: fetchLevel1Options,
        parentLevelIndex: null,
      },
      {
        name: "level2",
        label: "2단계",
        placeholder: "2단계를 선택하세요",
        queryKeyPrefix: "level2",
        queryFn: fetchLevel2Options,
        parentLevelIndex: 0,
      },
    ];

    return (
      <CascadeFormWrapper>
        {(form) => (
          <CascadingSelect
            control={form.control}
            levels={levels}
            direction="vertical"
          />
        )}
      </CascadeFormWrapper>
    );
  },
};

/**
 * 3단계 캐스케이딩 선택
 */
export const ThreeLevels: Story = {
  render: () => {
    const mockLevel3Data: Record<string, CascadeOption[]> = {
      "a1-1": [
        { label: "최종 A1-1-a", value: "a1-1-a" },
        { label: "최종 A1-1-b", value: "a1-1-b" },
      ],
      "a1-2": [
        { label: "최종 A1-2-a", value: "a1-2-a" },
      ],
      "a2-1": [
        { label: "최종 A2-1-a", value: "a2-1-a" },
        { label: "최종 A2-1-b", value: "a2-1-b" },
      ],
      "b1-1": [
        { label: "최종 B1-1-a", value: "b1-1-a" },
      ],
      "b1-2": [
        { label: "최종 B1-2-a", value: "b1-2-a" },
      ],
      "b1-3": [
        { label: "최종 B1-3-a", value: "b1-3-a" },
      ],
      "b2-1": [
        { label: "최종 B2-1-a", value: "b2-1-a" },
        { label: "최종 B2-1-b", value: "b2-1-b" },
      ],
      "c1-1": [
        { label: "최종 C1-1-a", value: "c1-1-a" },
      ],
      "c1-2": [
        { label: "최종 C1-2-a", value: "c1-2-a" },
      ],
    };

    const fetchLevel3Options = async (parentValue: string | null): Promise<CascadeOption[]> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockLevel3Data[parentValue || ""] || [];
    };

    const levels: CascadeLevelConfig<CascadeFormValues>[] = [
      {
        name: "level1",
        label: "1단계",
        placeholder: "선택하세요",
        queryKeyPrefix: "level1",
        queryFn: fetchLevel1Options,
        parentLevelIndex: null,
      },
      {
        name: "level2",
        label: "2단계",
        placeholder: "선택하세요",
        queryKeyPrefix: "level2",
        queryFn: fetchLevel2Options,
        parentLevelIndex: 0,
      },
      {
        name: "level3",
        label: "3단계",
        placeholder: "선택하세요",
        queryKeyPrefix: "level3",
        queryFn: fetchLevel3Options,
        parentLevelIndex: 1,
      },
    ];

    return (
      <CascadeFormWrapper
        onSubmit={(data) => {
          console.log("3단계 선택:", data);
        }}
      >
        {(form) => (
          <CascadingSelect
            control={form.control}
            levels={levels}
            direction="vertical"
          />
        )}
      </CascadeFormWrapper>
    );
  },
};

/**
 * 초기값 포함
 */
export const WithInitialValue: Story = {
  render: () => {
    const levels: CascadeLevelConfig<CascadeFormValues>[] = [
      {
        name: "level1",
        label: "1단계",
        placeholder: "1단계를 선택하세요",
        queryKeyPrefix: "level1",
        queryFn: fetchLevel1Options,
        parentLevelIndex: null,
      },
      {
        name: "level2",
        label: "2단계",
        placeholder: "2단계를 선택하세요",
        queryKeyPrefix: "level2",
        queryFn: fetchLevel2Options,
        parentLevelIndex: 0,
      },
    ];

    return (
      <CascadeFormWrapper>
        {(form) => {
          // 초기값 설정
          form.setValue("level1", "cat-b");
          form.setValue("level2", "b2");

          return (
            <CascadingSelect
              control={form.control}
              levels={levels}
              direction="vertical"
            />
          );
        }}
      </CascadeFormWrapper>
    );
  },
};

/**
 * 수평 레이아웃 (3컬럼)
 */
export const HorizontalLayout: Story = {
  render: () => {
    const levels: CascadeLevelConfig<CascadeFormValues>[] = [
      {
        name: "level1",
        label: "1단계",
        placeholder: "선택하세요",
        queryKeyPrefix: "level1",
        queryFn: fetchLevel1Options,
        parentLevelIndex: null,
      },
      {
        name: "level2",
        label: "2단계",
        placeholder: "선택하세요",
        queryKeyPrefix: "level2",
        queryFn: fetchLevel2Options,
        parentLevelIndex: 0,
      },
    ];

    return (
      <CascadeFormWrapper>
        {(form) => (
          <CascadingSelect
            control={form.control}
            levels={levels}
            direction="horizontal"
            columns={2}
          />
        )}
      </CascadeFormWrapper>
    );
  },
};

/**
 * 필수 필드
 */
export const Required: Story = {
  render: () => {
    const levels: CascadeLevelConfig<CascadeFormValues>[] = [
      {
        name: "level1",
        label: "1단계 (필수)",
        placeholder: "선택해주세요",
        queryKeyPrefix: "level1",
        queryFn: fetchLevel1Options,
        parentLevelIndex: null,
        required: true,
      },
      {
        name: "level2",
        label: "2단계 (필수)",
        placeholder: "선택해주세요",
        queryKeyPrefix: "level2",
        queryFn: fetchLevel2Options,
        parentLevelIndex: 0,
        required: true,
      },
    ];

    return (
      <CascadeFormWrapper>
        {(form) => (
          <CascadingSelect
            control={form.control}
            levels={levels}
            direction="vertical"
          />
        )}
      </CascadeFormWrapper>
    );
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  render: () => {
    const levels: CascadeLevelConfig<CascadeFormValues>[] = [
      {
        name: "level1",
        label: "1단계",
        placeholder: "선택할 수 없습니다",
        queryKeyPrefix: "level1",
        queryFn: fetchLevel1Options,
        parentLevelIndex: null,
        disabled: true,
      },
      {
        name: "level2",
        label: "2단계",
        placeholder: "선택할 수 없습니다",
        queryKeyPrefix: "level2",
        queryFn: fetchLevel2Options,
        parentLevelIndex: 0,
        disabled: true,
      },
    ];

    return (
      <CascadeFormWrapper>
        {(form) => (
          <CascadingSelect
            control={form.control}
            levels={levels}
            direction="vertical"
          />
        )}
      </CascadeFormWrapper>
    );
  },
};

/**
 * 폼 내 실제 사용 사례
 */
export const InForm: Story = {
  render: () => {
    const levels: CascadeLevelConfig<CascadeFormValues>[] = [
      {
        name: "level1",
        label: "카테고리",
        placeholder: "카테고리를 선택하세요",
        queryKeyPrefix: "categories",
        queryFn: fetchLevel1Options,
        parentLevelIndex: null,
        required: true,
      },
      {
        name: "level2",
        label: "항목",
        placeholder: "항목을 선택하세요",
        queryKeyPrefix: "items",
        queryFn: fetchLevel2Options,
        parentLevelIndex: 0,
        required: true,
      },
    ];

    return (
      <CascadeFormWrapper
        onSubmit={(data) => {
          console.log("폼 제출:", data);
        }}
      >
        {(form) => (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-sm mb-4">분류 정보</h3>
              <CascadingSelect
                control={form.control}
                levels={levels}
                direction="horizontal"
                columns={2}
              />
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                위에서 선택한 카테고리와 항목에 따라 추가 옵션이 로드됩니다.
              </p>
            </div>
          </div>
        )}
      </CascadeFormWrapper>
    );
  },
};
