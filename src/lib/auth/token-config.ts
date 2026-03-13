/**
 * JWT 토큰 설정
 * csp-was: 단일 authToken, 유효시간 1시간, 갱신 없음
 */
export const TOKEN_CONFIG = {
  /** 토큰 유효 시간 (1시간) - csp-was jwt.access-token-validity-in-seconds=3600 */
  authTokenTTL: 60 * 60,
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
