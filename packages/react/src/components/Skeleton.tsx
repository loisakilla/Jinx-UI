import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type JxSkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  circle?: boolean;
};

export function JxSkeleton({ width, height, circle = false, className, style, ...rest }: JxSkeletonProps) {
  return (
    <div
      {...rest}
      className={cn('jx-skeleton', className)}
      style={{ width, height, borderRadius: circle ? '50%' : undefined, ...style }}
    />
  );
}
