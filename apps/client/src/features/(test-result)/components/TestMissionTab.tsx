import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';
import { Card, CardContent } from '@/shared/components/ui/card';

interface TestMissionTabProps {
  missions: TestMission[];
  selectedMissionId: number;
  onMissionClick: (missionId: number) => void;
}

export function TestMissionTab({
  missions,
  selectedMissionId,
  onMissionClick,
}: TestMissionTabProps) {
  const handleMissionClick = (missionId: number) => {
    onMissionClick(missionId);
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-gray-800">미션 목록</h2>
      <div className="flex flex-wrap gap-4 rounded-xl border p-4">
        {missions.map((mission) => {
          const mId = Number(mission.publicId) || mission.order + 1;
          const isSelected = selectedMissionId === mId;

          return (
            <Card
              key={mission.publicId}
              onClick={() => handleMissionClick(mId)}
              className={cn(
                'h-[85px] w-[85px] cursor-pointer transition-all hover:shadow-md',
                isSelected
                  ? 'border-2 border-blue-500 bg-[#E0F2FE]'
                  : 'border-gray-200 hover:border-gray-300',
              )}
            >
              <CardContent className="flex h-full flex-col items-center justify-center p-2">
                <span
                  className={cn(
                    'text-center text-[13px] leading-tight font-bold',
                    isSelected ? 'text-blue-700' : 'text-gray-700',
                  )}
                >
                  {mission.order + 1}번 {mission.name}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
