"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  AlertCircle,
  Inbox,
  Trash2,
  Building2,
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

import {
  useClientList,
  useDeleteClient,
  useDownloadClientExcel,
} from "@/lib/hooks/use-clients";
import {
  CompanyStateLabel,
  CompanyStateStyle,
  type CompanyDTO,
  type SearchClientVO,
} from "@/lib/types/client";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 검색 유형
// ============================================================================

const SEARCH_CODES = [
  { value: "companyName", label: "회사명" },
  { value: "businessNo", label: "사업자번호" },
] as const;

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<CompanyDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.id}</span>
        ),
        size: 70,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.state;
          return (
            <StatusBadge
              status={CompanyStateStyle[state]}
              label={CompanyStateLabel[state] ?? state}
            />
          );
        },
        size: 90,
      },
      {
        accessorKey: "name",
        header: "회사명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/clients/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "businessNo",
        header: "사업자번호",
        cell: ({ row }) => <span>{row.original.businessNo || "-"}</span>,
        size: 130,
      },
      {
        accessorKey: "officerName",
        header: "담당자",
        cell: ({ row }) => <span>{row.original.officerName || "-"}</span>,
        size: 100,
      },
      {
        accessorKey: "phone",
        header: "대표 전화",
        cell: ({ row }) => <span>{row.original.phone || "-"}</span>,
        size: 130,
      },
      {
        accessorKey: "buildingCnt",
        header: "건물 수",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span>{row.original.buildingCnt}</span>
          </div>
        ),
        size: 80,
      },
      {
        accessorKey: "writeDate",
        header: "등록일",
        cell: ({ row }) => (
          <span>
            {row.original.writeDate
              ? String(row.original.writeDate).split("T")[0]
              : "-"}
          </span>
        ),
        size: 110,
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

function RowActions({ row }: { row: Row<CompanyDTO> }) {
  const router = useRouter();
  const deleteClient = useDeleteClient();
  const client = row.original;

  const handleDelete = useCallback(() => {
    if (confirm(`${client.name} 고객사를 삭제하시겠습니까?`)) {
      deleteClient.mutate(client.id);
    }
  }, [client, deleteClient]);

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
          onClick={() => router.push(`/clients/${client.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/clients/${client.id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function ClientListPage() {
  const router = useRouter();

  // 로컬 상태
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [searchCode, setSearchCode] = useState<string>("companyName");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 검색 파라미터
  const searchParams: SearchClientVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      searchCode: (searchCode as SearchClientVO["searchCode"]) || undefined,
      searchKeyword: searchKeyword || undefined,
    }),
    [page, size, searchCode, searchKeyword]
  );

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useClientList(searchParams);

  // 엑셀 다운로드
  const downloadExcel = useDownloadClientExcel();

  // 컬럼
  const columns = useColumns();

  // 핸들러
  const handleSearch = useCallback((value: string) => {
    setSearchKeyword(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleDownloadExcel = useCallback(() => {
    downloadExcel.mutate(searchParams);
  }, [downloadExcel, searchParams]);

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
        title="고객사 목록"
        description="고객사를 관리합니다."
        icon={Building2}
        actions={
          <Button onClick={() => router.push("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            새 고객사
          </Button>
        }
      />

      {/* 툴바 */}
      <div className="flex items-center justify-between gap-4">
        <div />
        <div className="flex items-center gap-2">
          <Select value={searchCode} onValueChange={setSearchCode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEARCH_CODES.map((code) => (
                <SelectItem key={code.value} value={code.value}>
                  {code.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="검색어 입력..."
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
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
        pagination={false}
      />

      {/* 데이터 없음 */}
      {!isLoading && (!data?.content || data.content.length === 0) && (
        <EmptyState
          icon={Inbox}
          title="고객사가 없습니다"
          description="새 고객사를 등록해보세요."
          action={{
            label: "새 고객사 등록",
            onClick: () => router.push("/clients/new"),
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
