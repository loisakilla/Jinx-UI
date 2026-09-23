import { Fragment } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxBreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

export type JxBreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
  items: JxBreadcrumbItem[];
  separator?: ReactNode;
};

export function JxBreadcrumbs({ items, separator = '/', className, ...rest }: JxBreadcrumbsProps) {
  return (
    <nav {...rest} className={cn('jx-breadcrumbs', className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const node = item.href && !isLast ? <a href={item.href}>{item.label}</a> : <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>;
        return (
          <Fragment key={index}>
            {node}
            {!isLast ? <span className="sep" aria-hidden="true">{separator}</span> : null}
          </Fragment>
        );
      })}
    </nav>
  );
}
