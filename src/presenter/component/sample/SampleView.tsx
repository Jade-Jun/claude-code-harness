/**
 * 3파일 세트 예시 — View (순수 렌더링)
 *
 * ViewModel의 반환값을 props로 받아 렌더링만 수행.
 * 비즈니스 로직을 포함하지 않는다.
 */

import { Sample } from '@/data/entity/sample/SampleEntity';

interface SampleViewProps {
  items: Sample.Entity[];
  search: string;
  onSearch: (value: string) => void;
}

export function SampleView({ items, search, onSearch }: SampleViewProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sample</h1>

      <input
        type="text"
        placeholder="검색..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="border rounded px-3 py-2 mb-4 w-full"
      />

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2 border-b">이름</th>
            <th className="text-left p-2 border-b">상태</th>
            <th className="text-left p-2 border-b">점수</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border-b">{item.name}</td>
              <td className="p-2 border-b">{item.status}</td>
              <td className="p-2 border-b">{item.score}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
