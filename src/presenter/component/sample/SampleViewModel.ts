/**
 * 3파일 세트 예시 — ViewModel (비즈니스 로직 훅)
 *
 * 데이터 조회, 상태 관리, 이벤트 핸들러를 담당.
 * View는 이 훅의 반환값만으로 렌더링한다.
 */

import { useState, useCallback } from 'react';
import { Sample } from '@/data/entity/sample/SampleEntity';

export function useSampleViewModel() {
  const [items, setItems] = useState<Sample.Entity[]>([
    { ...Sample.initData, id: 1, name: 'Sample Item 1', score: 85 },
    { ...Sample.initData, id: 2, name: 'Sample Item 2', score: 72 },
    { ...Sample.initData, id: 3, name: 'Sample Item 3', score: 91 },
  ]);

  const [search, setSearch] = useState('');

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return {
    items: filteredItems,
    search,
    onSearch: handleSearch,
  };
}
