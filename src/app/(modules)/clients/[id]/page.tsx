"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Plus,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useClientView,
  useAddBaseArea,
  useEditBaseAreaState,
} from "@/lib/hooks/use-clients";
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
  const addBaseArea = useAddBaseArea();
  const editBaseAreaState = useEditBaseAreaState(id);

  const [newBaseAreaName, setNewBaseAreaName] = useState("");

  const handleAddBaseArea = useCallback(() => {
    if (!newBaseAreaName.trim()) {
      alert("거점명을 입력해주세요.");
      return;
    }
    addBaseArea.mutate(
      { companyId: id, baseAreaName: newBaseAreaName.trim() },
      { onSuccess: () => setNewBaseAreaName("") }
    );
  }, [id, newBaseAreaName, addBaseArea]);

  const handleToggleBaseAreaState = useCallback(
    (baseAreaId: number, name: string, currentState: string) => {
      const newState = currentState === "USE" ? "STOP" : "USE";
      editBaseAreaState.mutate({
        baseAreas: [{ id: baseAreaId, name, state: newState }],
      });
    },
    [editBaseAreaState]
  );

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !client) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="고객사를 찾을 수 없습니다"
          description="요청하신 고객사가 존재하지 않거나 접근 권한이 없습니다."
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
                label={CompanyStateLabel[client.state] ?? client.state}
              />
            </div>
            <p className="text-muted-foreground">
              사업자번호: {client.businessNo || "-"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/clients/${id}/edit`)}
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
              <InfoItem icon={Building2} label="회사명" value={client.name} />
              <InfoItem
                icon={Building2}
                label="사업자번호"
                value={client.businessNo}
              />
              <InfoItem icon={Phone} label="대표 전화" value={client.phone} />
              <InfoItem icon={Phone} label="FAX" value={client.fax} />
              <InfoItem
                icon={MapPin}
                label="주소"
                value={
                  client.address
                    ? `${client.addressRoad || client.address} ${client.addressDetail || ""}`
                    : "-"
                }
              />
              <InfoItem
                icon={MapPin}
                label="우편번호"
                value={client.zipCode}
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
                icon={User}
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
                label="담당자 휴대폰"
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
          {client.buildingList && client.buildingList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  등록 건물 ({client.buildingList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {client.buildingList.map((building) => (
                    <div
                      key={building.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="font-medium">{building.name}</p>
                        {building.address && (
                          <p className="text-sm text-muted-foreground">
                            {building.address}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 거점 관리 */}
          <Card>
            <CardHeader>
              <CardTitle>거점 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 거점 등록 */}
              <div className="flex gap-2">
                <Input
                  placeholder="거점명 입력"
                  value={newBaseAreaName}
                  onChange={(e) => setNewBaseAreaName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddBaseArea()}
                />
                <Button
                  size="sm"
                  onClick={handleAddBaseArea}
                  disabled={addBaseArea.isPending}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* 거점 목록 */}
              {client.baseAreaList && client.baseAreaList.length > 0 ? (
                <div className="space-y-2">
                  {client.baseAreaList.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span className="text-sm font-medium">{area.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleBaseAreaState(area.id, area.name, area.state)
                        }
                        className={
                          area.state === "USE"
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        {area.state === "USE" ? "사용중" : "중지"}
                      </Button>
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
                <p className="font-medium">{client.writerName || "-"}</p>
                <p className="text-xs text-muted-foreground">
                  {client.writeDate
                    ? String(client.writeDate).split("T")[0]
                    : "-"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">최종 수정</p>
                <p className="text-xs text-muted-foreground">
                  {client.lastModifyDate
                    ? String(client.lastModifyDate).split("T")[0]
                    : "-"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">비고</p>
                <p className="text-sm">{client.note || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
