import type { ReactNode } from "react";
import { Inbox, Search, FileX, AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * 빈 상태 컴포넌트
 * - 데이터 없음, 검색 결과 없음 등 표시
 *
 * @example
 * <EmptyState
 *   icon={Search}
 *   title="검색 결과가 없습니다"
 *   description="다른 검색어로 다시 시도해 주세요."
 *   action={{ label: "필터 초기화", onClick: () => {} }}
 * />
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps): ReactNode {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * 검색 결과 없음 상태
 */
export function NoSearchResults({
  onClear,
}: {
  onClear?: () => void;
}): ReactNode {
  return (
    <EmptyState
      icon={Search}
      title="검색 결과가 없습니다"
      description="검색어를 변경하거나 필터를 조정해 보세요."
      action={onClear ? { label: "검색 초기화", onClick: onClear } : undefined}
    />
  );
}

/**
 * 데이터 없음 상태
 */
export function NoData({ onCreate }: { onCreate?: () => void }): ReactNode {
  return (
    <EmptyState
      icon={FileX}
      title="데이터가 없습니다"
      description="아직 등록된 데이터가 없습니다."
      action={onCreate ? { label: "새로 만들기", onClick: onCreate } : undefined}
    />
  );
}

/**
 * 에러 상태
 */
export function ErrorState({
  onRetry,
  message,
}: {
  onRetry?: () => void;
  message?: string;
}): ReactNode {
  return (
    <EmptyState
      icon={AlertCircle}
      title="오류가 발생했습니다"
      description={message || "데이터를 불러오는 중 문제가 발생했습니다."}
      action={onRetry ? { label: "다시 시도", onClick: onRetry } : undefined}
    />
  );
}
