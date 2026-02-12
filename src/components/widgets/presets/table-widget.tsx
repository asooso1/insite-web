"use client";

import { type ReactNode } from "react";
import { Table2 } from "lucide-react";
import { WidgetContainer } from "../widget-container";
import {
  type WidgetProps,
  type WidgetMeta,
  defineWidget,
} from "../widget-registry";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/data-display/status-badge";

// ============================================================================
// Types
// ============================================================================

export interface TableWidgetConfig {
  /** 위젯 제목 */
  title?: string;
  /** 부제목 */
  subtitle?: string;
  /** 테이블 컬럼 */
  columns?: TableColumn[];
  /** 테이블 데이터 */
  data?: Record<string, unknown>[];
  /** 최대 표시 행 수 */
  maxRows?: number;
}

export interface TableColumn {
  /** 컬럼 키 */
  key: string;
  /** 컬럼 헤더 */
  header: string;
  /** 컬럼 너비 */
  width?: string;
  /** 컬럼 정렬 */
  align?: "left" | "center" | "right";
}

// ============================================================================
// Sample Data
// ============================================================================

const SAMPLE_COLUMNS: TableColumn[] = [
  { key: "id", header: "번호", width: "60px" },
  { key: "title", header: "작업명" },
  { key: "status", header: "상태", width: "100px" },
  { key: "assignee", header: "담당자", width: "100px" },
];

const SAMPLE_DATA = [
  { id: 1, title: "엘리베이터 정기점검", status: "진행중", assignee: "김철수" },
  { id: 2, title: "HVAC 필터 교체", status: "완료", assignee: "이영희" },
  { id: 3, title: "조명 시스템 점검", status: "대기", assignee: "박민수" },
  { id: 4, title: "화재 감지기 테스트", status: "진행중", assignee: "최지연" },
  { id: 5, title: "주차장 환기 점검", status: "완료", assignee: "정호진" },
];

// ============================================================================
// Component
// ============================================================================

/**
 * 테이블 위젯 컴포넌트
 *
 * 대시보드에서 테이블 데이터를 간략하게 표시합니다.
 */
export function TableWidget({
  instanceId,
  config,
  onRefresh,
}: WidgetProps): ReactNode {
  const widgetConfig = config as TableWidgetConfig | undefined;
  const title = widgetConfig?.title ?? "최근 작업";
  const subtitle = widgetConfig?.subtitle;
  const columns = widgetConfig?.columns ?? SAMPLE_COLUMNS;
  const data = widgetConfig?.data ?? SAMPLE_DATA;
  const maxRows = widgetConfig?.maxRows ?? 5;

  const displayData = data.slice(0, maxRows);

  const renderCell = (
    row: Record<string, unknown>,
    column: TableColumn
  ): ReactNode => {
    const value = row[column.key];

    // 상태 컬럼 특별 처리
    if (column.key === "status" && typeof value === "string") {
      const statusMap: Record<string, "pending" | "inProgress" | "completed"> = {
        "대기": "pending",
        "진행중": "inProgress",
        "완료": "completed",
      };
      return (
        <StatusBadge status={statusMap[value] ?? "pending"} label={value} />
      );
    }

    return String(value ?? "-");
  };

  return (
    <WidgetContainer
      id={instanceId}
      title={title}
      subtitle={subtitle}
      icon={Table2}
      size="4x2"
      onRefresh={onRefresh}
      footer={
        data.length > maxRows ? (
          <span className="text-xs">
            {data.length}개 중 {maxRows}개 표시
          </span>
        ) : undefined
      }
    >
      <div className="h-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width }}
                  className={
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                      ? "text-right"
                      : ""
                  }
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell
                    key={`${rowIndex}-${column.key}`}
                    className={
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : ""
                    }
                  >
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </WidgetContainer>
  );
}

// ============================================================================
// Widget Definition
// ============================================================================

export const tableWidgetMeta: WidgetMeta = {
  id: "table-widget",
  name: "테이블 위젯",
  description: "테이블 형태의 데이터를 표시합니다",
  category: "table",
  icon: Table2,
  defaultSize: "4x2",
  supportedSizes: ["3x2", "4x2", "6x2", "6x4"],
  configurable: true,
};

export const tableWidgetDefinition = defineWidget(tableWidgetMeta, TableWidget);
