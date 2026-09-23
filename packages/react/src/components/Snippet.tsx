import { useCallback, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxSnippetTone = 'default' | 'info';

export type JxSnippetProps = HTMLAttributes<HTMLSpanElement> & {
  ref?: Ref<HTMLSpanElement>;
  prompt?: ReactNode;
  tone?: JxSnippetTone;
  block?: boolean;
  copyText?: string;
  children?: ReactNode;
};

const toneClass: Record<Exclude<JxSnippetTone, 'default'>, string> = {
  info: 'jx-snippet--info'
};

const copyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export function JxSnippet({ prompt, tone = 'default', block = false, copyText, className, children, ...rest }: JxSnippetProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    const text = copyText ?? (typeof children === 'string' ? children : '');
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable
    }
  }, [children, copyText]);

  return (
    <span
      {...rest}
      className={cn('jx-snippet', tone !== 'default' && toneClass[tone], block && 'jx-snippet--block', className)}
    >
      {prompt ? <span className="jx-snippet-prompt">{prompt}</span> : null}
      <span className="jx-snippet-code">{children}</span>
      <button
        type="button"
        className="jx-snippet-copy"
        aria-label={copied ? 'Copied' : 'Copy'}
        onClick={onCopy}
        style={copied ? { color: 'var(--jx-success)' } : undefined}
      >
        {copyIcon}
      </button>
    </span>
  );
}

export type JxSnipProps = HTMLAttributes<HTMLSpanElement> & {
  ref?: Ref<HTMLSpanElement>;
  children?: ReactNode;
};

export function JxSnip({ className, children, ...rest }: JxSnipProps) {
  return (
    <span {...rest} className={cn('jx-snip', className)}>
      {children}
    </span>
  );
}
