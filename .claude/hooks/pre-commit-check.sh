#!/bin/bash
# git commit 전 패턴 위반 검사
# PreToolUse:Bash 훅에서 실행

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# git commit 명령이 아니면 종료
if ! echo "$CMD" | grep -qE "git commit"; then
  exit 0
fi

CWD=$(echo "$INPUT" | jq -r '.cwd // "."')
cd "$CWD" 2>/dev/null || true

ISSUES=""

# 1. window.alert/confirm/prompt 체크
ALERT=$(grep -rn "window\.alert\|window\.confirm\|window\.prompt" src/app/ src/components/ 2>/dev/null \
  | grep -v "\.stories\." | head -3)
if [ -n "$ALERT" ]; then
  ISSUES="$ISSUES\n[window.alert/confirm 발견]\n$ALERT"
fi

# 2. console.log/error 프로덕션 코드 체크 (warn은 의도적 경고로 허용, API 라우트/error.tsx 제외)
CONSOLE=$(grep -rn "console\.log\|console\.error" src/app/ src/components/ 2>/dev/null \
  | grep -v "NODE_ENV\|development\|\.stories\.\|src/app/api/\|src/app/error\." \
  | grep -v ":[[:space:]]*\*\|:[[:space:]]*//" | head -3)
if [ -n "$CONSOLE" ]; then
  ISSUES="$ISSUES\n[console.log/error 프로덕션 코드 발견]\n$CONSOLE"
fi

# 3. any 타입 체크
ANY=$(grep -rn ": any\b\|as any\b" src/app/ src/components/ src/lib/ 2>/dev/null \
  | grep -v "\.stories\.\|\.d\.ts" | head -3)
if [ -n "$ANY" ]; then
  ISSUES="$ISSUES\n[any 타입 발견]\n$ANY"
fi

# 위반사항 있으면 additionalContext로 Claude에게 전달
if [ -n "$ISSUES" ]; then
  MSG=$(printf "⚠️ 커밋 전 패턴 위반이 발견됐습니다. /pre-commit 으로 전체 검사를 먼저 실행해주세요.\n%b" "$ISSUES")
  jq -n --arg msg "$MSG" \
    '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "additionalContext": $msg}}'
fi
