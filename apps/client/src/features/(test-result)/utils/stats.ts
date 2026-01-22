import type { ParticipantResult } from '../types';

export interface MissionStat {
  id: number;
  successRate: number;
}

/**
 * 참여자 결과 데이터로부터 미션별 성공률을 계산합니다.
 * @param participantsData 참여자 결과 데이터 배열
 * @returns 미션 번호와 성공률을 포함한 배열 (미션 번호 순으로 정렬됨)
 */
export function calculateMissionStats(
  participantsData: ParticipantResult[],
): MissionStat[] {
  const statsMap: Record<number, { successCount: number; totalCount: number }> = {};

  participantsData.forEach((participant) => {
    participant.missionResults.forEach((result) => {
      // FIXME: missionOrder는 0부터 시작하므로 +1을 해서 1번 미션부터 시작하도록 함
      const order = result.missionOrder + 1;
      if (!statsMap[order]) {
        statsMap[order] = { successCount: 0, totalCount: 0 };
      }

      // 해당 미션에 도달한 전체 횟수(성공+실패+이탈 등)를 카운트
      statsMap[order].totalCount += 1;

      // 성공인 경우만 카운트
      if (result.status === 'SUCCESS') {
        statsMap[order].successCount += 1;
      }
    });
  });

  // 가공된 맵을 배열로 변환하고 미션 번호 순으로 정렬합니다.
  return Object.entries(statsMap)
    .map(([id, stats]) => ({
      id: Number(id),
      successRate:
        stats.totalCount > 0 ? Math.round((stats.successCount / stats.totalCount) * 100) : 0,
    }))
    .sort((a, b) => a.id - b.id);
}
