import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxStep = {
  label: ReactNode;
};

export type JxStepperProps = HTMLAttributes<HTMLDivElement> & {
  steps: JxStep[];
  current: number;
};

const doneIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export function JxStepper({ steps, current, className, ...rest }: JxStepperProps) {
  return (
    <div {...rest} className={cn('jx-stepper', className)} role="list">
      {steps.map((step, index) => {
        const isDone = index < current;
        const isActive = index === current;
        return (
          <div key={index} role="listitem" className={cn('jx-step', isDone && 'is-done', isActive && 'is-active')}>
            <div className="jx-step-bubble">{isDone ? doneIcon : index + 1}</div>
            <div className="jx-step-label">{step.label}</div>
          </div>
        );
      })}
    </div>
  );
}
