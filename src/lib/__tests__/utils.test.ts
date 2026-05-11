/**
 * Unit 테스트 예시 — cn() 유틸 함수
 */
import { cn } from '../utils';

describe('cn', () => {
  it('문자열을 합친다', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('조건부 클래스를 처리한다', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('tailwind-merge로 충돌을 해소한다', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
