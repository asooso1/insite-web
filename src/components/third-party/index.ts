/**
 * 서드파티 라이브러리 래퍼 컴포넌트
 *
 * jQuery 플러그인/레거시 라이브러리를 대체하는 React 컴포넌트입니다.
 *
 * @module third-party
 */

// ============================================================================
// Calendar (FullCalendar) - DHTMLX Scheduler 대체
// ============================================================================

export {
  Calendar,
  MiniCalendar,
  type CalendarEvent,
  type CalendarView,
  type CalendarProps,
  type MiniCalendarProps,
} from "./calendar";

// ============================================================================
// Rich Text Editor (Tiptap) - Summernote 대체
// ============================================================================

export {
  RichTextEditor,
  RichTextViewer,
  type RichTextEditorProps,
  type RichTextViewerProps,
} from "./rich-text-editor";

// ============================================================================
// Print (react-to-print) - printThis 대체
// ============================================================================

export {
  PrintButton,
  PrintContainer,
  usePrint,
  type PrintButtonProps,
  type PrintContainerProps,
  type UsePrintOptions,
  type UsePrintResult,
} from "./print-button";

// ============================================================================
// Kakao Map (react-kakao-maps-sdk) - 카카오맵 React 래퍼
// ============================================================================

export {
  KakaoMapComponent,
  StaticMap,
  useMapBounds,
  useGeocode,
  type LatLng,
  type MapMarkerData,
  type KakaoMapComponentProps,
  type StaticMapProps,
} from "./kakao-map";
