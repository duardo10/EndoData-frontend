import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Card } from '@/components/ui/card';
import { FileText, BookOpen } from 'lucide-react';

interface GuideProps {
  title: string;
  content: string;
  category: string;
}

/**
 * Componente de Guia de Boas Práticas
 * 
 * @description Renderiza guias em markdown com estilo consistente
 */
export function Guide({ title, content, category }: GuideProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
          </div>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </Card>
  );
}

interface GuidesListProps {
  guides: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
  }>;
}

/**
 * Lista de Guias de Boas Práticas
 * 
 * @description Container para múltiplos guias, organizados por categoria
 */
export function GuidesList({ guides }: GuidesListProps) {
  // Agrupar por categoria
  const categories = guides.reduce((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {} as Record<string, typeof guides>);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Guias de Boas Práticas</h1>
      </div>

      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-semibold">{category}</h2>
          <div className="grid gap-4">
            {items.map((guide) => (
              <Guide key={guide.id} {...guide} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}