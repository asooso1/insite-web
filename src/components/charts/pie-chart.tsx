"use client";

import { type ReactNode } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getChartColors } from "@/lib/utils/chart-colors";

// ============================================================================
// Types
// ============================================================================

export interface PieChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface PieChartPresetProps {
  /** 차트 데이터 */
  data: PieChartData[];
  /** 로딩 상태 */
  loading?: boolean;
  /** 차트 높이 */
  height?: number;
  /** 도넛 차트 (내부 반지름) */
  innerRadius?: number;
  /** 외부 반지름 */
  outerRadius?: number;
  /** 범례 표시 */
  showLegend?: boolean;
  /** 툴팁 표시 */
  showTooltip?: boolean;
  /** 라벨 표시 */
  showLabels?: boolean;
  /** 중앙 라벨 (도넛 차트에서) */
  centerLabel?: string;
  /** 중앙 값 (도넛 차트에서) */
  centerValue?: string | number;
  /** 패딩 각도 */
  paddingAngle?: number;
  /** 커스텀 config */
  config?: ChartConfig;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 파이/도넛 차트 프리셋
 *
 * @example
 * ```tsx
 * // 기본 파이 차트
 * <PieChartPreset
 *   data={[
 *     { name: "완료", value: 400 },
 *     { name: "진행중", value: 300 },
 *     { name: "대기", value: 200 },
 *   ]}
 *   showLegend
 * />
 *
 * // 도넛 차트
 * <PieChartPreset
 *   data={data}
 *   innerRadius={60}
 *   centerLabel="총계"
 *   centerValue={900}
 * />
 * ```
 */
export function PieChartPreset({
  data,
  loading = false,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  centerLabel,
  centerValue,
  paddingAngle = 2,
  config,
  className,
}: PieChartPresetProps): ReactNode {
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

  const colors = getChartColors(data.length);

  // ChartConfig 생성
  const chartConfig: ChartConfig =
    config ??
    data.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: colors[index],
      };
      return acc;
    }, {} as ChartConfig);

  const isDonut = innerRadius > 0;
  const showCenter = isDonut && (centerLabel || centerValue !== undefined);

  return (
    <ChartContainer config={chartConfig} className={cn("w-full", className)}>
      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {showTooltip && (
          <Tooltip content={<ChartTooltipContent nameKey="name" />} />
        )}
        {showLegend && (
          <Legend content={<ChartLegendContent nameKey="name" />} />
        )}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          label={showLabels}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
          {showCenter && (
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {centerValue !== undefined && (
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {typeof centerValue === "number"
                            ? centerValue.toLocaleString()
                            : centerValue}
                        </tspan>
                      )}
                      {centerLabel && (
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          {centerLabel}
                        </tspan>
                      )}
                    </text>
                  );
                }
                return null;
              }}
            />
          )}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
