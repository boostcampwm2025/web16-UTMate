import { cn } from '@/shared/utils';

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-5xl',
};

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <span
      className={cn(
        'from-primary to-primary/70 bg-linear-to-r bg-clip-text font-bold tracking-tight text-transparent',
        sizeClasses[size],
        className,
      )}
    >
      UTMate
    </span>
  );
}
