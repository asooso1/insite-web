import { QnaForm } from "../_components/qna-form";

/**
 * Q&A 질문 등록 페이지
 */
export default function QnaNewPage() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">질문 등록</h1>
        <p className="text-muted-foreground">새로운 질문을 등록합니다.</p>
      </div>
      <QnaForm />
    </div>
  );
}
