import { Button } from '@/shared/components/ui/button';
import { Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';

interface CopyToClipboardButtonProps {
  text: string;
  className?: string;
}

export function CopyToClipboardButton({ text, className }: CopyToClipboardButtonProps) {
  const [copiedText, copy, setCopiedText] = useCopyToClipboard();

  const handleCopy = () => {
    copy(text);

    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className={className}>
      {copiedText ? (
        <>✓ 복사됨</>
      ) : (
        <>
          <Copy className="mr-1 size-4" />
          복사
        </>
      )}
    </Button>
  );
}
