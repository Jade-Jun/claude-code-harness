#!/usr/bin/env node

/**
 * Figma tokens.json → CSS 변수 변환 스크립트
 *
 * 사용법:
 *   node scripts/migrate-tokens.mjs [tokens.json 경로]
 *
 * 동작:
 *   1. Figma Variables에서 export한 JSON 파일을 읽는다
 *   2. 4층 구조(Primitive → Base → Semantic → Todo)로 분류한다
 *   3. src/styles/tokens.css를 갱신한다
 *   4. src/styles/globals.css의 @theme 섹션을 갱신한다
 *
 * 주의:
 *   - sed 사용 금지 (Windows CRLF 함정). Node.js로 처리.
 *   - 기존 --todo-* 변수는 보존. 신규 Semantic에 매칭되면 자동 승격.
 *   - dry-run 모드로 먼저 확인 후 적용 권장.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const TOKENS_CSS_PATH = resolve('src/styles/tokens.css');
const GLOBALS_CSS_PATH = resolve('src/styles/globals.css');

// ─── Figma JSON 구조 파싱 ───

function parseTokensJson(jsonPath) {
  if (!existsSync(jsonPath)) {
    console.error(`❌ 파일을 찾을 수 없습니다: ${jsonPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  const tokens = {
    primitive: [],  // --color-{hue}-{scale}
    base: [],       // --color-base-{name}
    semantic: [],   // --sem-{category}-{property}-{state}
  };

  // TODO: Figma Variables JSON 구조에 맞게 파싱 로직 구현
  // 프로젝트의 Figma Variables export 형식에 따라 달라짐.
  //
  // 일반적인 구조:
  // {
  //   "Color": {
  //     "Gray": { "50": { "value": "#F9FAFB" }, ... },
  //     "Blue": { "500": { "value": "#3B82F6" }, ... }
  //   },
  //   "Base": {
  //     "Primary": { "value": "{Color.Blue.500}" }
  //   },
  //   "Semantic": {
  //     "Background": {
  //       "card": { "value": "{Color.Gray.800}" }
  //     }
  //   }
  // }

  console.log('📋 파싱 완료:', {
    primitive: tokens.primitive.length,
    base: tokens.base.length,
    semantic: tokens.semantic.length,
  });

  return tokens;
}

// ─── CSS 생성 ───

function generateTokensCss(tokens) {
  const lines = [':root {'];

  lines.push('  /* 1. Primitive */');
  for (const t of tokens.primitive) {
    lines.push(`  --color-${t.name}: ${t.value};`);
  }

  lines.push('');
  lines.push('  /* 2. Base */');
  for (const t of tokens.base) {
    lines.push(`  --color-base-${t.name}: var(--color-${t.ref});`);
  }

  lines.push('');
  lines.push('  /* 3. Semantic */');
  for (const t of tokens.semantic) {
    lines.push(`  --sem-${t.name}: var(--color-${t.ref});`);
  }

  lines.push('}');
  return lines.join('\n');
}

// ─── 메인 ───

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const jsonPath = args.find(a => !a.startsWith('--'));

if (!jsonPath) {
  console.log('사용법: node scripts/migrate-tokens.mjs <tokens.json> [--dry-run]');
  console.log('');
  console.log('예시:');
  console.log('  node scripts/migrate-tokens.mjs design/Dark_tokens.json --dry-run');
  console.log('  node scripts/migrate-tokens.mjs design/Dark_tokens.json');
  process.exit(0);
}

const tokens = parseTokensJson(jsonPath);
const css = generateTokensCss(tokens);

if (isDryRun) {
  console.log('\n🔍 Dry-run 모드 — 파일을 수정하지 않습니다.\n');
  console.log(css);
} else {
  writeFileSync(TOKENS_CSS_PATH, css, 'utf-8');
  console.log(`✅ ${TOKENS_CSS_PATH} 갱신 완료`);
  // TODO: globals.css @theme 섹션 자동 갱신
  console.log(`⚠️  ${GLOBALS_CSS_PATH}의 @theme 섹션은 수동 갱신 필요`);
}
