import { create } from "zustand";

/**
 * 인증된 사용자 정보
 * - csp-was AuthVO 기반
 */
export interface AuthUser {
  accountId: string;
  userId: string;
  userName: string;
  userRoles: string[];
  accountName: string;
  accountType: "LABS" | "FIELD" | "CLIENT";
  currentCompanyId: string;
  currentCompanyName: string;
  currentBuildingId: string;
  currentBuildingName: string;
  accountCompanyId: string;
}

interface AuthState {
  // 인증 상태
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // 액션
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

/**
 * 인증 상태 스토어
 * - Access token은 메모리에만 저장 (보안)
 * - 페이지 새로고침 시 /api/auth/refresh로 재발급
 */
export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user });
  },

  setAuth: (token, user) => {
    set({
      accessToken: token,
      user,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
