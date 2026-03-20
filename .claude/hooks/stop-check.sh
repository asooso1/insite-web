#!/bin/bash
# 세션 종료 시 미커밋 소스 변경사항 안내
# Stop 훅에서 실행

# .omc/, CLAUDE.md 등 비소스 파일 제외하고 실제 소스 변경사항 확인
CHANGES=$(git status --short 2>/dev/null \
  | grep -v "^??" \
  | grep -v "\.omc/\|CLAUDE\.md\|\.claude/")

if [ -n "$CHANGES" ]; then
  COUNT=$(echo "$CHANGES" | wc -l | tr -d ' ')
  echo "{\"systemMessage\": \"📋 미커밋 소스 변경사항 ${COUNT}개 — 커밋 전 /pre-commit 검증을 권장합니다.\"}"
fi
