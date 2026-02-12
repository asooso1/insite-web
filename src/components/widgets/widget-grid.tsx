"use client";

import { type ReactNode } from "react";
import {
  ResponsiveGridLayout,
  useContainerWidth,
} from "react-grid-layout";
import type ReactGridLayout from "react-grid-layout";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "./widget-container";

// CSS import는 globals.css에서 처리

// ============================================================================
// Types
// ============================================================================

type Layout = ReactGridLayout.Layout;
type Layouts = ReactGridLayout.Layouts;

// ============================================================================
// Constants
// ============================================================================

/** 그리드 컬럼 수 (브레이크포인트별) */
const GRID_COLS = {
  lg: 6,
  md: 4,
  sm: 2,
  xs: 1,
};

/** 브레이크포인트 (px) */
const BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 0,
};

/** 로우 높이 (px) */
const ROW_HEIGHT = 120;

/** 그리드 마진 [x, y] */
const MARGIN: [number, number] = [16, 16];

/** 컨테이너 패딩 [x, y] */
const CONTAINER_PADDING: [number, number] = [0, 0];

// ============================================================================
// Types
// ============================================================================

export interface WidgetLayoutItem {
  /** 위젯 고유 ID */
  i: string;
  /** X 좌표 (컬럼) */
  x: number;
  /** Y 좌표 (로우) */
  y: number;
  /** 너비 (컬럼 수) */
  w: number;
  /** 높이 (로우 수) */
  h: number;
  /** 최소 너비 */
  minW?: number;
  /** 최소 높이 */
  minH?: number;
  /** 최대 너비 */
  maxW?: number;
  /** 최대 높이 */
  maxH?: number;
  /** 정적 (이동/리사이즈 불가) */
  static?: boolean;
  /** 드래그 불가 */
  isDraggable?: boolean;
  /** 리사이즈 불가 */
  isResizable?: boolean;
}

