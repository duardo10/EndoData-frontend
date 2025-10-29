import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Users, Pill, FileText, Settings, HelpCircle, ArrowLeft, Book, FileDown, Code } from 'lucide-react';
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
import { HelpLayout } from '@/components/help/HelpLayout';
import { KnowledgeBase } from '@/components/help/KnowledgeBase';
import { FAQ } from '@/components/help/FAQ';
import { GuidesList } from '@/components/help/Guide';

// Seções da documentação
const sections = [
  {
    id: 'knowledge-base',
    title: 'Base de Conhecimento',
    description: 'Documentação completa do sistema',
    href: '/ajuda',
    icon: <Book className="h-5 w-5" />,
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Perguntas frequentes',
    href: '/ajuda/faq',
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    id: 'api',
    title: 'API',
    description: 'Documentação técnica',
    href: '/ajuda/api',
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: 'guides',
    title: 'Guias',
    description: 'Boas práticas e tutoriais',
    href: '/ajuda/guides',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'downloads',
    title: 'Downloads',
    description: 'Manuais e documentos',
    href: '/ajuda/downloads',
    icon: <FileDown className="h-5 w-5" />,
  },
];

// Artigos da base de conhecimento (exemplos)
const articles = [
  {
    id: '1',
    title: 'Gestão de Pacientes',
    description: 'Como cadastrar e gerenciar pacientes no sistema',
    content: '# Gestão de Pacientes...',
    category: 'Pacientes',
  },
  {
    id: '2',
    title: 'Sistema de Prescrições',
    description: 'Como criar e gerenciar prescrições médicas',
    content: '# Sistema de Prescrições...',
    category: 'Prescrições',
  },
  // Mais artigos serão adicionados...
];

export default function AjudaPage(): React.ReactElement {
  return (
    <HelpLayout sections={sections} activeSection="knowledge-base">
      <KnowledgeBase articles={articles} />
    </HelpLayout>
  );
}
