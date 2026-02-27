"use client";

import * as React from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useTenantStore } from "@/lib/stores/tenant-store";

/**
 * 인증 초기화 컴포넌트
 * - 로그인 후 JWT의 빌딩/회사 정보 → tenant-store 자동 세팅
 * - user가 있고 currentBuilding이 없을 때만 실행
 */
export function AuthInitializer(): null {
  const { user } = useAuthStore();
  const { currentBuilding, currentCompany, setContext } = useTenantStore();

  React.useEffect(() => {
    if (
      user?.currentBuildingId &&
      user?.currentCompanyId &&
      !currentBuilding
    ) {
      setContext(
        {
          id: user.currentCompanyId,
          name: user.currentCompanyName ?? "",
        },
        {
          id: user.currentBuildingId,
          name: user.currentBuildingName ?? "",
        }
      );
    }
  }, [user, currentBuilding, currentCompany, setContext]);

  return null;
}
