#!/bin/bash
# .ts/.tsx 파일 편집 후 패턴 위반 검사
# PostToolUse:Edit 훅에서 실행

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

# .ts/.tsx 파일만 체크
if ! echo "$FILE" | grep -qE "\.(ts|tsx)$"; then
  exit 0
fi

# stories 파일 제외
if echo "$FILE" | grep -q "\.stories\."; then
  exit 0
fi

# 파일이 존재하지 않으면 종료
if [ ! -f "$FILE" ]; then
  exit 0
fi

ISSUES=""

# 1. window.alert/confirm/prompt 체크
ALERT=$(grep -n "window\.alert\|window\.confirm\|window\.prompt" "$FILE" 2>/dev/null)
if [ -n "$ALERT" ]; then
  ISSUES="$ISSUES\n[window.alert/confirm] → toast 또는 AlertDialog 사용:\n$ALERT"
fi

# 2. console.log (개발 환경 체크 없는 것)
CONSOLE=$(grep -n "console\.log\|console\.error\|console\.warn" "$FILE" 2>/dev/null \
  | grep -v "NODE_ENV\|development")
if [ -n "$CONSOLE" ]; then
  ISSUES="$ISSUES\n[console.log 프로덕션 코드]:\n$CONSOLE"
fi

# 3. any 타입
ANY=$(grep -n ": any\b\|as any\b" "$FILE" 2>/dev/null)
if [ -n "$ANY" ]; then
  ISSUES="$ISSUES\n[any 타입 사용]:\n$ANY"
fi

if [ -n "$ISSUES" ]; then
  MSG=$(printf "⚠️ 패턴 위반 발견: %s\n%b" "$(basename "$FILE")" "$ISSUES")
  jq -n --arg msg "$MSG" \
    '{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": $msg}}'
fi
