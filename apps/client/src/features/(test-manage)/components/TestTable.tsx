import type { Test } from '@/features/(test-manage)/types';
import { TestTableRow } from './TestTableRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/shared/components/ui/table';

interface TestTableProps {
  tests: Test[];
}

export function TestTable({ tests }: TestTableProps) {
  return (
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-left">테스트 이름</TableHead>
            <TableHead className="text-center">상태</TableHead>
            <TableHead className="text-center">통합</TableHead>
            <TableHead className="text-center">참가자</TableHead>
            <TableHead className="text-center">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TestTableRow key={test.publicId} test={test} />
          ))}
        </TableBody>
        <TableCaption className="sr-only">내 테스트 목록</TableCaption>
      </Table>
  );
}
