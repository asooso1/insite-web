/**
 * 무거운 서드파티 컴포넌트 Dynamic Import 래퍼
 *
 * Tiptap, FullCalendar, 카카오맵 등 번들 크기가 큰 라이브러리를
 * next/dynamic으로 지연 로딩하여 초기 번들에서 분리합니다.
 *
 * 사용법:
 * ```tsx
 * import { DynamicRichTextEditor } from "@/components/third-party/dynamic";
 * ```
 */

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// Rich Text (Tiptap) - ~200KB gzip
// ============================================================================

export const DynamicRichTextEditor = dynamic(
  () => import("./rich-text-editor").then((m) => ({ default: m.RichTextEditor })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-40 w-full" />,
  }
);

export const DynamicRichTextViewer = dynamic(
  () => import("./rich-text-editor").then((m) => ({ default: m.RichTextViewer })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-16 w-full" />,
  }
);

// ============================================================================
// Calendar (FullCalendar) - ~300KB gzip
// ============================================================================

export const DynamicCalendar = dynamic(
  () => import("./calendar").then((m) => ({ default: m.Calendar })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

export const DynamicMiniCalendar = dynamic(
  () => import("./calendar").then((m) => ({ default: m.MiniCalendar })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

// ============================================================================
// Kakao Map - 카카오맵 SDK
// ============================================================================

export const DynamicKakaoMap = dynamic(
  () => import("./kakao-map").then((m) => ({ default: m.KakaoMapComponent })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

export const DynamicStaticMap = dynamic(
  () => import("./kakao-map").then((m) => ({ default: m.StaticMap })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-40 w-full" />,
  }
);
