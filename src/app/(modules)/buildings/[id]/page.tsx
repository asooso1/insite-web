"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Building2,
  Phone,
  MapPin,
  AlertCircle,
  Calendar,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import { useBuildingView } from "@/lib/hooks/use-buildings";
import { BuildingStateLabel, BuildingStateStyle } from "@/lib/types/building";

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
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
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
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function BuildingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: building, isLoading, isError } = useBuildingView(id);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !building) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="건물을 찾을 수 없습니다"
          description="요청하신 건물이 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/buildings"),
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
            onClick={() => router.push("/buildings")}
            aria-label="목록으로"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{building.name}</h1>
              <StatusBadge
                status={BuildingStateStyle[building.state]}
                label={BuildingStateLabel[building.state] ?? building.state}
              />
            </div>
            <p className="text-muted-foreground">
              고객사: {building.companyName || "-"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/buildings/${id}/edit`)}
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
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="건물명" value={building.name} />
              <InfoItem label="고객사" value={building.companyName} />
              <InfoItem label="건물 용도" value={building.buildingUseType} />
              <InfoItem label="대표 전화" value={building.officePhone} />
              <InfoItem label="홈페이지" value={building.homePage} />
              <InfoItem label="지역" value={building.wideAreaName ? `${building.wideAreaName} / ${building.baseAreaName}` : building.baseAreaName} />
            </CardContent>
          </Card>

          {/* 주소 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                위치
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="우편번호" value={building.zipCode} />
              <InfoItem label="지번주소" value={building.address} />
              <InfoItem label="도로명주소" value={building.addressRoad} />
              <InfoItem label="상세주소" value={building.addressDetail} />
              <InfoItem label="위도" value={building.latitude} />
              <InfoItem label="경도" value={building.longitude} />
            </CardContent>
          </Card>

          {/* 계약 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                계약 및 서비스
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="계약 시작일" value={building.contractTermStart} />
              <InfoItem
                label="계약 종료일"
                value={
                  <span className={building.serviceExpire ? "text-destructive font-semibold" : ""}>
                    {building.contractTermEnd || "-"}
                    {building.serviceExpire && " (만료)"}
                  </span>
                }
              />
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground mb-2">서비스</p>
                <div className="flex flex-wrap gap-2">
                  {building.serviceNcp && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">NCP</span>}
                  {building.serviceFms && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">FMS</span>}
                  {building.serviceRms && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">RMS</span>}
                  {building.serviceEms && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">EMS</span>}
                  {building.serviceBim && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">BIM</span>}
                  {building.servicePatrol && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">순찰</span>}
                  {!building.serviceNcp && !building.serviceFms && !building.serviceRms &&
                   !building.serviceEms && !building.serviceBim && !building.servicePatrol && (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 건축 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                건축 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem label="지상 층수" value={building.groundMaxFloor ? `${building.groundMaxFloor}층` : undefined} />
              <InfoItem label="지하 층수" value={building.basementMaxFloor ? `${building.basementMaxFloor}층` : undefined} />
              <InfoItem label="높이" value={building.height ? `${building.height}m` : undefined} />
              <InfoItem label="구조" value={building.structure} />
              <InfoItem label="건축면적" value={building.buildingAreaSize ? `${building.buildingAreaSize}㎡` : undefined} />
              <InfoItem label="연면적" value={building.totalFloorAreaSize ? `${building.totalFloorAreaSize}㎡` : undefined} />
            </CardContent>
          </Card>

          {/* 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">준공일</p>
                <p className="font-medium">{building.completeDate || "-"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">착공일</p>
                <p className="font-medium">{building.constructStartDate || "-"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">비고</p>
                <p className="text-sm">{building.note || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
