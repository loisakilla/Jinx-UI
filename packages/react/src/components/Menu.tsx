import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxMenuItem = {
  type?: 'item' | 'divider' | 'label';
  label?: ReactNode;
  icon?: ReactNode;
  shortcut?: ReactNode;
  danger?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
};

export type JxMenuProps = HTMLAttributes<HTMLDivElement> & {
  items: JxMenuItem[];
};

export function JxMenu({ items, className, ...rest }: JxMenuProps) {
  const onItemClick = (item: JxMenuItem) => (event: MouseEvent<HTMLDivElement>) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    item.onSelect?.();
  };

  return (
    <div {...rest} className={cn('jx-menu-panel', className)} role="menu">
      {items.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={index} className="jx-menu-divider" role="separator" />;
        }
        if (item.type === 'label') {
          return (
            <div key={index} className="jx-menu-label">
              {item.label}
            </div>
          );
        }
        return (
          <div
            key={index}
            role="menuitem"
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled || undefined}
            className={cn('jx-menu-item', item.danger && 'jx-menu-item--danger')}
            onClick={onItemClick(item)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!item.disabled) item.onSelect?.();
              }
            }}
          >
            {item.icon}
            {item.label}
            {item.shortcut ? <span className="jx-menu-item-shortcut">{item.shortcut}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
