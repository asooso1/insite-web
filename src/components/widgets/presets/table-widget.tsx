"use client";

import { type ReactNode, useState, useEffect } from "react";
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

/** StatusBadge에서 지원하는 상태 타입 */
type StatusType =
  | "pending"
  | "inProgress"
  | "completed"
  | "cancelled"
  | "low"
  | "medium"
  | "high"
  | "urgent"
  | "online"
  | "offline"
  | "unread"
  | "read";

export interface TableColumn {
  /** 컬럼 키 */
  key: string;
  /** 컬럼 헤더 */
  header: string;
  /** 컬럼 너비 */
  width?: string;
  /** 컬럼 정렬 */
  align?: "left" | "center" | "right";
  /** 상태 컬럼 여부 (StatusBadge 렌더링) */
  isStatus?: boolean;
  /** 상태 매핑 */
  statusMap?: Record<string, StatusType>;
}

export interface TableWidgetConfig {
  /** 위젯 제목 */
  title?: string;
  /** 부제목 */
  subtitle?: string;
  /** 테이블 컬럼 */
  columns?: TableColumn[];
  /** 테이블 데이터 (직접 주입) */
  data?: Record<string, unknown>[];
  /** 데이터 조회 URL (API 연동) */
  dataUrl?: string;
  /** 최대 표시 행 수 */
  maxRows?: number;
  /** 행 클릭 시 이동할 URL 패턴 (예: "/work-orders/:id") */
  rowLinkPattern?: string;
}

// ============================================================================
// Sample Data
// ============================================================================

const SAMPLE_COLUMNS: TableColumn[] = [
  { key: "id", header: "번호", width: "60px" },
  { key: "title", header: "작업명" },
  {
    key: "status",
    header: "상태",
    width: "100px",
    isStatus: true,
  },
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
 *
 * @features
 * - 직접 데이터 주입 또는 API URL 통해 데이터 조회
 * - 상태 컬럼 자동 렌더링 (StatusBadge)
 * - 최대 행 수 제한
 * - 로딩/에러 상태 처리
 *
 * @example
 * ```tsx
 * <TableWidget
 *   instanceId="recent-tasks"
 *   config={{
 *     title: "최근 작업",
 *     dataUrl: "/api/work-orders?limit=5",
 *     columns: [
 *       { key: "title", header: "작업명" },
 *       { key: "status", header: "상태", isStatus: true },
 *     ],
 *   }}
 * />
 * ```
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
  const maxRows = widgetConfig?.maxRows ?? 5;

  // 데이터 상태 관리
  const [tableData, setTableData] = useState<Record<string, unknown>[]>(
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
        setTableData(data.data ?? data);
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
      setTableData(widgetConfig.data);
    }
  }, [widgetConfig?.data]);

  const handleRefresh = (): void => {
    const dataUrl = widgetConfig?.dataUrl;
    if (dataUrl) {
      const fetchData = async (): Promise<void> => {
        setIsLoading(true);
        try {
          const response = await fetch(dataUrl);
          if (response.ok) {
            const data = await response.json();
            setTableData(data.data ?? data);
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

  const displayData = tableData.slice(0, maxRows);

  const renderCell = (
    row: Record<string, unknown>,
    column: TableColumn
  ): ReactNode => {
    const value = row[column.key];

    // 상태 컬럼 처리 (isStatus 플래그 또는 key가 "status"인 경우)
    if ((column.isStatus || column.key === "status") && typeof value === "string") {
      const defaultStatusMap: Record<string, StatusType> = {
        "대기": "pending",
        "진행중": "inProgress",
        "완료": "completed",
        "취소": "cancelled",
      };
      const statusMap = column.statusMap ?? defaultStatusMap;
      const mappedStatus = statusMap[value] ?? "pending";
      return (
        <StatusBadge
          status={mappedStatus}
          label={value}
        />
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
      onRefresh={handleRefresh}
      loading={isLoading}
      error={error}
      footer={
        tableData.length > maxRows ? (
          <span className="text-xs">
            {tableData.length}개 중 {maxRows}개 표시
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
