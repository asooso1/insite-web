"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import {
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Copy,
  Ban,
  AlertCircle,
  Inbox,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { BulkActionBar } from "@/components/data-display/bulk-action-bar";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";

import {
  useWorkOrderList,
  useDownloadWorkOrderExcel,
  useCancelMultiWorkOrder,
  useApproveMultiWorkOrder,
} from "@/lib/hooks/use-work-orders";
import {
  WorkOrderState,
  WorkOrderType,
  WorkOrderTypeLabel,
  type WorkOrderListDTO,
  type SearchWorkOrderVO,
} from "@/lib/types/work-order";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 필터 정의
// ============================================================================

function getInitialFilters() {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  return {
    state: "",
    type: "",
    termType: "write_date" as const,
    termDateFrom: fmt(oneMonthAgo),
    termDateTo: fmt(today),
    searchCode: "title" as const,
    keyword: "",
  };
}

const FILTER_DEFS: FilterDef[] = [
  {
    type: "tabs",
    key: "state",
    options: [
      { value: "", label: "전체" },
      { value: WorkOrderState.WRITE, label: "작성" },
      { value: WorkOrderState.ISSUE, label: "발행" },
      { value: WorkOrderState.PROCESSING, label: "처리중" },
      { value: WorkOrderState.REQ_COMPLETE, label: "완료요청" },
      { value: WorkOrderState.COMPLETE, label: "완료" },
      { value: WorkOrderState.CANCEL, label: "취소" },
    ],
  },
  {
    type: "select",
    key: "type",
    options: [
      { value: "", label: "전체 유형" },
      { value: WorkOrderType.GENERAL, label: "일반" },
      { value: WorkOrderType.TBM, label: "정기" },
      { value: WorkOrderType.ALARM, label: "긴급" },
    ],
  },
  {
    type: "select",
    key: "termType",
    options: [
      { value: "write_date", label: "작성일자" },
      { value: "issue_date", label: "발행일자" },
      { value: "approve_date", label: "완료일자" },
    ],
  },
  {
    type: "date-range",
    fromKey: "termDateFrom",
    toKey: "termDateTo",
  },
  {
    type: "select",
    key: "searchCode",
    options: [
      { value: "title", label: "업무명" },
      { value: "writerAccountName", label: "작성자" },
      { value: "chargeAccountName", label: "담당자" },
      { value: "confirmAccountName", label: "승인자" },
    ],
  },
  {
    type: "search",
    key: "keyword",
    placeholder: "검색어를 입력하세요",
  },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<WorkOrderListDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            aria-label="전체 선택"
            className="h-4 w-4 rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            aria-label="행 선택"
            className="h-4 w-4 rounded border-gray-300"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.id}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.state;
          return <StatusBadge status={state as WorkOrderState} />;
        },
        size: 100,
      },
      {
        accessorKey: "name",
        header: "업무명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/work-orders/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 250,
      },
      {
        accessorKey: "type",
        header: "유형",
        cell: ({ row }) => (
          <span>{WorkOrderTypeLabel[row.original.type as WorkOrderType]}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "firstClassName",
        header: "업무 구분",
        cell: ({ row }) => (
          <span>
            {row.original.firstClassName} &gt; {row.original.secondClassName}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingName}</span>,
        size: 150,
      },
      {
        accessorKey: "buildingUserGroupName",
        header: "담당팀",
        cell: ({ row }) => <span>{row.original.buildingUserGroupName}</span>,
        size: 120,
      },
      {
        accessorKey: "writeActionDateTime",
        header: "작성일",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.writeActionDateTime?.split(" ")[0] ?? "-"}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "writeUserName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.writeUserName}</span>,
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <RowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

// ============================================================================
// 행 액션
// ============================================================================

function RowActions({ row }: { row: Row<WorkOrderListDTO> }) {
  const router = useRouter();
  const item = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="더 보기">
          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/work-orders/${item.id}`)}
        >
          <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/work-orders/${item.id}/edit`)}
        >
          수정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Copy aria-hidden="true" className="mr-2 h-4 w-4" />
          복사
        </DropdownMenuItem>
        {item.state !== WorkOrderState.CANCEL &&
          item.state !== WorkOrderState.COMPLETE && (
            <DropdownMenuItem className="text-destructive">
              <Ban className="mr-2 h-4 w-4" />
              취소
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function WorkOrderListPage() {
  const router = useRouter();

  // URL 상태 관리 (nuqs) - 필터/페이지 URL에 반영되어 공유/북마크 가능
  const defaultFilters = getInitialFilters();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [state, setState] = useQueryState("state", parseAsString.withDefault(""));
  const [type, setType] = useQueryState("type", parseAsString.withDefault(""));
  const [termType, setTermType] = useQueryState("termType", parseAsString.withDefault(defaultFilters.termType));
  const [termDateFrom, setTermDateFrom] = useQueryState("termDateFrom", parseAsString.withDefault(defaultFilters.termDateFrom));
  const [termDateTo, setTermDateTo] = useQueryState("termDateTo", parseAsString.withDefault(defaultFilters.termDateTo));
  const [searchCode, setSearchCode] = useQueryState("searchCode", parseAsString.withDefault(defaultFilters.searchCode));
  const [keyword, setKeyword] = useQueryState("keyword", parseAsString.withDefault(""));

  const size = 20;

  const filters = { state, type, termType, termDateFrom, termDateTo, searchCode, keyword };

  const FILTER_SETTERS: Record<string, (v: string) => void> = useMemo(() => ({
    state: (v) => void setState(v),
    type: (v) => void setType(v),
    termType: (v) => void setTermType(v),
    termDateFrom: (v) => void setTermDateFrom(v),
    termDateTo: (v) => void setTermDateTo(v),
    searchCode: (v) => void setSearchCode(v),
    keyword: (v) => void setKeyword(v),
  }), [setState, setType, setTermType, setTermDateFrom, setTermDateTo, setSearchCode, setKeyword]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    FILTER_SETTERS[key]?.(value);
    void setPage(0);
  }, [FILTER_SETTERS, setPage]);

  const handleFilterReset = useCallback(() => {
    void setState("");
    void setType("");
    void setTermType(defaultFilters.termType);
    void setTermDateFrom(defaultFilters.termDateFrom);
    void setTermDateTo(defaultFilters.termDateTo);
    void setSearchCode(defaultFilters.searchCode);
    void setKeyword("");
    void setPage(0);
  }, [setState, setType, setTermType, setTermDateFrom, setTermDateTo, setSearchCode, setKeyword, setPage, defaultFilters.termType, defaultFilters.termDateFrom, defaultFilters.termDateTo, defaultFilters.searchCode]);

  // 검색 파라미터
  const searchParams: SearchWorkOrderVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      state: (state as WorkOrderState) || undefined,
      type: (type as WorkOrderType) || undefined,
      termType: termType as SearchWorkOrderVO["termType"],
      termDateFrom: termDateFrom || undefined,
      termDateTo: termDateTo || undefined,
      searchCode: searchCode as SearchWorkOrderVO["searchCode"],
      keyword: keyword || undefined,
    }),
    [page, size, state, type, termType, termDateFrom, termDateTo, searchCode, keyword]
  );

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useWorkOrderList(searchParams);

  // 다중 선택
  const [selectedRows, setSelectedRows] = useState<WorkOrderListDTO[]>([]);

  // 엑셀 다운로드
  const downloadExcel = useDownloadWorkOrderExcel();

  // 다중 승인/취소
  const approveMulti = useApproveMultiWorkOrder();
  const cancelMulti = useCancelMultiWorkOrder();

  // 컬럼
  const columns = useColumns();

  const handlePageChange = useCallback((newPage: number) => {
    void setPage(newPage);
  }, [setPage]);

  const handleDownloadExcel = useCallback(() => {
    downloadExcel.mutate(searchParams);
  }, [downloadExcel, searchParams]);

  const handleApproveSelected = useCallback(() => {
    const ids = selectedRows.map((r) => r.id);
    approveMulti.mutate(ids, {
      onSuccess: () => {
        setSelectedRows([]);
        refetch();
      },
    });
  }, [selectedRows, approveMulti, refetch]);

  const handleCancelSelected = useCallback(() => {
    const ids = selectedRows.map((r) => r.id);
    cancelMulti.mutate(ids, {
      onSuccess: () => {
        setSelectedRows([]);
        refetch();
      },
    });
  }, [selectedRows, cancelMulti, refetch]);

  // 에러 처리
  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <PageHeader
        title="수시업무 목록"
        description="수시업무를 관리합니다."
        icon={ClipboardList}
        actions={
          <Button onClick={() => router.push("/work-orders/new")}>
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            신규 등록
          </Button>
        }
      />

      {/* 필터 */}
      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        rightSlot={
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadExcel}
            disabled={downloadExcel.isPending}
          >
            <Download aria-hidden="true" className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>
        }
      />

      {/* 벌크 액션 바 */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        onClear={() => setSelectedRows([])}
        actions={[
          {
            label: "일괄 승인",
            onClick: handleApproveSelected,
            disabled: approveMulti.isPending,
            loading: approveMulti.isPending,
          },
          {
            label: "일괄 취소",
            onClick: handleCancelSelected,
            variant: "destructive",
            disabled: cancelMulti.isPending,
            loading: cancelMulti.isPending,
          },
        ]}
      />

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        enableRowSelection
        onRowSelectionChange={setSelectedRows}
        pagination={false}
      />

      {/* 서버 사이드 페이지네이션 */}
      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {data.totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, data.totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={page === 0}
            >
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              이전
            </Button>
            <span className="px-2 text-sm">
              {page + 1} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= data.totalPages - 1}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.totalPages - 1)}
              disabled={page >= data.totalPages - 1}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
