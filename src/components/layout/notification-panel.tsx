"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Zap, AlertCircle, ClipboardList, CheckCircle2, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from "@/lib/hooks/use-notifications";
import { NOTIFICATION_TYPES } from "@/lib/types/notification";
import type { Notification } from "@/lib/types/notification";
import { cn } from "@/lib/utils";

// ============================================================================
// 알림 타입별 아이콘 & 색상
// ============================================================================

function getNotificationIcon(type: string): React.JSX.Element {
  const iconClass = "h-4 w-4";
  switch (type) {
    case NOTIFICATION_TYPES.WORK_ORDER:
      return <ClipboardList className={cn(iconClass, "text-blue-500")} />;
    case NOTIFICATION_TYPES.FACILITY:
      return <Zap className={cn(iconClass, "text-amber-500")} />;
    case NOTIFICATION_TYPES.SYSTEM:
      return <AlertCircle className={cn(iconClass, "text-slate-500")} />;
    case NOTIFICATION_TYPES.PATROL:
      return <CheckCircle2 className={cn(iconClass, "text-green-500")} />;
    default:
      return <Bell className={cn(iconClass, "text-slate-500")} />;
  }
}

// ============================================================================
// 알림 아이템
// ============================================================================

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps): React.JSX.Element {
  const createdTime = new Date(notification.createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeText = "";
  if (diffMins < 1) timeText = "방금";
  else if (diffMins < 60) timeText = `${diffMins}분 전`;
  else if (diffHours < 24) timeText = `${diffHours}시간 전`;
  else if (diffDays < 7) timeText = `${diffDays}일 전`;
  else timeText = createdTime.toLocaleDateString();

  const handleMarkRead = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const itemContent = (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-lg transition-colors duration-150",
        notification.isRead
          ? "bg-transparent hover:bg-muted/50"
          : "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
      )}
    >
      {/* 아이콘 */}
      <div className="mt-0.5 shrink-0">
        {getNotificationIcon(notification.type)}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium leading-tight", !notification.isRead && "text-blue-900 dark:text-blue-100")}>
            {notification.title}
          </p>
          <button
            onClick={handleMarkRead}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="읽음 처리"
          >
            {!notification.isRead && <span className="inline-flex h-2 w-2 rounded-full bg-primary" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground/60">
          {timeText}
        </p>
      </div>
    </div>
  );

  // 링크가 있으면 Link, 없으면 div
  if (notification.linkUrl) {
    return (
      <Link href={notification.linkUrl} onClick={handleMarkRead}>
        {itemContent}
      </Link>
    );
  }

  return itemContent;
}

// ============================================================================
// 빈 상태
// ============================================================================

function EmptyNotifications(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
      <p className="text-sm font-medium text-muted-foreground">
        알림이 없습니다
      </p>
    </div>
  );
}

// ============================================================================
// 알림 패널
// ============================================================================

export function NotificationPanel(): React.JSX.Element {
  const { data: notifications, unreadCount, isLoading, refetch } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const { mutate: markAsRead } = useMarkAsRead();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleRefresh = (): void => {
    void refetch();
  };

  const handleMarkAllAsRead = (): void => {
    if (unreadCount > 0) {
      markAllAsRead(undefined, {
        onSuccess: () => {
          void refetch();
        },
      });
    }
  };

  const handleMarkAsRead = (id: number): void => {
    markAsRead(id, {
      onSuccess: () => {
        void refetch();
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="알림"
        >
          <Bell className="h-[17px] w-[17px]" />
          {unreadCount > 0 && (
            <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full bg-destructive ring-[1.5px] ring-background" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[420px] p-0">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">알림</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                읽지 않은 알림 {unreadCount}개
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 px-2 text-xs"
              aria-label="새로고침"
            >
              새로고침
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="h-8 px-2 text-xs"
              >
                모두 읽음
              </Button>
            )}
          </div>
        </div>

        {/* 알림 목록 */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border/40">
              {notifications.map((notification) => (
                <div key={notification.id} className="px-2 py-1">
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyNotifications />
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
