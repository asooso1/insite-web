"use client";

import { type ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { WidgetContainer } from "../widget-container";
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

  const renderChart = (): ReactNode => {
    const commonProps = {
      data: SAMPLE_DATA,
      xAxisKey,
      dataKeys,
      height: 180,
      showLegend: false,
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
      onRefresh={onRefresh}
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
