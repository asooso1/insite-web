"use client";

import { type ReactNode } from "react";
import { Activity, Zap, Users, Building2 } from "lucide-react";
import { WidgetContainer } from "../widget-container";
import {
  type WidgetProps,
  type WidgetMeta,
  defineWidget,
} from "../widget-registry";
import { StatWidget, StatWidgetGrid } from "@/components/data-display/stat-widget";

// ============================================================================
// Types
// ============================================================================

export interface KPIWidgetConfig {
  /** 위젯 제목 */
  title?: string;
  /** KPI 항목 목록 */
  items?: KPIItem[];
  /** 그리드 컬럼 수 */
  columns?: 2 | 3 | 4;
}

export interface KPIItem {
  /** 항목 제목 */
  title: string;
  /** 값 */
  value: number | string;
  /** 단위 */
  unit?: string;
  /** 트렌드 */
  trend?: "up" | "down" | "neutral";
  /** 트렌드 값 */
  trendValue?: string;
  /** 스파크라인 데이터 */
  sparklineData?: { value: number }[];
}

// ============================================================================
// Sample Data
// ============================================================================

const SAMPLE_KPI_ITEMS: KPIItem[] = [
  {
    title: "에너지 사용량",
    value: 1234,
    unit: "kWh",
    trend: "down",
    trendValue: "-5.2%",
    sparklineData: [
      { value: 1500 },
      { value: 1400 },
      { value: 1350 },
      { value: 1280 },
      { value: 1234 },
    ],
  },
  {
    title: "금일 방문자",
    value: 892,
    unit: "명",
    trend: "up",
    trendValue: "+12%",
  },
  {
    title: "작업 완료율",
    value: 94.5,
    unit: "%",
    trend: "up",
    trendValue: "+2.3%",
  },
  {
    title: "장비 가동률",
    value: 87.2,
    unit: "%",
    trend: "neutral",
    trendValue: "0%",
  },
];

// ============================================================================
// Component
// ============================================================================

/**
 * KPI 위젯 컴포넌트
 *
 * 대시보드에서 주요 KPI 지표들을 그리드 형태로 표시합니다.
 */
export function KPIWidget({
  instanceId,
  config,
  onRefresh,
}: WidgetProps): ReactNode {
  const widgetConfig = config as KPIWidgetConfig | undefined;
  const title = widgetConfig?.title ?? "주요 지표";
  const items = widgetConfig?.items ?? SAMPLE_KPI_ITEMS;
  const columns = widgetConfig?.columns ?? 2;

  return (
    <WidgetContainer
      id={instanceId}
      title={title}
      icon={Activity}
      size="4x2"
      onRefresh={onRefresh}
    >
      <StatWidgetGrid columns={columns} className="h-full">
        {items.map((item, index) => (
          <StatWidget
            key={`${instanceId}-kpi-${index}`}
            title={item.title}
            value={item.value}
            unit={item.unit}
            trend={item.trend}
            trendValue={item.trendValue}
            sparklineData={item.sparklineData}
            size="sm"
          />
        ))}
      </StatWidgetGrid>
    </WidgetContainer>
  );
}

// ============================================================================
// Widget Definition
// ============================================================================

export const kpiWidgetMeta: WidgetMeta = {
  id: "kpi-widget",
  name: "KPI 위젯",
  description: "주요 KPI 지표를 그리드로 표시합니다",
  category: "kpi",
  icon: Activity,
  defaultSize: "4x2",
  supportedSizes: ["2x2", "3x2", "4x2", "6x2"],
  configurable: true,
};

export const kpiWidgetDefinition = defineWidget(kpiWidgetMeta, KPIWidget);
