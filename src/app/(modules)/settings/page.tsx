"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  AlertCircle,
  Settings2,
  FolderTree,
  Wrench,
  ChevronRight,
  ChevronDown,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useConfigGroupList,
  useFacilityCategoryTree,
  useFacilityMasterList,
  useCopyFacilityMaster,
} from "@/lib/hooks/use-settings";
import {
  FuelTypeLabel,
  type ConfigGroupDTO,
  type ConfigDTO,
  type FacilityCategoryTreeDTO,
  type FacilityMasterDTO,
  type FuelType,
  type SearchFacilityMasterVO,
} from "@/lib/types/setting";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 탭 타입
// ============================================================================

type SettingTab = "config" | "category" | "master";

const SETTING_TABS: { value: SettingTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "config", label: "기본 코드", icon: Settings2 },
  { value: "category", label: "설비 분류", icon: FolderTree },
  { value: "master", label: "표준 설비", icon: Wrench },
];

// ============================================================================
// 기본 코드 섹션
// ============================================================================

function ConfigSection() {
  const { data: groups, isLoading } = useConfigGroupList();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <EmptyState
        icon={Settings2}
        title="기본 코드가 없습니다"
        description="시스템 기본 코드 설정이 없습니다."
      />
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group: ConfigGroupDTO) => (
        <ConfigGroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}

function ConfigGroupCard({ group }: { group: ConfigGroupDTO }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {group.name}
            <span className="text-xs text-muted-foreground font-normal">
              ({group.code})
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-normal">
            {group.configs?.length ?? 0}개 항목
          </span>
        </CardTitle>
      </CardHeader>
      {expanded && group.configs && (
        <CardContent>
          <div className="divide-y">
            {group.configs.map((config: ConfigDTO) => (
              <div key={config.id} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{config.name}</span>
                    <span className="text-xs text-muted-foreground">
                      [{config.code}]
                    </span>
                    {config.enabled ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  {config.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {config.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm">{config.settingValue || "-"}</span>
                  <p className="text-xs text-muted-foreground">
                    {config.inputTypeName} · {config.scopeName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ============================================================================
// 설비 분류 섹션
// ============================================================================

function CategorySection() {
  const { data: tree, isLoading } = useFacilityCategoryTree();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!tree || tree.length === 0) {
    return (
      <EmptyState
        icon={FolderTree}
        title="설비 분류가 없습니다"
        description="설비 분류 트리를 등록해주세요."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">설비 분류 트리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {tree.map((node) => (
            <CategoryTreeNode key={node.id} node={node} depth={0} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryTreeNode({
  node,
  depth,
}: {
  node: FacilityCategoryTreeDTO;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(node.opened);
  const hasChildren = node.items && node.items.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted ${
          depth === 0 ? "font-medium" : ""
        }`}
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="shrink-0">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <span className="text-sm flex-1">{node.value}</span>
        <span className="text-xs text-muted-foreground">{node.code}</span>
        {!node.isUsed && (
          <span className="text-xs text-muted-foreground bg-muted rounded px-1">
            미사용
          </span>
        )}
      </div>
      {expanded &&
        hasChildren &&
        node.items.map((child) => (
          <CategoryTreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

// ============================================================================
// 표준 설비 섹션
// ============================================================================

function useMasterColumns(): ColumnDef<FacilityMasterDTO>[] {
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
        accessorKey: "name",
        header: "제품명",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/settings/facility-masters/${row.original.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "facilityCategory3Name",
        header: "분류",
        cell: ({ row }) => {
          const m = row.original;
          const parts = [m.facilityCategory1Name, m.facilityCategory2Name, m.facilityCategory3Name].filter(Boolean);
          return <span className="text-sm">{parts.join(" > ") || "-"}</span>;
        },
        size: 200,
      },
      {
        accessorKey: "makingCompany",
        header: "제조업체",
        cell: ({ row }) => <span>{row.original.makingCompany || "-"}</span>,
        size: 120,
      },
      {
        accessorKey: "modelName",
        header: "모델",
        cell: ({ row }) => <span>{row.original.modelName || "-"}</span>,
        size: 120,
      },
      {
        accessorKey: "fuelType",
        header: "연료",
        cell: ({ row }) => (
          <span>
            {FuelTypeLabel[row.original.fuelType as FuelType] ??
              row.original.fuelTypeName ??
              "-"}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "writeDate",
        header: "등록일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.writeDate}</span>
        ),
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <MasterRowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

function MasterRowActions({ row }: { row: Row<FacilityMasterDTO> }) {
  const router = useRouter();
  const copyMaster = useCopyFacilityMaster();
  const master = row.original;

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
          onClick={() => router.push(`/settings/facility-masters/${master.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/settings/facility-masters/${master.id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (confirm(`"${master.name}" 설비를 복사하시겠습니까?`)) {
              copyMaster.mutate(master.id);
            }
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          복사
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MasterSection() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [keyword, setKeyword] = useState("");

  const searchParams: SearchFacilityMasterVO = useMemo(
    () => ({
      page,
      size,
      facilityMasterName: keyword || undefined,
    }),
    [page, size, keyword]
  );

  const { data, isLoading } = useFacilityMasterList(searchParams);
  const columns = useMasterColumns();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="설비명 검색..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(0);
          }}
          className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
        />
        <Button onClick={() => router.push("/settings/facility-masters/new")}>
          <Plus className="mr-2 h-4 w-4" />
          새 표준 설비
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        pagination={false}
      />

      {!isLoading && (data?.content ?? []).length === 0 && (
        <EmptyState
          icon={Wrench}
          title="표준 설비가 없습니다"
          description="새 표준 설비를 등록해보세요."
          action={{
            label: "새 표준 설비 등록",
            onClick: () => router.push("/settings/facility-masters/new"),
          }}
        />
      )}

      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {data.totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, data.totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(0)} disabled={page === 0}>
              처음
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 0}>
              이전
            </Button>
            <span className="px-2 text-sm">{page + 1} / {data.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= data.totalPages - 1}>
              다음
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(data.totalPages - 1)} disabled={page >= data.totalPages - 1}>
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>("config");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-muted-foreground">시스템 코드, 설비 분류, 표준 설비를 관리합니다.</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b">
        {SETTING_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
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

      {/* 탭 컨텐츠 */}
      {activeTab === "config" && <ConfigSection />}
      {activeTab === "category" && <CategorySection />}
      {activeTab === "master" && <MasterSection />}
    </div>
  );
}
