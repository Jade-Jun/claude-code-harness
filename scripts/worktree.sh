#!/usr/bin/env bash
set -euo pipefail

# Git Worktree 라이프사이클 관리 스크립트
# 사용법:
#   ./scripts/worktree.sh create {name}   - feature 브랜치 + 워크트리 생성
#   ./scripts/worktree.sh remove {name}   - 워크트리 제거 (브랜치는 유지)
#   ./scripts/worktree.sh list            - 활성 워크트리 목록

WORKTREE_DIR=".worktrees"

create() {
  local name="$1"
  local branch="feature/${name}"
  local path="${WORKTREE_DIR}/${name}"

  if [ -d "$path" ]; then
    echo "❌ 워크트리가 이미 존재합니다: $path"
    echo "   다른 이름을 사용하세요 (예: ${name}-2)"
    exit 1
  fi

  # develop에서 feature 브랜치 분기
  git branch "$branch" develop 2>/dev/null || {
    echo "⚠️  브랜치 $branch 가 이미 존재합니다. 기존 브랜치로 워크트리를 생성합니다."
  }

  # 워크트리 생성
  mkdir -p "$WORKTREE_DIR"
  git worktree add "$path" "$branch"

  echo ""
  echo "✅ 워크트리 생성 완료"
  echo "   경로: $path"
  echo "   브랜치: $branch"
  echo ""
  echo "   다음 단계:"
  echo "   cd $path"
  echo "   pnpm install"
}

remove() {
  local name="$1"
  local path="${WORKTREE_DIR}/${name}"

  if [ ! -d "$path" ]; then
    echo "❌ 워크트리를 찾을 수 없습니다: $path"
    exit 1
  fi

  git worktree remove "$path" --force 2>/dev/null || {
    echo "⚠️  git worktree remove 실패. 수동 정리를 시도합니다."
    git worktree prune
    rm -rf "$path" 2>/dev/null || echo "   디렉토리 잔존 (node_modules 잠금). 수동 삭제 필요."
  }

  echo "✅ 워크트리 제거 완료: $path"
  echo "   (feature 브랜치는 유지됩니다)"
}

list() {
  echo "활성 워크트리 목록:"
  git worktree list
}

case "${1:-}" in
  create)
    [ -z "${2:-}" ] && echo "사용법: $0 create {name}" && exit 1
    create "$2"
    ;;
  remove)
    [ -z "${2:-}" ] && echo "사용법: $0 remove {name}" && exit 1
    remove "$2"
    ;;
  list)
    list
    ;;
  *)
    echo "사용법: $0 {create|remove|list} [name]"
    exit 1
    ;;
esac
