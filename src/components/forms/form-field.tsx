"use client";

import { type ReactNode, type ComponentProps } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
}

interface BaseFieldProps {
  /** 필드 라벨 */
  label?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 필수 필드 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 클래스명 */
  className?: string;
  /** 컨테이너 클래스명 */
  containerClassName?: string;
}

export interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFieldProps {
  type: "text" | "email" | "password" | "number" | "tel" | "url";
  control: Control<TFieldValues>;
  name: TName;
  /** Input 추가 props */
  inputProps?: Omit<ComponentProps<typeof Input>, "name" | "type" | "disabled" | "placeholder">;
}

export interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFieldProps {
  type: "textarea";
  control: Control<TFieldValues>;
  name: TName;
  /** 행 수 */
  rows?: number;
  /** Textarea 추가 props */
  textareaProps?: Omit<ComponentProps<typeof Textarea>, "name" | "disabled" | "placeholder" | "rows">;
}

export interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFieldProps {
  type: "select";
  control: Control<TFieldValues>;
  name: TName;
  /** 선택 옵션 */
  options: SelectOption[];
}

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> =
  | TextFieldProps<TFieldValues, TName>
  | TextareaFieldProps<TFieldValues, TName>
  | SelectFieldProps<TFieldValues, TName>;

// ============================================================================
// Helper Components
// ============================================================================

interface FieldWrapperProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

function FieldWrapper({
  label,
  helperText,
  errorMessage,
  required,
  htmlFor,
  className,
  children,
}: FieldWrapperProps): ReactNode {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={htmlFor}
          className={cn(errorMessage && "text-destructive")}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {helperText && !errorMessage && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

// ============================================================================
// Main FormField Component
// ============================================================================

/**
 * 폼 필드 래퍼 컴포넌트
 *
 * @features
 * - react-hook-form Controller 통합
 * - label, helperText, error 자동 처리
 * - 다양한 필드 타입 지원 (text, email, password, textarea, select)
 * - 필수 필드 표시
 *
 * @example
 * ```tsx
 * <FormField
 *   type="text"
 *   control={form.control}
 *   name="title"
 *   label="제목"
 *   placeholder="제목을 입력하세요"
 *   required
 * />
 *
 * <FormField
 *   type="select"
 *   control={form.control}
 *   name="status"
 *   label="상태"
 *   options={[
 *     { label: "진행중", value: "in_progress" },
 *     { label: "완료", value: "completed" },
 *   ]}
 * />
 * ```
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldProps<TFieldValues, TName>): ReactNode {
  const {
    control,
    name,
    label,
    helperText,
    required,
    disabled,
    placeholder,
    className,
    containerClassName,
  } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const errorMessage = error?.message;
        const fieldId = `field-${name}`;

        // Text/Email/Password/Number/Tel/URL Input
        if (
          props.type === "text" ||
          props.type === "email" ||
          props.type === "password" ||
          props.type === "number" ||
          props.type === "tel" ||
          props.type === "url"
        ) {
          const { inputProps } = props as TextFieldProps<TFieldValues, TName>;

          return (
            <FieldWrapper
              label={label}
              helperText={helperText}
              errorMessage={errorMessage}
              required={required}
              htmlFor={fieldId}
              className={containerClassName}
            >
              <Input
                {...field}
                {...inputProps}
                id={fieldId}
                type={props.type}
                disabled={disabled}
                placeholder={placeholder}
                aria-invalid={!!error}
                className={cn(
                  error && "border-destructive focus-visible:ring-destructive/50",
                  className
                )}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = props.type === "number"
                    ? e.target.value === "" ? "" : Number(e.target.value)
                    : e.target.value;
                  field.onChange(value);
                }}
              />
            </FieldWrapper>
          );
        }

        // Textarea
        if (props.type === "textarea") {
          const { rows = 3, textareaProps } = props as TextareaFieldProps<TFieldValues, TName>;

          return (
            <FieldWrapper
              label={label}
              helperText={helperText}
              errorMessage={errorMessage}
              required={required}
              htmlFor={fieldId}
              className={containerClassName}
            >
              <Textarea
                {...field}
                {...textareaProps}
                id={fieldId}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder}
                aria-invalid={!!error}
                className={cn(
                  error && "border-destructive focus-visible:ring-destructive/50",
                  className
                )}
                value={field.value ?? ""}
              />
            </FieldWrapper>
          );
        }

        // Select
        if (props.type === "select") {
          const { options } = props as SelectFieldProps<TFieldValues, TName>;

          return (
            <FieldWrapper
              label={label}
              helperText={helperText}
              errorMessage={errorMessage}
              required={required}
              htmlFor={fieldId}
              className={containerClassName}
            >
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger
                  id={fieldId}
                  aria-invalid={!!error}
                  className={cn(
                    error && "border-destructive focus:ring-destructive/50",
                    className
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrapper>
          );
        }

        // 지원하지 않는 타입
        return <></>;
      }}
    />
  );
}

// ============================================================================
// Exports
// ============================================================================

export { FieldWrapper };
