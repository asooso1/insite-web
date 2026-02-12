"use client";

import {
  type ReactNode,
  useRef,
  type RefObject,
  type ComponentProps,
} from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

/** Button 컴포넌트 Props 타입 */
type ButtonProps = ComponentProps<typeof Button>;

export interface PrintButtonProps extends Omit<ButtonProps, "onClick"> {
  /** 인쇄할 콘텐츠의 ref */
  contentRef: RefObject<HTMLElement | null>;
  /** 문서 제목 (인쇄 시 표시) */
  documentTitle?: string;
  /** 인쇄 전 콜백 */
  onBeforePrint?: () => void | Promise<void>;
  /** 인쇄 후 콜백 */
  onAfterPrint?: () => void;
  /** 인쇄 버튼 텍스트 */
  label?: string;
  /** 아이콘만 표시 */
  iconOnly?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 인쇄 버튼 컴포넌트
 *
 * react-to-print 기반의 인쇄 버튼입니다.
 * printThis를 대체합니다.
 *
 * @features
 * - 특정 요소만 인쇄
 * - 문서 제목 설정
 * - 인쇄 전/후 콜백
 * - 커스텀 스타일링
 *
 * @example
 * ```tsx
 * const printRef = useRef<HTMLDivElement>(null);
 *
 * <div ref={printRef}>
 *   <h1>인쇄할 콘텐츠</h1>
 *   <p>이 내용이 인쇄됩니다.</p>
 * </div>
 *
 * <PrintButton
 *   contentRef={printRef}
 *   documentTitle="보고서"
 *   label="인쇄"
 * />
 * ```
 */
export function PrintButton({
  contentRef,
  documentTitle = "문서",
  onBeforePrint,
  onAfterPrint,
  label = "인쇄",
  iconOnly = false,
  variant = "outline",
  size = "default",
  className,
  ...props
}: PrintButtonProps): ReactNode {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
    onBeforePrint: onBeforePrint
      ? async () => {
          await onBeforePrint();
        }
      : undefined,
    onAfterPrint,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return (
    <Button
      variant={variant}
      size={iconOnly ? "icon" : size}
      onClick={handlePrint}
      className={cn(className)}
      {...props}
    >
      <Printer className={cn("h-4 w-4", !iconOnly && "mr-2")} />
      {!iconOnly && label}
    </Button>
  );
}

// ============================================================================
// Print Container
// ============================================================================

export interface PrintContainerProps {
  /** 인쇄할 콘텐츠 */
  children: ReactNode;
  /** 문서 제목 */
  documentTitle?: string;
  /** 인쇄 버튼 위치 */
  buttonPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** 인쇄 버튼 표시 여부 */
  showButton?: boolean;
  /** 인쇄 버튼 텍스트 */
  buttonLabel?: string;
  /** 인쇄 전 콜백 */
  onBeforePrint?: () => void | Promise<void>;
  /** 인쇄 후 콜백 */
  onAfterPrint?: () => void;
  /** 컨테이너 클래스명 */
  className?: string;
  /** 콘텐츠 영역 클래스명 */
  contentClassName?: string;
}

/**
 * 인쇄 컨테이너 컴포넌트
 *
 * 인쇄 버튼과 인쇄할 콘텐츠를 함께 제공합니다.
 *
 * @example
 * ```tsx
 * <PrintContainer
 *   documentTitle="작업 보고서"
 *   buttonPosition="top-right"
 * >
 *   <h1>작업 보고서</h1>
 *   <p>내용...</p>
 * </PrintContainer>
 * ```
 */
export function PrintContainer({
  children,
  documentTitle = "문서",
  buttonPosition = "top-right",
  showButton = true,
  buttonLabel = "인쇄",
  onBeforePrint,
  onAfterPrint,
  className,
  contentClassName,
}: PrintContainerProps): ReactNode {
  const printRef = useRef<HTMLDivElement>(null);

  const buttonPositionClasses: Record<string, string> = {
    "top-right": "top-2 right-2",
    "top-left": "top-2 left-2",
    "bottom-right": "bottom-2 right-2",
    "bottom-left": "bottom-2 left-2",
  };

  return (
    <div className={cn("relative", className)}>
      {showButton && (
        <div className={cn("absolute z-10", buttonPositionClasses[buttonPosition])}>
          <PrintButton
            contentRef={printRef}
            documentTitle={documentTitle}
            label={buttonLabel}
            onBeforePrint={onBeforePrint}
            onAfterPrint={onAfterPrint}
            size="sm"
          />
        </div>
      )}
      <div ref={printRef} className={cn("print-content", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// usePrint Hook
// ============================================================================

export interface UsePrintOptions {
  /** 문서 제목 */
  documentTitle?: string;
  /** 인쇄 전 콜백 */
  onBeforePrint?: () => void | Promise<void>;
  /** 인쇄 후 콜백 */
  onAfterPrint?: () => void;
}

export interface UsePrintResult {
  /** 인쇄할 요소에 연결할 ref */
  printRef: RefObject<HTMLDivElement | null>;
  /** 인쇄 트리거 함수 */
  handlePrint: () => void;
}

/**
 * 인쇄 기능 훅
 *
 * 인쇄 기능을 커스텀 UI와 함께 사용할 때 유용합니다.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { printRef, handlePrint } = usePrint({
 *     documentTitle: "보고서",
 *     onAfterPrint: () => console.log("인쇄 완료"),
 *   });
 *
 *   return (
 *     <>
 *       <div ref={printRef}>
 *         <h1>인쇄할 콘텐츠</h1>
 *       </div>
 *       <button onClick={handlePrint}>커스텀 인쇄 버튼</button>
 *     </>
 *   );
 * }
 * ```
 */
export function usePrint({
  documentTitle = "문서",
  onBeforePrint,
  onAfterPrint,
}: UsePrintOptions = {}): UsePrintResult {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle,
    onBeforePrint: onBeforePrint
      ? async () => {
          await onBeforePrint();
        }
      : undefined,
    onAfterPrint,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return {
    printRef,
    handlePrint,
  };
}
