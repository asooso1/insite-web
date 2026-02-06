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
 * - localStorage에 영속화
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
