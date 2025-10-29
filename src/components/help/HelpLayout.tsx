import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Section = {
  id: string;
  title: string;
  href: string;
  description: string;
  icon: ReactNode;
  disabled?: boolean;
};

interface HelpLayoutProps {
  children: ReactNode;
  sections: Section[];
  activeSection?: string;
}

/**
 * Layout padrão para páginas da Central de Ajuda
 * 
 * @description Fornece navegação lateral e estrutura consistente
 * para todas as seções da Central de Ajuda
 */
export function HelpLayout({ children, sections, activeSection }: HelpLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar de navegação */}
          <div className="col-span-12 md:col-span-3">
            <Card className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    href={section.disabled ? '#' : section.href}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg transition-colors',
                      'hover:bg-accent/50',
                      section.disabled && 'opacity-50 cursor-not-allowed',
                      activeSection === section.id && 'bg-accent'
                    )}
                  >
                    <div className="flex-shrink-0">{section.icon}</div>
                    <div>
                      <h3 className="text-sm font-medium">{section.title}</h3>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                  </Link>
                ))}
              </nav>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="col-span-12 md:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}