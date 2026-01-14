'use client';

import { useRouter } from 'next/navigation';
import { type Test, TestStatus } from '@/features/(test-manage)/types';

import { TestStatusBadge } from './TestStatusBadge';
import { IntegrationButton } from './IntegrationButton';

import { TestActionButton } from './TestActionButton';

interface TestTableRowProps {
  test: Test;
}

export function TestTableRow({ test }: TestTableRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    if (test.status === TestStatus.DRAFT) {
      router.push(`/tests/${test.publicId}?mode=edit`);
      return;
    } else {
      router.push(`/dashboard/${test.publicId}`);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    //액션 버튼 클릭시 행 클릭 이벤트 발생하지 않도록 처리
    e.stopPropagation();
  };

  return (
    <tr onClick={handleRowClick} className="cursor-pointer transition-colors hover:bg-gray-50">
      <td className="px-6 py-4 text-left">
        <div className="font-medium text-gray-900">{test.title}</div>
      </td>
      <td className="px-6 py-4 text-center">
        <TestStatusBadge status={test.status} />
      </td>
      <td className="px-6 py-4 text-center">
        <IntegrationButton url={test.url} testId={test.publicId} />
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-sm text-gray-900">-</span>
      </td>
      <td className="px-6 py-4 text-center" onClick={handleActionClick}>
        <TestActionButton testId={test.publicId} />
      </td>
    </tr>
  );
}
