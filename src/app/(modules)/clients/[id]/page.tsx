"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useClientView, useDeleteClient } from "@/lib/hooks/use-clients";
import {
  CompanyStateLabel,
  CompanyStateStyle,
} from "@/lib/types/client";

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
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
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

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: client, isLoading, isError } = useClientView(id);
  const deleteClient = useDeleteClient();

  const handleDelete = () => {
    deleteClient.mutate(id, {
      onSuccess: () => {
        router.push("/clients");
      },
    });
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !client) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="클라이언트를 찾을 수 없습니다"
          description="요청하신 클라이언트가 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/clients"),
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
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <StatusBadge
                status={CompanyStateStyle[client.state]}
                label={CompanyStateLabel[client.state]}
              />
            </div>
            <p className="text-muted-foreground">
              사업자번호: {client.businessNo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/clients/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>클라이언트를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. {client.name} 클라이언트가
                  삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
              <InfoItem icon={Building2} label="회사명" value={client.name} />
              <InfoItem
                icon={FileText}
                label="사업자번호"
                value={client.businessNo}
              />
              <InfoItem icon={Phone} label="대표연락처" value={client.phone} />
              <InfoItem icon={Phone} label="팩스" value={client.fax} />
              <InfoItem
                icon={MapPin}
                label="주소"
                value={
                  client.address
                    ? `${client.address} ${client.addressDetail || ""}`
                    : "-"
                }
              />
            </CardContent>
          </Card>

          {/* 담당자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>담당자 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={Building2}
                label="담당자명"
                value={client.officerName}
              />
              <InfoItem
                icon={Phone}
                label="담당자 전화"
                value={client.officerPhone}
              />
              <InfoItem
                icon={Phone}
                label="담당자 휴대전화"
                value={client.officerMobile}
              />
              <InfoItem
                icon={Mail}
                label="담당자 이메일"
                value={client.officerEmail}
              />
            </CardContent>
          </Card>

          {/* 등록 건물 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                등록 건물 ({client.buildingDTO?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.buildingDTO && client.buildingDTO.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium text-muted-foreground">
                          건물명
                        </th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">
                          지역
                        </th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">
                          계약기간
                        </th>
                        <th className="pb-2 text-right font-medium text-muted-foreground">
                          시설
                        </th>
                        <th className="pb-2 text-right font-medium text-muted-foreground">
                          관제점
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.buildingDTO.map((building) => (
                        <tr key={building.id} className="border-b last:border-0">
                          <td className="py-2 font-medium">{building.name}</td>
                          <td className="py-2 text-muted-foreground">
                            {building.wideAreaName} {building.baseAreaName}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {building.contractTermStart} ~ {building.contractTermEnd}
                          </td>
                          <td className="py-2 text-right">
                            {building.facilityCount}
                          </td>
                          <td className="py-2 text-right">
                            {building.controlPointCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  등록된 건물이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 비고 */}
          {client.note && (
            <Card>
              <CardHeader>
                <CardTitle>비고</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{client.note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 로고 */}
          {client.companyLogoDTO && (
            <Card>
              <CardHeader>
                <CardTitle>로고</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-md border p-4">
                  <img
                    src={client.companyLogoDTO.fileUrl}
                    alt={`${client.name} 로고`}
                    className="max-h-24 object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 거점 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                거점 ({client.baseAreaList?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.baseAreaList && client.baseAreaList.length > 0 ? (
                <div className="space-y-2">
                  {client.baseAreaList.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span className="text-sm font-medium">{area.name}</span>
                      <StatusBadge
                        status={area.state === "USE" ? "completed" : "cancelled"}
                        label={area.state === "USE" ? "사용" : "중지"}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  등록된 거점이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">등록</p>
                <p className="font-medium">{client.writerName}</p>
                <p className="text-xs text-muted-foreground">
                  {client.writeDate}
                </p>
              </div>
              {client.contractDate && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">최초 계약일</p>
                    <p className="font-medium">{client.contractDate}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
