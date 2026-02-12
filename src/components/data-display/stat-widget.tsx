"use client";

import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// Variants
// ============================================================================

const trendVariants = cva(
  "inline-flex items-center gap-0.5 text-xs font-medium",
  {
    variants: {
      trend: {
        up: "text-green-600 dark:text-green-400",
        down: "text-red-600 dark:text-red-400",
        neutral: "text-muted-foreground",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  }
);

const sizeVariants = cva("", {
  variants: {
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface SparklineData {
  /** 데이터 값 */
  value: number;
}

export interface StatWidgetProps extends VariantProps<typeof sizeVariants> {
  /** 제목 */
  title: string;
  /** 주요 값 */
  value: string | number;
  /** 단위 */
  unit?: string;
  /** 아이콘 */
  icon?: LucideIcon;
  /** 트렌드 방향 */
  trend?: "up" | "down" | "neutral";
  /** 트렌드 값 (예: "+12%") */
  trendValue?: string;
  /** 트렌드 설명 (예: "전월 대비") */
  trendLabel?: string;
  /** 스파크라인 차트 데이터 */
  sparklineData?: SparklineData[];
  /** 스파크라인 색상 (CSS 변수 또는 색상값) */
  sparklineColor?: string;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 통계 위젯 컴포넌트
 *
 * KPICard보다 작은 크기로, 미니 스파크라인 차트를 포함할 수 있습니다.
 * 대시보드 위젯이나 사이드바 통계에 적합합니다.
 *
 * @features
 * - 미니 스파크라인 차트 (선택적)
 * - 트렌드 표시
 * - 다양한 사이즈 옵션
 * - 클릭 가능 옵션
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <StatWidget
 *   title="금일 방문자"
 *   value={1234}
 *   unit="명"
 *   trend="up"
 *   trendValue="+5.2%"
 * />
 *
 * // 스파크라인 포함
 * <StatWidget
 *   title="주간 에너지 사용량"
 *   value={456.7}
 *   unit="kWh"
 *   sparklineData={[
 *     { value: 400 },
 *     { value: 420 },
 *     { value: 380 },
 *     { value: 450 },
 *     { value: 456 },
 *   ]}
 *   sparklineColor="hsl(var(--chart-blue-50))"
 * />
 * ```
 */
export function StatWidget({
  title,
  value,
  unit,
  icon: Icon,
  trend = "neutral",
  trendValue,
  trendLabel,
  sparklineData,
  sparklineColor = "hsl(var(--primary))",
  size = "md",
  loading = false,
  className,
  onClick,
}: StatWidgetProps): ReactNode {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const isClickable = !!onClick;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-colors",
        isClickable && "cursor-pointer hover:bg-accent/50",
        className
      )}
      onClick={onClick}
    >
      <CardContent className={cn(sizeVariants({ size }))}>
        {/* 헤더: 제목 + 아이콘 */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground truncate">
            {title}
          </span>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>

        {/* 메인 값 + 트렌드 */}
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="font-display text-2xl font-bold tabular-nums tracking-tight truncate">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </span>
                {unit && (
                  <span className="text-xs text-muted-foreground ml-0.5">
                    {unit}
                  </span>
                )}
              </div>
            )}

            {/* 트렌드 */}
            {(trendValue || trendLabel) && !loading && (
              <div className="mt-1 flex items-center gap-1">
                <span className={cn(trendVariants({ trend }))}>
                  <TrendIcon className="h-3 w-3" />
                  {trendValue}
                </span>
                {trendLabel && (
                  <span className="text-[10px] text-muted-foreground truncate">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 스파크라인 차트 */}
          {sparklineData && sparklineData.length > 0 && !loading && (
            <div className="h-10 w-16 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient
                      id={`sparkline-gradient-${title.replace(/\s/g, "-")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={sparklineColor}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor={sparklineColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={sparklineColor}
                    strokeWidth={1.5}
                    fill={`url(#sparkline-gradient-${title.replace(/\s/g, "-")})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Grid Layout
// ============================================================================

interface StatWidgetGridProps {
  children: ReactNode;
  /** 그리드 컬럼 수 */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 통계 위젯 그리드 레이아웃
 *
 * @example
 * ```tsx
 * <StatWidgetGrid columns={4}>
 *   <StatWidget title="방문자" value={123} />
 *   <StatWidget title="페이지뷰" value={456} />
 * </StatWidgetGrid>
 * ```
 */
export function StatWidgetGrid({
  children,
  columns = 4,
  className,
}: StatWidgetGridProps): ReactNode {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div className={cn("grid gap-3", gridCols[columns], className)}>
      {children}
    </div>
  );
}
