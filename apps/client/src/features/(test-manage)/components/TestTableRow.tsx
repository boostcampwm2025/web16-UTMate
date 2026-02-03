'use client';

import { useRouter } from 'next/navigation';
import { type Test, TestStatus } from '@/features/(test-manage)/types';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { TestStatusBadge } from '@/shared/components/TestStatusBadge';

import { IntegrationButton } from './IntegrationButton';
import { TestActionButton } from './TestActionButton';
import { MemberButton } from './MemberButton';

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
      router.push(`/tests/${test.publicId}/result`);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    //액션 버튼 클릭시 행 클릭 이벤트 발생하지 않도록 처리
    e.stopPropagation();
  };

  return (
    <TableRow
      onClick={handleRowClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
      aria-label={`${test.title} 테스트 ${test.status === TestStatus.DRAFT ? '편집' : '결과 보기'}`}
    >
      <TableCell className="text-left">
        <div className="font-medium text-gray-900">{test.title}</div>
      </TableCell>
      <TableCell className="text-center">
        <TestStatusBadge status={test.status} />
      </TableCell>
      <TableCell className="text-center">
        <IntegrationButton url={test.url} sdkStatus={test.sdkStatus} testId={test.publicId} />
      </TableCell>
      <TableCell className="text-center" onClick={handleActionClick}>
        <MemberButton
          isDemo={test.status === TestStatus.DEMO}
          testId={test.publicId}
          owner={test.owner}
          members={test.members}
        />
      </TableCell>

      {/* TODO: 테스트 참여자 수 표시 */}
      <TableCell className="text-center">
        <span className="cursor-pointer text-sm text-gray-900"></span>
      </TableCell>
      <TableCell className="text-center" onClick={handleActionClick}>
        <TestActionButton testId={test.publicId} testStatus={test.status} />
      </TableCell>
    </TableRow>
  );
}
