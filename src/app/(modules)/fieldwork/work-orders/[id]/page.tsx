"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Edit, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/data-display/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useFieldWorkOrder, useAddFieldWorkOrderComment, useDeleteFieldWorkOrderComment } from "@/lib/hooks/use-field-work-orders";
import {
  FieldWorkOrderStatusLabel,
  FieldWorkOrderStatusStyle,
  FieldWorkOrderPriorityLabel,
  FieldWorkOrderPriorityStyle,
} from "@/lib/types/field-work-order";
import { StatusBadge } from "@/components/data-display/status-badge";

// ============================================================================
// 메인 페이지
// ============================================================================

export default function FieldWorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const workOrderId = Number(id);

  const { data: workOrder, isLoading, isError } = useFieldWorkOrder(workOrderId);
  const addCommentMutation = useAddFieldWorkOrderComment();
  const deleteCommentMutation = useDeleteFieldWorkOrderComment();

  const [commentContent, setCommentContent] = useState("");

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        workOrderId,
        content: commentContent,
      });
      setCommentContent("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (isError) {
    return (
      <EmptyState
        title="오류 발생"
        description="작업지시 정보를 불러올 수 없습니다"
        icon={AlertCircle}
      />
    );
  }

  if (isLoading || !workOrder) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-muted-foreground">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={workOrder.title}
        description={`프로젝트: ${workOrder.projectName}`}
        icon={Eye}
        actions={
          <Button onClick={() => router.push(`/fieldwork/work-orders/${workOrderId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        }
      />

      {/* 기본 정보 섹션 */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-foreground">기본 정보</h3>

        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">상태</dt>
            <dd className="mt-1">
              <StatusBadge
                status={FieldWorkOrderStatusStyle[workOrder.status]}
                label={FieldWorkOrderStatusLabel[workOrder.status]}
              />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">우선순위</dt>
            <dd className="mt-1">
              <StatusBadge
                status={FieldWorkOrderPriorityStyle[workOrder.priority]}
                label={FieldWorkOrderPriorityLabel[workOrder.priority]}
              />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">프로젝트</dt>
            <dd className="mt-1 font-medium text-foreground">
              {workOrder.projectName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">담당 인원</dt>
            <dd className="mt-1 font-medium text-foreground">
              {workOrder.assigneeCount}명
            </dd>
          </div>
        </dl>

        {workOrder.description && (
          <div className="border-t border-gray-200 pt-6">
            <dt className="text-sm font-medium text-muted-foreground">설명</dt>
            <dd className="mt-2 whitespace-pre-wrap text-foreground">
              {workOrder.description}
            </dd>
          </div>
        )}

        {(workOrder.startDateTime || workOrder.endDateTime) && (
          <div className="border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {workOrder.startDateTime && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    시작 예정일시
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {new Date(workOrder.startDateTime).toLocaleString("ko-KR")}
                  </dd>
                </div>
              )}
              {workOrder.endDateTime && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    종료 예정일시
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {new Date(workOrder.endDateTime).toLocaleString("ko-KR")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      {/* 담당자 섹션 */}
      {workOrder.assignees && workOrder.assignees.length > 0 && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-foreground">담당자</h3>

          <div className="space-y-2">
            {workOrder.assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {assignee.accountName}
                  </p>
                  {assignee.isMainAssignee && (
                    <p className="text-xs text-primary">주담당자</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 첨부파일 섹션 */}
      {workOrder.files && workOrder.files.length > 0 && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-foreground">첨부파일</h3>

          <div className="space-y-2">
            {workOrder.files.map((file) => (
              <a
                key={file.id}
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <span>{file.fileName}</span>
                {file.fileSize && (
                  <span className="text-xs text-muted-foreground">
                    ({(file.fileSize / 1024).toFixed(2)}KB)
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 댓글 섹션 */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-foreground">댓글</h3>

        {/* 댓글 입력 */}
        <div className="space-y-3 border-b border-gray-200 pb-6">
          <Textarea
            placeholder="댓글을 입력하세요..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="min-h-20 resize-none"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!commentContent.trim() || addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? "등록 중..." : "댓글 등록"}
            </Button>
          </div>
        </div>

        {/* 댓글 목록 */}
        {workOrder.comments && workOrder.comments.length > 0 ? (
          <div className="space-y-4">
            {workOrder.comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {comment.accountName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  {!comment.deleted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        deleteCommentMutation.mutate({
                          workOrderId,
                          commentId: comment.id,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-foreground">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            댓글이 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
