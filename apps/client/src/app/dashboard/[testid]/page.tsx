'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { getTestResult } from '@/api/dashboard';

export default function TestDashboardPage() {
  const { testid } = useParams();

  // TODO: 현재는 테스트ID가 1인 경우만 허용하고
  // 해당 데이터를 하드코딩해서 보여주고 있습니다. 나중에 API로 대체해야 합니다.
  if (testid !== '1') {
    notFound();
  }

  const { data } = useQuery({
    queryKey: ['testResult', testid],
    queryFn: () => getTestResult(testid),
  });

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 divide-y divide-gray-200">
      <div className="p-4">
        <h2 className="text-xl font-semibold">사용성 테스트 {testid}</h2>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          {data.map((missionResult) => (
            <Link
              key={missionResult.id}
              href={`/dashboard/${testid}/detail?missionResultId=${missionResult.id}`}
            >
              {missionResult.id}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
