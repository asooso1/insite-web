"use client";

import { type ReactNode } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

export interface LineChartPresetProps {
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
  /** 곡선 타입 */
  curveType?: "linear" | "monotone" | "step";
  /** 점 표시 */
  showDots?: boolean;
  /** 선 두께 */
  strokeWidth?: number;
  /** 커스텀 config */
  config?: ChartConfig;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 라인 차트 프리셋
 *
 * @example
 * ```tsx
 * <LineChartPreset
 *   data={[
 *     { month: "1월", value: 4000 },
 *     { month: "2월", value: 3000 },
 *   ]}
 *   xAxisKey="month"
 *   dataKeys={{ value: "수치" }}
 *   curveType="monotone"
 *   showDots
 * />
 * ```
 */
export function LineChartPreset({
  data,
  xAxisKey,
  dataKeys,
  loading = false,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showYAxis = true,
  showXAxis = true,
  curveType = "monotone",
  showDots = true,
  strokeWidth = 2,
  config,
  className,
}: LineChartPresetProps): ReactNode {
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
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        {showXAxis && <XAxis dataKey={xAxisKey} />}
        {showYAxis && <YAxis />}
        {showTooltip && (
          <Tooltip content={<ChartTooltipContent />} />
        )}
        {showLegend && (
          <Legend content={<ChartLegendContent />} />
        )}
        {keys.map((key, index) => (
          <Line
            key={key}
            type={curveType}
            dataKey={key}
            stroke={colors[index]}
            strokeWidth={strokeWidth}
            dot={showDots}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
