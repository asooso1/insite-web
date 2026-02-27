import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/pretendard/900.css";
import "@fontsource/pretendard/800.css";
import "@fontsource/pretendard/700.css";
import "@fontsource/pretendard/600.css";
import "@fontsource/pretendard/500.css";
import "@fontsource/pretendard/400.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "insite-web",
  description: "빌딩 시설 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
