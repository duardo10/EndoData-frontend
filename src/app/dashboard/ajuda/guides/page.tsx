import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HelpLayout } from '@/components/help/HelpLayout';
import { GuidesList } from '@/components/help/Guide';
import { Book, HelpCircle, Code, FileText, FileDown } from 'lucide-react';

const sections = [
  { id: 'knowledge-base', title: 'Base de Conhecimento', description: 'Documentação completa do sistema', href: '/dashboard/ajuda', icon: <Book className="h-5 w-5" /> },
  { id: 'faq', title: 'FAQ', description: 'Perguntas frequentes', href: '/dashboard/ajuda/faq', icon: <HelpCircle className="h-5 w-5" /> },
  { id: 'api', title: 'API', description: 'Documentação técnica', href: '/dashboard/ajuda/api', icon: <Code className="h-5 w-5" /> },
  { id: 'guides', title: 'Guias', description: 'Boas práticas e tutoriais', href: '/dashboard/ajuda/guides', icon: <FileText className="h-5 w-5" /> },
  { id: 'downloads', title: 'Downloads', description: 'Manuais e documentos', href: '/dashboard/ajuda/downloads', icon: <FileDown className="h-5 w-5" /> },
];

const guides = [
  { id: '1', title: 'Melhores Práticas para Prescrições', content: `# Melhores Práticas para Prescrições\n\n## 1. Validação de Dados\n- Sempre verifique os dados do paciente\n- Confirme alergias e interações medicamentosas\n- Documente todas as decisões clínicas\n\n## 2. Segurança\n- Use medicamentos da lista padrão\n- Verifique dosagens recomendadas\n- Documente efeitos adversos`, category: 'Prescrições' },
  { id: '2', title: 'Guia de Prontuário Eletrônico', content: `# Guia de Prontuário Eletrônico\n\n## 1. Organização\n- Mantenha registros cronológicos\n- Use templates padronizados\n- Atualize informações regularmente\n\n## 2. Privacidade\n- Proteja dados sensíveis\n- Compartilhe apenas o necessário\n- Siga normas LGPD`, category: 'Prontuário' },
];

export default function GuidesDashboardPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <HelpLayout sections={sections} activeSection="guides">
        <GuidesList guides={guides} />
      </HelpLayout>
    </DashboardLayout>
  );
}
