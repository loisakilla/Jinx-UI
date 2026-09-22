import { useId, useState } from 'react';
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

const eyeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const eyeOffIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.2 6.2A17.6 17.6 0 0 0 2 12s3.5 7 10 7a9.9 9.9 0 0 0 4-.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M3 3l18 18" />
  </svg>
);

export type JxPasswordFieldProps = FieldBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    revealLabel?: string;
    hideLabel?: string;
  };

export function JxPasswordField({
  label,
  helperText,
  errorText,
  required,
  className,
  id,
  revealLabel = 'Show password',
  hideLabel = 'Hide password',
  ...props
}: JxPasswordFieldProps) {
  const autoId = useId();
  const [revealed, setRevealed] = useState(false);
  const fieldId = id ?? `jx-password-${autoId}`;
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
      <div className="jx-input-group">
        <input
          id={fieldId}
          className="jx-input"
          type={revealed ? 'text' : 'password'}
          autoComplete="current-password"
          aria-invalid={Boolean(errorText)}
          aria-describedby={describedBy}
          {...props}
        />
        <button
          type="button"
          className="jx-input-action"
          aria-label={revealed ? hideLabel : revealLabel}
          aria-pressed={revealed}
          onClick={() => setRevealed((open) => !open)}
        >
          {revealed ? eyeOffIcon : eyeIcon}
        </button>
      </div>
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
