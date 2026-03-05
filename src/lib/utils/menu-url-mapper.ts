/**
 * csp-web URL → insite-web URL 매핑 테이블
 * 백엔드 MenuDTO.url 필드가 구 시스템 경로로 저장되어 있어 변환 필요
 */
const URL_PREFIX_MAP: Array<[string, string]> = [
  // 작업 관리
  ["/workorder", "/work-orders"],
  ["/work-order", "/work-orders"],
  // 시설 관리
  ["/facility", "/facilities"],
  ["/site/facility", "/facilities"],
  // 사용자 관리
  ["/user/", "/users/"],
  ["/user", "/users"],
  ["/account", "/users"],
  // 고객사
  ["/client", "/clients"],
  ["/company", "/clients"],
  // 자재
  ["/material", "/materials"],
  // 게시판
  ["/board/notice", "/boards"],
  ["/board/data", "/boards"],
  ["/board", "/boards"],
  ["/notice", "/boards"],
  // 설정
  ["/setting", "/settings"],
  ["/code", "/settings"],
  // 분석/리포트
  ["/analytics", "/analytics"],
  ["/anls", "/analytics"],
  ["/report", "/reports"],
  // 순찰
  ["/patrol", "/patrols"],
  // 자격증
  ["/license", "/licenses"],
  // 대시보드
  ["/main", "/dashboard"],
  ["/dashboard", "/dashboard"],
  ["/index", "/dashboard"],
];

/** 이미 insite-web 경로인 접두사 목록 */
const ALREADY_MAPPED_PREFIXES = [
  "/work-orders",
  "/facilities",
  "/users",
  "/clients",
  "/materials",
  "/boards",
  "/settings",
  "/analytics",
  "/reports",
  "/patrols",
  "/licenses",
  "/dashboard",
];

/**
 * csp-web URL을 insite-web URL로 변환
 * 매핑되지 않은 경우 원본 URL 반환
 */
export function mapMenuUrl(url: string): string {
  if (!url) return "/dashboard";

  // 이미 올바른 insite-web 경로면 그대로 반환
  if (ALREADY_MAPPED_PREFIXES.some((p) => url.startsWith(p))) return url;

  // 쿼리스트링/해시 제거 후 경로만 추출
  const path = (url.split("?")[0] ?? url).split("#")[0] ?? url;

  for (const [from, to] of URL_PREFIX_MAP) {
    if (
      path === from ||
      path.startsWith(from + "/") ||
      path.startsWith(from + "?")
    ) {
      return path.replace(from, to);
    }
  }

  return url;
}
