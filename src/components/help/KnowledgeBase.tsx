import { Card } from '@/components/ui/card';
import { 
  Book, 
  FileText, 
  Hash, 
  ChevronRight,
  ScrollText
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

interface KnowledgeBaseProps {
  articles: Article[];
}

/**
 * Componente da Base de Conhecimento
 * 
 * @description Exibe artigos da documentação organizados por categoria
 */
export function KnowledgeBase({ articles }: KnowledgeBaseProps) {
  // Agrupar artigos por categoria
  const categories = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Base de Conhecimento</h1>
      </div>

      <div className="grid gap-6">
        {Object.entries(categories).map(([category, items]) => (
          <Card key={category} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{category}</h2>
            </div>

            <div className="grid gap-4">
              {items.map((article) => (
                <div
                  key={article.id}
                  className="group p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-1 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {article.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-primary/5">
        <div className="flex items-center gap-3">
          <ScrollText className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">Não encontrou o que procura?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Entre em contato com nosso suporte para mais ajuda.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}