import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/session";

/**
 * 설정 레이아웃
 * 인증된 사용자만 접근 가능 (향후 역할 기반 권한으로 강화)
 */
export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
