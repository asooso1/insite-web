"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  User,
  Paperclip,
  FileText,
  AlertCircle,
  Send,
  CheckCircle,
} from "lucide-react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useWorkOrderView,
  useIssueWorkOrder,
  useRequestCompleteWorkOrder,
} from "@/lib/hooks/use-work-orders";
import {
  WorkOrderState,
  WorkOrderStateLabel,
  WorkOrderStateStyle,
  WorkOrderTypeLabel,
} from "@/lib/types/work-order";

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
// HTML 컨텐츠
// DOMPurify로 XSS 방어 후 렌더링 (ALLOWED_TAGS/ATTR 허용 목록 적용)
// ============================================================================

function SafeHtmlContent({ html }: { html: string | null | undefined }): React.JSX.Element {
  if (!html) {
    return <p className="text-sm text-muted-foreground">내용 없음</p>;
  }

  // DOMPurify allowlist 기반 sanitize - XSS 안전
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ul", "ol", "li",
      "h1", "h2", "h3", "blockquote", "pre", "code", "a"],
    ALLOWED_ATTR: ["href", "class"],
  });

  // DOMPurify 허용 목록 sanitize 완료된 HTML만 삽입 (XSS 안전)
  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

// ============================================================================
// 작업 이력 타임라인
// ============================================================================

const ACTION_LABEL: Record<string, string> = {
  WRITE: "작성", ISSUE: "발행", VIEW: "확인", START: "시작",
  DONE: "완료", REQ_COMPLETE: "완료 요청", APPROVE: "승인",
  REJECT: "반려", CANCEL: "취소",
};

function Timeline({
  actionDates,
}: {
  actionDates: Array<{
    id: number;
    type: string;
    workOrderActionDate: string;
    actorAccountName: string;
    actorAccountCompanyName: string;
  }>;
}): React.JSX.Element | null {
  if (!actionDates || actionDates.length === 0) return null;

  return (
    <div className="space-y-3">
      {actionDates.map((action, index) => (
        <div key={action.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
            {index < actionDates.length - 1 && (
              <div className="w-px flex-1 bg-border mt-1" />
            )}
          </div>
          <div className="flex-1 pb-3">
            <p className="text-sm font-medium">{ACTION_LABEL[action.type] ?? action.type}</p>
            <p className="text-xs text-muted-foreground">
              {action.actorAccountName} ({action.actorAccountCompanyName})
            </p>
            <p className="text-xs text-muted-foreground">{action.workOrderActionDate}</p>
          </div>
        </div>
      ))}
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

export default function MobileWorkOrderDetailPage(): React.JSX.Element {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError, refetch } = useWorkOrderView(id);
  const issueWorkOrder = useIssueWorkOrder();
  const requestComplete = useRequestCompleteWorkOrder();

  if (isLoading) {
    return (
      <MobileShell headerTitle="작업 상세" showBack hideBottomNav>
        <DetailSkeleton />
      </MobileShell>
    );
  }

  if (isError || !data) {
    return (
      <MobileShell headerTitle="작업 상세" showBack hideBottomNav>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">작업을 찾을 수 없습니다.</p>
          <button onClick={() => refetch()} className="text-sm text-primary underline">
            다시 시도
          </button>
        </div>
      </MobileShell>
    );
  }

  const { workOrderDTO, buildingDTO, workOrderItemListDTOs } = data;

  const handleIssue = (): void => {
    issueWorkOrder.mutate(workOrderDTO.id, { onSuccess: () => refetch() });
  };

  const handleRequestComplete = (): void => {
    requestComplete.mutate(workOrderDTO.id, { onSuccess: () => refetch() });
  };

  return (
    <MobileShell headerTitle="작업 상세" showBack hideBottomNav>
      <div className="flex flex-col gap-4">
        {/* 제목 & 상태 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge
              status={WorkOrderStateStyle[workOrderDTO.state]}
              label={WorkOrderStateLabel[workOrderDTO.state]}
            />
            <span className="text-xs text-muted-foreground">
              {WorkOrderTypeLabel[workOrderDTO.type]}
            </span>
          </div>
          <h1 className="text-lg font-bold leading-tight">{workOrderDTO.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            #{workOrderDTO.id} · {workOrderDTO.firstClassName} &gt; {workOrderDTO.secondClassName}
          </p>
        </div>

        {/* 상태별 액션 버튼 */}
        {workOrderDTO.state === WorkOrderState.WRITE && (
          <button
            onClick={handleIssue}
            disabled={issueWorkOrder.isPending}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            발행
          </button>
        )}
        {workOrderDTO.state === WorkOrderState.PROCESSING && (
          <button
            onClick={handleRequestComplete}
            disabled={requestComplete.isPending}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
          >
            <CheckCircle className="h-4 w-4" />
            완료 요청
          </button>
        )}

        {/* 기본 정보 */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 divide-y divide-border">
            <InfoRow icon={Building2} label="빌딩" value={buildingDTO.name} />
            <InfoRow
              icon={MapPin}
              label="위치"
              value={
                workOrderDTO.buildingFloorName
                  ? `${workOrderDTO.buildingFloorName}${
                      workOrderDTO.buildingFloorZoneName
                        ? ` / ${workOrderDTO.buildingFloorZoneName}`
                        : ""
                    }`
                  : "-"
              }
            />
            <InfoRow
              icon={Calendar}
              label="작업 예정일"
              value={
                workOrderDTO.planStartDate !== "-"
                  ? `${workOrderDTO.planStartDate.split(" ")[0]}${
                      workOrderDTO.planEndDate !== "-"
                        ? ` ~ ${workOrderDTO.planEndDate.split(" ")[0]}`
                        : ""
                    }`
                  : "-"
              }
            />
            <InfoRow
              icon={Clock}
              label="작업기한"
              value={workOrderDTO.deadline > 0 ? `${workOrderDTO.deadline}일` : "-"}
            />
            <InfoRow icon={User} label="작성자" value={workOrderDTO.writerName} />
          </CardContent>
        </Card>

        {/* 작업 내용 */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">작업 내용</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <SafeHtmlContent html={workOrderDTO.description} />
          </CardContent>
        </Card>

        {/* 첨부파일 */}
        {workOrderDTO.workOrderFileDTOs && workOrderDTO.workOrderFileDTOs.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                첨부파일 ({workOrderDTO.workOrderFileDTOs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {workOrderDTO.workOrderFileDTOs.map((file) => (
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

        {/* 점검 항목 */}
        {workOrderItemListDTOs && workOrderItemListDTOs.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-1">
                <FileText className="h-4 w-4" />
                점검 항목 ({workOrderItemListDTOs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {workOrderItemListDTOs.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-md border p-3">
                  <div
                    className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      item.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="flex-1 text-sm">{item.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 작업 이력 */}
        {workOrderDTO.workOrderActionDateDTOs &&
          workOrderDTO.workOrderActionDateDTOs.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">작업 이력</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Timeline actionDates={workOrderDTO.workOrderActionDateDTOs} />
            </CardContent>
          </Card>
        )}
      </div>
    </MobileShell>
  );
}
