import type { ReactNode } from "react";

/**
 * 인증 레이아웃
 * - 로그인, 아이디 찾기, 비밀번호 변경 등 인증 관련 페이지용
 * - AppShell 없이 전체 화면 레이아웃 사용
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
