"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  MoreHorizontal,
  AlertCircle,
  Inbox,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";

import {
  useSopList,
} from "@/lib/hooks/use-sops";
import {
  SopState,
  SopStateLabel,
  SopStateStyle,
  type SopDTO,
  type SearchSopVO,
} from "@/lib/types/sop";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 상태 필터 탭
// ============================================================================

const STATE_TABS = [
  { value: "", label: "전체" },
  { value: SopState.USE, label: "사용" },
  { value: SopState.END, label: "종료" },
] as const;

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<SopDTO>[] {
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
        accessorKey: "sopState",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.sopState;
          return (
            <StatusBadge
              status={SopStateStyle[state]}
              label={SopStateLabel[state]}
            />
          );
        },
        size: 100,
      },
      {
        accessorKey: "title",
        header: "제목",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/work-orders/sop/${row.original.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.title}
          </button>
        ),
        size: 250,
      },
      {
        accessorKey: "facilityCategoryName",
        header: "설비분류",
        cell: ({ row }) => (
          <span>{row.original.facilityCategoryName}</span>
        ),
        size: 150,
      },
      {
        accessorKey: "buildingDTO.name",
        header: "빌딩",
        cell: ({ row }) => (
          <span>{row.original.buildingDTO?.name ?? '-'}</span>
        ),
        size: 150,
      },
      {
        accessorKey: "sopKeyWord",
        header: "키워드",
        cell: ({ row }) => {
          const keywords = (row.original.sopKeyWord ?? "")
            .split("#")
            .filter((k) => k.trim());
          return (
            <div className="flex flex-wrap gap-1">
              {keywords.slice(0, 2).map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                >
                  {keyword.trim()}
                </span>
              ))}
              {keywords.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{keywords.length - 2}
                </span>
              )}
            </div>
          );
        },
        size: 200,
      },
      {
        accessorKey: "version",
        header: "버전",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.version}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "writerName",
        header: "작성자",
        cell: ({ row }) => (
          <span>{row.original.writerName}</span>
        ),
        size: 100,
      },
      {
        accessorKey: "writeDate",
        header: "작성일",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.writeDate?.split(" ")[0] ?? '-'}
          </span>
        ),
        size: 120,
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

function RowActions({ row }: { row: Row<SopDTO> }) {
  const router = useRouter();
  const sop = row.original;

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
          onClick={() => router.push(`/work-orders/sop/${sop.id}`)}
        >
          <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/work-orders/sop/${sop.id}/edit`)}
        >
          수정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function SopListPage() {
  const router = useRouter();

  // 로컬 상태
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [state, setState] = useState<string>("");
  const [keyword, setKeyword] = useState("");

  // 검색 파라미터
  const searchParams: SearchSopVO = useMemo(
    () => ({
      page,
      size,
      sopState: (state as SopState) || undefined,
      searchKeyword: keyword || undefined,
    }),
    [page, size, state, keyword]
  );

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useSopList(searchParams);

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
        title="SOP 목록"
        description="표준운영절차를 관리합니다."
        icon={BookOpen}
        actions={
          <Button onClick={() => router.push("/work-orders/sop/new")}>
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            새 SOP 등록
          </Button>
        }
      />

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
      <div className="flex items-center justify-end">
        <Input
          placeholder="SOP 검색..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
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
          title="SOP가 없습니다"
          description="새 SOP를 등록해보세요."
          action={{
            label: "새 SOP 등록",
            onClick: () => router.push("/work-orders/sop/new"),
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
