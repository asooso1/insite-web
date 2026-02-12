/**
 * 위젯 프리셋 (기본 위젯 구현체)
 */

export {
  ChartWidget,
  chartWidgetMeta,
  chartWidgetDefinition,
  type ChartWidgetConfig,
} from "./chart-widget";

export {
  KPIWidget,
  kpiWidgetMeta,
  kpiWidgetDefinition,
  type KPIWidgetConfig,
  type KPIItem,
} from "./kpi-widget";

export {
  TableWidget,
  tableWidgetMeta,
  tableWidgetDefinition,
  type TableWidgetConfig,
  type TableColumn,
} from "./table-widget";

export {
  ListWidget,
  listWidgetMeta,
  listWidgetDefinition,
  type ListWidgetConfig,
  type ListItem,
} from "./list-widget";

// 모든 위젯 정의 (일괄 등록용)
import { chartWidgetDefinition } from "./chart-widget";
import { kpiWidgetDefinition } from "./kpi-widget";
import { tableWidgetDefinition } from "./table-widget";
import { listWidgetDefinition } from "./list-widget";

export const allWidgetDefinitions = [
  chartWidgetDefinition,
  kpiWidgetDefinition,
  tableWidgetDefinition,
  listWidgetDefinition,
];
