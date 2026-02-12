"use client";

import { useParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Edit,
  Copy,
  Ban,
  CheckCircle,
  Send,
  Clock,
  User,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Paperclip,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useWorkOrderView,
  useIssueWorkOrder,
  useRequestCompleteWorkOrder,
  useCopyWorkOrder,
} from "@/lib/hooks/use-work-orders";
import {
  WorkOrderState,
  WorkOrderStateLabel,
  WorkOrderStateStyle,
  WorkOrderTypeLabel,
} from "@/lib/types/work-order";

// ============================================================================
// 상태별 액션 버튼
// ============================================================================

function ActionButtons({
  state,
  workOrderId,
  onRefetch,
}: {
  state: WorkOrderState;
  workOrderId: number;
  onRefetch: () => void;
}) {
  const router = useRouter();
  const issueWorkOrder = useIssueWorkOrder();
  const requestComplete = useRequestCompleteWorkOrder();
  const copyWorkOrder = useCopyWorkOrder();

  const handleIssue = () => {
    issueWorkOrder.mutate(workOrderId, {
      onSuccess: () => onRefetch(),
    });
  };

  const handleRequestComplete = () => {
    requestComplete.mutate(workOrderId, {
      onSuccess: () => onRefetch(),
    });
  };

  const handleCopy = () => {
    copyWorkOrder.mutate(workOrderId, {
      onSuccess: () => router.push("/work-orders"),
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* 상태별 주요 액션 */}
      {state === WorkOrderState.WRITE && (
        <Button onClick={handleIssue} disabled={issueWorkOrder.isPending}>
          <Send className="mr-2 h-4 w-4" />
          발행
        </Button>
      )}
      {state === WorkOrderState.PROCESSING && (
        <Button
          onClick={handleRequestComplete}
          disabled={requestComplete.isPending}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          완료 요청
        </Button>
      )}
      {state === WorkOrderState.REQ_COMPLETE && (
        <Button onClick={() => router.push(`/work-orders/${workOrderId}/approve`)}>
          <CheckCircle className="mr-2 h-4 w-4" />
          승인
        </Button>
      )}

      {/* 수정 버튼 (작성/발행 상태에서만) */}
      {(state === WorkOrderState.WRITE || state === WorkOrderState.ISSUE) && (
        <Button
          variant="outline"
          onClick={() => router.push(`/work-orders/${workOrderId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          수정
        </Button>
      )}

      {/* 더보기 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            복사
          </DropdownMenuItem>
          {state !== WorkOrderState.CANCEL &&
            state !== WorkOrderState.COMPLETE && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Ban className="mr-2 h-4 w-4" />
                  취소
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

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
// 담당자 목록
// ============================================================================

function AccountList({
  title,
  accounts,
}: {
  title: string;
  accounts: Array<{
    id: number;
    accountName: string;
    companyName: string;
    roleName: string;
  }>;
}) {
  if (!accounts || accounts.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="space-y-1">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center gap-2 text-sm"
          >
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{account.accountName}</span>
            <span className="text-muted-foreground">
              ({account.companyName} / {account.roleName})
            </span>
          </div>
        ))}
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
// 작업 이력 타임라인
// ============================================================================

function WorkOrderTimeline({
  actionDates,
}: {
  actionDates: Array<{
    id: number;
    type: string;
    workOrderActionDate: string;
    actorAccountName: string;
    actorAccountCompanyName: string;
  }>;
}) {
  if (!actionDates || actionDates.length === 0) return null;

  const actionTypeLabel: Record<string, string> = {
    WRITE: "작성",
    ISSUE: "발행",
    VIEW: "확인",
    START: "시작",
    DONE: "완료",
    REQ_COMPLETE: "완료 요청",
    APPROVE: "승인",
    REJECT: "반려",
    CANCEL: "취소",
  };

  return (
    <div className="space-y-3">
      {actionDates.map((action, index) => (
        <div key={action.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-primary" />
            {index < actionDates.length - 1 && (
              <div className="w-px flex-1 bg-border" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="font-medium">
              {actionTypeLabel[action.type] || action.type}
            </p>
            <p className="text-sm text-muted-foreground">
              {action.actorAccountName} ({action.actorAccountCompanyName})
            </p>
            <p className="text-xs text-muted-foreground">
              {action.workOrderActionDate}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// HTML 컨텐츠 렌더러 (DOMPurify로 sanitize)
// ============================================================================

function SafeHtmlContent({ html }: { html: string | null | undefined }) {
  if (!html) {
    return <p className="text-muted-foreground">내용 없음</p>;
  }

  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
      "a", "img", "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class"],
  });

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
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

export default function WorkOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data, isLoading, isError, refetch } = useWorkOrderView(id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="작업을 찾을 수 없습니다"
          description="요청하신 작업이 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/work-orders"),
          }}
        />
      </div>
    );
  }

  const { workOrderDTO, buildingDTO, workOrderItemListDTOs } = data;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/work-orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{workOrderDTO.name}</h1>
              <StatusBadge
                status={WorkOrderStateStyle[workOrderDTO.state]}
                label={WorkOrderStateLabel[workOrderDTO.state]}
              />
            </div>
            <p className="text-muted-foreground">
              #{workOrderDTO.id} · {WorkOrderTypeLabel[workOrderDTO.type]} ·{" "}
              {workOrderDTO.firstClassName} &gt; {workOrderDTO.secondClassName}
            </p>
          </div>
        </div>
        <ActionButtons
          state={workOrderDTO.state}
          workOrderId={workOrderDTO.id}
          onRefetch={refetch}
        />
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
                icon={Building2}
                label="빌딩"
                value={buildingDTO.name}
              />
              <InfoItem
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
              <InfoItem
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
              <InfoItem
                icon={Clock}
                label="작업기한"
                value={
                  workOrderDTO.deadline > 0
                    ? `${workOrderDTO.deadline}일`
                    : "-"
                }
              />
              <InfoItem
                icon={User}
                label="작업팀"
                value={workOrderDTO.buildingUserGroupName}
              />
              <InfoItem
                icon={User}
                label="작성자"
                value={`${workOrderDTO.writerName} (${workOrderDTO.writerCompanyName})`}
              />
            </CardContent>
          </Card>

          {/* 작업 내용 */}
          <Card>
            <CardHeader>
              <CardTitle>작업 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <SafeHtmlContent html={workOrderDTO.description} />
            </CardContent>
          </Card>

          {/* 첨부파일 */}
          {workOrderDTO.workOrderFileDTOs &&
            workOrderDTO.workOrderFileDTOs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    첨부파일 ({workOrderDTO.workOrderFileDTOs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileList files={workOrderDTO.workOrderFileDTOs} />
                </CardContent>
              </Card>
            )}

          {/* 점검 항목 */}
          {workOrderItemListDTOs && workOrderItemListDTOs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  점검 항목 ({workOrderItemListDTOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workOrderItemListDTOs.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-md border p-3"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.typeName}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 작업 결과 */}
          {workOrderDTO.workOrderResultDTOs &&
            workOrderDTO.workOrderResultDTOs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>작업 결과</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workOrderDTO.workOrderResultDTOs.map((result) => (
                    <div key={result.id} className="space-y-2 rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {result.createDate}
                        </span>
                      </div>
                      <p>{result.description}</p>
                      {result.files && result.files.length > 0 && (
                        <FileList files={result.files} />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 담당자 */}
          <Card>
            <CardHeader>
              <CardTitle>담당자</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AccountList
                title="담당자"
                accounts={workOrderDTO.workOrderChargeAccountDTOs}
              />
              <Separator />
              <AccountList
                title="참조"
                accounts={workOrderDTO.workOrderCcAccountDTOs}
              />
              <Separator />
              <AccountList
                title="승인자"
                accounts={workOrderDTO.workOrderApproveAccountDTOs}
              />
            </CardContent>
          </Card>

          {/* 작업 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>작업 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkOrderTimeline
                actionDates={workOrderDTO.workOrderActionDateDTOs}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
