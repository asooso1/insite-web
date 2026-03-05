# insite 프로젝트

> 빌딩 에너지 관리 시스템 (BEMS/FMS)

## 프로젝트 구조

```
00_insite/
├── insite-web/     # Next.js 15 마이그레이션 (Phase 6 완료, ~75%)
├── csp-web/        # 기존 BFF (Spring Boot + Thymeleaf + Vue.js) - 참조만
├── csp-was/        # REST API 백엔드 (변경 금지, CORS만 허용)
└── csp-mobile-*/   # 모바일 앱
```

## 핵심 규칙

- **모든 문서/주석/커밋: 한국어**
- csp-was 변경 금지 (CORS 1줄만 허용)
- csp-web 참조만 (수정 금지)

## insite-web 참조

- `.claude/CLAUDE.md` - 개발 규칙 및 구현 패턴
- `.claude/context/` - Phase별 상세 계획
- `docs/task-progress.md` - 전체 진행 현황
