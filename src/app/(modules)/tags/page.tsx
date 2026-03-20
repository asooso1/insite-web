"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Eye, Edit, Trash2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { FilterBar, type FilterDef, type FilterOption } from "@/components/common/filter-bar";
import { PageHeader } from "@/components/common/page-header";

import { useTagList, useDeleteTag } from "@/lib/hooks/use-tags";
import {
  TagType,
  TagTypeLabel,
  type TagDTO,
  type SearchQrNfcVO,
} from "@/lib/types/tag";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/error-handler";
import type { ColumnDef, Row } from "@tanstack/react-table";

const TAG_TYPE_OPTIONS: FilterOption[] = [
  { value: "", label: "전체" },
  { value: TagType.NFC, label: TagTypeLabel[TagType.NFC] },
  { value: TagType.QR, label: TagTypeLabel[TagType.QR] },
];

const INITIAL_FILTERS = {
  keyword: "",
  tagType: "",
};

const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "tagType", options: TAG_TYPE_OPTIONS },
  { type: "search", key: "keyword", placeholder: "태그코드 또는 시설명 검색" },
];

function useTagColumns(): ColumnDef<TagDTO>[] {
  const router = useRouter();
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        size: 70,
      },
      {
        accessorKey: "tagType",
        header: "태그유형",
        cell: ({ row }) => <span className="font-medium">{TagTypeLabel[row.original.tagType]}</span>,
        size: 100,
      },
      {
        accessorKey: "tagCode",
        header: "태그코드",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/tags/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.tagCode}
          </button>
        ),
        size: 150,
      },
      {
        accessorKey: "facilityName",
        header: "시설명",
        size: 150,
      },
      {
        accessorKey: "buildingFloorName",
        header: "층",
        size: 120,
      },
      {
        accessorKey: "zoneName",
        header: "구역",
        size: 120,
      },
      {
        accessorKey: "createdAt",
        header: "등록일",
        size: 130,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <TagRowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

function TagRowActions({ row }: { row: Row<TagDTO> }) {
  const router = useRouter();
  const tag = row.original;
  const [showDelete, setShowDelete] = useState(false);
  const { mutate: deleteTag, isPending } = useDeleteTag();

  const handleDelete = async () => {
    try {
      deleteTag(tag.id);
      toast.success("태그가 삭제되었습니다.");
      setShowDelete(false);
    } catch (error) {
      handleApiError(error as Error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/tags/${tag.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/tags/${tag.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>태그 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 태그를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function TagListPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const params: SearchQrNfcVO = useMemo(
    () => ({
      keyword: filters.keyword || undefined,
      tagType: (filters.tagType as SearchQrNfcVO["tagType"]) || undefined,
      page,
      size,
    }),
    [filters, page, size]
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTagList(params);

  const columns = useTagColumns();

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{
          label: "다시 시도",
          onClick: refetch,
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="NFC/QR 태그 관리"
        description="NFC 및 QR 태그를 관리합니다"
        actions={
          <Button asChild size="sm">
            <div onClick={() => router.push("/tags/new")}>
              <Plus className="mr-1 h-4 w-4" />
              새 태그
            </div>
          </Button>
        }
      />

      <div className="px-6">
        <FilterBar
          filters={FILTER_DEFS}
          values={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <div className="px-6">
        <DataTable
          columns={columns}
          data={data?.content ?? []}
          loading={isLoading}
          pagination={false}
        />
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t px-6 pt-4">
          <div className="text-sm text-muted-foreground">
            총 {totalElements}건 중 {page * size + 1}-{Math.min((page + 1) * size, totalElements)}건
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
