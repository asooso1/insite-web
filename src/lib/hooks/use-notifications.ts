/**
 * 알림 관련 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAllAsRead, markAsRead } from '@/lib/api/notification';
import type { NotificationListResponse } from '@/lib/types/notification';

// ============================================================================
// Query Keys Factory
// ============================================================================

const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: () => [...notificationKeys.lists()] as const,
} as const;

// ============================================================================
// Hooks
// ============================================================================

/**
 * 알림 목록 조회
 */
export function useNotifications() {
  const query = useQuery<NotificationListResponse>({
    queryKey: notificationKeys.list(),
    queryFn: () => getNotifications(),
    staleTime: 30 * 1000, // 30초
  });

  return {
    data: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * 모든 알림을 읽음 처리
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      // 알림 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}

/**
 * 특정 알림을 읽음 처리
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      // 알림 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}
