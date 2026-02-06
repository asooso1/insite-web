/**
 * JWT 토큰 설정
 */
export const TOKEN_CONFIG = {
  /** Access Token 유효 시간 (15분) */
  accessTokenTTL: 15 * 60,

  /** Refresh Token 유효 시간 (7일) */
  refreshTokenTTL: 7 * 24 * 60 * 60,

  /** 토큰 자동 갱신 임계값 (만료 5분 전) */
  refreshThreshold: 5 * 60,
} as const;

/**
 * JWT 클레임 인터페이스
 */
export interface JWTPayload {
  sub: string; // userId
  accountId: string;
  userName: string;
  userRoles: string[];
  accountName: string;
  accountType: "LABS" | "FIELD" | "CLIENT";
  currentCompanyId: string;
  currentCompanyName: string;
  currentBuildingId: string;
  currentBuildingName: string;
  accountCompanyId: string;
  iat: number;
  exp: number;
}
