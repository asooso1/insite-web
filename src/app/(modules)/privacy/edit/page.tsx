import { PrivacyForm } from "../_components/privacy-form";

/**
 * 개인정보정책 수정 페이지
 */
export default function PrivacyEditPage() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">개인정보정책 수정</h1>
        <p className="text-muted-foreground">개인정보정책을 수정합니다.</p>
      </div>
      <PrivacyForm />
    </div>
  );
}
