"use client";

import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  useController,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, File, Image as ImageIcon, FileText, AlertCircle } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

export interface FileUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** react-hook-form control */
  control: Control<TFieldValues>;
  /** 필드 이름 */
  name: TName;
  /** 라벨 */
  label?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 필수 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 다중 파일 허용 */
  multiple?: boolean;
  /** 허용 파일 타입 (예: "image/*", ".pdf,.doc") */
  accept?: string;
  /** 최대 파일 크기 (bytes) */
  maxSize?: number;
  /** 최대 파일 개수 (multiple일 때) */
  maxFiles?: number;
  /** 이미지 미리보기 활성화 */
  showPreview?: boolean;
  /** 드래그앤드롭 영역 높이 */
  dropzoneHeight?: string;
  /** 클래스명 */
  className?: string;
  /** 파일 업로드 핸들러 (서버 업로드용) */
  onUpload?: (file: File) => Promise<UploadedFile>;
  /** 파일 삭제 핸들러 */
  onRemove?: (file: UploadedFile) => Promise<void>;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getFileIcon(type: string): ReactNode {
  if (type.startsWith("image/")) {
    return <ImageIcon className="h-8 w-8 text-blue-500" />;
  }
  if (type === "application/pdf") {
    return <FileText className="h-8 w-8 text-red-500" />;
  }
  return <File className="h-8 w-8 text-gray-500" />;
}

function isImageFile(type: string): boolean {
  return type.startsWith("image/");
}

// ============================================================================
// File Preview Component
// ============================================================================

interface FilePreviewProps {
  file: UploadedFile;
  showPreview: boolean;
  onRemove: () => void;
  disabled?: boolean;
}

function FilePreview({
  file,
  showPreview,
  onRemove,
  disabled,
}: FilePreviewProps): ReactNode {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 이미지 미리보기 URL 생성
  useEffect(() => {
    if (!showPreview || !isImageFile(file.type)) {
      return undefined;
    }

    if (file.url) {
      setPreviewUrl(file.url);
      return undefined;
    }

    if (file.file) {
      const url = URL.createObjectURL(file.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    return undefined;
  }, [showPreview, file]);

  return (
    <div className="group relative flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
      {/* 아이콘 또는 미리보기 */}
      <div className="flex-shrink-0">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="h-12 w-12 rounded object-cover"
          />
        ) : (
          getFileIcon(file.type)
        )}
      </div>

      {/* 파일 정보 */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* 삭제 버튼 */}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 rounded-full p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Main FileUpload Component
// ============================================================================

/**
 * 파일 업로드 컴포넌트
 *
 * @features
 * - 드래그앤드롭 지원
 * - 이미지 미리보기
 * - 파일 크기/타입/개수 제한
 * - 다중 파일 업로드
 * - react-hook-form 통합
 *
 * @example
 * ```tsx
 * <FileUpload
 *   control={form.control}
 *   name="attachments"
 *   label="첨부파일"
 *   multiple
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024}
 *   maxFiles={5}
 *   showPreview
 * />
 * ```
 */
export function FileUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  helperText,
  required,
  disabled,
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  showPreview = true,
  dropzoneHeight = "150px",
  className,
  onUpload,
  onRemove,
}: FileUploadProps<TFieldValues, TName>): ReactNode {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  // 현재 파일 목록
  const files: UploadedFile[] = Array.isArray(field.value) ? field.value : [];

  // 파일 유효성 검사
  const validateFile = useCallback(
    (file: File): string | null => {
      // 파일 크기 검사
      if (maxSize && file.size > maxSize) {
        return `${file.name}: 파일 크기가 ${formatFileSize(maxSize)}를 초과합니다.`;
      }

      // 파일 타입 검사
      if (accept) {
        const acceptedTypes = accept.split(",").map((t) => t.trim());
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.replace("/*", "/"));
          }
          return file.type === type;
        });
        if (!isAccepted) {
          return `${file.name}: 지원하지 않는 파일 형식입니다.`;
        }
      }

      return null;
    },
    [maxSize, accept]
  );

  // 파일 추가 핸들러
  const handleAddFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const errors: string[] = [];
      const validFiles: UploadedFile[] = [];

      // 최대 파일 개수 검사
      const remainingSlots = maxFiles
        ? Math.max(0, maxFiles - files.length)
        : fileArray.length;

      if (maxFiles && fileArray.length > remainingSlots) {
        errors.push(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
      }

      // 파일별 유효성 검사
      for (const file of fileArray.slice(0, remainingSlots)) {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(validationError);
          continue;
        }

        // 서버 업로드 핸들러가 있으면 업로드
        if (onUpload) {
          try {
            const uploaded = await onUpload(file);
            validFiles.push(uploaded);
          } catch {
            errors.push(`${file.name}: 업로드에 실패했습니다.`);
          }
        } else {
          // 로컬 파일 객체 생성
          validFiles.push({
            id: generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            file,
          });
        }
      }

      setUploadErrors(errors);

      if (validFiles.length > 0) {
        const newValue = multiple
          ? [...files, ...validFiles]
          : [validFiles[0]];
        field.onChange(newValue as PathValue<TFieldValues, TName>);
      }
    },
    [files, multiple, maxFiles, validateFile, onUpload, field]
  );

  // 파일 제거 핸들러
  const handleRemoveFile = useCallback(
    async (fileToRemove: UploadedFile) => {
      // 서버 삭제 핸들러가 있으면 호출
      if (onRemove) {
        try {
          await onRemove(fileToRemove);
        } catch {
          setUploadErrors(["파일 삭제에 실패했습니다."]);
          return;
        }
      }

      const newFiles = files.filter((f) => f.id !== fileToRemove.id);
      field.onChange(
        (newFiles.length > 0 ? newFiles : undefined) as PathValue<
          TFieldValues,
          TName
        >
      );
    },
    [files, onRemove, field]
  );

  // 드래그 이벤트 핸들러
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleAddFiles(droppedFiles);
      }
    },
    [disabled, handleAddFiles]
  );

  // 파일 선택 핸들러
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleAddFiles(selectedFiles);
      }
      // input 초기화 (같은 파일 재선택 가능)
      e.target.value = "";
    },
    [handleAddFiles]
  );

  // 클릭으로 파일 선택
  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* 라벨 */}
      {label && (
        <Label className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}

      {/* 드롭존 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-destructive"
        )}
        style={{ minHeight: dropzoneHeight }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          파일을 드래그하거나 클릭하여 선택
        </p>
        {accept && (
          <p className="mt-1 text-xs text-muted-foreground/70">
            {accept.replace(/,/g, ", ")}
          </p>
        )}
        {maxSize && (
          <p className="text-xs text-muted-foreground/70">
            최대 {formatFileSize(maxSize)}
          </p>
        )}
      </div>

      {/* 에러 메시지 */}
      {uploadErrors.length > 0 && (
        <div className="space-y-1">
          {uploadErrors.map((err, i) => (
            <div key={i} className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* 폼 에러 */}
      {error?.message && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}

      {/* 도움말 */}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {/* 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <FilePreview
              key={file.id}
              file={file}
              showPreview={showPreview}
              onRemove={() => handleRemoveFile(file)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
