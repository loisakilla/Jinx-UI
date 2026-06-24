import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type JxButtonVariant = 'primary' | 'alt' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type JxButtonSize = 'sm' | 'md' | 'lg';

export type JxButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: JxButtonVariant;
  size?: JxButtonSize;
  iconOnly?: boolean;
};

const variantClass: Record<JxButtonVariant, string> = {
  primary: 'jx-btn--primary',
  alt: 'jx-btn--alt',
  secondary: 'jx-btn--secondary',
  ghost: 'jx-btn--ghost',
  outline: 'jx-btn--outline',
  danger: 'jx-btn--danger'
};

const sizeClass: Record<JxButtonSize, string> = {
  sm: 'jx-btn--sm',
  md: '',
  lg: 'jx-btn--lg'
};

export function JxButton({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  className,
  type = 'button',
  ...props
}: JxButtonProps) {
  return (
    <button
      type={type}
      className={cn('jx-btn', variantClass[variant], sizeClass[size], iconOnly && 'jx-btn--icon', className)}
      {...props}
    />
  );
}
