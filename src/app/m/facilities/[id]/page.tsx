"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Calendar,
  User,
  Wrench,
  Paperclip,
  AlertCircle,
  QrCode,
} from "lucide-react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFacilityView } from "@/lib/hooks/use-facilities";
import { FacilityStateLabel, FacilityStateStyle } from "@/lib/types/facility";

// ============================================================================
// 정보 항목
// ============================================================================

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value ?? "-"}</p>
      </div>
    </div>
  );
}

// ============================================================================
// 로딩 스켈레톤
// ============================================================================

function DetailSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function MobileFacilityDetailPage(): React.JSX.Element {
  const params = useParams();
  const id = Number(params.id);

  const { data: facility, isLoading, isError, refetch } = useFacilityView(id);

  if (isLoading) {
    return (
      <MobileShell headerTitle="시설 상세" showBack hideBottomNav>
        <DetailSkeleton />
      </MobileShell>
    );
  }

  if (isError || !facility) {
    return (
      <MobileShell headerTitle="시설 상세" showBack hideBottomNav>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">시설을 찾을 수 없습니다.</p>
          <button onClick={() => refetch()} className="text-sm text-primary underline">
            다시 시도
          </button>
        </div>
      </MobileShell>
    );
  }

  const location = facility.buildingFloorName
    ? `${facility.buildingFloorName}${
        facility.buildingFloorZoneName ? ` / ${facility.buildingFloorZoneName}` : ""
      }`
    : "-";

  return (
    <MobileShell headerTitle="시설 상세" showBack hideBottomNav>
      <div className="flex flex-col gap-4">
        {/* 제목 & 상태 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge
              status={FacilityStateStyle[facility.state]}
              label={FacilityStateLabel[facility.state]}
            />
          </div>
          <h1 className="text-lg font-bold leading-tight">{facility.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            #{facility.id} · {facility.facilityNo || "장비번호 없음"}
          </p>
        </div>

        {/* 기본 정보 */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 divide-y divide-border">
            <InfoRow icon={Wrench} label="용도" value={facility.use} />
            <InfoRow icon={MapPin} label="위치" value={location} />
            <InfoRow icon={Calendar} label="설치일" value={facility.installDate} />
            <InfoRow icon={Calendar} label="운전시작일" value={facility.startRunDate} />
            <InfoRow icon={User} label="담당자" value={facility.chargerName} />
            <InfoRow icon={User} label="작업팀" value={facility.buildingUserGroupName} />
          </CardContent>
        </Card>

        {/* 제조/납품 정보 */}
        {(facility.sellCompany || facility.snNo || facility.makeDate) && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">제조/납품 정보</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 divide-y divide-border">
              {facility.sellCompany && (
                <InfoRow icon={Wrench} label="납품사" value={facility.sellCompany} />
              )}
              {facility.makeDate && (
                <InfoRow icon={Calendar} label="제조일" value={facility.makeDate} />
              )}
              {facility.snNo && (
                <InfoRow icon={Wrench} label="시리얼번호" value={facility.snNo} />
              )}
              {facility.cop && (
                <InfoRow icon={Wrench} label="용량" value={facility.cop} />
              )}
            </CardContent>
          </Card>
        )}

        {/* QR/NFC */}
        {facility.facilityQrNfcDTOs && facility.facilityQrNfcDTOs.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-1">
                <QrCode className="h-4 w-4" />
                QR/NFC ({facility.facilityQrNfcDTOs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {facility.facilityQrNfcDTOs.map((qr) => (
                <div key={qr.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{qr.type}</p>
                    <p className="text-sm font-mono">{qr.code}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 첨부파일 */}
        {facility.facilityFileDTOs && facility.facilityFileDTOs.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                첨부파일 ({facility.facilityFileDTOs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {facility.facilityFileDTOs.map((file) => (
                <a
                  key={file.id}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border p-2 text-sm active:bg-accent"
                >
                  <Paperclip className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{file.fileName}</span>
                </a>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </MobileShell>
  );
}
