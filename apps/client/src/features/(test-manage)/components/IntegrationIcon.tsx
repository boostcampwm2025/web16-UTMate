import { Link2 } from 'lucide-react';

interface IntegrationIconProps {
  url: string;
}

export function IntegrationIcon({ url }: IntegrationIconProps) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50">
      <Link2 className="h-5 w-5 text-blue-600" />
    </div>
  );
}
