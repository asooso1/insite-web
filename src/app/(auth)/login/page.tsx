import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

/**
 * 로그인 페이지 메타데이터
 */
export const metadata = {
  title: "로그인 - Insite",
  description: "Insite 시스템 로그인",
};

/**
 * Insite 로고 SVG
 */
function InsiteLogo(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      id="Layer_2"
      width="180"
      height="44"
      data-name="Layer 2"
      className="fill-current"
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="-521.1"
          x2="-521.1"
          y1="900.9"
          y2="879.1"
          gradientTransform="matrix(1 0 0 -1 539 908.7)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="currentColor" />
          <stop offset=".5" stopColor="currentColor" />
          <stop offset=".6" stopColor="currentColor" stopOpacity=".7" />
          <stop offset=".7" stopColor="currentColor" stopOpacity=".5" />
          <stop offset=".8" stopColor="currentColor" stopOpacity=".3" />
          <stop offset=".9" stopColor="currentColor" stopOpacity=".1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          xlinkHref="#linear-gradient"
          id="linear-gradient-2"
          x1="-521.1"
          x2="-521.1"
          y1="865.1"
          y2="886.9"
        />
      </defs>
      <g id="Layer_1-2" data-name="Layer 1">
        <path d="M51.3 6.6V1c0-.7.3-1 1-1h4c.7 0 1 .3 1 1v5.7c0 .7-.3 1.1-1 1.1h-4c-.7 0-1-.4-1-1.1Zm0 35.9V13c0-.7.3-1.1 1-1.1h4c.7 0 1.1.4 1.1 1.1v29.6c0 .4 0 .7-.2.8-.2.1-.4.2-.8.2h-4c-.7 0-1.1-.4-1.1-1.1ZM69.9 43.6H66c-.7 0-1.1-.4-1.1-1.1V13c0-.7.3-1.1 1.1-1.1h3.9c.7 0 1.1.4 1.1 1.1v2.2h.2c1-2.2 3.1-3.3 6.3-3.3h2.7c3 0 5.3.8 6.9 2.5 1.6 1.7 2.4 4 2.4 7.1v21c0 .7-.4 1.1-1.1 1.1h-3.9c-.7 0-1.1-.4-1.1-1.1V21.6c0-3.1-1.5-4.6-4.5-4.6H76c-3.4 0-5.1 1.8-5.1 5.3v20.2c0 .7-.3 1.1-1.1 1.1ZM108.4 43.6H96.8c-.7 0-1.1-.4-1.1-1.1v-3c0-.7.3-1 1.1-1h10.6c2.7 0 4-.9 4-2.8V35c0-1.7-1-2.9-2.9-3.8l-6.8-3.2c-2.1-1-3.6-2.1-4.6-3.3-.9-1.2-1.4-2.8-1.4-4.7 0-5.3 2.9-8 8.9-8h10.3c.7 0 1 .4 1 1.1v3c0 .7-.3 1.1-1 1.1h-9.1c-1.2 0-2.2.2-2.9.7-.7.4-1 1-1 1.7v.7c0 1.3 1.1 2.5 3.2 3.5l6.8 3.5c2.1 1 3.6 2.1 4.4 3.4.8 1.3 1.2 3 1.2 5.1 0 5.4-3.1 8.1-9.2 8.1ZM123.6 6.6V1c0-.7.3-1 1-1h4c.7 0 1 .3 1 1v5.7c0 .7-.3 1.1-1 1.1h-4c-.7 0-1-.4-1-1.1Zm0 35.9V13c0-.7.3-1.1 1-1.1h4c.7 0 1.1.4 1.1 1.1v29.6c0 .4 0 .7-.2.8-.2.1-.4.2-.8.2h-4c-.7 0-1.1-.4-1.1-1.1ZM136.7 17.1h-3c-.4 0-.7 0-.8-.2-.2-.1-.2-.4-.2-.8V13c0-.7.3-1.1 1.1-1.1h3c.4 0 .6-.2.6-.6V5.7c0-.7.4-1.1 1.1-1.1h3.9c.7 0 1.1.4 1.1 1.1v5.6c0 .4.2.6.7.6h5.8c.7 0 1.1.4 1.1 1.1v3.1c0 .7-.4 1-1.1 1h-5.8c-.5 0-.7.2-.7.6v16.1c0 3 1.6 4.5 4.7 4.5h1.8c.8 0 1.1.4 1.1 1.1v3.2c0 .7-.4 1-1.1 1h-2.7c-3.1 0-5.5-.8-7.2-2.5-1.7-1.7-2.6-4-2.6-7V17.7c0-.4-.2-.6-.6-.6ZM178.8 43.6h-13.7c-3.1 0-5.4-.8-7.1-2.5-1.7-1.7-2.5-4.1-2.5-7.1V21.6c0-3.1.8-5.4 2.5-7.1 1.7-1.7 4.1-2.5 7.1-2.5h5.1c3.1 0 5.4.8 7.1 2.5 1.7 1.7 2.6 4 2.6 7.1v7.9c0 .7-.4 1.1-1.1 1.1h-16.6c-.4 0-.7.2-.7.6v2.7c0 3 1.5 4.5 4.5 4.5h12.8c.8 0 1.1.4 1.1 1.1v3.1c0 .7-.4 1-1.1 1Zm-16.6-17.1h11.1c.4 0 .6-.2.6-.6v-4.2c0-1.6-.4-2.8-1.1-3.6-.7-.7-1.8-1.1-3.4-1.1H166c-1.6 0-2.7.4-3.4 1.1-.7.7-1.1 2-1.1 3.6v4.2c0 .4.2.6.6.6Z" />
        <path
          d="M35.9 8.6v4.6c0 .5-.4.9-.9.9H14.8c-4.4 0-8 3.4-8.4 7.7v.7c0 2.4 1 4.6 2.7 6.1.3.3.1.9-.4.9H2.8c-.7 0-1.3-.4-1.6-1-.8-1.8-1.3-3.9-1.3-6v-.7c.1-2.9 1.1-5.5 2.6-7.7 2.7-3.8 7.1-6.3 12.1-6.3h20.2c.5 0 .9.4.9.9Z"
          style={{ fill: "url(#linear-gradient)" }}
        />
        <path
          d="M35.9 28.8v.7c-.1 2.9-1.1 5.5-2.6 7.7-2.7 3.8-7.1 6.3-12.1 6.3H.9c-.5 0-.9-.4-.9-.9V38c0-.5.4-.9.9-.9h20.2c4.4 0 8-3.4 8.4-7.7v-.7c0-2.4-1-4.6-2.7-6.1-.3-.3-.1-.9.4-.9H33c.7 0 1.3.4 1.6 1 .8 1.8 1.3 3.9 1.3 6Z"
          style={{ fill: "url(#linear-gradient-2)" }}
        />
        <path d="M21.8 25.6c0-2.1-1.7-3.9-3.9-3.9S14 23.4 14 25.6s1.7 3.9 3.9 3.9 3.9-1.7 3.9-3.9Z" />
      </g>
    </svg>
  );
}

