import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-2 border-primary',
        {
          'h-4 w-4 border-2': size === 'sm',
          'h-8 w-8 border-2': size === 'md',
          'h-12 w-12 border-4': size === 'lg',
        },
        className
      )}
    />
  );
}

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loading({ text, size = 'md', fullScreen = false }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-4',
        fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : 'p-8'
      )}
    >
      <LoadingSpinner size={size} />
      {text && <p className="text-gray-500 animate-pulse">{text}</p>}
    </div>
  );
}
