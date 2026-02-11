"use client";

import { type ReactNode, useState } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  useController,
} from "react-hook-form";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ============================================================================
// Calendar Styles (Tailwind 기반)
// ============================================================================

const calendarClassNames = {
  months: "flex flex-col sm:flex-row gap-4",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
  nav: "flex items-center gap-1",
  nav_button: cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
  ),
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
  row: "flex w-full mt-2",
  cell: cn(
    "h-9 w-9 text-center text-sm p-0 relative",
    "[&:has([aria-selected].day-range-end)]:rounded-r-md",
    "[&:has([aria-selected].day-outside)]:bg-accent/50",
    "[&:has([aria-selected])]:bg-accent",
    "first:[&:has([aria-selected])]:rounded-l-md",
    "last:[&:has([aria-selected])]:rounded-r-md",
    "focus-within:relative focus-within:z-20"
  ),
  day: cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
    "hover:bg-accent hover:text-accent-foreground"
  ),
  day_range_end: "day-range-end",
  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  day_today: "bg-accent text-accent-foreground",
  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible",
};

// ============================================================================
// Types
// ============================================================================

export interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** react-hook-form control */
  control: Control<TFieldValues>;
  /** 필드 이름 */
  name: TName;
  /** 라벨 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 필수 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 날짜 포맷 (기본: yyyy-MM-dd) */
  dateFormat?: string;
  /** 표시 포맷 (기본: yyyy년 M월 d일) */
  displayFormat?: string;
  /** 최소 날짜 */
  minDate?: Date;
  /** 최대 날짜 */
  maxDate?: Date;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// DatePicker Component
// ============================================================================

/**
 * 날짜 선택 컴포넌트
 *
 * @features
 * - react-hook-form 통합
 * - 한국어 로케일
 * - 커스텀 날짜 포맷
 * - 최소/최대 날짜 제한
 *
 * @example
 * ```tsx
 * <DatePicker
 *   control={form.control}
 *   name="startDate"
 *   label="시작일"
 *   placeholder="날짜 선택"
 *   required
 * />
 * ```
 */
export function DatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "날짜 선택",
  helperText,
  required,
  disabled,
  dateFormat = "yyyy-MM-dd",
  displayFormat = "yyyy년 M월 d일",
  minDate,
  maxDate,
  className,
}: DatePickerProps<TFieldValues, TName>): ReactNode {
  const [open, setOpen] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  // 문자열 값을 Date로 변환
  const selectedDate = field.value
    ? typeof field.value === "string"
      ? parse(field.value, dateFormat, new Date())
      : (field.value as Date)
    : undefined;

  const handleSelect = (date: Date | undefined): void => {
    if (date) {
      const formatted = format(date, dateFormat);
      field.onChange(formatted as PathValue<TFieldValues, TName>);
    } else {
      field.onChange(undefined as PathValue<TFieldValues, TName>);
    }
    setOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive/50"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? format(selectedDate, displayFormat, { locale: ko })
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={ko}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            classNames={calendarClassNames}
            showOutsideDays
          />
        </PopoverContent>
      </Popover>
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {error?.message && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}

// ============================================================================
// MonthPicker Types
// ============================================================================

export interface MonthPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** react-hook-form control */
  control: Control<TFieldValues>;
  /** 필드 이름 */
  name: TName;
  /** 라벨 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 필수 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 월 포맷 (기본: yyyy-MM) */
  monthFormat?: string;
  /** 표시 포맷 (기본: yyyy년 M월) */
  displayFormat?: string;
  /** 최소 월 */
  minMonth?: Date;
  /** 최대 월 */
  maxMonth?: Date;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// MonthPicker Component
// ============================================================================

const MONTHS = [
  "1월", "2월", "3월", "4월",
  "5월", "6월", "7월", "8월",
  "9월", "10월", "11월", "12월",
];

/**
 * 월 선택 컴포넌트
 *
 * @features
 * - react-hook-form 통합
 * - 년/월 그리드 선택
 * - 커스텀 월 포맷
 * - 최소/최대 월 제한
 *
 * @example
 * ```tsx
 * <MonthPicker
 *   control={form.control}
 *   name="targetMonth"
 *   label="대상 월"
 *   placeholder="월 선택"
 * />
 * ```
 */
export function MonthPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "월 선택",
  helperText,
  required,
  disabled,
  monthFormat = "yyyy-MM",
  displayFormat = "yyyy년 M월",
  minMonth,
  maxMonth,
  className,
}: MonthPickerProps<TFieldValues, TName>): ReactNode {
  const [open, setOpen] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  // 문자열 값을 Date로 변환
  const selectedMonth = field.value
    ? typeof field.value === "string"
      ? parse(field.value, monthFormat, new Date())
      : (field.value as Date)
    : undefined;

  const [viewYear, setViewYear] = useState(
    selectedMonth?.getFullYear() ?? new Date().getFullYear()
  );

  const handleSelect = (month: number): void => {
    const date = new Date(viewYear, month, 1);

    // 범위 체크
    if (minMonth && date < minMonth) return;
    if (maxMonth && date > maxMonth) return;

    const formatted = format(date, monthFormat);
    field.onChange(formatted as PathValue<TFieldValues, TName>);
    setOpen(false);
  };

  const isMonthDisabled = (month: number): boolean => {
    const date = new Date(viewYear, month, 1);
    if (minMonth && date < minMonth) return true;
    if (maxMonth && date > maxMonth) return true;
    return false;
  };

  const isMonthSelected = (month: number): boolean => {
    if (!selectedMonth) return false;
    return (
      selectedMonth.getFullYear() === viewYear &&
      selectedMonth.getMonth() === month
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedMonth && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive/50"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedMonth
              ? format(selectedMonth, displayFormat, { locale: ko })
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-3">
            {/* 년도 네비게이션 */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewYear(viewYear - 1)}
              >
                <span className="sr-only">이전 년도</span>
                ‹
              </Button>
              <span className="text-sm font-medium">{viewYear}년</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewYear(viewYear + 1)}
              >
                <span className="sr-only">다음 년도</span>
                ›
              </Button>
            </div>

            {/* 월 그리드 */}
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((monthName, index) => (
                <Button
                  key={monthName}
                  variant={isMonthSelected(index) ? "default" : "ghost"}
                  size="sm"
                  disabled={isMonthDisabled(index)}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "h-9",
                    isMonthSelected(index) &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {monthName}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {error?.message && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}
