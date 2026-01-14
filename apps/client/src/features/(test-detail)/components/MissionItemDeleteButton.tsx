import { Trash2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface MissionItemDeleteButtonProps {
  publicId: string;
  onDeleteMission: (publicId: string) => void;
}

export function MissionItemDeleteButton({
  publicId,
  onDeleteMission,
}: MissionItemDeleteButtonProps) {
  const handleDeleteMission = () => {
    onDeleteMission(publicId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDeleteMission}
      className="group text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      <Trash2 className="size-4" />
      <span className="ml-1 hidden group-hover:inline">삭제</span>
    </Button>
  );
}
