import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';
import { Card, CardContent } from '@/shared/components/ui/card';

interface TestMissionTabProps {
  missions: TestMission[];
  selectedMissionId: number;
  onMissionClick: (missionId: number) => void;
}

export function TestMissionTab({ missions, selectedMissionId, onMissionClick }: TestMissionTabProps) {
  const handleMissionClick = (missionId: number) => {
    onMissionClick(missionId);
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-gray-800">미션 목록</h2>
      <div className="flex flex-wrap gap-4 border p-4 rounded-xl">
        {missions.map((mission) => {
          const mId = Number(mission.publicId) || mission.order + 1;
          const isSelected = selectedMissionId === mId;
          
          return (
            <Card
              key={mission.publicId}
              onClick={() => handleMissionClick(mId)}
              className={cn(
                "h-[85px] w-[85px] cursor-pointer transition-all hover:shadow-md",
                isSelected
                  ? "bg-[#E0F2FE] border-blue-500 border-2"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <CardContent className="flex h-full flex-col items-center justify-center p-2">
                <span className={cn(
                  "text-[13px] font-bold leading-tight text-center",
                  isSelected ? "text-blue-700" : "text-gray-700"
                )}>
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