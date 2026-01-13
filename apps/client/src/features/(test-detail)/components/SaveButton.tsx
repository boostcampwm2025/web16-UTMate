import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface SaveButtonProps {
  loading: boolean;
  success: boolean;
  onSave: () => void;
}

export function SaveButton({ loading, success, onSave }: SaveButtonProps) {
  return (
    <div className="flex items-center gap-3">
      {success && <span className="text-sm text-green-600">✓ 저장되었습니다</span>}
      <Button onClick={onSave} disabled={loading}>
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        저장
      </Button>
    </div>
  );
}
