# /verify - 코드 검증

빌드, 타입, 린트, 테스트를 순서대로 실행하여 PR 준비 상태를 확인합니다.

## 사용법

```
/verify          # 전체 검증
/verify quick    # 빌드 + 타입만
/verify pre-pr   # PR 전 전체 검증
```

## 검증 순서

```
1. npm run build     → 빌드 실패 시 중단
2. tsc --noEmit      → 타입 에러 확인
3. npm run lint      → 린트 검사
4. (테스트 있을 경우) 테스트 실행
5. console.log 잔존 여부 확인
6. git status        → 미커밋 변경 확인
```

## 결과 형식

```
VERIFICATION: [PASS/FAIL]

✅ Build: 성공
✅ Types: 에러 없음
✅ Lint: 경고 없음
⚠️ Tests: 커버리지 75% (목표: 80%)
✅ Secrets: 없음
✅ Logs: 없음

PR 준비: [가능/불가]
```

## 실패 시

- 빌드 실패 → `/build-fix` 실행
- 타입 에러 → build-error-resolver 에이전트
- 린트 에러 → 해당 파일 수정
- 테스트 실패 → tdd-guide 에이전트
