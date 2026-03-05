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
import { Briefcase, AlertCircle, Inbox } from "lucide-react";

import { useFieldProjectList } from "@/lib/hooks/use-field-projects";
import {
  FieldProjectStatus,
  FieldProjectStatusLabel,
  FieldProjectStatusStyle,
  type FieldProjectDTO,
} from "@/lib/types/field-project";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 상태 필터 옵션
// ============================================================================

const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: FieldProjectStatus.PLANNING, label: "계획중" },
  { value: FieldProjectStatus.ACTIVE, label: "진행중" },
  { value: FieldProjectStatus.INACTIVE, label: "일시중지" },
  { value: FieldProjectStatus.COMPLETED, label: "완료" },
  { value: FieldProjectStatus.CANCELLED, label: "취소" },
];

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<FieldProjectDTO>[] {
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
        accessorKey: "projectName",
        header: "프로젝트명",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/fieldwork/projects/${row.original.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.projectName}
          </button>
        ),
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: ({ row }) => (
          <StatusBadge
            status={FieldProjectStatusStyle[row.original.status]}
            label={FieldProjectStatusLabel[row.original.status]}
          />
        ),
        size: 120,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.buildingName}</span>
        ),
      },
      {
        accessorKey: "startDate",
        header: "시작일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.startDate.split("T")[0]}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "endDate",
        header: "종료일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.endDate.split("T")[0]}
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
                  router.push(`/fieldwork/projects/${row.original.id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                상세보기
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/fieldwork/projects/${row.original.id}/edit`)
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

export default function FieldProjectsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState<string>("");
  const [keyword, setKeyword] = useState("");

  const buildingId = Number(user?.currentBuildingId ?? 0);

  const { data, isLoading, isError } = useFieldProjectList({
    buildingId: buildingId > 0 ? buildingId : undefined,
    status: (status as any) || undefined,
    keyword: keyword || undefined,
    page,
    size,
  });

  const columns = useColumns();

  if (isError) {
    return (
      <EmptyState
        title="오류 발생"
        description="현장프로젝트 목록을 불러올 수 없습니다"
        icon={AlertCircle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="현장프로젝트"
        description="현장 프로젝트를 관리하세요"
        icon={Briefcase}
        actions={
          <Button onClick={() => router.push("/fieldwork/projects/new")}>
            <Plus className="mr-2 h-4 w-4" />
            프로젝트 추가
          </Button>
        }
      />

      {/* 필터 영역 */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <label className="text-sm font-medium text-foreground">
              검색어
            </label>
            <Input
              placeholder="프로젝트명 검색"
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
          title="프로젝트가 없습니다"
          description="첫 번째 프로젝트를 추가해보세요"
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
