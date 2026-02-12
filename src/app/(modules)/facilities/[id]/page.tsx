"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Building2,
  MapPin,
  Calendar,
  User,
  Wrench,
  Paperclip,
  AlertCircle,
  QrCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import { useFacilityView } from "@/lib/hooks/use-facilities";
import {
  FacilityStateLabel,
  FacilityStateStyle,
} from "@/lib/types/facility";

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
// 첨부파일 목록
// ============================================================================

function FileList({
  files,
}: {
  files: Array<{
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }>;
}) {
  if (!files || files.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <a
          key={file.id}
          href={file.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border p-2 hover:bg-muted"
        >
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 truncate text-sm">{file.fileName}</span>
          <span className="text-xs text-muted-foreground">
            {formatFileSize(file.fileSize)}
          </span>
        </a>
      ))}
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
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: facility, isLoading, isError } = useFacilityView(id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !facility) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="시설을 찾을 수 없습니다"
          description="요청하신 시설이 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/facilities"),
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
            onClick={() => router.push("/facilities")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{facility.name}</h1>
              <StatusBadge
                status={FacilityStateStyle[facility.state]}
                label={FacilityStateLabel[facility.state]}
              />
            </div>
            <p className="text-muted-foreground">
              #{facility.id} · {facility.facilityNo || "장비번호 없음"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/facilities/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          수정
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 좌측 메인 컨텐츠 */}
        <div className="md:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={Wrench}
                label="용도"
                value={facility.use}
              />
              <InfoItem
                icon={Building2}
                label="위치"
                value={
                  facility.buildingFloorName
                    ? `${facility.buildingFloorName}${
                        facility.buildingFloorZoneName
                          ? ` / ${facility.buildingFloorZoneName}`
                          : ""
                      }`
                    : "-"
                }
              />
              <InfoItem
                icon={Calendar}
                label="설치일"
                value={facility.installDate}
              />
              <InfoItem
                icon={Calendar}
                label="운전시작일"
                value={facility.startRunDate}
              />
              <InfoItem
                icon={User}
                label="담당자"
                value={facility.chargerName}
              />
              <InfoItem
                icon={User}
                label="작업팀"
                value={facility.buildingUserGroupName}
              />
            </CardContent>
          </Card>

          {/* 제조/납품 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>제조/납품 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={Calendar}
                label="제조일"
                value={facility.makeDate}
              />
              <InfoItem
                icon={Building2}
                label="납품업체"
                value={facility.sellCompany}
              />
              <InfoItem
                icon={MapPin}
                label="납품업체 연락처"
                value={facility.sellCompanyPhone}
              />
              <InfoItem
                icon={Wrench}
                label="시리얼번호"
                value={facility.snNo}
              />
              <InfoItem
                icon={Wrench}
                label="COP"
                value={facility.cop}
              />
              <InfoItem
                icon={Calendar}
                label="보증만료일"
                value={facility.guaranteeExpireDate}
              />
            </CardContent>
          </Card>

          {/* 첨부파일 */}
          {facility.facilityFileDTOs && facility.facilityFileDTOs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  첨부파일 ({facility.facilityFileDTOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileList files={facility.facilityFileDTOs} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* QR/NFC */}
          {facility.facilityQrNfcDTOs && facility.facilityQrNfcDTOs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR/NFC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {facility.facilityQrNfcDTOs.map((qrnfc) => (
                    <div
                      key={qrnfc.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span className="text-sm font-medium">{qrnfc.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {qrnfc.code}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 관제점 */}
          {facility.facilityControlPointDTOs &&
            facility.facilityControlPointDTOs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>관제점</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {facility.facilityControlPointDTOs.map((cp) => (
                      <div
                        key={cp.id}
                        className="rounded-md border p-2 text-sm"
                      >
                        {cp.controlPointName}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* 작성/수정 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">작성</p>
                <p className="font-medium">{facility.writerName}</p>
                <p className="text-xs text-muted-foreground">
                  {facility.writeDate}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">최종 수정</p>
                <p className="font-medium">{facility.lastModifierName}</p>
                <p className="text-xs text-muted-foreground">
                  {facility.lastModifyDate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
