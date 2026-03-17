"use client";

import { useParams } from "next/navigation";
import { AlertCircle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";

import { useComplainView } from "@/lib/hooks/use-complains";
import {
  VocStateLabel,
  VocStateStyle,
} from "@/lib/types/complain";

export default function ComplainDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError, refetch } = useComplainView(id);

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="민원을 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 h-96">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="민원이 없습니다"
        description="존재하지 않는 민원입니다."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{data.title}</CardTitle>
            <StatusBadge
              status={VocStateStyle[data.state]}
              label={VocStateLabel[data.state]}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">민원인</p>
              <p className="font-medium">{data.vocUserName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">연락처</p>
              <p className="font-medium">{data.vocUserPhone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">빌딩</p>
              <p className="font-medium">{data.buildingDTO.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">층</p>
              <p className="font-medium">{data.buildingFloorDTO.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">구역</p>
              <p className="font-medium">{data.buildingFloorZoneDTO.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">민원일시</p>
              <p className="font-medium">{data.vocDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 요청 내용 */}
      <Card>
        <CardHeader>
          <CardTitle>요청 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{data.requestContents}</p>
        </CardContent>
      </Card>

      {/* 연결된 수시업무 */}
      {data.workOrderVocDTOs && data.workOrderVocDTOs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>연결된 수시업무</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.workOrderVocDTOs.map((wo) => (
                <div
                  key={wo.workOrderId}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm font-medium">{wo.workOrderName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={`/work-orders/${wo.workOrderId}`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 첨부파일 */}
      {data.files && data.files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>첨부파일</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="text-sm font-medium">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={file.fileUrl} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
