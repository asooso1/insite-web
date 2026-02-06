import { z } from "zod";

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
  userId: z.string().min(1, { message: "아이디를 입력해 주세요." }),
  passwd: z.string().min(1, { message: "비밀번호를 입력해 주세요." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 비밀번호 변경 폼 스키마
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "현재 비밀번호를 입력해 주세요." }),
    newPassword: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .regex(/[a-zA-Z]/, { message: "비밀번호에 영문자가 포함되어야 합니다." })
      .regex(/[0-9]/, { message: "비밀번호에 숫자가 포함되어야 합니다." })
      .regex(/[^a-zA-Z0-9]/, { message: "비밀번호에 특수문자가 포함되어야 합니다." }),
    confirmPassword: z.string().min(1, { message: "비밀번호 확인을 입력해 주세요." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
