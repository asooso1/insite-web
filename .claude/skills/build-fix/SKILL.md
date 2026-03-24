---
name: build-fix
description: TypeScript 빌드 에러를 최소 변경으로 해결. 빌드 실패 시 사용.
disable-model-invocation: true
allowed-tools: Bash, Read, Edit, Grep
---

# 빌드 에러 해결

TypeScript 컴파일 에러를 최소 변경으로 체계적으로 해결합니다. $ARGUMENTS

## 절차

1. `npm run build` → 전체 에러 수집
2. 파일별 그룹화, 의존성 순서 정렬 (근본 문제 먼저)
3. 에러별 최소 수정 → 빌드 확인 → 다음 에러
4. 새 문제 발생 시 사용자 확인 요청

## 수정 패턴

| 에러 | 수정 |
|------|------|
| 암시적 `any` | 타입 어노테이션 추가 |
| `undefined` 가능성 | null 체크 또는 옵셔널 체이닝 |
| 모듈 찾기 실패 | import 경로 수정 |
| 타입 불일치 | 타입 캐스팅 또는 타입 수정 |

## 원칙

- 최소 diff (광범위한 리팩토링 금지)
- 아키텍처 변경 금지
- 동일 에러 3회 반복 시 중단
- 패키지 설치 필요 시 사용자 확인
