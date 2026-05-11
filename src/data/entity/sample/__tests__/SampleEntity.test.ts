/**
 * Unit 테스트 예시 — Entity initData 검증
 *
 * 테스트 피라미드의 Unit 층.
 * DOM 없이 순수 데이터 검증만 수행.
 */
import { Sample } from '../SampleEntity';

describe('SampleEntity', () => {
  it('initData가 존재한다', () => {
    expect(Sample.initData).toBeDefined();
  });

  it('initData의 id가 0이다', () => {
    expect(Sample.initData.id).toBe(0);
  });

  it('initData의 name이 빈 문자열이다', () => {
    expect(Sample.initData.name).toBe('');
  });

  it('initData의 status가 active이다', () => {
    expect(Sample.initData.status).toBe('active');
  });

  it('initData의 score가 0이다', () => {
    expect(Sample.initData.score).toBe(0);
  });
});
