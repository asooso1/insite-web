import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Company {
  id: string;
  name: string;
}

interface Building {
  id: string;
  name: string;
}

interface TenantState {
  // 현재 선택된 회사/빌딩
  currentCompany: Company | null;
  currentBuilding: Building | null;

  // 액션
  setCompany: (company: Company) => void;
  setBuilding: (building: Building) => void;
  setContext: (company: Company, building: Building) => void;
  clearContext: () => void;
}

/**
 * 테넌트 컨텍스트 스토어
 * - 현재 선택된 회사/빌딩 관리
 * - localStorage에 영속화 (페이지 새로고침 시 선택 유지 목적)
 *
 * [보안 주의]
 * 빌딩 ID는 localStorage에 저장되어 사용자가 조작 가능하지만,
 * 실제 데이터 접근 권한은 csp-was JWT Bearer 검증 및 role_menu 권한 체계가 담당.
 * localStorage 조작은 표시되는 컨텍스트만 변경하며, API 데이터 보안에는 영향 없음.
 */
export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      currentCompany: null,
      currentBuilding: null,

      setCompany: (company) => {
        set({ currentCompany: company });
      },

      setBuilding: (building) => {
        set({ currentBuilding: building });
      },

      setContext: (company, building) => {
        set({
          currentCompany: company,
          currentBuilding: building,
        });
      },

      clearContext: () => {
        set({
          currentCompany: null,
          currentBuilding: null,
        });
      },
    }),
    {
      name: "tenant-store",
    }
  )
);
