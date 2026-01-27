import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { MissionStatusBadge } from './MissionStatusBadge';
import { formatDuration } from '../utils/format';

import type { MissionResultDetail, MissionDetail } from '../types';

interface MissionResultSidebarProps {
  missionResultData: MissionResultDetail;
  missionDetail?: MissionDetail;
}

export function MissionResultSidebar({
  missionResultData,
  missionDetail,
}: MissionResultSidebarProps) {
  return (
    <aside className="bg-background h-full w-80 overflow-y-auto border-r p-4">
      <div className="space-y-4">
        {/* 미션 정보 */}
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="text-base">미션 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {missionDetail && (
              <>
                <div>
                  <p className="text-muted-foreground mb-1 font-medium">미션명</p>
                  <p className="text-gray-900">{missionDetail.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-medium">미션 설명</p>
                  <p className="leading-relaxed text-gray-900">{missionDetail.description}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-medium">예상 소요 시간</p>
                  <p className="text-gray-900">{formatDuration(missionDetail.estimatedDuration)}</p>
                </div>
              </>
            )}
            {!missionDetail && <div className="text-gray-500">미션 정보를 불러오는 중...</div>}
          </CardContent>
        </Card>

        {/* 실행 결과 */}
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="text-base">미션 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">상태</span>
              <MissionStatusBadge status={missionResultData.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">피드백</span>
              {missionResultData.feedback}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
