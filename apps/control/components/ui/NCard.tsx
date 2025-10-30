import React from 'react';
import clsx from 'clsx';

type NCardProps = React.PropsWithChildren<{
  className?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  compact?: boolean;
  'data-testid'?: string;
}>;

export default function NCard({ children, className, title, actions, compact, 'data-testid': testid }: NCardProps) {
  const base = 'noro-card';
  const classes = clsx(base, className, compact && 'card-body-compact');

  return (
    <div className={classes} data-testid={testid}>
      {(title || actions) && (
        <div className="noro-card-header">
          <div className="noro-card-title">{title}</div>
          {actions ? <div className="noro-card-actions">{actions}</div> : null}
        </div>
      )}

      <div className={clsx('noro-card-body', compact ? 'card-body-compact' : '')}>{children}</div>
    </div>
  );
}
