import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'link';
}

/**
 * Basic Button stub for UI prototype and Storybook.
 */
export const Button: React.FC<ButtonProps> = ({ variant, className, children, ...props }) => {
  const baseClasses = variant === 'link'
    ? 'text-blue-500 hover:text-blue-600'
    : 'bg-blue-500 text-white hover:bg-blue-600';
  return (
    <button
      {...props}
      className={[baseClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  );
}; 