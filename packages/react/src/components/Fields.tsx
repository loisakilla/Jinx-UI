import { useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type FieldBaseProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  className?: string;
};

export type JxInputFieldProps = FieldBaseProps & InputHTMLAttributes<HTMLInputElement> & {
  prefix?: string;
};

export function JxInputField({
  label,
  helperText,
  errorText,
  required,
  className,
  prefix,
  id,
  ...props
}: JxInputFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `jx-input-${autoId}`;
  const helperId = helperText ? `${fieldId}-help` : undefined;
  const errorId = errorText ? `${fieldId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('jx-field', errorText && 'jx-field--error', className)}>
      {label ? (
        <label className="jx-label" htmlFor={fieldId}>
          {label}
          {required ? <span className="jx-label-req">*</span> : null}
        </label>
      ) : null}
      {prefix ? (
        <div className="jx-input-group">
          <span className="jx-input-group-affix">{prefix}</span>
          <input id={fieldId} className="jx-input" aria-invalid={Boolean(errorText)} aria-describedby={describedBy} {...props} />
        </div>
      ) : (
        <input id={fieldId} className="jx-input" aria-invalid={Boolean(errorText)} aria-describedby={describedBy} {...props} />
      )}
      {helperText ? (
        <span id={helperId} className="jx-input-help">
          {helperText}
        </span>
      ) : null}
      {errorText ? (
        <span id={errorId} className="jx-input-error">
          {errorText}
        </span>
      ) : null}
    </div>
  );
}

export type JxTextareaFieldProps = FieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function JxTextareaField({ label, helperText, errorText, required, className, id, ...props }: JxTextareaFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `jx-textarea-${autoId}`;
  const helperId = helperText ? `${fieldId}-help` : undefined;
  const errorId = errorText ? `${fieldId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('jx-field', errorText && 'jx-field--error', className)}>
      {label ? (
        <label className="jx-label" htmlFor={fieldId}>
          {label}
          {required ? <span className="jx-label-req">*</span> : null}
        </label>
      ) : null}
      <textarea id={fieldId} className="jx-textarea" aria-invalid={Boolean(errorText)} aria-describedby={describedBy} {...props} />
      {helperText ? (
        <span id={helperId} className="jx-input-help">
          {helperText}
        </span>
      ) : null}
      {errorText ? (
        <span id={errorId} className="jx-input-error">
          {errorText}
        </span>
      ) : null}
    </div>
  );
}
