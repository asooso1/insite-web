import { FaqForm } from "../_components/faq-form";

/**
 * FAQ 등록 페이지
 */
export default function FaqNewPage() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">FAQ 등록</h1>
        <p className="text-muted-foreground">새로운 FAQ를 등록합니다.</p>
      </div>
      <FaqForm />
    </div>
  );
}
