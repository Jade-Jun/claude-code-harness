/**
 * PreToolUse Hook: 브랜치 보호
 *
 * develop/main 브랜치에서 파일 수정 도구(Edit, Write, Update, Create)를
 * 물리적으로 차단한다. 판단형 룰이 아닌 실행 차단.
 *
 * 설치: .claude/settings.json의 hooks.PreToolUse에 등록
 * {
 *   "hooks": {
 *     "PreToolUse": [
 *       { "matcher": "Edit|Write|Update|Create", "hook": "node hooks/guard-branch.mjs" }
 *     ]
 *   }
 * }
 */

import { execSync } from 'child_process';

// 보호할 브랜치 목록 (프로젝트에 맞게 수정)
const PROTECTED_BRANCHES = ['main', 'develop', 'master'];

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

function isInWorktree() {
  try {
    const gitDir = execSync('git rev-parse --git-dir', { encoding: 'utf-8' }).trim();
    return gitDir.includes('.worktrees') || gitDir.includes('worktrees');
  } catch {
    return false;
  }
}

const branch = getCurrentBranch();
const toolName = process.argv[2] || '';

if (PROTECTED_BRANCHES.includes(branch) && !isInWorktree()) {
  console.error(`\n🚫 차단: ${branch} 브랜치에서 ${toolName} 사용 불가.`);
  console.error(`워크트리를 생성하세요: ./scripts/worktree.sh create {name}\n`);
  process.exit(1);
}

process.exit(0);
