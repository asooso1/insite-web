import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RichTextEditor, RichTextViewer } from "./rich-text-editor";

const meta = {
  title: "Components/ThirdParty/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = `<h2>작업 매뉴얼</h2>
<p><strong>유지보수 절차:</strong></p>
<ol>
  <li>사전 안전점검</li>
  <li>장비 준비</li>
  <li>작업 진행</li>
  <li>완료 확인</li>
</ol>
<p><em>주의: 모든 작업 후 안전장비를 정리하고 체크리스트를 작성하세요.</em></p>`;

const richContent = `<h1>빌딩 관리 시스템</h1>
<h2>소개</h2>
<p>이것은 <strong>현대적인 빌딩 에너지 관리 시스템</strong>입니다.</p>
<h3>주요 기능</h3>
<ul>
  <li>에너지 모니터링</li>
  <li>설비 관리</li>
  <li>작업 지시</li>
  <li>보고서 생성</li>
</ul>
<p><u>모든 변경사항은 관리자의 승인이 필요합니다.</u></p>
<blockquote>효율적인 관리는 지속 가능한 운영의 기초입니다.</blockquote>`;

export const Default: Story = {
  render: () => {
    const [content, setContent] = useState("");
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="내용을 입력하세요..."
        minHeight={250}
      />
    );
  },
};

export const WithInitialContent: Story = {
  render: () => {
    const [content, setContent] = useState(sampleContent);
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="내용을 입력하세요..."
        minHeight={300}
      />
    );
  },
};

export const ReadOnly: Story = {
  render: () => {
    const [content] = useState(richContent);
    return (
      <RichTextEditor
        content={content}
        readOnly={true}
        minHeight={350}
      />
    );
  },
};

export const Minimal: Story = {
  render: () => {
    const [content, setContent] = useState("");
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="메모를 입력하세요..."
        minHeight={150}
        showToolbar={true}
      />
    );
  },
};

export const WithMaxHeight: Story = {
  render: () => {
    const [content, setContent] = useState(sampleContent);
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="내용을 입력하세요..."
        minHeight={250}
        maxHeight={400}
      />
    );
  },
};

export const LargeMemo: Story = {
  render: () => {
    const [content, setContent] = useState("");
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="상세한 메모를 입력하세요..."
        minHeight={500}
      />
    );
  },
};

export const CompactEditor: Story = {
  render: () => {
    const [content, setContent] = useState("");
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="한 줄 입력..."
        minHeight={100}
      />
    );
  },
};

export const WithCustomClass: Story = {
  render: () => {
    const [content, setContent] = useState(sampleContent);
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        className="border-2 border-primary rounded-lg"
        minHeight={300}
      />
    );
  },
};

export const FormIntegration: Story = {
  render: () => {
    const [content, setContent] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (content.trim()) {
        setSubmitted(true);
        setContent("");
        setTimeout(() => setSubmitted(false), 2000);
      }
    };

    return (
      <div className="space-y-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="작업 내용을 입력하세요..."
          minHeight={250}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            저장
          </button>
        </div>
        {submitted && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
            작업 내용이 저장되었습니다.
          </div>
        )}
      </div>
    );
  },
};

export const RichContentExample: Story = {
  render: () => {
    const [content, setContent] = useState(richContent);
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">편집</h3>
          <RichTextEditor
            content={content}
            onChange={setContent}
            minHeight={300}
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">미리보기</h3>
          <RichTextViewer content={content} className="border rounded-md p-4" />
        </div>
      </div>
    );
  },
};

export const WithLinks: Story = {
  render: () => {
    const [content, setContent] = useState(
      `<p>공식 웹사이트: <a href="https://example.com" class="text-primary underline">방문하기</a></p>`
    );
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="링크를 포함한 내용을 입력하세요..."
        minHeight={250}
      />
    );
  },
};

export const WithImages: Story = {
  render: () => {
    const [content, setContent] = useState(
      `<p>시설 사진:</p><img src="https://via.placeholder.com/300x200" alt="시설 사진" style="max-width: 100%; border-radius: 4px;" />`
    );
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        minHeight={400}
      />
    );
  },
};

export const MultilineTextarea: Story = {
  render: () => {
    const [content, setContent] = useState(
      `<p>줄 1</p><p>줄 2</p><p>줄 3</p><p>줄 4</p><p>줄 5</p>`
    );
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        minHeight={200}
        maxHeight={400}
      />
    );
  },
};

export const FormattingShowcase: Story = {
  render: () => {
    const [content, setContent] = useState(
      `<h2>글꼴 스타일</h2>
<p><strong>굵은</strong> <em>기울임</em> <u>밑줄</u> <s>취소선</s></p>
<h3>다양한 제목</h3>
<p>일반 텍스트입니다.</p>
<ul><li>목록 항목 1</li><li>목록 항목 2</li></ul>
<blockquote>인용구입니다</blockquote>`
    );
    return (
      <RichTextEditor
        content={content}
        onChange={setContent}
        minHeight={350}
      />
    );
  },
};

export const Viewer: Story = {
  render: () => (
    <RichTextViewer content={richContent} className="border rounded-md p-6" />
  ),
};

export const ViewerWithStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">문서 내용</h3>
      <RichTextViewer
        content={richContent}
        className="bg-muted/50 border rounded-lg p-6"
      />
    </div>
  ),
};
