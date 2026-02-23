# 보안 규칙

적용 대상: `**/*.ts`, `**/*.tsx`

## 커밋 전 필수 확인

- [ ] 하드코딩된 시크릿(API 키, 비밀번호, 토큰) 없음
- [ ] 모든 사용자 입력 검증됨
- [ ] SQL Injection 방지 (파라미터화 쿼리)
- [ ] XSS 방지 (HTML 출력 시 sanitize)
- [ ] CSRF 방어 적용

## 시크릿 처리

- 코드에 자격증명 직접 삽입 금지
- 환경변수 또는 시크릿 관리 시스템 사용
- localStorage에 토큰 저장 금지 (CLAUDE.md 핵심 규칙)
- `.env.local`은 `.gitignore`에 포함

## 인증/인가

- 모든 API 엔드포인트 인증 확인
- 엔드포인트 rate limiting 적용
- 에러 메시지에 민감 정보 노출 금지

## Next.js 보안

- Server Actions에서 입력 검증 필수
- API Routes에서 CORS 설정 확인
- 원시 HTML 삽입 API 사용 금지 (XSS 위험)
- 외부 URL redirect 시 허용 목록 검증

## 취약점 발견 시

1. 즉시 작업 중단
2. security-reviewer 에이전트 실행
3. 심각도 높은 취약점 해결 후 진행
4. 유사 패턴 전체 코드베이스 감사
