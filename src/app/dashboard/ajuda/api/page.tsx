import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HelpLayout } from '@/components/help/HelpLayout';
import { Card } from '@/components/ui/card';
import { Book, HelpCircle, Code, FileText, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'knowledge-base', title: 'Base de Conhecimento', description: 'Documentação completa do sistema', href: '/dashboard/ajuda', icon: <Book className="h-5 w-5" /> },
  { id: 'faq', title: 'FAQ', description: 'Perguntas frequentes', href: '/dashboard/ajuda/faq', icon: <HelpCircle className="h-5 w-5" /> },
  { id: 'api', title: 'API', description: 'Documentação técnica', href: '/dashboard/ajuda/api', icon: <Code className="h-5 w-5" /> },
  { id: 'guides', title: 'Guias', description: 'Boas práticas e tutoriais', href: '/dashboard/ajuda/guides', icon: <FileText className="h-5 w-5" /> },
  { id: 'downloads', title: 'Downloads', description: 'Manuais e documentos', href: '/dashboard/ajuda/downloads', icon: <FileDown className="h-5 w-5" /> },
];

export default function APIDashboardPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <HelpLayout sections={sections} activeSection="api">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Documentação da API</h1>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Swagger UI</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Documentação interativa completa da API
                  </p>
                </div>
                <a href="http://localhost:4000/api/docs" target="_blank" rel="noopener noreferrer">
                  <Button>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Swagger
                  </Button>
                </a>
              </div>

              <div className="prose prose-sm max-w-none mt-4">
                <p>
                  A documentação completa da API está disponível através do Swagger UI.
                  Lá você encontra:
                </p>
                <ul>
                  <li>Todos os endpoints disponíveis</li>
                  <li>Exemplos de requisições e respostas</li>
                  <li>Schemas dos modelos de dados</li>
                  <li>Autenticação e autorização</li>
                  <li>Códigos de erro e suas descrições</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Endpoints Principais</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono">GET</div>
                    <code className="text-sm">/api/patients</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lista todos os pacientes com suporte a paginação e filtros
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono">POST</div>
                    <code className="text-sm">/api/prescriptions</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cria uma nova prescrição médica
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono">GET</div>
                    <code className="text-sm">/api/dashboard/metrics</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Retorna métricas e estatísticas do dashboard
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Autenticação</h2>
              <div className="prose prose-sm max-w-none">
                <p>
                  A API usa autenticação JWT (JSON Web Token). Todas as requisições 
                  autenticadas devem incluir o token no header:
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  Authorization: Bearer &lt;seu_token_jwt&gt;
                </pre>
                <p>
                  Tokens são obtidos através do endpoint de login e têm validade de 24 horas.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </HelpLayout>
    </DashboardLayout>
  );
}
