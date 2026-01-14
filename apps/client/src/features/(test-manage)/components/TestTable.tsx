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
          <tr className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            <th className="px-6 py-3 text-left">테스트 이름</th>
            <th className="px-6 py-3 text-center">상태</th>
            <th className="px-6 py-3 text-center">통합</th>
            <th className="px-6 py-3 text-center">참가자</th>
            <th className="px-6 py-3 text-center">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {tests.map((test) => (
            <TestTableRow key={test.publicId} test={test} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
