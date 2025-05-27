import type React from 'react';
import { cn } from '@/lib/utils';

interface DevanagariTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function DevanagariText({ children, className, ...props }: DevanagariTextProps) {
  return (
    <span className={cn('font-devanagari', className)} {...props}>
      {children}
    </span>
  );
}
