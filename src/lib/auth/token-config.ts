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
 * csp-was TokenProvider.createToken() 기반
 */
export interface JWTPayload {
  // 기본 사용자 정보
  accountId: number;
  userId: string;
  accountName: string;
  accountType: string;

  // 회사 정보
  accountCompanyId: number;
  accountCompanyName: string;
  currentCompanyId: number;
  currentCompanyName: string;

  // 건물 정보
  currentBuildingId: number;
  currentBuildingName: string;

  // 날씨 정보
  currentWeatherAddress: string;
  currentWeatherX: number;
  currentWeatherY: number;

  // 권한 정보
  userRoles: string[];
  userRoleNames: string[];

  // 담당 범위
  userCompanyIds: number[];
  userWideAreaIds: number[];
  userBaseAreaIds: number[];
  userBuildingIds: number[];
  viewAllBuildings: boolean;

  // JWT 표준 클레임
  iss: string;
  iat: number;
  exp: number;
}
