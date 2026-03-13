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
  /** 초기 세션 복원 완료 여부 (페이지 로드 시 /api/auth/me 응답 후 true) */
  isInitialized: boolean;

  // 액션
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  setInitialized: () => void;
}

/**
 * 인증 상태 스토어
 * - 토큰은 메모리에만 저장 (보안)
 * - 페이지 새로고침 시 /api/auth/me로 httpOnly 쿠키에서 복원
 */
export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

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
      isInitialized: true,
    });
  },

  setInitialized: () => {
    set({ isInitialized: true });
  },
}));
