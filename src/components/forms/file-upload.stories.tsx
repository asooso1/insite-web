import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpload, type UploadedFile } from "./file-upload";
import { Button } from "@/components/ui/button";

// ============================================================================
// 타입 및 스키마
// ============================================================================

const fileSchema = z.object({
  singleFile: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  multipleFiles: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  imageOnly: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  withPreview: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  documentFiles: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
});

type FileFormValues = z.infer<typeof fileSchema>;

// ============================================================================
// Storybook 메타
// ============================================================================

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "드래그앤드롭을 지원하는 파일 업로드 컴포넌트. 파일 검증, 다중 파일 업로드, 이미지 미리보기 기능을 제공합니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

// ============================================================================
// 공통 헬퍼
// ============================================================================

function FileFormWrapper({
  children,
  onSubmit,
}: {
  children: (form: ReturnType<typeof useForm<FileFormValues>>) => React.ReactNode;
  onSubmit?: (data: FileFormValues) => void;
}) {
  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
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
 * 기본 파일 업로드 (단일 파일)
 */
export const Default: Story = {
  render: () => {
    return (
      <FileFormWrapper>
        {(form) => (
          <FileUpload
            control={form.control}
            name="singleFile"
            label="파일 업로드"
            helperText="최대 5MB 파일을 선택할 수 있습니다"
            maxSize={5 * 1024 * 1024}
            showPreview
          />
        )}
      </FileFormWrapper>
    );
  },
};

/**
 * 다중 파일 업로드
 */
export const MultipleFiles: Story = {
  render: () => {
    return (
      <FileFormWrapper>
        {(form) => (
          <FileUpload
            control={form.control}
            name="multipleFiles"
            label="여러 파일 업로드"
            multiple
            maxFiles={5}
            maxSize={10 * 1024 * 1024}
            showPreview
            helperText="최대 5개 파일, 각 파일 10MB 이하"
          />
        )}
      </FileFormWrapper>
    );
  },
};

/**
 * 이미지 전용
 */
export const ImageOnly: Story = {
  render: () => {
    return (
      <FileFormWrapper>
        {(form) => (
          <FileUpload
            control={form.control}
            name="imageOnly"
            label="이미지 업로드"
            accept="image/*"
            multiple
            maxFiles={3}
            maxSize={3 * 1024 * 1024}
            showPreview
            helperText="JPG, PNG, GIF 등 이미지 파일만 가능합니다"
          />
        )}
      </FileFormWrapper>
    );
  },
};

/**
 * 미리보기 포함
 */
export const WithPreview: Story = {
  render: () => {
    return (
      <FileFormWrapper
        onSubmit={(data) => {
          console.log("업로드된 파일:", data.withPreview);
        }}
      >
        {(form) => (
          <FileUpload
            control={form.control}
            name="withPreview"
            label="썸네일 포함 업로드"
            accept="image/*"
            maxSize={2 * 1024 * 1024}
            showPreview={true}
            helperText="업로드된 이미지의 미리보기가 표시됩니다"
          />
        )}
      </FileFormWrapper>
    );
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  render: () => {
    return (
      <FileFormWrapper>
        {(form) => (
          <FileUpload
            control={form.control}
            name="singleFile"
            label="업로드 불가 (읽기 전용)"
            disabled
            maxSize={5 * 1024 * 1024}
            showPreview
          />
        )}
      </FileFormWrapper>
    );
  },
};

/**
 * 오류 상태
 */
export const WithError: Story = {
  render: () => {
    return (
      <FileFormWrapper>
        {(form) => {
          form.setError("singleFile", {
            type: "manual",
            message: "지원하지 않는 파일 형식입니다",
          });

          return (
            <FileUpload
              control={form.control}
              name="singleFile"
              label="필수 파일 업로드"
              required
              accept=".pdf,.doc,.docx"
              maxSize={5 * 1024 * 1024}
              showPreview
            />
          );
        }}
      </FileFormWrapper>
    );
  },
};

/**
 * 문서 업로드 (복합 용도)
 */
export const InForm: Story = {
  render: () => {
    return (
      <FileFormWrapper
        onSubmit={(data) => {
          console.log("제출 데이터:", data);
        }}
      >
        {(form) => (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-sm mb-4">기본 첨부파일</h3>
              <FileUpload
                control={form.control}
                name="singleFile"
                label="대표 문서"
                accept=".pdf,.doc,.docx,.xlsx"
                maxSize={10 * 1024 * 1024}
                showPreview
                helperText="최대 10MB의 문서 파일"
              />
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-sm mb-4">이미지 첨부</h3>
              <FileUpload
                control={form.control}
                name="imageOnly"
                label="시설 사진"
                accept="image/*"
                multiple
                maxFiles={3}
                maxSize={5 * 1024 * 1024}
                showPreview={true}
                helperText="시설의 현재 상태를 보여주는 사진을 업로드해주세요"
              />
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4">추가 자료</h3>
              <FileUpload
                control={form.control}
                name="multipleFiles"
                label="참고 자료"
                multiple
                maxFiles={5}
                maxSize={5 * 1024 * 1024}
                showPreview
                helperText="최대 5개 파일까지 업로드 가능합니다"
              />
            </div>
          </div>
        )}
      </FileFormWrapper>
    );
  },
};

/**
 * 서버 업로드 시뮬레이션
 */
export const WithServerUpload: Story = {
  render: () => {
    const mockUpload = async (file: File): Promise<UploadedFile> => {
      // 실제로는 서버에 업로드하지만, 데모에서는 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
    };

    return (
      <FileFormWrapper>
        {(form) => (
          <FileUpload
            control={form.control}
            name="documentFiles"
            label="서버 업로드"
            multiple
            maxFiles={3}
            maxSize={5 * 1024 * 1024}
            showPreview
            onUpload={mockUpload}
            helperText="선택하신 파일이 자동으로 서버에 업로드됩니다"
          />
        )}
      </FileFormWrapper>
    );
  },
};
