"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Megaphone,
  FileText,
  Pin,
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

import { useNoticeList, useDeleteNotice } from "@/lib/hooks/use-boards";
import { useReferenceDataList, useDeleteReferenceData } from "@/lib/hooks/use-boards";
import {
  NoticeTypeLabel,
  PublishStateLabel,
  PublishStateStyle,
  type NoticeListDTO,
  type NoticeType,
  type SearchNoticeVO,
  type ReferenceDataListDTO,
  type SearchReferenceDataVO,
} from "@/lib/types/board";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 탭 타입
// ============================================================================

type BoardTab = "notice" | "data";

const BOARD_TABS: { value: BoardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "notice", label: "공지사항", icon: Megaphone },
  { value: "data", label: "자료실", icon: FileText },
];

// ============================================================================
// 공지사항 컬럼 정의
// ============================================================================

function useNoticeColumns(): ColumnDef<NoticeListDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.noticeDTO.id}</span>
        ),
        size: 70,
      },
      {
        id: "publishState",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.noticeDTO.publishState;
          return (
            <StatusBadge
              status={PublishStateStyle[state] ?? "pending"}
              label={PublishStateLabel[state] ?? state}
            />
          );
        },
        size: 80,
      },
      {
        id: "noticeType",
        header: "유형",
        cell: ({ row }) => {
          const type = row.original.noticeDTO.noticeType as NoticeType;
          return (
            <span className={type === "NOTICE" ? "font-semibold text-primary" : ""}>
              {NoticeTypeLabel[type] ?? type}
            </span>
          );
        },
        size: 70,
      },
      {
        id: "title",
        header: "제목",
        cell: ({ row }) => {
          const notice = row.original.noticeDTO;
          return (
            <button
              onClick={() => router.push(`/boards/notices/${notice.id}`)}
              className="flex items-center gap-2 text-left font-medium text-primary hover:underline"
            >
              {row.original.isMajor && (
                <Pin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              )}
              <span className="truncate">{notice.title}</span>
              {notice.noticeFileDTOs.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({notice.noticeFileDTOs.length})
                </span>
              )}
            </button>
          );
        },
        size: 350,
      },
      {
        id: "companyName",
        header: "대상",
        cell: ({ row }) => (
          <span>{row.original.noticeCompanyName ?? "전체"}</span>
        ),
        size: 100,
      },
      {
        id: "viewCnt",
        header: "조회",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.noticeDTO.viewCnt}</span>
        ),
        size: 60,
      },
      {
        id: "writerName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.noticeDTO.writerName}</span>,
        size: 90,
      },
      {
        id: "writeDate",
        header: "작성일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.noticeDTO.writeDate}</span>
        ),
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <NoticeRowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

function NoticeRowActions({ row }: { row: Row<NoticeListDTO> }) {
  const router = useRouter();
  const deleteNotice = useDeleteNotice();
  const notice = row.original.noticeDTO;

  const handleDelete = useCallback(() => {
    if (confirm(`"${notice.title}" 공지사항을 삭제하시겠습니까?`)) {
      deleteNotice.mutate(notice.id);
    }
  }, [notice, deleteNotice]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/boards/notices/${notice.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/boards/notices/${notice.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 자료실 컬럼 정의
// ============================================================================

function useDataColumns(): ColumnDef<ReferenceDataListDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.referenceDataDTO.id}</span>
        ),
        size: 70,
      },
      {
        id: "title",
        header: "제목",
        cell: ({ row }) => {
          const data = row.original.referenceDataDTO;
          return (
            <button
              onClick={() => router.push(`/boards/data/${data.id}`)}
              className="flex items-center gap-2 text-left font-medium text-primary hover:underline"
            >
              <span className="truncate">{data.title}</span>
              {data.referenceDataFileDTOs.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({data.referenceDataFileDTOs.length})
                </span>
              )}
            </button>
          );
        },
        size: 400,
      },
      {
        id: "companyName",
        header: "대상",
        cell: ({ row }) => (
          <span>{row.original.referenceDataCompanyName ?? "전체"}</span>
        ),
        size: 100,
      },
      {
        id: "viewCnt",
        header: "조회",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.referenceDataDTO.viewCnt}</span>
        ),
        size: 60,
      },
      {
        id: "writerName",
        header: "작성자",
        cell: ({ row }) => <span>{row.original.referenceDataDTO.writerName}</span>,
        size: 90,
      },
      {
        id: "writeDate",
        header: "작성일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.referenceDataDTO.writeDate}</span>
        ),
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <DataRowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

