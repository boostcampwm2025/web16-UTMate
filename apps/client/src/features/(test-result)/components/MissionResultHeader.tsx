import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import type { MissionResultWithParticipant, MissionResultDetail } from '../types';

interface MissionResultHeaderProps {
  testId: string;
  missionResultData: MissionResultWithParticipant | MissionResultDetail;
}

function isMissionResultDetail(
  data: MissionResultWithParticipant | MissionResultDetail,
): data is MissionResultDetail {
  return 'presignedUrl' in data;
}

export function MissionResultHeader({ testId, missionResultData }: MissionResultHeaderProps) {
  const isDetail = isMissionResultDetail(missionResultData);

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/tests/${testId}/result`} aria-label="테스트 결과 페이지로 돌아가기">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">
            {isDetail
              ? `미션 결과: ${missionResultData.missionId}`
              : `${missionResultData.missionId} - ${missionResultData.participantId}`}
          </h1>
        </div>
      </div>
    </header>
  );
}
