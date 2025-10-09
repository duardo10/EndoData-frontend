import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Users, Pill, FileText, Settings, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Ajuda e Teste do Sistema EndoData
 * 
 * @description Página de demonstração que mostra todas as funcionalidades
 * do sistema, incluindo navegação, componentes UI e informações sobre
 * o sistema médico EndoData.
 * 
 * @returns {React.ReactElement} Página de ajuda e teste
 * 
 * @features
 * - Demonstração de todos os componentes UI
 * - Informações sobre o sistema
 * - Links de navegação
 * - Design responsivo
 * - Tema claro/escuro
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export default function AjudaPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      {/* Header da página */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Central de Ajuda</h1>
              <p className="text-muted-foreground mt-1">
                Teste e demonstração das funcionalidades do EndoData
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container py-8">
        <div className="grid gap-8">
          
          {/* Seção de Navegação */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Navegação do Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/" className="group">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Início</h3>
                      <p className="text-sm text-muted-foreground">Dashboard principal</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/pacientes" className="group">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Pacientes</h3>
                      <p className="text-sm text-muted-foreground">Gerenciamento de pacientes</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/prescricao" className="group">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Prescrição</h3>
                      <p className="text-sm text-muted-foreground">Sistema de prescrições</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/relatorios" className="group">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Relatórios</h3>
                      <p className="text-sm text-muted-foreground">Relatórios e análises</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/configuracoes" className="group">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Configurações</h3>
                      <p className="text-sm text-muted-foreground">Configurações do sistema</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="p-4 border rounded-lg bg-accent/50">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Ajuda</h3>
                    <p className="text-sm text-muted-foreground">Página atual</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Seção de Componentes UI */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Componentes UI Disponíveis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Botões</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Botão Padrão</Button>
                  <Button variant="secondary">Secundário</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destrutivo</Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Tamanhos de Botão</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Pequeno</Button>
                  <Button size="default">Padrão</Button>
                  <Button size="lg">Grande</Button>
                  <Button size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Seção de Informações do Sistema */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Sobre o EndoData</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-4">
                O EndoData é um sistema moderno de gerenciamento médico desenvolvido com as mais 
                recentes tecnologias web para proporcionar uma experiência eficiente e intuitiva 
                para profissionais da saúde.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Tecnologias Utilizadas</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Next.js 14 com App Router</li>
                    <li>• TypeScript para type safety</li>
                    <li>• Tailwind CSS para estilização</li>
                    <li>• shadcn/ui para componentes</li>
                    <li>• Lucide React para ícones</li>
                    <li>• next-themes para temas</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Funcionalidades</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Interface responsiva</li>
                    <li>• Tema claro/escuro</li>
                    <li>• Navegação intuitiva</li>
                    <li>• Componentes acessíveis</li>
                    <li>• Design system consistente</li>
                    <li>• Performance otimizada</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Seção de Teste de Tema */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Teste de Tema</h2>
            <p className="text-muted-foreground mb-4">
              Use o botão de tema no header para alternar entre modo claro e escuro. 
              Esta página demonstra como os componentes se adaptam aos diferentes temas.
            </p>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <span className="text-sm">Cor primária do tema atual</span>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
