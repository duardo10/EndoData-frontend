import { HelpLayout } from '@/components/help/HelpLayout';
import { GuidesList } from '@/components/help/Guide';
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

// Guias (exemplos)
const guides = [
  {
    id: '1',
    title: 'Melhores Práticas para Prescrições',
    content: `
# Melhores Práticas para Prescrições

## 1. Validação de Dados
- Sempre verifique os dados do paciente
- Confirme alergias e interações medicamentosas
- Documente todas as decisões clínicas

## 2. Segurança
- Use medicamentos da lista padrão
- Verifique dosagens recomendadas
- Documente efeitos adversos
    `,
    category: 'Prescrições',
  },
  {
    id: '2',
    title: 'Guia de Prontuário Eletrônico',
    content: `
# Guia de Prontuário Eletrônico

## 1. Organização
- Mantenha registros cronológicos
- Use templates padronizados
- Atualize informações regularmente

## 2. Privacidade
- Proteja dados sensíveis
- Compartilhe apenas o necessário
- Siga normas LGPD
    `,
    category: 'Prontuário',
  },
  // Mais guias serão adicionados...
];

export default function GuidesPage(): React.ReactElement {
  return (
    <HelpLayout sections={sections} activeSection="guides">
      <GuidesList guides={guides} />
    </HelpLayout>
  );
}