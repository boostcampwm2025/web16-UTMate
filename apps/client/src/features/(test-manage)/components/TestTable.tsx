import type { Test } from '@/features/(test-manage)/types';
import { TestTableRow } from './TestTableRow';

interface TestTableProps {
  tests: Test[];
}

export function TestTable({ tests }: TestTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-left">
            <th className="px-6 py-3">테스트 이름</th>
            <th className="px-6 py-3">상태</th>
            <th className="px-6 py-3">통합</th>
            <th className="px-6 py-3">참가자</th>
            <th className="px-6 py-3">생성자</th>
            <th className="px-6 py-3">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {tests.map((test) => (
            <TestTableRow key={test.id} test={test} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
