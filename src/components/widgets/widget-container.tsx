"use client";

import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  MoreHorizontal,
  Maximize2,
  Minimize2,
  RefreshCw,
  X,
  GripVertical,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// Size Classes (7가지 사이즈)
// ============================================================================

/**
 * 위젯 사이즈 클래스
 * - 6컬럼 그리드 기준
 * - w: 그리드 컬럼 수, h: 그리드 로우 수
 */
export const WIDGET_SIZES = {
  /** 1x1 - 미니 위젯 */
  "1x1": { w: 1, h: 1, minW: 1, minH: 1 },
  /** 2x1 - 작은 가로 위젯 */
  "2x1": { w: 2, h: 1, minW: 2, minH: 1 },
  /** 2x2 - 작은 정사각 위젯 */
  "2x2": { w: 2, h: 2, minW: 2, minH: 2 },
  /** 3x2 - 중간 위젯 */
  "3x2": { w: 3, h: 2, minW: 2, minH: 2 },
  /** 4x2 - 넓은 위젯 */
  "4x2": { w: 4, h: 2, minW: 3, minH: 2 },
  /** 6x2 - 전체 너비 위젯 */
  "6x2": { w: 6, h: 2, minW: 4, minH: 2 },
  /** 6x4 - 대형 위젯 */
  "6x4": { w: 6, h: 4, minW: 4, minH: 3 },
} as const;

export type WidgetSize = keyof typeof WIDGET_SIZES;

// ============================================================================
// Variants
// ============================================================================

