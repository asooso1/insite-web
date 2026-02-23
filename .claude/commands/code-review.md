# /code-review - 코드 품질 검토

미커밋 변경사항에 대한 보안 및 품질 종합 리뷰를 실행합니다.

## 사용법

```
/code-review
/code-review <특정 파일 또는 범위>
```

## 검토 항목

### 보안 (Critical)
- 하드코딩된 자격증명/API 키
- SQL Injection 취약점
- 사용자 입력 미검증
- 인증 누락 엔드포인트

### 코드 품질 (High)
- 함수 50줄 초과
- 파일 800줄 초과
- 중첩 4단계 초과
- 에러 처리 누락
- 디버그 로그 잔존

### Next.js/React 패턴
- useEffect 의존성 배열 불완전
- 리스트 key에 index 사용
- prop drilling 과다
- 로딩/에러 상태 누락

### 품질 기준
- 불변성 위반 패턴
- 테스트 커버리지 부족
- 타입 안전성 (`any` 사용)

## 결과 형식

```
[CRITICAL] 파일경로:줄번호 - 문제 설명 → 수정 방안
[HIGH]     ...
[MEDIUM]   ...
[LOW]      ...

판정: APPROVE / WARNING / BLOCK
```

## 판정 기준

- **APPROVE**: critical/high 이슈 없음
- **WARNING**: high 이슈 존재, 신중히 진행
- **BLOCK**: critical 이슈 → 해결 후 머지

신뢰도 80% 이상인 항목만 보고합니다.
