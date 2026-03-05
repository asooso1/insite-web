"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Eye, Edit, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/data-display/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-display/data-table";

import { useFieldProject, useFieldProjectAccounts } from "@/lib/hooks/use-field-projects";
import {
  FieldProjectStatusLabel,
  FieldProjectStatusStyle,
} from "@/lib/types/field-project";
import { StatusBadge } from "@/components/data-display/status-badge";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

// ============================================================================
// 참여자 테이블 컬럼
// ============================================================================

function useAccountColumns(): ColumnDef<any>[] {
  return useMemo(
    () => [
      {
        accessorKey: "accountName",
        header: "이름",
        cell: ({ row }) => <span className="font-medium">{row.original.accountName}</span>,
      },
      {
        accessorKey: "accountEmail",
        header: "이메일",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.accountEmail}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "역할",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.role}</span>
        ),
      },
    ],
    []
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function FieldProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const projectId = Number(id);

  const { data: project, isLoading, isError } = useFieldProject(projectId);
  const { data: accounts = [] } = useFieldProjectAccounts(projectId);

  const accountColumns = useAccountColumns();

  if (isError) {
    return (
      <EmptyState
        title="오류 발생"
        description="프로젝트 정보를 불러올 수 없습니다"
        icon={AlertCircle}
      />
    );
  }

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-muted-foreground">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.projectName}
        description={`프로젝트 상세 정보 - ${project.buildingName}`}
        icon={Eye}
        actions={
          <Button onClick={() => router.push(`/fieldwork/projects/${projectId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        }
      />

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">기본정보</TabsTrigger>
          <TabsTrigger value="accounts">참여자</TabsTrigger>
        </TabsList>

        {/* 기본정보 탭 */}
        <TabsContent value="info" className="space-y-6">
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">상태</dt>
                <dd className="mt-1">
                  <StatusBadge
                    status={FieldProjectStatusStyle[project.status]}
                    label={FieldProjectStatusLabel[project.status]}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">빌딩</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {project.buildingName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">시작일</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {project.startDate.split("T")[0]}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">종료일</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {project.endDate.split("T")[0]}
                </dd>
              </div>
            </dl>

            {project.description && (
              <div className="border-t border-gray-200 pt-6">
                <dt className="text-sm font-medium text-muted-foreground">설명</dt>
                <dd className="mt-2 whitespace-pre-wrap text-foreground">
                  {project.description}
                </dd>
              </div>
            )}

            {(project.address || project.addressDetail) && (
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">주소</dt>
                  <dd className="mt-1 text-foreground">{project.address}</dd>
                </div>
                {project.addressDetail && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      상세주소
                    </dt>
                    <dd className="mt-1 text-foreground">{project.addressDetail}</dd>
                  </div>
                )}
              </div>
            )}

            {(project.latitude || project.longitude) && (
              <div className="border-t border-gray-200 pt-6">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {project.latitude && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">위도</dt>
                      <dd className="mt-1 font-medium text-foreground">
                        {project.latitude}
                      </dd>
                    </div>
                  )}
                  {project.longitude && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">경도</dt>
                      <dd className="mt-1 font-medium text-foreground">
                        {project.longitude}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {project.geofenceRadius && (
              <div className="border-t border-gray-200 pt-6">
                <dt className="text-sm font-medium text-muted-foreground">
                  Geofence 반경
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {project.geofenceRadius}m
                </dd>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 참여자 탭 */}
        <TabsContent value="accounts" className="space-y-6">
          {accounts.length === 0 ? (
            <EmptyState
              title="참여자가 없습니다"
              description="현재 프로젝트에 참여한 사람이 없습니다"
              icon={Inbox}
            />
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white">
              <DataTable columns={accountColumns} data={accounts} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
