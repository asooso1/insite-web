import type { ReactNode } from "react";

export const metadata = {
  title: "UI Preview — insite-web",
  description: "개발용 UI 컴포넌트 프리뷰 페이지",
};

export default function UIPreviewLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-foreground">UI Preview — insite-web</h1>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
          개발 전용 (NODE_ENV=development)
        </span>
      </nav>
      <main className="container mx-auto px-6 py-8 space-y-16">{children}</main>
    </div>
  );
}
