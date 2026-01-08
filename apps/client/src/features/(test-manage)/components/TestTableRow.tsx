'use client';

import { useRouter } from 'next/navigation';
import { type Test, TestType } from '@/features/(test-manage)/types';

import { TestStatusBadge } from './TestStatusBadge';
import { IntegrationIcon } from './IntegrationIcon';
import { UserAvatar } from './UserAvatar';
import { TestActionButton } from './TestActionButton';

interface TestTableRowProps {
  test: Test;
}

export function TestTableRow({ test }: TestTableRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    if (test.type === TestType.DRAFT) {
      router.push(`/tests/${test.id}?mode=edit`);
      return;
    } else {
      router.push(`/dashboard/${test.id}`);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    //액션 버튼 클릭시 행 클릭 이벤트 발생하지 않도록 처리
    e.stopPropagation();
  };

  return (
    <tr onClick={handleRowClick} className="cursor-pointer transition-colors hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{test.name}</div>
      </td>
      <td className="px-6 py-4">
        <TestStatusBadge type={test.type} />
      </td>
      <td className="px-6 py-4">
        <IntegrationIcon url={test.integrationUrl} />
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">
          {test.participants > 0 ? test.participants : '-'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <UserAvatar name={test.creator.name} imageUrl={test.creator.profileImageUrl} />
        </div>
      </td>
      <td className="px-6 py-4" onClick={handleActionClick}>
        <TestActionButton testId={test.id} />
      </td>
    </tr>
  );
}
