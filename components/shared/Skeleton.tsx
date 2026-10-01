import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height, 
  rounded = 'md' 
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-muted',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: width,
        height: height
      }}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="1rem"
        className={clsx(
          i === lines - 1 ? 'w-3/4' : 'w-full',
          'h-4'
        )}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-4 space-y-3', className)}>
    <div className="flex items-center space-x-3">
      <Skeleton width={40} height={40} rounded="full" />
      <div className="space-y-2 flex-1">
        <Skeleton height="1rem" className="w-3/4" />
        <Skeleton height="0.75rem" className="w-1/2" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number; 
  className?: string;
  itemClassName?: string;
}> = ({ 
  items = 3, 
  className,
  itemClassName 
}) => (
  <div className={clsx('space-y-4', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} className={itemClassName} />
    ))}
  </div>
);

export const SkeletonGrid: React.FC<{ 
  items?: number; 
  columns?: number;
  className?: string;
  itemClassName?: string;
}> = ({ 
  items = 6, 
  columns = 3,
  className,
  itemClassName 
}) => (
  <div 
    className={clsx(
      'grid gap-4',
      className
    )}
    style={{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
    }}
  >
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} className={itemClassName} />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <Skeleton 
      className={clsx(sizeClasses[size], 'rounded-full', className)} 
    />
  );
};

export const SkeletonButton: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <Skeleton 
      className={clsx(sizeClasses[size], 'rounded-lg', className)} 
    />
  );
};

export const SkeletonImage: React.FC<{ 
  aspectRatio?: 'square' | 'video' | 'wide';
  className?: string;
}> = ({ 
  aspectRatio = 'square',
  className 
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]'
  };

  return (
    <Skeleton 
      className={clsx(aspectClasses[aspectRatio], 'rounded-lg', className)} 
    />
  );
};

export default Skeleton; 