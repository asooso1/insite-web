"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Eye, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, AlertCircle, Inbox } from "lucide-react";

import { useFieldWorkOrderList } from "@/lib/hooks/use-field-work-orders";
import {
  FieldWorkOrderStatus,
  FieldWorkOrderStatusLabel,
  FieldWorkOrderStatusStyle,
  FieldWorkOrderPriority,
  FieldWorkOrderPriorityLabel,
  FieldWorkOrderPriorityStyle,
  type FieldWorkOrderDTO,
} from "@/lib/types/field-work-order";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 필터 옵션
// ============================================================================

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: FieldWorkOrderStatus.PENDING, label: "대기중" },
  { value: FieldWorkOrderStatus.ASSIGNED, label: "배정됨" },
  { value: FieldWorkOrderStatus.IN_PROGRESS, label: "진행중" },
  { value: FieldWorkOrderStatus.COMPLETED, label: "완료" },
  { value: FieldWorkOrderStatus.CANCELLED, label: "취소" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "전체" },
  { value: FieldWorkOrderPriority.URGENT, label: "긴급" },
  { value: FieldWorkOrderPriority.HIGH, label: "높음" },
  { value: FieldWorkOrderPriority.MEDIUM, label: "보통" },
  { value: FieldWorkOrderPriority.LOW, label: "낮음" },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<FieldWorkOrderDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.id}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "title",
        header: "제목",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/fieldwork/work-orders/${row.original.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.title}
          </button>
        ),
      },
      {
        accessorKey: "priority",
        header: "우선순위",
        cell: ({ row }) => (
          <StatusBadge
            status={FieldWorkOrderPriorityStyle[row.original.priority]}
            label={FieldWorkOrderPriorityLabel[row.original.priority]}
          />
        ),
        size: 100,
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: ({ row }) => (
          <StatusBadge
            status={FieldWorkOrderStatusStyle[row.original.status]}
            label={FieldWorkOrderStatusLabel[row.original.status]}
          />
        ),
        size: 100,
      },
      {
        accessorKey: "projectName",
        header: "프로젝트",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.projectName}</span>
        ),
      },
      {
        accessorKey: "mainAssigneeName",
        header: "담당자",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.mainAssigneeName || "-"}
          </span>
        ),
      },
      {
        accessorKey: "startDateTime",
        header: "예정시작",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.startDateTime
              ? row.original.startDateTime.split("T")[0]
              : "-"}
          </span>
        ),
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/fieldwork/work-orders/${row.original.id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                상세보기
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/fieldwork/work-orders/${row.original.id}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                수정
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 80,
      },
    ],
    [router]
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

function getDefaultDateRange() {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - 6);
  const end = new Date(now);
  end.setMonth(end.getMonth() + 1);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export default function FieldWorkOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [keyword, setKeyword] = useState("");
  const { startDate, endDate } = getDefaultDateRange();

  const buildingId = Number(user?.currentBuildingId ?? 0);

  const { data, isLoading, isError } = useFieldWorkOrderList({
    projectId: buildingId > 0 ? buildingId : undefined,
    startDate,
    endDate,
    status: (status !== "all" ? status as any : undefined),
    priority: (priority !== "all" ? priority as any : undefined),
    keyword: keyword || undefined,
    page,
    size,
  });

  const columns = useColumns();

  if (isError) {
    return (
      <EmptyState
        title="오류 발생"
        description="수시업무 목록을 불러올 수 없습니다"
        icon={AlertCircle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="현장 수시업무"
        description="현장 작업을 관리하세요"
        icon={CheckCircle}
        actions={
          <Button onClick={() => router.push("/fieldwork/work-orders/new")}>
            <Plus className="mr-2 h-4 w-4" />
            수시업무 추가
          </Button>
        }
      />

      {/* 필터 영역 */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-foreground">상태</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">우선순위</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground">검색어</label>
            <Input
              placeholder="업무명 검색"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-muted-foreground">불러오는 중...</span>
        </div>
      ) : !data?.content || data.content.length === 0 ? (
        <EmptyState
          title="데이터가 없습니다."
          description="첫 번째 수시업무를 추가해보세요"
          icon={Inbox}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data.content}
          />

          {/* 페이지네이션 */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                총 {data.totalElements}개 중 {page * size + 1}-
                {Math.min((page + 1) * size, data.totalElements)}개 표시
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages - 1}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
