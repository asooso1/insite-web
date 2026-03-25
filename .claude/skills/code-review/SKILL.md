---
name: code-review
description: 미커밋 변경사항 보안 및 품질 종합 리뷰. 코드 작성 후 사용.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob
---

# 코드 리뷰

미커밋 변경사항에 대한 보안 및 품질 종합 리뷰입니다. $ARGUMENTS

## 검토 항목

### 보안 (Critical)
- 하드코딩된 자격증명/API 키
- 사용자 입력 미검증
- XSS (innerHTML without DOMPurify)
- Open redirect

### 코드 품질 (High)
- 함수 50줄 초과 / 파일 800줄 초과
- 에러 처리 누락
- `any` 타입 사용

### Next.js/React 패턴
- useEffect 의존성 배열 불완전
- 리스트 key에 index 사용
- 로딩/에러 상태 누락

## 결과 형식

```
[CRITICAL] 파일:줄 - 문제 → 수정
[HIGH]     ...
[MEDIUM]   ...

판정: APPROVE / WARNING / BLOCK
```

APPROVE: critical/high 없음 | WARNING: high 존재 | BLOCK: critical 존재
