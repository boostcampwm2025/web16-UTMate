'use client';

import { notFound, useParams } from 'next/navigation';

export default function TestDashboardPage() {
  const { testid } = useParams();

  // TODO: 현재는 테스트ID가 1인 경우만 허용하고
  // 해당 데이터를 하드코딩해서 보여주고 있습니다. 나중에 API로 대체해야 합니다.
  if (testid !== '1') {
    notFound();
  }

  return (
    <div className="p-2 flex flex-col gap-2 divide-y divide-gray-200">
      <div className="p-2">
        <h2 className="text-xl font-semibold">사용성 테스트 {testid}</h2>
      </div>
      <div className="p-2"></div>
    </div>
  );
}
