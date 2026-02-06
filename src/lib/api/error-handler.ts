import { toast } from "sonner";

/**
 * API 에러 응답 인터페이스
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  data?: unknown;
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  code: string;
  status: number;
  data?: unknown;

  constructor(code: string, message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

/**
 * 에러 코드별 처리 핸들러
 */
const ERROR_HANDLERS: Record<string, (error: ApiErrorResponse) => void> = {
  E00401: () => {
    // 인증 실패 - 토큰 갱신 시도는 인터셉터에서 처리
    toast.error("인증이 만료되었습니다. 다시 로그인해주세요.");
  },
  E00403: () => {
    toast.error("접근 권한이 없습니다.");
  },
  E00404: () => {
    // 데이터 없음 - UI에서 빈 상태로 처리
  },
  E00412: () => {
    toast.error("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    window.location.href = "/login";
  },
  E00422: (error) => {
    // 유효성 검사 실패 - 필드별 에러는 폼에서 처리
    toast.error(error.message || "입력값을 확인해주세요.");
  },
  E00500: (error) => {
    toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    // Sentry 보고 (향후 추가)
    console.error("서버 오류:", error);
  },
  E01003: () => {
    // 조회 데이터 없음 - UI에서 빈 상태로 처리
  },
};

/**
 * API 에러 처리
 */
export function handleApiError(error: ApiErrorResponse | Error): void {
  if (error instanceof ApiError || "code" in error) {
    const apiError = error as ApiErrorResponse;
    const handler = ERROR_HANDLERS[apiError.code];

    if (handler) {
      handler(apiError);
    } else {
      // 기본 에러 처리
      toast.error(apiError.message || "오류가 발생했습니다.");
    }
  } else {
    // 일반 에러
    toast.error("오류가 발생했습니다.");
    console.error("에러:", error);
  }
}

/**
 * HTTP 응답에서 에러 추출
 */
export async function extractApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return new ApiError(
      data.code || `E${response.status}`,
      data.message || response.statusText,
      response.status,
      data.data
    );
  } catch {
    return new ApiError(
      `E${response.status}`,
      response.statusText,
      response.status
    );
  }
}

/**
 * 에러가 특정 코드인지 확인
 */
export function isErrorCode(
  error: unknown,
  code: string | string[]
): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }

  const errorCode = (error as { code: string }).code;
  const codes = Array.isArray(code) ? code : [code];
  return codes.includes(errorCode);
}

/**
 * 네트워크 에러 여부 확인
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message === "Failed to fetch";
}
