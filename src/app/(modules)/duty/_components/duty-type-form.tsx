"use client";

/**
 * 당직 유형 폼 (placeholder)
 * - 기존 프로젝트의 미완성 모듈
 */

interface DutyTypeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DutyTypeForm({ onCancel }: DutyTypeFormProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">당직 유형 폼 (준비 중)</p>
      {onCancel && (
        <button type="button" onClick={onCancel} className="text-sm underline">
          취소
        </button>
      )}
    </div>
  );
}
