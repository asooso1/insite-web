import { z } from "zod";

/**
 * 필수 문자열 (trim 후 최소 1자)
 * @param fieldName 필드명 (에러 메시지에 사용)
 */
export const requiredString = (fieldName: string) =>
  z.string().trim().min(1, { message: `${fieldName}을(를) 입력해 주세요.` });

/**
 * 선택 문자열 (빈 문자열 허용)
 */
export const optionalString = z.string().optional().or(z.literal(""));

/**
 * 전화번호 (한국 형식: 010-1234-5678, 02-1234-5678 등)
 */
export const phoneNumber = z
  .string()
  .regex(/^(010|011|016|017|018|019|02|0[3-9][0-9])-\d{3,4}-\d{4}$/, {
    message: "올바른 전화번호 형식을 입력해 주세요. (예: 010-1234-5678)",
  })
  .or(z.literal(""));

/**
 * 이메일
 */
export const email = z
  .string()
  .email({ message: "올바른 이메일 주소를 입력해 주세요." })
  .or(z.literal(""));

/**
 * 날짜 문자열 (YYYY-MM-DD)
 */
export const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "날짜 형식이 올바르지 않습니다. (예: 2024-01-01)",
  })
  .or(z.literal(""));

/**
 * 양의 정수
 * @param fieldName 필드명 (에러 메시지에 사용)
 */
export const positiveNumber = (fieldName: string) =>
  z
    .number()
    .int({ message: `${fieldName}은(는) 정수여야 합니다.` })
    .positive({ message: `${fieldName}은(는) 1 이상이어야 합니다.` });

/**
 * 비음수 정수 (0 포함)
 * @param fieldName 필드명 (에러 메시지에 사용)
 */
export const nonNegativeNumber = (fieldName: string) =>
  z
    .number()
    .int({ message: `${fieldName}은(는) 정수여야 합니다.` })
    .min(0, { message: `${fieldName}은(는) 0 이상이어야 합니다.` });

/**
 * 페이지네이션 파라미터
 */
export const paginationSchema = z.object({
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(200).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * 날짜 범위
 */
export const dateRangeSchema = z
  .object({
    dateFrom: dateString.optional(),
    dateTo: dateString.optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return data.dateFrom <= data.dateTo;
      }
      return true;
    },
    { message: "종료일은 시작일 이후여야 합니다.", path: ["dateTo"] }
  );

export type DateRange = z.infer<typeof dateRangeSchema>;
