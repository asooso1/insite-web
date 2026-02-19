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

import {
  useUserList,
  useDeleteUser,
  useDownloadUserExcel,
} from "@/lib/hooks/use-users";
import {
  AccountState,
  AccountStateLabel,
  AccountStateStyle,
  type AccountDTO,
  type SearchUserVO,
} from "@/lib/types/user";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 상태 필터 탭
// ============================================================================

const STATE_TABS = [
  { value: "", label: "전체" },
  { value: AccountState.HIRED, label: "재직중" },
  { value: AccountState.LEAVE, label: "휴직" },
  { value: AccountState.RETIRED, label: "퇴사" },
  { value: AccountState.TEMPORAL, label: "임시" },
] as const;

// ============================================================================
// 검색 유형
// ============================================================================

const SEARCH_CODES = [
  { value: "name", label: "이름" },
  { value: "userId", label: "아이디" },
  { value: "mobile", label: "휴대폰" },
] as const;

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<AccountDTO>[] {
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
              status={AccountStateStyle[state]}
              label={AccountStateLabel[state] ?? state}
            />
          );
        },
        size: 90,
      },
      {
        accessorKey: "name",
        header: "이름",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/users/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 120,
      },
      {
        accessorKey: "userId",
        header: "아이디",
        cell: ({ row }) => <span>{row.original.userId}</span>,
        size: 120,
      },
      {
        accessorKey: "companyName",
        header: "소속회사",
        cell: ({ row }) => <span>{row.original.companyName || "-"}</span>,
        size: 150,
      },
      {
        accessorKey: "department",
        header: "부서",
        cell: ({ row }) => <span>{row.original.department || "-"}</span>,
        size: 120,
      },
      {
        accessorKey: "roleName",
        header: "역할",
        cell: ({ row }) => <span>{row.original.roleName || "-"}</span>,
        size: 120,
      },
      {
        accessorKey: "mobile",
        header: "연락처",
        cell: ({ row }) => <span>{row.original.mobile || "-"}</span>,
        size: 130,
      },
      {
        accessorKey: "buildingCnt",
        header: "담당 건물",
        cell: ({ row }) => (
          <span className="text-center">{row.original.buildingCnt}</span>
        ),
        size: 90,
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

function RowActions({ row }: { row: Row<AccountDTO> }) {
  const router = useRouter();
  const deleteUser = useDeleteUser();
  const user = row.original;

  const handleDelete = useCallback(() => {
    if (confirm(`${user.name} 사용자를 삭제하시겠습니까?`)) {
      deleteUser.mutate(user.id);
    }
  }, [user, deleteUser]);

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
          onClick={() => router.push(`/users/${user.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/users/${user.id}/edit`)}
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

export default function UserListPage() {
  const router = useRouter();

  // 로컬 상태
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [accountState, setAccountState] = useState<string>("");
  const [searchCode, setSearchCode] = useState<string>("name");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 검색 파라미터
  const searchParams: SearchUserVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      accountState: (accountState as AccountState) || undefined,
      searchCode: (searchCode as SearchUserVO["searchCode"]) || undefined,
      searchKeyword: searchKeyword || undefined,
    }),
    [page, size, accountState, searchCode, searchKeyword]
  );

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useUserList(searchParams);

  // 엑셀 다운로드
  const downloadExcel = useDownloadUserExcel();

  // 컬럼
  const columns = useColumns();

  // 핸들러
  const handleSearch = useCallback((value: string) => {
    setSearchKeyword(value);
    setPage(0);
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setAccountState(value);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">사용자 목록</h1>
          <p className="text-muted-foreground">사용자를 관리합니다.</p>
        </div>
        <Button onClick={() => router.push("/users/new")}>
          <Plus className="mr-2 h-4 w-4" />
          새 사용자
        </Button>
      </div>

      {/* 상태 탭 */}
      <div className="flex gap-2 border-b">
        {STATE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStateChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              accountState === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 툴바 */}
      <div className="flex items-center justify-between gap-4">
        <div />
        <div className="flex items-center gap-2">
          <select
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            {SEARCH_CODES.map((code) => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="검색어 입력..."
            value={searchKeyword}
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
        pagination={false}
      />

      {/* 데이터 없음 */}
      {!isLoading && (!data?.content || data.content.length === 0) && (
        <EmptyState
          icon={Inbox}
          title="사용자가 없습니다"
          description="새 사용자를 등록해보세요."
          action={{
            label: "새 사용자 등록",
            onClick: () => router.push("/users/new"),
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
