/**
 * 알림 API 클라이언트
 */

import { apiClient } from './client';
import type { Notification, NotificationListResponse } from '@/lib/types/notification';

/**
 * 알림 목록 조회
 * @returns NotificationListResponse
 */
export async function getNotifications(): Promise<NotificationListResponse> {
  try {
    const response = await apiClient.get<NotificationListResponse>(
      '/api/notifications/v1/list'
    );
    return response;
  } catch {
    // 백엔드 API 미존재 시 mock 데이터 반환
    return getMockNotifications();
  }
}

/**
 * 모든 알림을 읽음 처리
 */
export async function markAllAsRead(): Promise<void> {
  try {
    await apiClient.put('/api/notifications/v1/mark-all-read');
  } catch {
    // 백엔드 API 미존재 시 무시
  }
}

/**
 * 특정 알림을 읽음 처리
 * @param id 알림 ID
 */
export async function markAsRead(id: number): Promise<void> {
  try {
    await apiClient.put(`/api/notifications/v1/${id}/mark-read`);
  } catch {
    // 백엔드 API 미존재 시 무시
  }
}

/**
 * Mock 데이터 - 백엔드 API 미존재 시 사용
 */
function getMockNotifications(): NotificationListResponse {
  const now = new Date();
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'WORK_ORDER',
      title: '작업 상태 업데이트',
      message: '수시업무 "HVAC 점검"이 완료되었습니다.',
      isRead: false,
      createdAt: new Date(now.getTime() - 5 * 60000).toISOString(),
      linkUrl: '/work-orders/1',
    },
    {
      id: 2,
      type: 'FACILITY',
      title: '시설 점검 필요',
      message: '보일러 점검이 필요합니다. 예정된 유지보수 기간: 내일',
      isRead: false,
      createdAt: new Date(now.getTime() - 30 * 60000).toISOString(),
      linkUrl: '/facilities/5',
    },
    {
      id: 3,
      type: 'SYSTEM',
      title: '시스템 알림',
      message: '정기적인 시스템 백업이 완료되었습니다.',
      isRead: true,
      createdAt: new Date(now.getTime() - 2 * 60 * 60000).toISOString(),
    },
    {
      id: 4,
      type: 'PATROL',
      title: '순찰 일정',
      message: '오늘 오후 3시 순찰 예정입니다.',
      isRead: true,
      createdAt: new Date(now.getTime() - 24 * 60 * 60000).toISOString(),
      linkUrl: '/patrols/10',
    },
  ];

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
  };
}
