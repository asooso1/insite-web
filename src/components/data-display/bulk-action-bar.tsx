"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface BulkActionBarAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  loading?: boolean;
}

export interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: BulkActionBarAction[];
  className?: string;
}

// ============================================================================
// BulkActionBar Component
// ============================================================================

/**
 * 다중 행 선택 시 표시되는 액션 바
 *
 * @example
 * ```tsx
 * <BulkActionBar
 *   selectedCount={3}
 *   onClear={() => setSelectedRows([])}
 *   actions={[
 *     {
 *       label: "일괄 승인",
 *       onClick: handleApprove,
 *       disabled: isLoading,
 *     },
 *     {
 *       label: "일괄 취소",
 *       onClick: handleCancel,
 *       variant: "destructive",
 *       disabled: isLoading,
 *     },
 *   ]}
 * />
 * ```
 */
export function BulkActionBar({
  selectedCount,
  onClear,
  actions,
  className,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30",
        className
      )}
    >
      {/* 선택된 행 수 표시 */}
      <span className="flex-1 text-sm font-medium text-foreground">
        {selectedCount}개 항목 선택됨
      </span>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            size="sm"
            variant={action.variant || "default"}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
          >
            {action.loading ? "처리 중..." : action.label}
          </Button>
        ))}
      </div>

      {/* 선택 해제 버튼 */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onClear}
        className="h-8 w-8 flex-shrink-0"
        aria-label="선택 해제"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
