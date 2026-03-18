import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, type SelectOption } from "./form-field";
import { Button } from "@/components/ui/button";

// ============================================================================
// 타입 및 스키마
// ============================================================================

const testSchema = z.object({
  textInput: z.string().optional(),
  emailInput: z.string().email("올바른 이메일을 입력해주세요").optional(),
  passwordInput: z.string().min(6, "6자 이상 입력해주세요").optional(),
  numberInput: z.string().optional(),
  telInput: z.string().optional(),
  urlInput: z.string().url("올바른 URL을 입력해주세요").optional(),
  textareaInput: z.string().optional(),
  selectInput: z.string().optional(),
});

type FormValues = z.infer<typeof testSchema>;

// ============================================================================
// Storybook 메타
// ============================================================================

const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "react-hook-form Controller를 통합한 폼 필드 래퍼. label, helperText, error 메시지를 자동으로 처리합니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

// ============================================================================
// 공통 헬퍼
// ============================================================================

function FormWrapper({
  children,
  onSubmit,
}: {
  children: (form: ReturnType<typeof useForm<FormValues>>) => React.ReactNode;
  onSubmit?: (data: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(testSchema),
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
// Stories
// ============================================================================

/**
 * 기본 텍스트 입력 필드
 */
export const Default: Story = {
  render: () => (
    <FormWrapper>
      {(form) => (
        <FormField<FormValues>
          type="text"
          control={form.control}
          name="textInput"
          label="제목"
          placeholder="제목을 입력하세요"
        />
      )}
    </FormWrapper>
  ),
};

/**
 * 필수 필드 (asterisk 표시)
 */
export const Required: Story = {
  render: () => (
    <FormWrapper>
      {(form) => (
        <FormField<FormValues>
          type="text"
          control={form.control}
          name="textInput"
          label="필수 입력"
          placeholder="입력하세요"
          required
        />
      )}
    </FormWrapper>
  ),
};

/**
 * 오류 상태 (유효성 검사 실패)
 */
export const WithError: Story = {
  render: () => (
    <FormWrapper
      onSubmit={() => {
        /* 유효성 검사 실패 시뮬레이션 */
      }}
    >
      {(form) => {
        // 에러 시뮬레이션
        form.setError("emailInput", {
          type: "manual",
          message: "이미 등록된 이메일입니다",
        });

        return (
          <FormField<FormValues>
            type="email"
            control={form.control}
            name="emailInput"
            label="이메일"
            placeholder="example@email.com"
            required
          />
        );
      }}
    </FormWrapper>
  ),
};

/**
 * 도움말 텍스트 포함
 */
export const WithHelperText: Story = {
  render: () => (
    <FormWrapper>
      {(form) => (
        <FormField<FormValues>
          type="text"
          control={form.control}
          name="textInput"
          label="사용자명"
          placeholder="사용자명을 입력하세요"
          helperText="3자 이상 20자 이하로 입력해주세요"
        />
      )}
    </FormWrapper>
  ),
};

/**
 * Input 조합 (다양한 타입)
 */
export const WithInput: Story = {
  render: () => (
    <FormWrapper>
      {(form) => (
        <div className="space-y-4">
          <FormField<FormValues>
            type="text"
            control={form.control}
            name="textInput"
            label="일반 텍스트"
            placeholder="텍스트 입력"
          />
          <FormField<FormValues>
            type="email"
            control={form.control}
            name="emailInput"
            label="이메일"
            placeholder="example@email.com"
          />
          <FormField<FormValues>
            type="password"
            control={form.control}
            name="passwordInput"
            label="비밀번호"
            placeholder="비밀번호 입력"
            helperText="6자 이상 입력해주세요"
          />
          <FormField<FormValues>
            type="number"
            control={form.control}
            name="numberInput"
            label="숫자"
            placeholder="숫자 입력"
          />
          <FormField<FormValues>
            type="tel"
            control={form.control}
            name="telInput"
            label="전화번호"
            placeholder="010-1234-5678"
          />
          <FormField<FormValues>
            type="url"
            control={form.control}
            name="urlInput"
            label="웹사이트"
            placeholder="https://example.com"
          />
        </div>
      )}
    </FormWrapper>
  ),
};

/**
 * Select 조합
 */
export const WithSelect: Story = {
  render: () => {
    const statusOptions: SelectOption[] = [
      { label: "활성", value: "active" },
      { label: "비활성", value: "inactive" },
      { label: "보류중", value: "pending" },
    ];

    return (
      <FormWrapper>
        {(form) => (
          <FormField<FormValues>
            type="select"
            control={form.control}
            name="selectInput"
            label="상태"
            placeholder="상태를 선택하세요"
            options={statusOptions}
            required
          />
        )}
      </FormWrapper>
    );
  },
};

/**
 * Textarea 조합
 */
export const WithTextarea: Story = {
  render: () => (
    <FormWrapper>
      {(form) => (
        <FormField<FormValues>
          type="textarea"
          control={form.control}
          name="textareaInput"
          label="설명"
          placeholder="상세 설명을 입력하세요"
          rows={5}
          helperText="최대 500자까지 입력 가능합니다"
        />
      )}
    </FormWrapper>
  ),
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  render: () => (
    <FormWrapper>
      {(form) => (
        <div className="space-y-4">
          <FormField<FormValues>
            type="text"
            control={form.control}
            name="textInput"
            label="읽기 전용 필드"
            placeholder="입력할 수 없습니다"
            disabled
          />
          <FormField<FormValues>
            type="select"
            control={form.control}
            name="selectInput"
            label="선택 불가 드롭다운"
            options={[
              { label: "옵션 1", value: "1" },
              { label: "옵션 2", value: "2" },
            ]}
            disabled
          />
          <FormField<FormValues>
            type="textarea"
            control={form.control}
            name="textareaInput"
            label="읽기 전용 텍스트 영역"
            placeholder="편집할 수 없습니다"
            disabled
          />
        </div>
      )}
    </FormWrapper>
  ),
};

/**
 * 복합 폼 (실제 사용 사례)
 */
export const InContext: Story = {
  render: () => (
    <FormWrapper
      onSubmit={(data) => {
        console.log("폼 제출:", data);
      }}
    >
      {(form) => (
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-sm mb-4">기본 정보</h3>
            <FormField<FormValues>
              type="text"
              control={form.control}
              name="textInput"
              label="이름"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-sm mb-4">연락처</h3>
            <FormField<FormValues>
              type="email"
              control={form.control}
              name="emailInput"
              label="이메일"
              placeholder="example@email.com"
              helperText="비즈니스 메일을 입력해주세요"
            />
            <div className="mt-4">
              <FormField<FormValues>
                type="tel"
                control={form.control}
                name="telInput"
                label="전화번호"
                placeholder="010-1234-5678"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">기타 정보</h3>
            <FormField<FormValues>
              type="select"
              control={form.control}
              name="selectInput"
              label="부서"
              placeholder="부서를 선택하세요"
              options={[
                { label: "개발팀", value: "dev" },
                { label: "기획팀", value: "plan" },
                { label: "운영팀", value: "ops" },
              ]}
            />
            <div className="mt-4">
              <FormField<FormValues>
                type="textarea"
                control={form.control}
                name="textareaInput"
                label="비고"
                placeholder="추가 정보를 입력하세요"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  ),
};
