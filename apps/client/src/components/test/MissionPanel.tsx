import { Mission, MissionStatusMap, TestWithMissions } from '@/types/test';

interface MissionPanelProps {
  test: TestWithMissions;
  currentMission: Mission;
  missionStatuses: MissionStatusMap;
  onComplete: () => void;
  onSkip: () => void;
  onQuit: () => void;
}

export default function MissionPanel({
  test,
  currentMission,
  missionStatuses,
  onComplete,
  onSkip,
  onQuit,
}: MissionPanelProps) {
  // 미션 완료된 갯수 계산
  const completedCount = Object.values(missionStatuses).filter(
    (status) => status === 'completed' || status === 'skipped',
  ).length;
  const totalMissions = test.missions.length;
  const progress = (completedCount / totalMissions) * 100;

  return (
    <section className="w-96 flex flex-col border-r-4 border-primary-300 bg-white min-w-[300px]">
      {/* Progress Section */}
      <div className="h-32 border-b-4 border-primary-300 flex flex-col items-center justify-center gap-3 p-4 bg-linear-to-b from-primary-50 to-white">
        <span className="text-sm font-medium text-primary-700">
          {completedCount} / {totalMissions}
        </span>
        {/** Progress Bar */}
        <div className="w-full bg-primary-100 rounded-full h-2.5">
          <div
            className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mission Info Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3 overflow-y-auto">
        <h2 className="text-2xl font-bold text-primary-800">{test.title}</h2>
        <h3 className="text-lg font-semibold text-primary-600">{currentMission.title}</h3>
        <p className="text-gray-600 text-sm mt-2 leading-relaxed whitespace-pre-line">
          {currentMission.description}
        </p>

        {/* Mission Criteria Info */}
        <div className="mt-4 px-4 py-2 bg-primary-50 border border-primary-300 rounded-lg">
          <span className="text-xs text-primary-700 font-medium">
            목표: {currentMission.successCriteriaValue}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="h-24 p-3 flex gap-2 border-t-2 border-primary-100 bg-gray-50">
        <button
          onClick={onComplete}
          className="flex-1 border-2 border-success-400 rounded-lg bg-success-50 font-bold hover:bg-success-100 hover:border-success-500 transition-all text-sm text-success-700 shadow-sm"
        >
          ✓ 완료
        </button>
        <button
          onClick={onSkip}
          className="flex-1 border-2 border-secondary-400 rounded-lg bg-secondary-50 font-bold hover:bg-secondary-100 hover:border-secondary-500 transition-all text-sm text-secondary-700 shadow-sm"
        >
          × 포기
        </button>
        <button
          onClick={onQuit}
          className="flex-1 border-2 border-primary-400 rounded-lg bg-primary-50 font-bold hover:bg-primary-100 hover:border-primary-500 transition-all text-sm leading-tight text-primary-700 shadow-sm"
        >
          전체
          <br />
          포기
        </button>
      </div>
    </section>
  );
}
