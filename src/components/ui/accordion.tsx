import * as React from 'react';

export interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={className}>{children}</div>;
}

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
}

export function AccordionItem({ children }: AccordionItemProps) {
  return <div className="border-b">{children}</div>;
}

export interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <button
      className={className + ' w-full text-left font-medium py-2'}
      onClick={() => setOpen((o) => !o)}
      type="button"
    >
      {children}
    </button>
  );
}

export interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  return <div className={className + ' py-2'}>{children}</div>;
}
