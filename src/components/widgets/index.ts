/**
 * 위젯 프레임워크
 *
 * 대시보드 위젯 시스템의 핵심 컴포넌트들을 제공합니다.
 *
 * @example
 * ```tsx
 * import {
 *   WidgetGrid,
 *   WidgetContainer,
 *   widgetRegistry,
 *   registerWidgets,
 * } from "@/components/widgets";
 * import { allWidgetDefinitions } from "@/components/widgets/presets";
 *
 * // 위젯 일괄 등록
 * registerWidgets(allWidgetDefinitions);
 *
 * // 그리드 레이아웃
 * <WidgetGrid layouts={layouts} onLayoutChange={handleLayoutChange}>
 *   <div key="widget-1">
 *     <WidgetContainer id="widget-1" title="에너지 사용량">
 *       <ChartWidget />
 *     </WidgetContainer>
 *   </div>
 * </WidgetGrid>
 * ```
 */

// Container
export {
  WidgetContainer,
  WidgetSkeleton,
  WidgetErrorBoundary,
  WIDGET_SIZES,
  type WidgetSize,
  type WidgetAction,
  type WidgetContainerProps,
} from "./widget-container";

// Grid
export {
  WidgetGrid,
  sizeToLayout,
  addWidgetToLayout,
  removeWidgetFromLayout,
  saveLayout,
  loadLayout,
  type WidgetLayoutItem,
  type WidgetGridProps,
} from "./widget-grid";

// Registry
export {
  widgetRegistry,
  WidgetRegistryProvider,
  useWidgetRegistry,
  DynamicWidget,
  defineWidget,
  defineLazyWidget,
  registerWidgets,
  type WidgetMeta,
  type WidgetProps,
  type WidgetCategory,
  type WidgetDefinition,
  type IWidgetRegistry,
} from "./widget-registry";