/**
 * 로그인 페이지
 */
export default function LoginPage(): ReactNode {
  return (
    <div className="flex min-h-screen">
      {/* 좌측: 비주얼 영역 (데스크탑 전용) */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12">
        <div className="relative w-full max-w-2xl">
          {/* 배경 블러 효과 */}
          <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-3xl" />

          {/* 미리보기 이미지 (추후 Swiper 또는 실제 이미지로 교체) */}
          <div className="relative z-10 p-8 flex gap-4 justify-center">
            <div className="w-48 h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl animate-fade-in-right" style={{ animationDelay: "0.1s" }} />
            <div className="w-48 h-64 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl animate-fade-in-right" style={{ animationDelay: "0.2s" }} />
            <div className="w-48 h-64 bg-gradient-to-br from-primary/40 to-primary/15 rounded-xl animate-fade-in-right" style={{ animationDelay: "0.3s" }} />
            <div className="w-48 h-64 bg-gradient-to-br from-primary/50 to-primary/20 rounded-xl animate-fade-in-right" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>

      {/* 우측: 로그인 폼 영역 */}
      <div className="flex w-full lg:w-2/5 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* 로고 */}
          <div className="flex justify-center">
            <InsiteLogo />
          </div>

          {/* 로그인 폼 */}
          <Suspense fallback={<div className="h-48 animate-pulse bg-muted rounded-lg" />}>
            <LoginForm />
          </Suspense>

          {/* 하단 링크 */}
          <div className="flex justify-center gap-4 text-sm">
            <Link
              href="/id-find"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
