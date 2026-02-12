"use client";

import {
  type ComponentType,
  type ReactNode,
  lazy,
  Suspense,
  createContext,
  useContext,
  useMemo,
} from "react";
import { type LucideIcon } from "lucide-react";
import { WidgetSkeleton, type WidgetSize } from "./widget-container";

// ============================================================================
// Types
// ============================================================================

/**
 * 위젯 메타데이터
 */
export interface WidgetMeta {
  /** 위젯 고유 ID */
  id: string;
  /** 표시 이름 */
  name: string;
  /** 설명 */
  description?: string;
  /** 카테고리 */
  category: WidgetCategory;
  /** 아이콘 */
  icon?: LucideIcon;
  /** 기본 사이즈 */
  defaultSize: WidgetSize;
  /** 지원 사이즈 목록 */
  supportedSizes?: WidgetSize[];
  /** 설정 가능 여부 */
  configurable?: boolean;
}

/**
 * 위젯 Props (공통)
 */
export interface WidgetProps {
  /** 위젯 인스턴스 ID */
  instanceId: string;
  /** 위젯 설정 */
  config?: Record<string, unknown>;
  /** 새로고침 핸들러 */
  onRefresh?: () => void;
  /** 설정 변경 핸들러 */
  onConfigChange?: (config: Record<string, unknown>) => void;
}

/**
 * 위젯 카테고리
 */
export type WidgetCategory =
  | "chart"      // 차트 위젯
  | "table"      // 테이블 위젯
  | "kpi"        // KPI/통계 위젯
  | "list"       // 목록 위젯
  | "calendar"   // 캘린더 위젯
  | "map"        // 지도 위젯
  | "custom";    // 커스텀 위젯

/**
 * 위젯 정의
 */
export interface WidgetDefinition {
  /** 메타데이터 */
  meta: WidgetMeta;
  /** 컴포넌트 (lazy import 또는 직접 컴포넌트) */
  component: ComponentType<WidgetProps>;
}

/**
 * 위젯 레지스트리 인터페이스
 */
export interface IWidgetRegistry {
  /** 위젯 등록 */
  register: (definition: WidgetDefinition) => void;
  /** 위젯 등록 해제 */
  unregister: (id: string) => void;
  /** 위젯 조회 */
  get: (id: string) => WidgetDefinition | undefined;
  /** 모든 위젯 조회 */
  getAll: () => WidgetDefinition[];
  /** 카테고리별 위젯 조회 */
  getByCategory: (category: WidgetCategory) => WidgetDefinition[];
  /** 위젯 존재 여부 */
  has: (id: string) => boolean;
}

// ============================================================================
// Registry Implementation
// ============================================================================

/**
 * 위젯 레지스트리 클래스
 *
 * 위젯 컴포넌트를 ID로 매핑하고 관리합니다.
 * lazy import를 지원하여 코드 스플리팅이 가능합니다.
 */
class WidgetRegistryImpl implements IWidgetRegistry {
  private widgets: Map<string, WidgetDefinition> = new Map();

  register(definition: WidgetDefinition): void {
    if (this.widgets.has(definition.meta.id)) {
      console.warn(
        `[WidgetRegistry] 위젯 "${definition.meta.id}"가 이미 등록되어 있습니다. 덮어씁니다.`
      );
    }
    this.widgets.set(definition.meta.id, definition);
  }

  unregister(id: string): void {
    if (!this.widgets.has(id)) {
      console.warn(
        `[WidgetRegistry] 위젯 "${id}"가 등록되어 있지 않습니다.`
      );
      return;
    }
    this.widgets.delete(id);
  }

  get(id: string): WidgetDefinition | undefined {
    return this.widgets.get(id);
  }

  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  getByCategory(category: WidgetCategory): WidgetDefinition[] {
    return this.getAll().filter((def) => def.meta.category === category);
  }

  has(id: string): boolean {
    return this.widgets.has(id);
  }
}

// 싱글톤 인스턴스
export const widgetRegistry = new WidgetRegistryImpl();

// ============================================================================
// Context
// ============================================================================

const WidgetRegistryContext = createContext<IWidgetRegistry>(widgetRegistry);

interface WidgetRegistryProviderProps {
  registry?: IWidgetRegistry;
  children: ReactNode;
}

/**
 * 위젯 레지스트리 프로바이더
 */
export function WidgetRegistryProvider({
  registry = widgetRegistry,
  children,
}: WidgetRegistryProviderProps): ReactNode {
  return (
    <WidgetRegistryContext.Provider value={registry}>
      {children}
    </WidgetRegistryContext.Provider>
  );
}

/**
 * 위젯 레지스트리 훅
 */
export function useWidgetRegistry(): IWidgetRegistry {
  return useContext(WidgetRegistryContext);
}

// ============================================================================
// Dynamic Widget Renderer
// ============================================================================

interface DynamicWidgetProps extends WidgetProps {
  /** 위젯 타입 ID */
  widgetId: string;
  /** 로딩 폴백 */
  fallback?: ReactNode;
}

/**
 * 동적 위젯 렌더러
 *
 * 레지스트리에서 위젯을 찾아 렌더링합니다.
 * Suspense를 사용하여 lazy 로딩을 지원합니다.
 *
 * @example
 * ```tsx
 * <DynamicWidget
 *   widgetId="energy-chart"
 *   instanceId="dashboard-energy-1"
 *   config={{ timeRange: "7d" }}
 * />
 * ```
 */
export function DynamicWidget({
  widgetId,
  instanceId,
  config,
  onRefresh,
  onConfigChange,
  fallback,
}: DynamicWidgetProps): ReactNode {
  const registry = useWidgetRegistry();
  const definition = registry.get(widgetId);

  if (!definition) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <p className="text-sm text-muted-foreground">
          위젯을 찾을 수 없습니다: {widgetId}
        </p>
      </div>
    );
  }

  const Component = definition.component;

  return (
    <Suspense fallback={fallback ?? <WidgetSkeleton />}>
      <Component
        instanceId={instanceId}
        config={config}
        onRefresh={onRefresh}
        onConfigChange={onConfigChange}
      />
    </Suspense>
  );
}

// ============================================================================
// Registration Helpers
// ============================================================================

/**
 * 위젯 정의 생성 헬퍼
 */
export function defineWidget(
  meta: WidgetMeta,
  component: ComponentType<WidgetProps>
): WidgetDefinition {
  return { meta, component };
}

/**
 * lazy 위젯 정의 생성 헬퍼
 */
export function defineLazyWidget(
  meta: WidgetMeta,
  importFn: () => Promise<{ default: ComponentType<WidgetProps> }>
): WidgetDefinition {
  return {
    meta,
    component: lazy(importFn),
  };
}

/**
 * 여러 위젯 일괄 등록
 */
export function registerWidgets(definitions: WidgetDefinition[]): void {
  definitions.forEach((def) => widgetRegistry.register(def));
}
