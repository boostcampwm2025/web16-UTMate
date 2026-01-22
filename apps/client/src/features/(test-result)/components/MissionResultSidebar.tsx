import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { MissionResultDetail } from '../types';

interface MissionResultSidebarProps {
  missionResultData: MissionResultDetail;
}

export function MissionResultSidebar({ missionResultData }: MissionResultSidebarProps) {
  return (
    <aside className="w-80 border-r bg-white p-6">
    <div className="space-y-6">
      {/* 미션 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">미션 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground font-medium">미션 설명</p>
          </div>
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
            <span
              className={`font-medium ${
                missionResultData.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {missionResultData.status === 'COMPLETED' ? '성공' : '실패'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">소요 시간</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">시작 시간</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">종료 시간</span>
          </div>
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