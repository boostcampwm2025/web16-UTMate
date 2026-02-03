import { TestStatus } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

interface TestStatusBadgeProps {
  status: TestStatus;
}

const STATUS_DESCRIPTION: Record<TestStatus, string> = {
  [TestStatus.DRAFT]: '테스트가 아직 작성 중이며, 참여자에게 공개되지 않은 상태입니다.',
  [TestStatus.PUBLISHED]: '테스트가 배포되어 참여자가 참여할 수 있는 상태입니다.',
  [TestStatus.ARCHIVED]: '테스트가 종료되어 더 이상 참여할 수 없는 상태입니다.',
  [TestStatus.DEMO]: '데모 테스트 결과로, 예시 결과 데이터를 제공합니다.',
};

export function TestStatusBadge({ status }: TestStatusBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium', {
            'bg-blue-50 text-blue-700': status === TestStatus.PUBLISHED,
            'bg-gray-100 text-gray-700': status === TestStatus.DRAFT,
            'bg-green-50 text-green-700': status === TestStatus.ARCHIVED,
            'bg-yellow-50 text-yellow-700': status === TestStatus.DEMO,
          })}
        >
          {status}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{STATUS_DESCRIPTION[status]}</p>
      </TooltipContent>
    </Tooltip>
  );
}
