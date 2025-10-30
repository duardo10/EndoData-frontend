import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HelpLayout } from '@/components/help/HelpLayout';
import { FAQ } from '@/components/help/FAQ';
import { Book, HelpCircle, Code, FileText, FileDown } from 'lucide-react';

const sections = [
  { id: 'knowledge-base', title: 'Base de Conhecimento', description: 'Documentação completa do sistema', href: '/dashboard/ajuda', icon: <Book className="h-5 w-5" /> },
  { id: 'faq', title: 'FAQ', description: 'Perguntas frequentes', href: '/dashboard/ajuda/faq', icon: <HelpCircle className="h-5 w-5" /> },
  { id: 'api', title: 'API', description: 'Documentação técnica', href: '/dashboard/ajuda/api', icon: <Code className="h-5 w-5" /> },
  { id: 'guides', title: 'Guias', description: 'Boas práticas e tutoriais', href: '/dashboard/ajuda/guides', icon: <FileText className="h-5 w-5" /> },
  { id: 'downloads', title: 'Downloads', description: 'Manuais e documentos', href: '/dashboard/ajuda/downloads', icon: <FileDown className="h-5 w-5" /> },
];

const faqItems = [
  { question: 'Como cadastrar um novo paciente?', answer: 'Para cadastrar um novo paciente, acesse o menu "Pacientes", clique no botão "Novo Paciente" e preencha o formulário com os dados necessários.', category: 'Pacientes' },
  { question: 'Como criar uma nova prescrição?', answer: 'Para criar uma nova prescrição, acesse o menu "Prescrições", selecione um paciente e clique em "Nova Prescrição". Preencha os medicamentos e instruções necessárias.', category: 'Prescrições' },
];

export default function FAQDashboardPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <HelpLayout sections={sections} activeSection="faq">
        <FAQ items={faqItems} />
      </HelpLayout>
    </DashboardLayout>
  );
}
