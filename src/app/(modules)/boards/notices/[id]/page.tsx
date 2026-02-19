"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Megaphone,
  Calendar,
  User,
  Building2,
  AlertCircle,
  Paperclip,
  Eye,
  MessageSquare,
  Send,
  Trash2,
  Pin,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useNoticeView,
  useAddComment,
  useDeleteComment,
  useDeleteNotice,
} from "@/lib/hooks/use-boards";
import {
  NoticeTypeLabel,
  NoticeTargetGroupLabel,
  PublishStateLabel,
  PublishStateStyle,
  type NoticeType,
  type NoticeTargetGroup,
  type NoticeCommentDTO,
} from "@/lib/types/board";

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
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-48" />
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
// 댓글 컴포넌트
// ============================================================================

function CommentItem({
  comment,
  noticeId,
  depth = 0,
}: {
  comment: NoticeCommentDTO;
  noticeId: number;
  depth?: number;
}) {
  const deleteComment = useDeleteComment(noticeId);

  const handleDelete = useCallback(() => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment.mutate(comment.id);
    }
  }, [comment.id, deleteComment]);

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}>
      <div className="rounded-md border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.writerName}</span>
            <span className="text-xs text-muted-foreground">
              {comment.writerCompanyName} · {comment.writerRoleName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {comment.writeDate}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>
      </div>
      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          noticeId={noticeId}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: notice, isLoading, isError } = useNoticeView(id);
  const addComment = useAddComment(id);
  const deleteNotice = useDeleteNotice();

  const [commentContent, setCommentContent] = useState("");

  const handleAddComment = useCallback(() => {
    if (!commentContent.trim()) return;
    addComment.mutate(
      { content: commentContent },
      {
        onSuccess: () => setCommentContent(""),
      }
    );
  }, [commentContent, addComment]);

  const handleDelete = useCallback(() => {
    if (confirm("이 공지사항을 삭제하시겠습니까?")) {
      deleteNotice.mutate(id, {
        onSuccess: () => router.push("/boards"),
      });
    }
  }, [id, deleteNotice, router]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !notice) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="공지사항을 찾을 수 없습니다"
          description="요청하신 공지사항이 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/boards"),
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
            onClick={() => router.push("/boards")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              {notice.isMajor && (
                <Pin className="h-4 w-4 text-orange-500" />
              )}
              <h1 className="text-2xl font-bold">{notice.title}</h1>
              <StatusBadge
                status={PublishStateStyle[notice.publishState] ?? "pending"}
                label={PublishStateLabel[notice.publishState] ?? notice.publishState}
              />
            </div>
            <p className="text-muted-foreground">
              {NoticeTypeLabel[notice.noticeType as NoticeType] ?? notice.noticeType}
              {" · "}
              {notice.writerName} · {notice.writeDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/boards/notices/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button
            variant="outline"
            className="text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 좌측 메인 컨텐츠 */}
        <div className="md:col-span-2 space-y-6">
          {/* 본문 */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {notice.contents}
              </div>
            </CardContent>
          </Card>

          {/* 첨부파일 */}
          {notice.noticeFileDTOs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  첨부파일 ({notice.noticeFileDTOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notice.noticeFileDTOs.map((file) => (
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

          {/* 댓글 */}
          {notice.commentEnabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  댓글 ({notice.noticeCommentDTOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 댓글 목록 */}
                {notice.noticeCommentDTOs.length > 0 ? (
                  <div className="space-y-3">
                    {notice.noticeCommentDTOs.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        noticeId={id}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 댓글이 없습니다.
                  </p>
                )}

                <Separator />

                {/* 댓글 입력 */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="댓글을 입력하세요"
                    rows={2}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={addComment.isPending || !commentContent.trim()}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 게시 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>게시 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={Calendar}
                label="게시 기간"
                value={
                  notice.postTermStart && notice.postTermEnd
                    ? `${notice.postTermStart.split(" ")[0]} ~ ${notice.postTermEnd.split(" ")[0]}`
                    : "-"
                }
              />
              <InfoItem
                icon={Building2}
                label="대상 고객사"
                value={notice.allCompany ? "전체" : notice.noticeCompanyName}
              />
              <InfoItem
                icon={Building2}
                label="대상 빌딩"
                value={notice.noticeBuildingName ?? "전체"}
              />
              <InfoItem
                icon={Eye}
                label="조회수"
                value={`${notice.viewCnt}회`}
              />

              {notice.alert && (
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="h-4 w-4 text-orange-500" />
                  <span>알림 발송됨</span>
                </div>
              )}

              {notice.targetGroups.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">대상 그룹</p>
                  <div className="flex flex-wrap gap-1">
                    {notice.targetGroups.map((group) => (
                      <span
                        key={group}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs"
                      >
                        {NoticeTargetGroupLabel[group as NoticeTargetGroup] ?? group}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={User}
                label="작성자"
                value={
                  <span>
                    {notice.writerName}
                    <span className="text-xs text-muted-foreground block">
                      {notice.writerCompanyName} · {notice.writeDate}
                    </span>
                  </span>
                }
              />
              <Separator />
              <InfoItem
                icon={User}
                label="최종 수정자"
                value={
                  <span>
                    {notice.lastModifierName}
                    <span className="text-xs text-muted-foreground block">
                      {notice.lastModifierCompanyName} · {notice.lastModifyDate}
                    </span>
                  </span>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
