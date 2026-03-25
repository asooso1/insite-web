#!/bin/bash
# 세션 종료 시 미커밋 소스 변경사항 안내
# Stop 훅에서 실행

# 프로젝트 루트 기준으로 실행 (hooks/ 디렉토리 기준 상위 3단계)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# .omc/, CLAUDE.md 등 비소스 파일 제외하고 실제 소스 변경사항 확인
CHANGES=$(git -C "$PROJECT_ROOT" status --short 2>/dev/null \
  | grep -v "^??" \
  | grep -v "\.omc/\|CLAUDE\.md\|\.claude/\|settings\.json")

if [ -n "$CHANGES" ]; then
  COUNT=$(echo "$CHANGES" | wc -l | tr -d ' ')
  # Stop 훅: additionalContext 형식으로 Claude에게 전달
  jq -n --arg msg "미커밋 소스 변경사항 ${COUNT}개 있음. 커밋 전 /pre-commit 검증 권장." \
    '{"hookSpecificOutput": {"hookEventName": "Stop", "additionalContext": $msg}}'
fi
