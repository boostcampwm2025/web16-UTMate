import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface SaveButtonProps {
  loading: boolean;
  success: boolean;
  error?: string | null;
  onSave: () => void;
}

export function SaveButton({ loading, success, error, onSave }: SaveButtonProps) {
  return (
    <div className="flex items-center gap-3">
      {success && <span className="text-success text-sm">✓ 저장되었습니다</span>}
      {error && <span className="text-destructive text-sm">{error}</span>}
      <Button onClick={onSave} disabled={loading}>
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        저장
      </Button>
    </div>
  );
}
