import { TestStatus } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';

interface TestStatusBadgeProps {
  status: TestStatus;
}

export function TestStatusBadge({ status }: TestStatusBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium', {
        'bg-blue-50 text-blue-700': status === TestStatus.PUBLISHED,
        'bg-gray-100 text-gray-700': status === TestStatus.DRAFT,
        'bg-green-50 text-green-700': status === TestStatus.ARCHIVED,
      })}
    >
      {status}
    </span>
  );
}
