import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

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

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  className?: string;
  loading?: boolean;
}

/**
 * KPI 지표 카드 컴포넌트
 * - 숫자/KPI 표시용 폰트 사용 (font-display)
 * - 트렌드 표시 옵션
 *
 * @example
 * <KPICard
 *   title="총 작업 건수"
 *   value={1234}
 *   unit="건"
 *   icon={Briefcase}
 *   trend="up"
 *   trendValue="+12%"
 *   trendLabel="전월 대비"
 * />
 */
export function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend = "neutral",
  trendValue,
  trendLabel,
  className,
  loading = false,
}: KPICardProps): ReactNode {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card className={cn("overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold tabular-nums tracking-tight">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </span>
                {unit && (
                  <span className="text-sm text-muted-foreground">{unit}</span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-[image:var(--gradient-brand-soft)] p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>

        {(trendValue || trendLabel) && (
          <div className="mt-3 flex items-center gap-2">
            <span className={cn(trendVariants({ trend }))}>
              <TrendIcon className="h-3 w-3" />
              {trendValue}
            </span>
            {trendLabel && (
              <span className="text-xs text-muted-foreground">
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KPICardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * KPI 카드 그리드 레이아웃
 *
 * @example
 * <KPICardGrid columns={4}>
 *   <KPICard ... />
 *   <KPICard ... />
 * </KPICardGrid>
 */
export function KPICardGrid({
  children,
  columns = 4,
  className,
}: KPICardGridProps): ReactNode {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}
