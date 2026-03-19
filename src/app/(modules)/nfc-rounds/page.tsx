"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, MoreHorizontal, Eye, Edit, AlertCircle } from "lucide-react";

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
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { PageHeader } from "@/components/common/page-header";

import { useNfcRoundForms, useNfcRoundIssues } from "@/lib/hooks/use-nfc-rounds";
import {
  NfcRoundIssueStateLabel,
  type NfcRoundFormDTO,
  type NfcRoundIssueDTO,
  type SearchNfcRoundVO,
} from "@/lib/types/nfc-round";
import type { ColumnDef, Row } from "@tanstack/react-table";

const TABS = [
  { value: "forms", label: "라운드 양식" },
  { value: "issues", label: "이슈" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const STATE_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "IN_PROGRESS", label: "진행중" },
  { value: "COMPLETED", label: "완료" },
  { value: "CANCELLED", label: "취소" },
];

function getInitialFilters() {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return {
    state: "ALL",
    keyword: "",
    fromDate: fmt(oneMonthAgo),
    toDate: fmt(today),
  };
}

const INITIAL_FILTERS = getInitialFilters();

const FORM_FILTER_DEFS: FilterDef[] = [
  { type: "select", key: "state", options: STATE_OPTIONS },
  { type: "search", key: "keyword", placeholder: "라운드명 또는 시설명 검색" },
];

const ISSUE_FILTER_DEFS: FilterDef[] = [
  { type: "select", key: "state", options: STATE_OPTIONS },
  { type: "date-range", fromKey: "fromDate", toKey: "toDate" },
  { type: "search", key: "keyword", placeholder: "검색어 입력" },
];

function useFormColumns(): ColumnDef<NfcRoundFormDTO>[] {
  const router = useRouter();
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
        size: 70,
      },
      {
        accessorKey: "name",
        header: "라운드명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/nfc-rounds/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "facilityName",
        header: "시설명",
        size: 150,
      },
      {
        accessorKey: "totalCount",
        header: "전체",
        size: 70,
      },
      {
        accessorKey: "passCount",
        header: "통과",
        size: 70,
      },
      {
        accessorKey: "failCount",
        header: "실패",
        size: 70,
      },
      {
        accessorKey: "checkDate",
        header: "점검일",
        size: 110,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <FormRowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

function FormRowActions({ row }: { row: Row<NfcRoundFormDTO> }) {
  const router = useRouter();
  const form = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/nfc-rounds/${form.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/nfc-rounds/${form.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useIssueColumns(): ColumnDef<NfcRoundIssueDTO>[] {
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        size: 70,
      },
      {
        accessorKey: "categoryName",
        header: "카테고리",
        size: 130,
      },
      {
        accessorKey: "itemName",
        header: "항목",
        size: 200,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.state}
            label={NfcRoundIssueStateLabel[row.original.state] ?? row.original.state}
          />
        ),
        size: 90,
      },
      {
        accessorKey: "checkDate",
        header: "점검일",
        size: 110,
      },
      {
        accessorKey: "comment",
        header: "비고",
        size: 200,
      },
    ],
    []
  );
}

export default function NfcRoundListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>("forms");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const params: SearchNfcRoundVO = useMemo(
    () => ({
      state: filters.state !== "ALL" ? filters.state : undefined,
      keyword: filters.keyword || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
      page,
      size,
    }),
    [filters, page, size]
  );

  const {
    data: formData,
    isLoading: formLoading,
    isError: formError,
    refetch: refetchForms,
  } = useNfcRoundForms(params);

  const {
    data: issueData,
    isLoading: issueLoading,
    isError: issueError,
    refetch: refetchIssues,
  } = useNfcRoundIssues(params);

  const formColumns = useFormColumns();
  const issueColumns = useIssueColumns();

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(getInitialFilters());
    setPage(0);
  }, []);

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
    setPage(0);
    setFilters(getInitialFilters());
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const isForms = activeTab === "forms";
  const isLoading = isForms ? formLoading : issueLoading;
  const isError = isForms ? formError : issueError;
  const totalPages = isForms ? (formData?.totalPages ?? 0) : (issueData?.totalPages ?? 0);
  const totalElements = isForms ? (formData?.totalElements ?? 0) : (issueData?.totalElements ?? 0);

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{
          label: "다시 시도",
          onClick: () => (isForms ? refetchForms() : refetchIssues()),
        }}
      />
    );
  }

  const renderTable = () => {
    if (isForms) {
      return (
        <DataTable
          columns={formColumns}
          data={formData?.content ?? []}
          loading={isLoading}
          pagination={false}
        />
      );
    } else {
      return (
        <DataTable
          columns={issueColumns}
          data={issueData?.content ?? []}
          loading={isLoading}
          pagination={false}
        />
      );
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="NFC 라운드 관리"
        description="NFC 라운드 점검 양식 및 이슈를 관리합니다"
        actions={
          isForms && (
            <Button asChild size="sm">
              <Link href="/nfc-rounds/new">
                <Plus className="mr-1 h-4 w-4" />
                새 라운드
              </Link>
            </Button>
          )
        }
      />

      <div className="flex gap-2 border-b px-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-6">
        <FilterBar
          filters={isForms ? FORM_FILTER_DEFS : ISSUE_FILTER_DEFS}
          values={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <div className="px-6">
        {renderTable()}
        {!isLoading && ((isForms ? formData?.content : issueData?.content) ?? []).length === 0 && (
          <EmptyState
            title="데이터가 없습니다."
            description={isForms ? "NFC 라운드 양식을 등록해보세요." : "등록된 이슈가 없습니다."}
          />
        )}
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t px-6 pt-4">
          <div className="text-sm text-muted-foreground">
            총 {totalElements}건 중 {page * size + 1}-{Math.min((page + 1) * size, totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(0)} disabled={page === 0}>
              처음
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
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
