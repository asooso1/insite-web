"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Package,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Paperclip,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMaterialView, useAddMaterialStock } from "@/lib/hooks/use-materials";
import {
  MaterialStateLabel,
  MaterialStateStyle,
  MaterialTypeLabel,
  type MaterialType,
} from "@/lib/types/material";

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
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: material, isLoading, isError } = useMaterialView(id);
  const addStock = useAddMaterialStock();

  const [stockType, setStockType] = useState<"IN" | "OUT">("IN");
  const [stockCnt, setStockCnt] = useState("");
  const [stockReason, setStockReason] = useState("");

  const handleAddStock = useCallback(() => {
    const cnt = Number(stockCnt);
    if (!cnt || cnt <= 0) {
      alert("수량을 입력해주세요.");
      return;
    }
    addStock.mutate(
      {
        materialId: id,
        type: stockType,
        date: new Date().toISOString().split("T")[0] ?? "",
        cnt,
        reason: stockReason || undefined,
      },
      {
        onSuccess: () => {
          setStockCnt("");
          setStockReason("");
          alert(`${stockType === "IN" ? "입고" : "출고"} 처리되었습니다.`);
        },
      }
    );
  }, [id, stockType, stockCnt, stockReason, addStock]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !material) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="자재를 찾을 수 없습니다"
          description="요청하신 자재가 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/materials"),
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
            onClick={() => router.push("/materials")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{material.name}</h1>
              <StatusBadge
                status={MaterialStateStyle[material.state]}
                label={MaterialStateLabel[material.state] ?? material.state}
              />
            </div>
            <p className="text-muted-foreground">
              {MaterialTypeLabel[material.type as MaterialType] ?? material.typeName}
              {material.privateCode && ` · ${material.privateCode}`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/materials/${id}/edit`)}
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
              <InfoItem icon={Package} label="자재명" value={material.name} />
              <InfoItem
                icon={Package}
                label="유형"
                value={MaterialTypeLabel[material.type as MaterialType] ?? material.typeName}
              />
              <InfoItem icon={Package} label="관리코드" value={material.privateCode} />
              <InfoItem icon={Package} label="규격" value={material.standard} />
              <InfoItem icon={Package} label="단위" value={material.unit} />
              <InfoItem
                icon={Package}
                label="작업지시 연동"
                value={material.connectWorkOrderName}
              />
              <InfoItem
                icon={MapPin}
                label="위치"
                value={`${material.buildingName || "-"} · ${material.buildingFloorZoneDTO?.name || "-"}`}
              />
              <InfoItem
                icon={User}
                label="관리팀"
                value={material.buildingUserGroupDTO?.name}
              />
            </CardContent>
          </Card>

          {/* 설명 */}
          {material.description && (
            <Card>
              <CardHeader>
                <CardTitle>설명</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{material.description}</p>
              </CardContent>
            </Card>
          )}

          {/* 입출고 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>입출고 이력</CardTitle>
            </CardHeader>
            <CardContent>
              {material.materialInOutDTOs && material.materialInOutDTOs.length > 0 ? (
                <div className="space-y-2">
                  {material.materialInOutDTOs.map((record, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        {record.type === "입고" ? (
                          <ArrowDownToLine className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpFromLine className="h-4 w-4 text-orange-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {record.type} {record.cnt}개
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {record.reason || "-"} · {record.writerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">잔여 {record.stockCnt}개</p>
                        <p className="text-xs text-muted-foreground">
                          {record.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  입출고 이력이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 첨부파일 */}
          {material.materialFileDTOs && material.materialFileDTOs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  첨부파일 ({material.materialFileDTOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {material.materialFileDTOs.map((file) => (
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
          {/* 재고 현황 */}
          <Card>
            <CardHeader>
              <CardTitle>재고 현황</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold">{material.stockCnt}</p>
                <p className="text-sm text-muted-foreground">
                  적정 재고: {material.suitableStock || "-"}
                </p>
                {material.suitableStock > 0 &&
                  material.stockCnt < material.suitableStock && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      재고 부족
                    </p>
                  )}
              </div>

              <Separator />

              {/* 재고 조정 */}
              <div className="space-y-3">
                <p className="text-sm font-medium">재고 조정</p>
                <Select
                  value={stockType}
                  onValueChange={(v) => setStockType(v as "IN" | "OUT")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">입고</SelectItem>
                    <SelectItem value="OUT">출고</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="수량"
                  value={stockCnt}
                  onChange={(e) => setStockCnt(e.target.value)}
                />
                <Input
                  placeholder="사유"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                />
                <Button
                  className="w-full"
                  size="sm"
                  onClick={handleAddStock}
                  disabled={addStock.isPending}
                >
                  {stockType === "IN" ? (
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                  ) : (
                    <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  )}
                  {stockType === "IN" ? "입고 처리" : "출고 처리"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">작성</p>
                <p className="font-medium">{material.writerName}</p>
                <p className="text-xs text-muted-foreground">
                  {material.writeDate}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">최종 수정</p>
                <p className="font-medium">{material.lastModifierName}</p>
                <p className="text-xs text-muted-foreground">
                  {material.lastModifyDate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
