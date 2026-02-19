"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Building2,
  AlertCircle,
  Paperclip,
  Eye,
  Trash2,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useReferenceDataView,
  useDeleteReferenceData,
} from "@/lib/hooks/use-boards";

// ============================================================================
// 정보 항목 컴포넌트
// ============================================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

// ============================================================================
// 로딩 스켈레톤
// ============================================================================

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function ReferenceDataDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: refData, isLoading, isError } = useReferenceDataView(id);
  const deleteData = useDeleteReferenceData();

  const handleDelete = useCallback(() => {
    if (confirm("이 자료를 삭제하시겠습니까?")) {
      deleteData.mutate(id, {
        onSuccess: () => router.push("/boards"),
      });
    }
  }, [id, deleteData, router]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !refData) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="자료를 찾을 수 없습니다"
          description="요청하신 자료가 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/boards"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/boards")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{refData.title}</h1>
            <p className="text-muted-foreground">
              {refData.writerName} · {refData.writeDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/boards/data/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button
            variant="outline"
            className="text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 좌측 메인 컨텐츠 */}
        <div className="md:col-span-2 space-y-6">
          {/* 본문 */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {refData.contents}
              </div>
            </CardContent>
          </Card>

          {/* 첨부파일 */}
          {refData.referenceDataFileDTOs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  첨부파일 ({refData.referenceDataFileDTOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {refData.referenceDataFileDTOs.map((file) => (
                    <a
                      key={file.id}
                      href={file.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md border p-2 hover:bg-muted"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate text-sm">
                        {file.originFileName}
                      </span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 게시 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>게시 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={Building2}
                label="대상 고객사"
                value={refData.allCompany ? "전체" : refData.referenceDataCompanyName}
              />
              <InfoItem
                icon={Building2}
                label="대상 빌딩"
                value={refData.referenceDataBuildingName ?? "전체"}
              />
              <InfoItem
                icon={Eye}
                label="조회수"
                value={`${refData.viewCnt}회`}
              />
            </CardContent>
          </Card>

          {/* 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={User}
                label="작성자"
                value={
                  <span>
                    {refData.writerName}
                    <span className="text-xs text-muted-foreground block">
                      {refData.writerCompanyName} · {refData.writeDate}
                    </span>
                  </span>
                }
              />
              <Separator />
              <InfoItem
                icon={User}
                label="최종 수정자"
                value={
                  <span>
                    {refData.lastModifierName}
                    <span className="text-xs text-muted-foreground block">
                      {refData.lastModifierCompanyName} · {refData.lastModifyDate}
                    </span>
                  </span>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
