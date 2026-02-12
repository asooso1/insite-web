# 스킬: test-and-commit

> 테스트 실행 및 커밋 자동화

## 트리거

- 태스크 구현 완료 후
- 사용자가 `/commit` 요청 시

## 실행 단계

### 1. 빌드 확인

```bash
cd /Volumes/jinseok-SSD-1tb/00_insite/insite-web
npm run build
```

**실패 시:** 에러 수정 후 재시도

### 2. 린트 확인

```bash
npm run lint
```

**경고 있을 시:** 수정 권장

### 3. 테스트 실행

```bash
# 유닛 테스트
npm run test

# E2E 테스트 (선택적)
npm run test:e2e
```

### 4. 변경 사항 확인

```bash
git status
git diff --stat
```

### 5. 커밋 생성

**커밋 메시지 형식:**
```
<type>: <한글 설명>

Co-Authored-By: Claude <noreply@anthropic.com>
```

**type 종류:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경

**예시:**
```bash
git add src/components/data-display/data-table.tsx
git add tests/components/data-table.test.tsx

git commit -m "feat: DataTable 컴포넌트 구현

- TanStack Table v8 기반 테이블
- 가상화 스크롤 지원
- 3가지 variant (default/striped/category)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 6. 진행 상황 업데이트

커밋 후 자동으로 `update-progress` 스킬 실행

## 주의사항

- **민감 파일 제외:** `.env`, `credentials.json` 등
- **대용량 파일 확인:** 바이너리, node_modules 등
- **훅 실패 시:** 문제 해결 후 새 커밋 (--amend 금지)

## 커밋 전 체크리스트

- [ ] 빌드 성공
- [ ] 린트 통과
- [ ] 테스트 통과
- [ ] 타입 에러 없음
- [ ] 민감 정보 없음

## 자동화 옵션

```bash
# 모든 체크 한 번에 실행
npm run build && npm run lint && npm run test
```
