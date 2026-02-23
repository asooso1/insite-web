# Git 워크플로우 규칙

## 커밋 형식

```
<type>: <한글 설명>
```

**허용 타입:** `feat` | `fix` | `refactor` | `docs` | `test` | `chore` | `perf` | `ci`

**예시:**
- `feat: 사용자 목록 페이지 구현`
- `fix: 작업지시 상세 조회 오류 수정`
- `refactor: 시설 API 클라이언트 리팩토링`
- `docs: CLAUDE.md 개발 규칙 업데이트`

## PR 프로세스

1. 전체 커밋 히스토리 검토 (`git diff [base]...HEAD`)
2. 변경 범위 명확한 요약 작성
3. 테스트 계획 포함
4. 브랜치 push 시 `-u` 플래그 사용

## 기능 개발 흐름

1. **계획**: planner 에이전트로 의존성/위험 파악
2. **TDD**: 테스트 먼저(RED) → 구현(GREEN) → 리팩토링
3. **코드 리뷰**: code-reviewer 에이전트로 심각도 높은 이슈 처리
4. **커밋**: 한국어 설명 포함 커밋 메시지

## 금지사항

- `git push --force` (main/master 브랜치)
- `--no-verify` 스킵 (명시적 요청 없이)
- 민감 정보 포함 파일 커밋 (`.env`, credentials)
- 작업 중인 파일 무단 삭제/덮어쓰기
