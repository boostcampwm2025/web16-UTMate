import { useDialogStore } from '@/shared/stores/useDialogStore';

interface MetricCardProps {
  label: string;
  value: string;
  description?: React.ReactNode;
}

export function MetricCard({ label, value, description }: MetricCardProps) {
  const { confirm } = useDialogStore();

  const handleClick = () => {
    if (description) {
      confirm(label, '', description, {
        hasCancel: false,
        confirmText: '닫기',
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-start justify-center rounded-2xl bg-gray-50/80 p-4 text-left transition-colors hover:bg-gray-100 ${
        description ? 'cursor-pointer' : ''
      }`}
    >
      <div className="mb-2 text-sm font-medium text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-700">{value}</div>
    </div>
  );
}