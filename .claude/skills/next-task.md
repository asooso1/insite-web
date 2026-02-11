# 스킬: next-task

> 다음 미완료 태스크를 자동으로 찾아 제시합니다.

## 트리거

사용자가 `/next-task` 또는 "다음 작업" 요청 시

## 실행 단계

### 1. 현재 상태 확인

```bash
# 현재 상태 파일 읽기
cat .claude/state/current.md
```

### 2. 진행 상황 파싱

```bash
# task-progress.md에서 미완료 태스크 찾기
# 상태가 ⏳ 또는 🔄인 항목 필터링
```

### 3. 다음 태스크 결정

**우선순위:**
1. 현재 Phase의 `🔄 진행중` 항목
2. 현재 Phase의 첫 번째 `⏳ 대기` 항목
3. 다음 Phase의 첫 번째 항목

### 4. 태스크 상세 로드

해당 Phase의 context 파일에서 상세 정보 확인:
- `.claude/context/phase-2a.md` (현재)
- `.claude/context/phase-2b.md`
- etc.

### 5. 출력 형식

```markdown
## 다음 태스크

**Phase:** 2A - 핵심 데이터 컴포넌트
**태스크:** DataTable 컴포넌트 구현
**상태:** ⏳ 대기

### 상세 설명
[context 파일에서 가져온 상세 설명]

### 구현 가이드
[관련 코드 예시 및 참조 경로]

### 예상 파일
- `src/components/data-display/data-table.tsx`
- `src/components/data-display/data-table-toolbar.tsx`

---
구현을 시작하시겠습니까?
```

## 관련 파일

- `.claude/state/current.md` - 현재 상태
- `docs/task-progress.md` - 전체 진행 상황
- `.claude/context/*.md` - Phase별 상세

## 자동화 연계

태스크 완료 후 자동으로:
1. `update-progress` 스킬 호출
2. 커밋 생성 제안
3. 다음 태스크 제시