const containerVariants = cva(
  "relative flex flex-col overflow-hidden transition-shadow",
  {
    variants: {
      variant: {
        default: "bg-card",
        elevated: "bg-card shadow-2",
        bordered: "bg-card border-2",
        transparent: "bg-transparent",
      },
      state: {
        idle: "",
        loading: "pointer-events-none",
        error: "border-destructive/50",
        dragging: "shadow-4 ring-2 ring-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "idle",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface WidgetAction {
  /** 액션 ID */
  id: string;
  /** 표시 라벨 */
  label: string;
  /** 아이콘 */
  icon?: LucideIcon;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 위험 액션 여부 (빨간색 표시) */
  destructive?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export interface WidgetContainerProps
  extends VariantProps<typeof containerVariants> {
  /** 위젯 ID */
  id: string;
  /** 위젯 제목 */
  title: string;
  /** 부제목 */
  subtitle?: string;
  /** 아이콘 */
  icon?: LucideIcon;
  /** 위젯 크기 */
  size?: WidgetSize;
  /** 헤더 영역 커스텀 콘텐츠 (우측) */
  headerActions?: ReactNode;
  /** 추가 메뉴 액션 */
  menuActions?: WidgetAction[];
  /** 푸터 콘텐츠 */
  footer?: ReactNode;
  /** 위젯 본문 */
  children: ReactNode;
  /** 로딩 상태 */
  loading?: boolean;
  /** 에러 상태 */
  error?: Error | null;
  /** 새로고침 핸들러 */
  onRefresh?: () => void;
  /** 최대화 핸들러 */
  onMaximize?: () => void;
  /** 닫기 핸들러 */
  onClose?: () => void;
  /** 드래그 가능 여부 */
  draggable?: boolean;
  /** 최대화 상태 */
  isMaximized?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 위젯 컨테이너 컴포넌트
 *
 * 대시보드 위젯의 기본 래퍼 컴포넌트입니다.
 * header/body/footer 슬롯 구조를 제공합니다.
 *
 * @features
 * - 7가지 사이즈 클래스
 * - 드래그 핸들
 * - 로딩/에러 상태 처리
 * - 메뉴 액션 (새로고침, 최대화, 닫기)
 * - 커스텀 헤더/푸터
 *
 * @example
 * ```tsx
 * <WidgetContainer
 *   id="energy-usage"
 *   title="에너지 사용량"
 *   subtitle="금일"
 *   icon={Zap}
 *   size="3x2"
 *   onRefresh={() => refetch()}
 *   loading={isLoading}
 * >
 *   <AreaChart data={data} />
 * </WidgetContainer>
 * ```
 */
export function WidgetContainer({
  id,
  title,
  subtitle,
  icon: Icon,
  size = "2x2",
  variant = "default",
  state: stateProp,
  headerActions,
  menuActions = [],
  footer,
  children,
  loading = false,
  error = null,
  onRefresh,
  onMaximize,
  onClose,
  draggable = true,
  isMaximized = false,
  className,
}: WidgetContainerProps): ReactNode {
  // 상태 결정
  const state = stateProp ?? (loading ? "loading" : error ? "error" : "idle");

  // 기본 메뉴 액션 구성
  const defaultActions: WidgetAction[] = [
    ...(onRefresh
      ? [
          {
            id: "refresh",
            label: "새로고침",
            icon: RefreshCw,
            onClick: onRefresh,
          },
        ]
      : []),
    ...(onMaximize
      ? [
          {
            id: "maximize",
            label: isMaximized ? "축소" : "최대화",
            icon: isMaximized ? Minimize2 : Maximize2,
            onClick: onMaximize,
          },
        ]
      : []),
  ];

  const closeAction: WidgetAction | null = onClose
    ? {
        id: "close",
        label: "위젯 닫기",
        icon: X,
        onClick: onClose,
        destructive: true,
      }
    : null;

  const allActions = [...defaultActions, ...menuActions];
  const hasActions = allActions.length > 0 || closeAction;

  return (
    <Card
      className={cn(containerVariants({ variant, state }), className)}
      data-widget-id={id}
      data-widget-size={size}
    >
      {/* 헤더 */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* 드래그 핸들 */}
          {draggable && (
            <div className="widget-drag-handle cursor-grab active:cursor-grabbing shrink-0">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground" />
            </div>
          )}

          {/* 아이콘 */}
          {Icon && (
            <div className="shrink-0 rounded bg-primary/10 p-1.5">
              <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
          )}

          {/* 제목 */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-none truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 헤더 액션 */}
        <div className="flex items-center gap-1 shrink-0">
          {headerActions}

          {/* 로딩 인디케이터 */}
          {loading && (
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
          )}

          {/* 메뉴 */}
          {hasActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="위젯 메뉴"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {allActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={cn(
                      action.destructive && "text-destructive focus:text-destructive"
                    )}
                  >
                    {action.icon && (
                      <action.icon className="mr-2 h-4 w-4" />
                    )}
                    {action.label}
                  </DropdownMenuItem>
                ))}
                {closeAction && (
                  <>
                    {allActions.length > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={closeAction.onClick}
                      className="text-destructive focus:text-destructive"
                    >
                      {closeAction.icon && (
                        <closeAction.icon className="mr-2 h-4 w-4" />
                      )}
                      {closeAction.label}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      {/* 본문 */}
      <CardContent className="flex-1 p-3 pt-0 overflow-auto">
        {error ? (
          <WidgetError error={error} onRetry={onRefresh} />
        ) : (
          children
        )}
      </CardContent>

      {/* 푸터 */}
      {footer && (
        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface WidgetErrorProps {
  error: Error;
  onRetry?: () => void;
}

/**
 * 위젯 에러 상태 컴포넌트
 */
function WidgetError({ error, onRetry }: WidgetErrorProps): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center h-full py-4 text-center">
      <p className="text-sm text-destructive mb-2">데이터를 불러올 수 없습니다</p>
      <p className="text-xs text-muted-foreground mb-3">{error.message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-3 w-3" />
          다시 시도
        </Button>
      )}
    </div>
  );
}

/**
 * 위젯 스켈레톤 컴포넌트
 */
export function WidgetSkeleton({
  className,
}: {
  className?: string;
}): ReactNode {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Skeleton className="h-full min-h-[100px] w-full" />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Widget Error Boundary
// ============================================================================

import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

interface WidgetErrorFallbackProps extends FallbackProps {
  widgetTitle?: string;
}

/**
 * 에러 메시지 추출 헬퍼
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "알 수 없는 오류가 발생했습니다";
}

/**
 * 위젯 에러 폴백 컴포넌트
 */
function WidgetErrorFallback({
  error,
  resetErrorBoundary,
  widgetTitle,
}: WidgetErrorFallbackProps): ReactNode {
  const errorMessage = getErrorMessage(error);

  return (
    <Card className="h-full overflow-hidden border-destructive/50">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded bg-destructive/10 p-1.5">
            <X className="h-3.5 w-3.5 text-destructive" />
          </div>
          <h3 className="text-sm font-semibold truncate">
            {widgetTitle ?? "위젯 오류"}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[calc(100%-48px)] p-3 pt-0 text-center">
        <p className="text-sm text-destructive mb-2">
          위젯을 표시할 수 없습니다
        </p>
        <p className="text-xs text-muted-foreground mb-3 max-w-[200px] truncate">
          {errorMessage}
        </p>
        <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
          <RefreshCw className="mr-2 h-3 w-3" />
          다시 시도
        </Button>
      </CardContent>
    </Card>
  );
}

export interface WidgetErrorBoundaryProps {
  children: ReactNode;
  widgetTitle?: string;
  onReset?: () => void;
}

/**
 * 위젯 에러 바운더리
 *
 * 개별 위젯의 에러를 격리하여 전체 대시보드가 깨지지 않도록 합니다.
 *
 * @example
 * ```tsx
 * <WidgetErrorBoundary widgetTitle="에너지 사용량" onReset={refetch}>
 *   <ChartWidget data={data} />
 * </WidgetErrorBoundary>
 * ```
 */
export function WidgetErrorBoundary({
  children,
  widgetTitle,
  onReset,
}: WidgetErrorBoundaryProps): ReactNode {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <WidgetErrorFallback {...props} widgetTitle={widgetTitle} />
      )}
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}
