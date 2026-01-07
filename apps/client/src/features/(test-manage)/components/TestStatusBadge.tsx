import { TestType } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';

interface TestStatusBadgeProps {
  type: TestType;
}

export function TestStatusBadge({ type }: TestStatusBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium', {
        'bg-blue-50 text-blue-700': type === TestType.LIVE,
        'bg-gray-100 text-gray-700': type === TestType.DRAFT,
        'bg-green-50 text-green-700': type === TestType.COMPLETED,
      })}
    >
      {type}
    </span>
  );
}
