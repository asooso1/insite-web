"use client";

import { type ReactNode, useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { WidgetContainer, WidgetSkeleton } from "../widget-container";
import {
  type WidgetProps,
  type WidgetMeta,
  defineWidget,
} from "../widget-registry";
import { BarChartPreset } from "@/components/charts/bar-chart";
import { LineChartPreset } from "@/components/charts/line-chart";
import { AreaChartPreset } from "@/components/charts/area-chart";

// ============================================================================
// Types
// ============================================================================

export interface ChartWidgetConfig {
  /** 차트 타입 */
  chartType?: "bar" | "line" | "area";
  /** 차트 제목 */
  title?: string;
  /** 부제목 */
  subtitle?: string;
  /** X축 키 */
  xAxisKey?: string;
  /** 데이터 키 매핑 */
  dataKeys?: Record<string, string>;
  /** 차트 데이터 (직접 주입) */
  data?: Record<string, unknown>[];
  /** 데이터 조회 URL (API 연동) */
  dataUrl?: string;
  /** 차트 높이 */
  height?: number;
  /** 레전드 표시 여부 */
  showLegend?: boolean;
}

// ============================================================================
// Sample Data
// ============================================================================

const SAMPLE_DATA = [
  { month: "1월", value: 186 },
  { month: "2월", value: 305 },
  { month: "3월", value: 237 },
  { month: "4월", value: 273 },
  { month: "5월", value: 209 },
  { month: "6월", value: 314 },
];

const DEFAULT_DATA_KEYS = { value: "값" };

// ============================================================================
// Component
// ============================================================================

/**
 * 차트 위젯 컴포넌트
 *
 * 대시보드에서 차트를 표시하는 기본 위젯입니다.
 * Bar, Line, Area 차트 타입을 지원합니다.
 *
 * @features
 * - 3가지 차트 타입 지원 (bar, line, area)
 * - 직접 데이터 주입 또는 API URL 통해 데이터 조회
 * - 로딩/에러 상태 처리
 *
 * @example
 * ```tsx
 * // 직접 데이터 주입
 * <ChartWidget
 *   instanceId="chart-1"
 *   config={{
 *     chartType: "line",
 *     title: "월별 에너지 사용량",
 *     data: monthlyData,
 *     xAxisKey: "month",
 *     dataKeys: { usage: "사용량" }
 *   }}
 * />
 *
 * // API 연동
 * <ChartWidget
 *   instanceId="chart-2"
 *   config={{
 *     chartType: "bar",
 *     title: "일별 방문자",
 *     dataUrl: "/api/analytics/visitors"
 *   }}
 * />
 * ```
 */
export function ChartWidget({
  instanceId,
  config,
  onRefresh,
}: WidgetProps): ReactNode {
  const widgetConfig = config as ChartWidgetConfig | undefined;
  const chartType = widgetConfig?.chartType ?? "bar";
  const title = widgetConfig?.title ?? "차트 위젯";
  const subtitle = widgetConfig?.subtitle;
  const xAxisKey = widgetConfig?.xAxisKey ?? "month";
  const dataKeys = widgetConfig?.dataKeys ?? DEFAULT_DATA_KEYS;
  const height = widgetConfig?.height ?? 180;
  const showLegend = widgetConfig?.showLegend ?? false;

  // 데이터 상태 관리
  const [chartData, setChartData] = useState<Record<string, unknown>[]>(
    widgetConfig?.data ?? SAMPLE_DATA
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // API 데이터 조회
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!widgetConfig?.dataUrl) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(widgetConfig.dataUrl);
        if (!response.ok) {
          throw new Error("데이터를 불러올 수 없습니다");
        }
        const data = await response.json();
        setChartData(data.data ?? data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("알 수 없는 오류"));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [widgetConfig?.dataUrl]);

  // config.data 변경 시 반영
  useEffect(() => {
    if (widgetConfig?.data) {
      setChartData(widgetConfig.data);
    }
  }, [widgetConfig?.data]);

  const handleRefresh = (): void => {
    const dataUrl = widgetConfig?.dataUrl;
    if (dataUrl) {
      // 강제 리페치
      setChartData([]);
      const fetchData = async (): Promise<void> => {
        setIsLoading(true);
        try {
          const response = await fetch(dataUrl);
          if (response.ok) {
            const data = await response.json();
            setChartData(data.data ?? data);
          }
        } catch {
          // 에러 무시
        } finally {
          setIsLoading(false);
        }
      };
      void fetchData();
    }
    onRefresh?.();
  };

  const renderChart = (): ReactNode => {
    const commonProps = {
      data: chartData,
      xAxisKey,
      dataKeys,
      height,
      showLegend,
      showGrid: true,
      showTooltip: true,
    };

    switch (chartType) {
      case "line":
        return <LineChartPreset {...commonProps} />;
      case "area":
        return <AreaChartPreset {...commonProps} />;
      case "bar":
      default:
        return <BarChartPreset {...commonProps} />;
    }
  };

  return (
    <WidgetContainer
      id={instanceId}
      title={title}
      subtitle={subtitle}
      icon={BarChart3}
      size="3x2"
      onRefresh={handleRefresh}
      loading={isLoading}
      error={error}
    >
      <div className="h-full min-h-[180px]">{renderChart()}</div>
    </WidgetContainer>
  );
}

// ============================================================================
// Widget Definition
// ============================================================================

export const chartWidgetMeta: WidgetMeta = {
  id: "chart-widget",
  name: "차트 위젯",
  description: "Bar, Line, Area 차트를 표시합니다",
  category: "chart",
  icon: BarChart3,
  defaultSize: "3x2",
  supportedSizes: ["2x2", "3x2", "4x2", "6x2", "6x4"],
  configurable: true,
};

export const chartWidgetDefinition = defineWidget(chartWidgetMeta, ChartWidget);
