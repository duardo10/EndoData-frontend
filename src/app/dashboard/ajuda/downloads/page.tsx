import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HelpLayout } from '@/components/help/HelpLayout';
import { Card } from '@/components/ui/card';
import { Book, FileText, HelpCircle, FileDown, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'knowledge-base', title: 'Base de Conhecimento', description: 'Documentação completa do sistema', href: '/dashboard/ajuda', icon: <Book className="h-5 w-5" /> },
  { id: 'faq', title: 'FAQ', description: 'Perguntas frequentes', href: '/dashboard/ajuda/faq', icon: <HelpCircle className="h-5 w-5" /> },
  { id: 'api', title: 'API', description: 'Documentação técnica', href: '/dashboard/ajuda/api', icon: <Code className="h-5 w-5" /> },
  { id: 'guides', title: 'Guias', description: 'Boas práticas e tutoriais', href: '/dashboard/ajuda/guides', icon: <FileText className="h-5 w-5" /> },
  { id: 'downloads', title: 'Downloads', description: 'Manuais e documentos', href: '/dashboard/ajuda/downloads', icon: <FileDown className="h-5 w-5" /> },
];

export default function DownloadsDashboardPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <HelpLayout sections={sections} activeSection="downloads">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <FileDown className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Downloads</h1>
          </div>

          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Manuais do Sistema</h2>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Manual do Usuário</h3>
                        <p className="text-sm text-muted-foreground">
                          Guia completo de uso do sistema
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileDown className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Documentação da API</h3>
                        <p className="text-sm text-muted-foreground">
                          Especificação técnica completa
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileDown className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Templates e Formulários</h2>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Templates de Prescrição</h3>
                        <p className="text-sm text-muted-foreground">
                          Modelos padrão para prescrições
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileDown className="h-4 w-4 mr-2" />
                      Baixar ZIP
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Formulários de Admissão</h3>
                        <p className="text-sm text-muted-foreground">
                          Documentos para novos pacientes
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileDown className="h-4 w-4 mr-2" />
                      Baixar ZIP
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </HelpLayout>
    </DashboardLayout>
  );
}
