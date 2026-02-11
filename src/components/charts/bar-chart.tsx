"use client";

import { type ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getChartColors, createChartConfig } from "@/lib/utils/chart-colors";

// ============================================================================
// Types
// ============================================================================

export interface BarChartPresetProps {
  /** 차트 데이터 */
  data: Record<string, unknown>[];
  /** X축 데이터 키 */
  xAxisKey: string;
  /** 데이터 키와 라벨 매핑 */
  dataKeys: Record<string, string>;
  /** 로딩 상태 */
  loading?: boolean;
  /** 차트 높이 */
  height?: number;
  /** 수평 바 차트 */
  horizontal?: boolean;
  /** 스택 차트 */
  stacked?: boolean;
  /** 그리드 표시 */
  showGrid?: boolean;
  /** 범례 표시 */
  showLegend?: boolean;
  /** 툴팁 표시 */
  showTooltip?: boolean;
  /** Y축 표시 */
  showYAxis?: boolean;
  /** X축 표시 */
  showXAxis?: boolean;
  /** 바 둥글기 */
  barRadius?: number;
  /** 커스텀 config */
  config?: ChartConfig;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 바 차트 프리셋
 *
 * @example
 * ```tsx
 * <BarChartPreset
 *   data={[
 *     { month: "1월", revenue: 4000, profit: 2400 },
 *     { month: "2월", revenue: 3000, profit: 1398 },
 *   ]}
 *   xAxisKey="month"
 *   dataKeys={{ revenue: "매출", profit: "이익" }}
 *   stacked
 *   showLegend
 * />
 * ```
 */
export function BarChartPreset({
  data,
  xAxisKey,
  dataKeys,
  loading = false,
  height = 300,
  horizontal = false,
  stacked = false,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showYAxis = true,
  showXAxis = true,
  barRadius = 4,
  config,
  className,
}: BarChartPresetProps): ReactNode {
  if (loading) {
    return <Skeleton className={cn("w-full", className)} style={{ height }} />;
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ height }}
      >
        데이터가 없습니다
      </div>
    );
  }

  const keys = Object.keys(dataKeys);
  const colors = getChartColors(keys.length);
  const chartConfig: ChartConfig =
    config ?? createChartConfig(dataKeys);

  return (
    <ChartContainer config={chartConfig} className={cn("w-full", className)}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" vertical={!horizontal} horizontal={horizontal || true} />
        )}
        {horizontal ? (
          <>
            {showXAxis && <XAxis type="number" />}
            {showYAxis && <YAxis dataKey={xAxisKey} type="category" width={80} />}
          </>
        ) : (
          <>
            {showXAxis && <XAxis dataKey={xAxisKey} />}
            {showYAxis && <YAxis />}
          </>
        )}
        {showTooltip && (
          <Tooltip content={<ChartTooltipContent />} />
        )}
        {showLegend && (
          <Legend content={<ChartLegendContent />} />
        )}
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index]}
            radius={barRadius}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