function DataRowActions({ row }: { row: Row<ReferenceDataListDTO> }) {
  const router = useRouter();
  const deleteData = useDeleteReferenceData();
  const data = row.original.referenceDataDTO;

  const handleDelete = useCallback(() => {
    if (confirm(`"${data.title}" 자료를 삭제하시겠습니까?`)) {
      deleteData.mutate(data.id);
    }
  }, [data, deleteData]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/boards/data/${data.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/boards/data/${data.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
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

export default function BoardListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BoardTab>("notice");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [keyword, setKeyword] = useState("");

  // 공지사항 쿼리
  const noticeParams: SearchNoticeVO = useMemo(
    () => ({
      page,
      size,
      searchKeyword: keyword || undefined,
    }),
    [page, size, keyword]
  );

  const {
    data: noticeData,
    isLoading: noticeLoading,
    isError: noticeError,
    refetch: noticeRefetch,
  } = useNoticeList(noticeParams);

  // 자료실 쿼리
  const dataParams: SearchReferenceDataVO = useMemo(
    () => ({
      page,
      size,
      searchKeyword: keyword || undefined,
    }),
    [page, size, keyword]
  );

  const {
    data: refData,
    isLoading: dataLoading,
    isError: dataError,
    refetch: dataRefetch,
  } = useReferenceDataList(dataParams);

  const noticeColumns = useNoticeColumns();
  const dataColumns = useDataColumns();

  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
    setPage(0);
  }, []);

  const handleTabChange = useCallback((tab: BoardTab) => {
    setActiveTab(tab);
    setPage(0);
    setKeyword("");
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const isLoading = activeTab === "notice" ? noticeLoading : dataLoading;
  const isError = activeTab === "notice" ? noticeError : dataError;
  const refetch = activeTab === "notice" ? noticeRefetch : dataRefetch;

  const currentData = activeTab === "notice" ? noticeData : refData;
  const totalPages = currentData?.totalPages ?? 0;
  const totalElements = currentData?.totalElements ?? 0;

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
          <h1 className="text-2xl font-bold">게시판</h1>
          <p className="text-muted-foreground">공지사항 및 자료를 관리합니다.</p>
        </div>
        <Button
          onClick={() =>
            router.push(
              activeTab === "notice" ? "/boards/notices/new" : "/boards/data/new"
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          {activeTab === "notice" ? "새 공지" : "새 자료"}
        </Button>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b">
        {BOARD_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 검색 */}
      <div className="flex items-center justify-end gap-2">
        <input
          type="text"
          placeholder={activeTab === "notice" ? "공지사항 검색..." : "자료 검색..."}
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
        />
      </div>

      {/* 테이블 */}
      {activeTab === "notice" ? (
        <>
          <DataTable
            columns={noticeColumns}
            data={noticeData?.content ?? []}
            loading={noticeLoading}
            pagination={false}
          />
          {!noticeLoading && (noticeData?.content ?? []).length === 0 && (
            <EmptyState
              icon={Megaphone}
              title="공지사항이 없습니다"
              description="새 공지사항을 등록해보세요."
              action={{
                label: "새 공지 등록",
                onClick: () => router.push("/boards/notices/new"),
              }}
            />
          )}
        </>
      ) : (
        <>
          <DataTable
            columns={dataColumns}
            data={refData?.content ?? []}
            loading={dataLoading}
            pagination={false}
          />
          {!dataLoading && (refData?.content ?? []).length === 0 && (
            <EmptyState
              icon={FileText}
              title="자료가 없습니다"
              description="새 자료를 등록해보세요."
              action={{
                label: "새 자료 등록",
                onClick: () => router.push("/boards/data/new"),
              }}
            />
          )}
        </>
      )}

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, totalElements)}건
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
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={page >= totalPages - 1}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
