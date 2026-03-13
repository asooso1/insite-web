import { useAuthStore } from "@/lib/stores/auth-store";
import { ApiError, extractApiError } from "./error-handler";

/**
 * API 기본 URL
 * - 클라이언트: 상대 경로 사용 (Next.js API Routes)
 * - 서버: 환경변수 사용
 */
const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_INTERNAL_URL || "http://localhost:8080"
    : "";

/**
 * API 요청 옵션
 */
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

/**
 * API 응답 타입
 */
interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/**
 * JWT exp 클레임 확인 (서명 검증 없이 만료 여부만 확인)
 * - 401이 토큰 만료인지 권한 부족인지 구별하기 위해 사용
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    const payloadB64 = parts[1];
    if (!payloadB64) return true;
    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    );
    const now = Math.floor(Date.now() / 1000);
    return !payload.exp || payload.exp <= now;
  } catch {
    return true; // 디코딩 실패 시 만료로 처리
  }
}

/**
 * 인증 만료 처리 - 로그인 페이지로 리다이렉트
 * - 토큰이 실제로 만료된 경우만 로그아웃 (권한 부족 401은 무시)
 * - csp-was 토큰 갱신 미구현 - 추후 구현 예정
 */
function handleAuthExpired(url?: string): void {
  const { accessToken, isInitialized, clearAuth } = useAuthStore.getState();

  // 초기화 중이면 무시 (페이지 로드 시 세션 복원 전 API 호출 race condition 방지)
  if (!isInitialized) {
    return;
  }

  // 토큰이 있고 아직 유효하면 권한 부족 오류 - 로그아웃 불필요
  if (accessToken && !isTokenExpired(accessToken)) {
    return;
  }

  // 토큰 없거나 만료된 경우 로그아웃
  clearAuth();
  window.location.href = "/login";
}

/**
 * API 요청 함수
 *
 * @example
 * // GET 요청
 * const data = await apiRequest<UserDTO>("/api/user/v1/me");
 *
 * @example
 * // POST 요청
 * const result = await apiRequest<WorkOrder>("/api/workorder/v1", {
 *   method: "POST",
 *   body: { title: "새 작업" }
 * });
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, skipAuth = false, ...fetchOptions } = options;
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // 헤더 구성
  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");

  // 인증 토큰 추가
  if (!skipAuth) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // 요청 실행
  let response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  // 401 에러 시 로그인 페이지로 리다이렉트
  // (csp-was 토큰 갱신 미구현 - 추후 구현 예정)
  if (response.status === 401 && !skipAuth) {
    handleAuthExpired(url);
    throw new ApiError("E00401", "인증이 만료되었습니다.", 401);
  }

  // 에러 응답 처리
  if (!response.ok) {
    throw await extractApiError(response);
  }

  // 응답 파싱
  const responseData: ApiResponse<T> = await response.json();
  return responseData.data;
}

/**
 * GET 요청 헬퍼
 */
export function apiGet<T>(
  endpoint: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST 요청 헬퍼
 */
export function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "POST", body });
}

/**
 * PUT 요청 헬퍼
 */
export function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "PUT", body });
}

/**
 * DELETE 요청 헬퍼
 */
export function apiDelete<T>(
  endpoint: string,
  options?: Omit<RequestOptions, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * FormData POST 요청 헬퍼
 */
export async function apiPostForm<T>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options?.headers);
  // FormData는 Content-Type을 자동으로 설정 (boundary 포함)

  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  // 401 에러 시 로그인 페이지로 리다이렉트
  if (response.status === 401) {
    handleAuthExpired(url);
    throw new ApiError("E00401", "인증이 만료되었습니다.", 401);
  }

  if (!response.ok) {
    throw await extractApiError(response);
  }

  const responseData: ApiResponse<T> = await response.json();
  return responseData.data;
}

/**
 * FormData PUT 요청 헬퍼
 */
export async function apiPutForm<T>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options?.headers);

  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
    credentials: "include",
  });

  // 401 에러 시 로그인 페이지로 리다이렉트
  if (response.status === 401) {
    handleAuthExpired(url);
    throw new ApiError("E00401", "인증이 만료되었습니다.", 401);
  }

  if (!response.ok) {
    throw await extractApiError(response);
  }

  const responseData: ApiResponse<T> = await response.json();
  return responseData.data;
}

/**
 * Blob GET 요청 헬퍼 (파일 다운로드용)
 */
export async function apiGetBlob(
  endpoint: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<Blob> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options?.headers);

  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw await extractApiError(response);
  }

  return response.blob();
}

/**
 * API 클라이언트 객체
 * - 메서드 체이닝 스타일
 */
export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  postForm: apiPostForm,
  putForm: apiPutForm,
  getBlob: apiGetBlob,
  request: apiRequest,
} as const;

/**
 * @deprecated api 대신 apiClient 사용
 */
export const api = apiClient;