export interface WidgetGridProps {
  /** 위젯 레이아웃 (반응형) */
  layouts?: Layouts;
  /** 기본 레이아웃 (단일) */
  layout?: WidgetLayoutItem[];
  /** 레이아웃 변경 핸들러 */
  onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
  /** 드래그 시작 핸들러 */
  onDragStart?: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
  /** 드래그 종료 핸들러 */
  onDragStop?: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
  /** 리사이즈 시작 핸들러 */
  onResizeStart?: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
  /** 리사이즈 종료 핸들러 */
  onResizeStop?: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
  /** 드래그 가능 여부 */
  isDraggable?: boolean;
  /** 리사이즈 가능 여부 */
  isResizable?: boolean;
  /** 위젯 컴포넌트들 */
  children: ReactNode;
  /** 로우 높이 */
  rowHeight?: number;
  /** 컴팩트 타입 */
  compactType?: "vertical" | "horizontal" | null;
  /** 추가 클래스명 */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 위젯 그리드 컴포넌트
 *
 * react-grid-layout 기반의 6컬럼 반응형 그리드입니다.
 * 드래그앤드롭, 리사이즈를 지원합니다.
 *
 * @features
 * - 6컬럼 반응형 그리드 (lg: 6, md: 4, sm: 2, xs: 1)
 * - 드래그앤드롭 재정렬
 * - 리사이즈
 * - 레이아웃 저장/복원
 *
 * @example
 * ```tsx
 * const [layouts, setLayouts] = useState<Layouts>({
 *   lg: [
 *     { i: "widget-1", x: 0, y: 0, w: 2, h: 2 },
 *     { i: "widget-2", x: 2, y: 0, w: 4, h: 2 },
 *   ],
 * });
 *
 * <WidgetGrid
 *   layouts={layouts}
 *   onLayoutChange={(_, newLayouts) => setLayouts(newLayouts)}
 * >
 *   <div key="widget-1">
 *     <WidgetContainer id="widget-1" title="위젯 1">
 *       콘텐츠 1
 *     </WidgetContainer>
 *   </div>
 *   <div key="widget-2">
 *     <WidgetContainer id="widget-2" title="위젯 2">
 *       콘텐츠 2
 *     </WidgetContainer>
 *   </div>
 * </WidgetGrid>
 * ```
 */
export function WidgetGrid({
  layouts,
  layout,
  onLayoutChange,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
  isDraggable = true,
  isResizable = true,
  children,
  rowHeight = ROW_HEIGHT,
  compactType = "vertical",
  className,
}: WidgetGridProps): ReactNode {
  const { width, mounted, containerRef } = useContainerWidth({
    measureBeforeMount: true,
    initialWidth: 1200,
  });

  // 단일 레이아웃을 반응형으로 변환
  const getResponsiveLayouts = (): Layouts => {
    if (layouts) return layouts;
    if (layout) {
      return {
        lg: layout,
        md: layout.map((item) => ({
          ...item,
          w: Math.min(item.w, GRID_COLS.md),
        })),
        sm: layout.map((item) => ({
          ...item,
          w: Math.min(item.w, GRID_COLS.sm),
        })),
        xs: layout.map((item) => ({
          ...item,
          w: GRID_COLS.xs,
        })),
      };
    }
    return { lg: [], md: [], sm: [], xs: [] };
  };

  const responsiveLayouts = getResponsiveLayouts();

  // Note: react-grid-layout 2.x의 타입 정의가 실제 라이브러리와 불일치하여
  // any 타입으로 우회합니다. 런타임에서는 정상 동작합니다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GridComponent = ResponsiveGridLayout as any;

  return (
    <div ref={containerRef} className={cn("widget-grid", className)}>
      {mounted && width > 0 && (
        <GridComponent
          className="layout"
          layouts={responsiveLayouts}
          breakpoints={BREAKPOINTS}
          cols={GRID_COLS}
          rowHeight={rowHeight}
          width={width}
          margin={MARGIN}
          containerPadding={CONTAINER_PADDING}
          isDraggable={isDraggable}
          isResizable={isResizable}
          draggableHandle=".widget-drag-handle"
          compactType={compactType}
          preventCollision={false}
          onLayoutChange={onLayoutChange}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
        >
          {children}
        </GridComponent>
      )}
    </div>
  );
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * 위젯 사이즈를 레이아웃 아이템으로 변환
 */
export function sizeToLayout(
  id: string,
  size: WidgetSize,
  position: { x: number; y: number }
): WidgetLayoutItem {
  const sizeConfig = WIDGET_SIZES[size];
  return {
    i: id,
    x: position.x,
    y: position.y,
    w: sizeConfig.w,
    h: sizeConfig.h,
    minW: sizeConfig.minW,
    minH: sizeConfig.minH,
  };
}

/**
 * 레이아웃에 새 위젯 추가
 * 자동으로 빈 공간을 찾아 배치합니다.
 */
export function addWidgetToLayout(
  layout: WidgetLayoutItem[],
  id: string,
  size: WidgetSize,
  cols: number = 6
): WidgetLayoutItem[] {
  const sizeConfig = WIDGET_SIZES[size];

  // 점유된 셀 맵 생성
  const occupied = new Set<string>();
  let maxY = 0;

  layout.forEach((item) => {
    for (let x = item.x; x < item.x + item.w; x++) {
      for (let y = item.y; y < item.y + item.h; y++) {
        occupied.add(`${x},${y}`);
      }
    }
    maxY = Math.max(maxY, item.y + item.h);
  });

  // 빈 공간 찾기
  const findEmptySpace = (): { x: number; y: number } => {
    for (let y = 0; y <= maxY + sizeConfig.h; y++) {
      for (let x = 0; x <= cols - sizeConfig.w; x++) {
        let canPlace = true;
        for (let dx = 0; dx < sizeConfig.w && canPlace; dx++) {
          for (let dy = 0; dy < sizeConfig.h && canPlace; dy++) {
            if (occupied.has(`${x + dx},${y + dy}`)) {
              canPlace = false;
            }
          }
        }
        if (canPlace) {
          return { x, y };
        }
      }
    }
    // 새 줄에 배치
    return { x: 0, y: maxY };
  };

  const position = findEmptySpace();
  const newItem = sizeToLayout(id, size, position);

  return [...layout, newItem];
}

/**
 * 레이아웃에서 위젯 제거
 */
export function removeWidgetFromLayout(
  layout: WidgetLayoutItem[],
  id: string
): WidgetLayoutItem[] {
  return layout.filter((item) => item.i !== id);
}

/**
 * 레이아웃 저장 (localStorage)
 */
export function saveLayout(key: string, layouts: Layouts): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(layouts));
  }
}

/**
 * 레이아웃 불러오기 (localStorage)
 */
export function loadLayout(key: string): Layouts | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as Layouts;
      } catch {
        return null;
      }
    }
  }
  return null;
}
