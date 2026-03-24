"use client";

import { useRouter } from "next/navigation";
import { HelpCircle, MessageSquare, LifeBuoy } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";

interface SupportCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const SUPPORT_CARDS: SupportCard[] = [
  {
    title: "FAQ",
    description: "자주 묻는 질문과 답변을 확인하세요",
    icon: HelpCircle,
    href: "/support/faq",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "QnA",
    description: "궁금한 사항을 질문하고 답변 받으세요",
    icon: MessageSquare,
    href: "/support/qna",
    color: "from-green-500 to-green-600",
  },
];

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <PageHeader
        title="고객지원"
        description="FAQ 및 QnA를 통해 지원을 받으세요"
        icon={LifeBuoy}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {SUPPORT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.href}
              onClick={() => router.push(card.href)}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity group-hover:opacity-5`}
              />
              <div className="relative flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
