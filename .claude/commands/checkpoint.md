# /checkpoint - 작업 체크포인트

개발 진행 상태를 저장하고 비교하는 워크플로우 상태 관리 도구입니다.

## 사용법

```
/checkpoint create <이름>    # 체크포인트 생성
/checkpoint verify <이름>    # 상태 비교
/checkpoint list             # 전체 목록 확인
/checkpoint clear            # 정리 (최근 5개 유지)
```

## 체크포인트 생성

- 현재 상태 확인 (clean state 검증)
- git stash 또는 커밋 생성
- `.claude/checkpoints.log`에 타임스탬프 + git SHA 기록

## 전형적인 워크플로우

```
1. setup       - 기능 브랜치 시작
2. core        - 핵심 구현 완료
3. tested      - 테스트 통과
4. refactored  - 리팩토링 완료
5. pr-ready    - PR 준비 완료
```

## 비교 결과 형식

```
체크포인트: <이름> vs 현재
변경 파일: X개
테스트 통과율: 이전 95% → 현재 98%
커버리지: 이전 80% → 현재 83%
```

## 활용 시나리오

- 실험적 변경 전 안전망 확보
- 리팩토링 전후 상태 비교
- 장기 작업의 중간 진행 저장
