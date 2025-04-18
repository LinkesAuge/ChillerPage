import React from 'react';
import { designTokens } from '@/lib/designTokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
}

/**
 * Basic Card stub for dashboard UI.
 */
export const Card: React.FC<CardProps> = ({ accent, style, className, children, ...props }) => {
  const accentStyle = accent
    ? { borderLeft: `4px solid ${designTokens.colors.accent}` }
    : {};
  return (
    <div
      {...props}
      className={[
        'rounded-lg shadow p-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor: designTokens.colors.card,
        ...accentStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}; 