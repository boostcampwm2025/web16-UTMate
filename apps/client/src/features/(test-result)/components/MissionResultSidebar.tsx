import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { MissionResultDetail, MissionDetail } from '../types';

interface MissionResultSidebarProps {
  missionResultData: MissionResultDetail;
  missionDetail?: MissionDetail;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`;
  }
  return `${remainingSeconds}초`;
}

export function MissionResultSidebar({ missionResultData, missionDetail }: MissionResultSidebarProps) {
  const statusLabel = {
    'COMPLETED': '성공',
    'FAILED': '실패',
    'PENDING': '대기 중',
    'SKIPPED': '건너뜀',
  }[missionResultData.status] || missionResultData.status;

  const statusColor = {
    'COMPLETED': 'text-green-600',
    'FAILED': 'text-red-600',
    'PENDING': 'text-yellow-600',
    'SKIPPED': 'text-gray-600',
  }[missionResultData.status] || 'text-gray-600';

  return (
    <aside className="w-80 border-r bg-white p-6">
    <div className="space-y-6">
      {/* 미션 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">미션 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {missionDetail && (
            <>
              <div>
                <p className="text-muted-foreground font-medium mb-1">미션명</p>
                <p className="text-gray-900">{missionDetail.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">미션 설명</p>
                <p className="text-gray-900 leading-relaxed">{missionDetail.description}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">예상 소요 시간</p>
                <p className="text-gray-900">{formatDuration(missionDetail.estimatedDuration)}</p>
              </div>
            </>
          )}
          {!missionDetail && (
            <div className="text-gray-500">미션 정보를 불러오는 중...</div>
          )}
        </CardContent>
      </Card>

      {/* 실행 결과 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">실행 결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">상태</span>
            <span className={`font-medium ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          {missionDetail?.averageDuration && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">평균 소요 시간</span>
              <span className="font-medium">{formatDuration(missionDetail.averageDuration)}</span>
            </div>
          )}
          {missionDetail?.successRate !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">성공률</span>
              <span className="font-medium">{(missionDetail.successRate * 100).toFixed(1)}%</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 히트맵 데이터 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">히트맵 데이터</CardTitle>
        </CardHeader>
        {/* <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">클릭</span>
            <span className="font-medium">{missionResultData.heatmapData.clicks}회</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">스크롤</span>
            <span className="font-medium">{missionResultData.heatmapData.scrolls}회</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">호버</span>
            <span className="font-medium">{missionResultData.heatmapData.hovers}회</span>
          </div>
        </CardContent> */}
      </Card>

      {/* 피드백 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">사용자 피드백</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{missionResultData.feedback}</p>
        </CardContent>
      </Card>
    </div>
  </aside>
  );
}