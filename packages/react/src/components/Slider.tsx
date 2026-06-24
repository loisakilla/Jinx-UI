import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  unit?: string;
  label?: ReactNode;
  showOutput?: boolean;
};

export function JxSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  unit = '',
  label,
  showOutput = true,
  className,
  style,
  ...rest
}: JxSliderProps) {
  const [internal, setInternal] = useControllableState<number>(value, defaultValue ?? Number(min), onValueChange);
  const sliderRef = useRef<HTMLInputElement>(null);

  const minNum = Number(min);
  const maxNum = Number(max);

  const sync = useCallback(
    (current: number) => {
      const pct = ((current - minNum) / (maxNum - minNum)) * 100;
      sliderRef.current?.style.setProperty('--_p', `${pct}%`);
    },
    [maxNum, minNum]
  );

  useEffect(() => {
    sync(internal);
  }, [internal, sync]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setInternal(next);
  };

  const merged: CSSProperties | undefined = style;

  return (
    <div className={cn('jx-slider-wrap', className)}>
      {label || showOutput ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--jx-text-3)',
            marginBottom: 6,
            fontFamily: 'var(--jx-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          {label ? <span>{label}</span> : <span />}
          {showOutput ? <span>{internal}{unit}</span> : null}
        </div>
      ) : null}
      <input
        ref={sliderRef}
        type="range"
        className="jx-slider"
        min={min}
        max={max}
        step={step}
        value={internal}
        onChange={handleChange}
        style={merged}
        {...rest}
      />
    </div>
  );
}
