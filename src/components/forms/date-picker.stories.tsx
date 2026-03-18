import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, MonthPicker } from "./date-picker";
import { Button } from "@/components/ui/button";

// ============================================================================
// 타입 및 스키마
// ============================================================================

const dateSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  targetMonth: z.string().optional(),
  restrictedDate: z.string().optional(),
});

type DateFormValues = z.infer<typeof dateSchema>;

// ============================================================================
// Storybook 메타
// ============================================================================

const meta: Meta<typeof DatePicker> = {
  title: "Forms/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "react-day-picker 기반 날짜 선택 컴포넌트. 한국어 로케일을 지원하며 최소/최대 날짜 제한이 가능합니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// ============================================================================
// 공통 헬퍼
// ============================================================================

function DateFormWrapper({
  children,
  onSubmit,
}: {
  children: (form: ReturnType<typeof useForm<DateFormValues>>) => React.ReactNode;
  onSubmit?: (data: DateFormValues) => void;
}) {
  const form = useForm<DateFormValues>({
    resolver: zodResolver(dateSchema),
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit || (() => {}))}
      className="space-y-4 max-w-md"
    >
      {children(form)}
      <Button type="submit" size="sm">
        제출
      </Button>
    </form>
  );
}

// ============================================================================
// DatePicker Stories
// ============================================================================

/**
 * 기본 DatePicker
 */
export const Default: Story = {
  render: () => {
    return (
      <DateFormWrapper>
        {(form) => (
          <DatePicker
            control={form.control}
            name="startDate"
            label="시작일"
            placeholder="날짜 선택"
          />
        )}
      </DateFormWrapper>
    );
  },
};

/**
 * 초기값 포함
 */
export const WithValue: Story = {
  render: () => {
    return (
      <DateFormWrapper onSubmit={(data) => console.log(data)}>
        {(form) => {
          // 초기값 설정
          form.setValue("startDate", "2026-03-15");

          return (
            <DatePicker
              control={form.control}
              name="startDate"
              label="선택된 날짜"
              placeholder="날짜 선택"
            />
          );
        }}
      </DateFormWrapper>
    );
  },
};

/**
 * 필수 필드
 */
export const Required: Story = {
  render: () => {
    const requiredSchema = z.object({
      requiredDate: z.string().min(1, "날짜는 필수 입력입니다"),
    });

    return (
      <DateFormWrapper onSubmit={(data) => console.log(data)}>
        {(form) => (
          <DatePicker
            control={form.control}
            name="startDate"
            label="선택 필수 날짜"
            placeholder="날짜를 선택하세요"
            required
          />
        )}
      </DateFormWrapper>
    );
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  render: () => {
    return (
      <DateFormWrapper>
        {(form) => (
          <DatePicker
            control={form.control}
            name="startDate"
            label="비활성화된 날짜 선택"
            placeholder="선택할 수 없습니다"
            disabled
          />
        )}
      </DateFormWrapper>
    );
  },
};

/**
 * 날짜 범위 제한
 */
export const DateRange: Story = {
  render: () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return (
      <DateFormWrapper>
        {(form) => (
          <div className="space-y-4">
            <DatePicker
              control={form.control}
              name="startDate"
              label="시작일 (당월만)"
              placeholder="날짜 선택"
              minDate={minDate}
              maxDate={maxDate}
              helperText={`${minDate.toLocaleDateString("ko-KR")} ~ ${maxDate.toLocaleDateString("ko-KR")} 범위에서만 선택 가능`}
            />
          </div>
        )}
      </DateFormWrapper>
    );
  },
};

/**
 * 플레이스홀더 및 도움말
 */
export const Placeholder: Story = {
  render: () => {
    return (
      <DateFormWrapper>
        {(form) => (
          <DatePicker
            control={form.control}
            name="startDate"
            label="보고서 기준일"
            placeholder="기준일을 선택하세요"
            helperText="보고서를 작성할 기준 날짜를 선택합니다"
          />
        )}
      </DateFormWrapper>
    );
  },
};

/**
 * 폼 내 실제 사용 (날짜 범위)
 */
export const InForm: Story = {
  render: () => {
    return (
      <DateFormWrapper
        onSubmit={(data) => {
          console.log("조회 기간:", {
            from: data.startDate,
            to: data.endDate,
          });
        }}
      >
        {(form) => (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-sm mb-4">조회 기간</h3>
              <div className="space-y-4">
                <DatePicker
                  control={form.control}
                  name="startDate"
                  label="시작일"
                  placeholder="시작일 선택"
                  required
                />
                <DatePicker
                  control={form.control}
                  name="endDate"
                  label="종료일"
                  placeholder="종료일 선택"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4">월간 보고</h3>
              <MonthPicker
                control={form.control}
                name="targetMonth"
                label="보고 월"
                placeholder="월 선택"
                required
              />
            </div>
          </div>
        )}
      </DateFormWrapper>
    );
  },
};

// ============================================================================
// MonthPicker Stories
// ============================================================================

/**
 * MonthPicker 기본
 */
export const MonthPickerDefault: Story = {
  render: () => {
    return (
      <DateFormWrapper>
        {(form) => (
          <MonthPicker
            control={form.control}
            name="targetMonth"
            label="월 선택"
            placeholder="월을 선택하세요"
          />
        )}
      </DateFormWrapper>
    );
  },
};

/**
 * MonthPicker 초기값
 */
export const MonthPickerWithValue: Story = {
  render: () => {
    return (
      <DateFormWrapper>
        {(form) => {
          form.setValue("targetMonth", "2026-03");
          return (
            <MonthPicker
              control={form.control}
              name="targetMonth"
              label="선택된 월"
              placeholder="월을 선택하세요"
            />
          );
        }}
      </DateFormWrapper>
    );
  },
};

/**
 * MonthPicker 범위 제한
 */
export const MonthPickerWithRange: Story = {
  render: () => {
    const minMonth = new Date(2026, 0, 1); // 2026년 1월
    const maxMonth = new Date(2026, 11, 1); // 2026년 12월

    return (
      <DateFormWrapper>
        {(form) => (
          <MonthPicker
            control={form.control}
            name="targetMonth"
            label="2026년 월 선택"
            placeholder="월을 선택하세요"
            minMonth={minMonth}
            maxMonth={maxMonth}
            helperText="2026년에 한정되어 있습니다"
            required
          />
        )}
      </DateFormWrapper>
    );
  },
};
