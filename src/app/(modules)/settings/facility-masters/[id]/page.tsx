"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Copy,
  Wrench,
  User,
  AlertCircle,
  Paperclip,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useFacilityMasterView,
  useCopyFacilityMaster,
} from "@/lib/hooks/use-settings";
import { FuelTypeLabel, type FuelType } from "@/lib/types/setting";

// ============================================================================
// 정보 항목 컴포넌트
// ============================================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function FacilityMasterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: master, isLoading, isError } = useFacilityMasterView(id);
  const copyMaster = useCopyFacilityMaster();

  const handleCopy = useCallback(() => {
    if (confirm("이 표준 설비를 복사하시겠습니까?")) {
      copyMaster.mutate(id, {
        onSuccess: () => {
          alert("복사되었습니다.");
          router.push("/settings");
        },
      });
    }
  }, [id, copyMaster, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !master) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="표준 설비를 찾을 수 없습니다"
          description="요청하신 표준 설비가 존재하지 않습니다."
          action={{
            label: "설정으로 돌아가기",
            onClick: () => router.push("/settings"),
          }}
        />
      </div>
    );
  }

  const categoryPath = [
    master.facilityCategory1Name,
    master.facilityCategory2Name,
    master.facilityCategory3Name,
  ]
    .filter(Boolean)
    .join(" > ");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/settings")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{master.name}</h1>
            <p className="text-muted-foreground">{categoryPath || "미분류"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            복사
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/settings/facility-masters/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 좌측 메인 */}
        <div className="md:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="제품명" value={master.name} />
              <InfoItem label="용도" value={master.use} />
              <InfoItem label="제조업체" value={master.makingCompany} />
              <InfoItem label="제조업체 전화" value={master.makingCompanyPhone} />
              <InfoItem label="모델" value={master.modelName} />
              <InfoItem
                label="연료 유형"
                value={
                  FuelTypeLabel[master.fuelType as FuelType] ??
                  master.fuelTypeName
                }
              />
              <InfoItem label="정격전력" value={master.electricityConsumption} />
              <InfoItem label="용량" value={master.capacity} />
              <InfoItem label="설비 분류" value={categoryPath} />
            </CardContent>
          </Card>

          {/* 이미지 파일 */}
          {master.imageFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  이미지 ({master.imageFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-3">
                  {master.imageFiles.map((file) => (
                    <a
                      key={file.id}
                      href={file.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md border overflow-hidden hover:opacity-80"
                    >
                      <img
                        src={file.filePath}
                        alt={file.originFileName}
                        className="w-full h-32 object-cover"
                      />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 첨부파일 */}
          {master.facilityMasterFileDTOs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  첨부파일 ({master.facilityMasterFileDTOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {master.facilityMasterFileDTOs.map((file) => (
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
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">작성자</p>
                <p className="font-medium">{master.writerName}</p>
                <p className="text-xs text-muted-foreground">{master.writeDate}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">최종 수정자</p>
                <p className="font-medium">{master.lastModifierName}</p>
                <p className="text-xs text-muted-foreground">{master.lastModifyDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
