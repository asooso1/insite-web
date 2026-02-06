import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
  {
    variants: {
      status: {
        // 작업 상태
        pending: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        inProgress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        // 우선순위
        low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        // 온라인 상태
        online: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        offline: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        // 알림 상태
        unread: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        read: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

/**
 * 상태별 점 색상
 */
const dotColors: Record<string, string> = {
  pending: "bg-slate-400",
  inProgress: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
  low: "bg-slate-400",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
  online: "bg-green-500",
  offline: "bg-gray-400",
  unread: "bg-blue-500",
  read: "bg-gray-400",
};

/**
 * 상태별 한글 라벨
 */
const statusLabels: Record<string, string> = {
  pending: "대기",
  inProgress: "진행중",
  completed: "완료",
  cancelled: "취소",
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "긴급",
  online: "온라인",
  offline: "오프라인",
  unread: "읽지 않음",
  read: "읽음",
};

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  label?: string;
  showDot?: boolean;
  className?: string;
}

/**
 * 상태 배지 컴포넌트
 * - 작업 상태, 우선순위, 온라인 상태 등 표시
 * - 점(dot) 표시 옵션
 *
 * @example
 * <StatusBadge status="inProgress" />
 * <StatusBadge status="urgent" label="긴급" showDot />
 */
export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps): ReactNode {
  const statusKey = status ?? "pending";
  const displayLabel = label ?? statusLabels[statusKey] ?? statusKey;
  const dotColor = dotColors[statusKey] ?? "bg-gray-400";

  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      )}
      {displayLabel}
    </span>
  );
}

/**
 * 작업 상태 타입
 */
export type WorkOrderStatus = "pending" | "inProgress" | "completed" | "cancelled";

/**
 * 우선순위 타입
 */
export type Priority = "low" | "medium" | "high" | "urgent";
