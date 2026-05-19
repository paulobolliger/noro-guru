import * as React from 'react';

function mergeClassName(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const Avatar = React.forwardRef<HTMLDivElement, DivProps>(function Avatar(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={mergeClassName('relative inline-flex h-10 w-10 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
});

export const AvatarImage = React.forwardRef<HTMLImageElement, ImgProps>(function AvatarImage(
  { className, alt = '', ...props },
  ref
) {
  return <img ref={ref} alt={alt} className={mergeClassName('h-full w-full object-cover', className)} {...props} />;
});

export const AvatarFallback = React.forwardRef<HTMLDivElement, DivProps>(function AvatarFallback(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={mergeClassName('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
      {...props}
    />
  );
});
