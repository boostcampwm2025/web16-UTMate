import { Mission, MissionStatusMap } from '@/types/test';

import MissionItem from './MissionItem';

interface MissionSidebarProps {
	missions: Mission[];
	missionStatuses: MissionStatusMap;
	currentMissionId: number;
	onMissionClick: (missionId: number) => void;
}

export default function MissionSidebar({
	missions,
	missionStatuses,
	currentMissionId,
	onMissionClick,
}: MissionSidebarProps) {
	return (
		<aside className="w-28 flex flex-col border-r-4 border-primary-300 bg-white">
			<div className="p-3 text-center font-bold text-sm border-b-2 border-primary-200 bg-primary-50 text-primary-700">
				미션 목록
			</div>
			<div className="flex flex-col gap-2 p-2 overflow-y-auto">
				{missions.map((mission) => {
					const status = missionStatuses[mission.id] || 'pending';
					const isCurrent = mission.id === currentMissionId;

					return (
						<MissionItem
							key={mission.id}
							mission={mission}
							status={status}
							isCurrent={isCurrent}
							onClick={() => onMissionClick(mission.id)}
						/>
					);
				})}
			</div>
		</aside>
	);
}
