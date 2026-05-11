# 디자인 토큰 시스템

## 원칙

**Figma Variables가 소스 오브 트루스.** 디자인팀이 Figma에서 관리하는 팔레트가 유일한 진실이다. 코드에서 임의로 색상을 추가하지 않는다.

## 4층 구조

```
Primitive (--color-*)
    ↓ var() 참조
Base (--color-base-*)
    ↓ var() 참조
Semantic (--sem-*)
    ↓ Figma 미등록 시
Todo (--todo-*)
```

### Primitive
팔레트 원자값. Figma의 Color 그룹에 대응.

```css
--color-gray-950: #030712;
--color-blue-500: #3B82F6;
```

네이밍: `--color-{hue}-{scale}`. Opacity는 `-a{NN}` 접미사로 `color-mix()` 사용.

```css
--color-blue-a20: color-mix(in srgb, var(--color-blue-500) 20%, transparent);
```

`color-mix()` 를 쓰는 이유: Primitive 값이 바뀌면 Opacity도 자동 추종. 디자인팀 백분율 기준과 정렬.

### Base
브랜드 진입점. Primitive를 `var()` 참조.

```css
--color-base-primary: var(--color-blue-500);
--color-base-secondary: var(--color-gray-700);
```

### Semantic
용도별 매핑. **코드에서 가장 먼저 찾아야 할 층.**

```css
--sem-bg-card: var(--color-gray-800);
--sem-text-base: var(--color-gray-50);
--sem-system-danger: var(--color-red-500);
```

네이밍: `--sem-{category}-{property}-{state}`. 카테고리 축약: Background→bg, Button→btn.

Semantic 변수는 반드시 Primitive를 `var()` 참조. hex 직접 입력은 Figma가 직접값인 경우만 허용.

### Todo
Figma 미등록이지만 코드에서 필요한 색상의 임시 보관소.

```css
--todo-bg-card-hover: var(--color-gray-700);
```

`grep -r "todo-" src/` 으로 디자인팀 요청 리스트를 추출할 수 있다. 디자인팀이 등록하면 `--sem-*` 으로 승격.

## Tailwind 연동 (2층 구조)

### tokens.css
순수 토큰 선언. Figma JSON의 1:1 미러.

### globals.css @theme
Tailwind 유틸리티 생성을 위한 alias 등록.

```css
@theme inline {
  --color-sem-bg-card: var(--sem-bg-card);
}
```

이렇게 하면 `bg-sem-bg-card` 같은 Tailwind 클래스가 생성된다. **CSS 변수명과 Tailwind 클래스명이 1:1 일치.**

Primitive(`--color-*`)는 Tailwind v4가 자동 인식하므로 alias 생략.

## 사용 우선순위

1. **Semantic 변수** — `bg-sem-bg-card`, `text-sem-text-base`
2. **Primitive 변수** — Semantic에 없을 때만. `bg-color-gray-800`
3. **Todo 변수** — Figma 미등록. 사용 시 주석 표기 "디자인팀 등록 요청"
4. **hex 하드코딩** — 금지. 차트 라이브러리(Recharts 등) CSS 변수 미지원 케이스만 예외.

## Figma 팔레트 갱신 절차

1. 디자인팀이 Figma Variables 업데이트 후 tokens.json export
2. `node scripts/migrate-tokens.mjs tokens.json --dry-run` 으로 변경 사항 확인
3. `node scripts/migrate-tokens.mjs tokens.json` 으로 tokens.css 갱신
4. globals.css @theme 섹션 수동 갱신 (신규 Semantic 추가 시)
5. `grep -r "todo-" src/` 로 승격 가능한 Todo 변수 확인

## 금지 사항

- `tokens.css`에 임의 토큰 추가 (Figma JSON 미러만)
- Semantic 변수에 hex 직접 입력 (`var()` 참조만)
- Tailwind 기본 색상(`blue-500`, `red-400` 등) 직접 사용 → CSS 변수 사용
- `bg-[#hex]`, `style={{ color: '#hex' }}` 등 인라인 hex
- `rgba()` 직접 입력 → `color-mix()` + Primitive 참조
