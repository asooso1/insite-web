"use client";

import { type ReactNode } from "react";
import {
  AreaChart,
  Area,
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
import { getChartColors, createChartConfig, getGradientId } from "@/lib/utils/chart-colors";

// ============================================================================
// Types
// ============================================================================

export interface AreaChartPresetProps {
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
  /** 곡선 타입 */
  curveType?: "linear" | "monotone" | "step";
  /** 그라디언트 채우기 */
  gradient?: boolean;
  /** 투명도 */
  fillOpacity?: number;
  /** 커스텀 config */
  config?: ChartConfig;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 영역 차트 프리셋
 *
 * @example
 * ```tsx
 * <AreaChartPreset
 *   data={[
 *     { month: "1월", desktop: 186, mobile: 80 },
 *     { month: "2월", desktop: 305, mobile: 200 },
 *   ]}
 *   xAxisKey="month"
 *   dataKeys={{ desktop: "데스크톱", mobile: "모바일" }}
 *   stacked
 *   gradient
 * />
 * ```
 */
export function AreaChartPreset({
  data,
  xAxisKey,
  dataKeys,
  loading = false,
  height = 300,
  stacked = false,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showYAxis = true,
  showXAxis = true,
  curveType = "monotone",
  gradient = true,
  fillOpacity = 0.4,
  config,
  className,
}: AreaChartPresetProps): ReactNode {
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
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {gradient && (
          <defs>
            {keys.map((key, index) => (
              <linearGradient
                key={key}
                id={getGradientId("area", index)}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={colors[index]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[index]} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
        )}
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
          <Area
            key={key}
            type={curveType}
            dataKey={key}
            stackId={stacked ? "stack" : undefined}
            stroke={colors[index]}
            fill={gradient ? `url(#${getGradientId("area", index)})` : colors[index]}
            fillOpacity={gradient ? 1 : fillOpacity}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
