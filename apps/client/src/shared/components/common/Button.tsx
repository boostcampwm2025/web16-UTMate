import { cn } from '@/shared/utils';

type ButtonVariant = 'outline';

export function Button({
  variant = 'outline',
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={cn('rounded-md p-2 cursor-pointer', className, {
        'border border-gray-300 bg-white text-gray-500': variant === 'outline',
      })}
    >
      {children}
    </button>
  );
}
