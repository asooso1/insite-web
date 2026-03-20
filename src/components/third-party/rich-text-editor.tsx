"use client";

import { type ReactNode, useCallback, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  RemoveFormatting,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ============================================================================
// Types
// ============================================================================

export interface RichTextEditorProps {
  /** 초기 HTML 콘텐츠 */
  content?: string;
  /** 콘텐츠 변경 핸들러 */
  onChange?: (html: string) => void;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 읽기 전용 */
  readOnly?: boolean;
  /** 최소 높이 */
  minHeight?: number | string;
  /** 최대 높이 */
  maxHeight?: number | string;
  /** 툴바 표시 여부 */
  showToolbar?: boolean;
  /** 클래스명 */
  className?: string;
}

// URL 검증: http/https 프로토콜만 허용 (javascript: 등 XSS 방지)
function isValidUrl(url: string): boolean {
  try {
    const obj = new URL(url);
    return ["http:", "https:"].includes(obj.protocol);
  } catch {
    return false;
  }
}

// ============================================================================
// Toolbar Button Component
// ============================================================================

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: ReactNode;
  title: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: ToolbarButtonProps): ReactNode {
  return (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={() => onClick()}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Toggle>
  );
}

// ============================================================================
// Toolbar Component
// ============================================================================

interface ToolbarProps {
  editor: Editor | null;
}

function Toolbar({ editor }: ToolbarProps): ReactNode {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleOpenLinkDialog = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setLinkDialogOpen(true);
  }, [editor]);

  const handleConfirmLink = useCallback(() => {
    if (!editor) return;
    const trimmedUrl = linkUrl.trim();

    if (trimmedUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkDialogOpen(false);
      setLinkUrl("");
      return;
    }

    // http/https 프로토콜만 허용 (javascript: XSS 방지)
    if (!isValidUrl(trimmedUrl)) {
      toast.error("https:// 또는 http:// 로 시작하는 URL만 허용됩니다.");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
    setLinkDialogOpen(false);
    setLinkUrl("");
    toast.success("링크가 추가되었습니다.");
  }, [editor, linkUrl]);

  const handleOpenImageDialog = useCallback(() => {
    setImageUrl("");
    setImageDialogOpen(true);
  }, []);

  const handleConfirmImage = useCallback(() => {
    if (!editor) return;
    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) {
      toast.error("이미지 URL을 입력해주세요.");
      return;
    }

    // http/https 프로토콜만 허용 (javascript: XSS 방지)
    if (!isValidUrl(trimmedUrl)) {
      toast.error("https:// 또는 http:// 로 시작하는 URL만 허용됩니다.");
      return;
    }

    editor.chain().focus().setImage({ src: trimmedUrl }).run();
    setImageDialogOpen(false);
    setImageUrl("");
    toast.success("이미지가 추가되었습니다.");
  }, [editor, imageUrl]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
      {/* 실행 취소 / 다시 실행 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="실행 취소"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="다시 실행"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* 제목 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="제목 1"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="제목 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="제목 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* 텍스트 스타일 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="굵게"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="기울임"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="밑줄"
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="취소선"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="인라인 코드"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive("highlight")}
        title="형광펜"
      >
        <Highlighter className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* 정렬 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="왼쪽 정렬"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="가운데 정렬"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="오른쪽 정렬"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        title="양쪽 정렬"
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* 목록 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="글머리 기호 목록"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="번호 매기기 목록"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="인용구"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* 링크 / 이미지 */}
      <ToolbarButton
        onClick={handleOpenLinkDialog}
        isActive={editor.isActive("link")}
        title="링크"
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={handleOpenImageDialog} title="이미지">
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* 서식 지우기 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="서식 지우기"
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolbarButton>

      {/* 링크 추가 Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>링크 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmLink();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setLinkDialogOpen(false);
                setLinkUrl("");
              }}
            >
              취소
            </Button>
            <Button onClick={handleConfirmLink}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 이미지 추가 Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이미지 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">이미지 URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmImage();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImageDialogOpen(false);
                setImageUrl("");
              }}
            >
              취소
            </Button>
            <Button onClick={handleConfirmImage}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * 리치 텍스트 에디터 컴포넌트
 *
 * Tiptap 기반의 WYSIWYG 에디터입니다.
 * Summernote를 대체합니다.
 *
 * @features
 * - 텍스트 서식 (굵게, 기울임, 밑줄, 취소선)
 * - 제목 레벨 (H1, H2, H3)
 * - 정렬 (왼쪽, 가운데, 오른쪽, 양쪽)
 * - 목록 (글머리 기호, 번호)
 * - 링크 / 이미지 삽입
 * - 형광펜, 인용구
 * - 실행 취소 / 다시 실행
 *
 * @example
 * ```tsx
 * const [content, setContent] = useState("<p>Hello World</p>");
 *
 * <RichTextEditor
 *   content={content}
 *   onChange={setContent}
 *   placeholder="내용을 입력하세요..."
 *   minHeight={200}
 * />
 * ```
 */
export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "내용을 입력하세요...",
  readOnly = false,
  minHeight = 200,
  maxHeight,
  showToolbar = true,
  className,
}: RichTextEditorProps): ReactNode {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        protocols: ["http", "https"],
        // href에 허용되지 않은 프로토콜 주입 방지
        validate: (url) => isValidUrl(url),
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          "dark:prose-invert",
          "[&_ol]:list-decimal [&_ul]:list-disc",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic"
        ),
        style: `min-height: ${typeof minHeight === "number" ? `${minHeight}px` : minHeight}`,
      },
    },
  });

  return (
    <div
      className={cn(
        "rounded-md border bg-background",
        readOnly && "bg-muted/50",
        className
      )}
    >
      {showToolbar && !readOnly && <Toolbar editor={editor} />}
      <div
        className="p-3"
        style={{
          maxHeight: maxHeight
            ? typeof maxHeight === "number"
              ? `${maxHeight}px`
              : maxHeight
            : undefined,
          overflowY: maxHeight ? "auto" : undefined,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// ============================================================================
// Read-only Viewer
// ============================================================================

export interface RichTextViewerProps {
  /** HTML 콘텐츠 */
  content: string;
  /** 클래스명 */
  className?: string;
}

/**
 * 리치 텍스트 뷰어 컴포넌트
 *
 * HTML 콘텐츠를 읽기 전용으로 표시합니다.
 *
 * @example
 * ```tsx
 * <RichTextViewer content="<p><strong>Hello</strong> World</p>" />
 * ```
 */
export function RichTextViewer({
  content,
  className,
}: RichTextViewerProps): ReactNode {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none",
          "dark:prose-invert",
          "[&_ol]:list-decimal [&_ul]:list-disc",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic"
        ),
      },
    },
  });

  return (
    <div className={cn("rounded-md", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
