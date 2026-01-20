import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';

interface TestParticipateLinkCheckProps {
  testId: string;
}

export function TestParticipateLinkCheck({ testId }: TestParticipateLinkCheckProps) {
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://localhost:3000' : 'https://utmate.me';
  const url = `${baseUrl}/participate/${testId}`;
  return (
    <div className="flex items-center space-x-2">
      <span className="text-muted-foreground text-sm">{url}</span>
      <CopyToClipboardButton text={url} className="rounded-full" />
    </div>
  );
}
