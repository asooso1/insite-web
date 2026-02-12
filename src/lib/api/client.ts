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
 * 토큰 갱신 상태
 * - 중복 갱신 요청 방지
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * 토큰 갱신
 */
async function refreshToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        useAuthStore.getState().clearAuth();
        return null;
      }

      const data = await response.json();
      const newToken = data.accessToken;

      if (newToken) {
        useAuthStore.getState().setAccessToken(newToken);
        return newToken;
      }

      return null;
    } catch {
      useAuthStore.getState().clearAuth();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
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

  // 401 에러 시 토큰 갱신 후 재시도
  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshToken();

    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });
    } else {
      // 토큰 갱신 실패 - 로그인 페이지로 리다이렉트
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiError("E00401", "인증이 만료되었습니다.", 401);
    }
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
