import { ClipboardList, MoreVertical } from 'lucide-react';
import type { Test } from '@/features/(test-manage)/types';
import { TestStatusBadge } from './TestStatusBadge';
import { IntegrationIcon } from './IntegrationIcon';
import { UserAvatar } from './UserAvatar';

interface TestTableRowProps {
  test: Test;
}

export function TestTableRow({ test }: TestTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
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
      <td className="px-6 py-4">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
