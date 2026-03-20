"use client";

import * as React from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

/**
 * 인증 상태 초기화 컴포넌트
 * - 페이지 리로드 시 httpOnly 쿠키에서 사용자 정보 복원
 * - 실패해도 redirect 없음 (미들웨어가 경로 보호 담당)
 */
export function AuthInitializer(): null {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initRef = React.useRef(false);

  React.useEffect(() => {
    // 이미 초기화되었거나 인증된 경우 - 즉시 완료 처리
    if (initRef.current || isAuthenticated) {
      setInitialized();
      return;
    }
    initRef.current = true;

    // 페이지 리로드 시 쿠키에서 세션 복원
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.accessToken && data?.user) {
          setAuth(data.accessToken, data.user);
        }
      })
      .catch(() => {
        // 세션 복원 실패 시 무시 (미들웨어가 경로 보호 담당)
      })
      .finally(() => {
        // 성공/실패 모두 초기화 완료 처리
        setInitialized();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열 필수 - Zustand 함수 참조 변경 방지 (마운트 시 1회만 실행)

  return null;
}
