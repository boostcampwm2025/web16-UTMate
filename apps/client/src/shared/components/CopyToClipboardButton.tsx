import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard, useTimeout } from 'usehooks-ts';

import { Button } from '@/shared/components/ui/button';

interface CopyToClipboardButtonProps {
  text: string;
  className?: string;
}

export function CopyToClipboardButton({ text, className }: CopyToClipboardButtonProps) {
  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  // 복사 성공 시 2초 후에 상태를 초기화합니다.
  // isCopied가 true일 때만 타이머가 작동하며, false이면 타이머가 해제됩니다.
  useTimeout(() => setIsCopied(false), isCopied ? 2000 : null);

  const handleCopy = async () => {
    const success = await copy(text);
    if (success) {
      setIsCopied(true);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className={className}>
      {isCopied ? (
        <>
          <Check className="mr-1 size-4" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="mr-1 size-4" />
          복사
        </>
      )}
    </Button>
  );
}
