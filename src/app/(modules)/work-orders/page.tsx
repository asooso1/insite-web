"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Copy,
  Ban,
  AlertCircle,
  Inbox,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";

import {
  useWorkOrderList,
  useDownloadWorkOrderExcel,
  useCancelMultiWorkOrder,
  useApproveMultiWorkOrder,
} from "@/lib/hooks/use-work-orders";
import {
  WorkOrderState,
  WorkOrderStateLabel,
  WorkOrderStateStyle,
  WorkOrderTypeLabel,
  type WorkOrderListDTO,
  type SearchWorkOrderVO,
} from "@/lib/types/work-order";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 상태 필터 탭
// ============================================================================

const STATE_TABS = [
  { value: "", label: "전체" },
  { value: WorkOrderState.WRITE, label: "작성" },
  { value: WorkOrderState.ISSUE, label: "발행" },
  { value: WorkOrderState.PROCESSING, label: "처리중" },
  { value: WorkOrderState.REQ_COMPLETE, label: "완료요청" },
  { value: WorkOrderState.COMPLETE, label: "완료" },
  { value: WorkOrderState.CANCEL, label: "취소" },
] as const;

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
        accessorKey: "workOrderDTO.id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.workOrderDTO.id}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "workOrderDTO.state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.workOrderDTO.state;
          return (
            <StatusBadge
              status={WorkOrderStateStyle[state]}
              label={WorkOrderStateLabel[state]}
            />
          );
        },
        size: 100,
      },
      {
        accessorKey: "workOrderDTO.name",
        header: "작업명",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/work-orders/${row.original.workOrderDTO.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.workOrderDTO.name}
          </button>
        ),
        size: 250,
      },
      {
        accessorKey: "workOrderDTO.type",
        header: "유형",
        cell: ({ row }) => (
          <span>{WorkOrderTypeLabel[row.original.workOrderDTO.type]}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "workOrderDTO.firstClassName",
        header: "작업 구분",
        cell: ({ row }) => (
          <span>
            {row.original.workOrderDTO.firstClassName} &gt;{" "}
            {row.original.workOrderDTO.secondClassName}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "buildingDTO.name",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingDTO.name}</span>,
        size: 150,
      },
      {
        accessorKey: "workOrderDTO.buildingUserGroupName",
        header: "작업팀",
        cell: ({ row }) => (
          <span>{row.original.workOrderDTO.buildingUserGroupName}</span>
        ),
        size: 120,
      },
      {
        accessorKey: "workOrderDTO.planStartDate",
        header: "작업예정일",
        cell: ({ row }) => {
          const start = row.original.workOrderDTO.planStartDate;
          const end = row.original.workOrderDTO.planEndDate;
          if (!start || start === "-") return <span>-</span>;
          return (
            <span className="text-sm">
              {start.split(" ")[0]}
              {end && end !== "-" && ` ~ ${end.split(" ")[0]}`}
            </span>
          );
        },
        size: 180,
      },
      {
        accessorKey: "workOrderDTO.writerName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.workOrderDTO.writerName}</span>,
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
  const workOrder = row.original.workOrderDTO;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/work-orders/${workOrder.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/work-orders/${workOrder.id}/edit`)}
        >
          수정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          복사
        </DropdownMenuItem>
        {workOrder.state !== WorkOrderState.CANCEL &&
          workOrder.state !== WorkOrderState.COMPLETE && (
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

  // 로컬 상태 (URL 동기화는 추후 nuqs 셋업 후 적용)
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [state, setState] = useState<string>("");
  const [keyword, setKeyword] = useState("");

  // 검색 파라미터
  const searchParams: SearchWorkOrderVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      state: (state as WorkOrderState) || undefined,
      keyword: keyword || undefined,
    }),
    [page, size, state, keyword]
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

  // 핸들러
  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
    setPage(0);
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setState(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleDownloadExcel = useCallback(() => {
    downloadExcel.mutate(searchParams);
  }, [downloadExcel, searchParams]);

  const handleApproveSelected = useCallback(() => {
    const ids = selectedRows.map((r) => r.workOrderDTO.id);
    approveMulti.mutate(ids, {
      onSuccess: () => {
        setSelectedRows([]);
        refetch();
      },
    });
  }, [selectedRows, approveMulti, refetch]);

  const handleCancelSelected = useCallback(() => {
    const ids = selectedRows.map((r) => r.workOrderDTO.id);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">작업 목록</h1>
          <p className="text-muted-foreground">작업지시를 관리합니다.</p>
        </div>
        <Button onClick={() => router.push("/work-orders/new")}>
          <Plus className="mr-2 h-4 w-4" />
          새 작업
        </Button>
      </div>

      {/* 상태 탭 */}
      <Tabs
        value={state || "ALL"}
        onValueChange={(v) => handleStateChange(v === "ALL" ? "" : v)}
      >
        <TabsList className="h-auto gap-1 bg-transparent p-0 border-b rounded-none w-full justify-start">
          {STATE_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value || "ALL"}
              value={tab.value || "ALL"}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 툴바 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedRows.length}개 선택됨
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleApproveSelected}
                disabled={approveMulti.isPending}
              >
                일괄 승인
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelSelected}
                disabled={cancelMulti.isPending}
              >
                일괄 취소
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="작업명 검색..."
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadExcel}
            disabled={downloadExcel.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            엑셀
          </Button>
        </div>
      </div>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        enableRowSelection
        onRowSelectionChange={setSelectedRows}
        pagination={false}
      />

      {/* 데이터 없음 */}
      {!isLoading && (!data?.content || data.content.length === 0) && (
        <EmptyState
          icon={Inbox}
          title="작업이 없습니다"
          description="새 작업을 등록해보세요."
          action={{
            label: "새 작업 등록",
            onClick: () => router.push("/work-orders/new"),
          }}
        />
      )}

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
