import { HelpLayout } from '@/components/help/HelpLayout';
import { FAQ } from '@/components/help/FAQ';
import { Book, FileText, HelpCircle, FileDown, Code } from 'lucide-react';

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

// Perguntas frequentes (exemplos)
const faqItems = [
  {
    question: 'Como cadastrar um novo paciente?',
    answer: 'Para cadastrar um novo paciente, acesse o menu "Pacientes", clique no botão "Novo Paciente" e preencha o formulário com os dados necessários.',
    category: 'Pacientes',
  },
  {
    question: 'Como criar uma nova prescrição?',
    answer: 'Para criar uma nova prescrição, acesse o menu "Prescrições", selecione um paciente e clique em "Nova Prescrição". Preencha os medicamentos e instruções necessárias.',
    category: 'Prescrições',
  },
  // Mais perguntas serão adicionadas...
];

export default function FAQPage(): React.ReactElement {
  return (
    <HelpLayout sections={sections} activeSection="faq">
      <FAQ items={faqItems} />
    </HelpLayout>
  );
}