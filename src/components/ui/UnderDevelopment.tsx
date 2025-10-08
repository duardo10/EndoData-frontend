'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Construction, ArrowLeft, Clock, Code } from 'lucide-react'
import Link from 'next/link'

/**
 * Props do componente UnderDevelopment
 */
interface UnderDevelopmentProps {
  /** Título da página */
  title: string
  /** Descrição da funcionalidade */
  description?: string
  /** Funcionalidades planejadas */
  features?: string[]
  /** Estimativa de conclusão */
  eta?: string
}

/**
 * Componente para páginas em desenvolvimento
 * 
 * @description Componente reutilizável que exibe uma mensagem informativa
 * para páginas ainda não implementadas, mantendo a consistência visual
 * e fornecendo informações úteis sobre o desenvolvimento.
 * 
 * @param {UnderDevelopmentProps} props - Propriedades do componente
 * 
 * @returns {React.ReactElement} Página de desenvolvimento
 * 
 * @features
 * - Layout consistente com DashboardLayout
 * - Ícone de construção visual
 * - Lista de funcionalidades planejadas
 * - Estimativa de conclusão
 * - Botão de voltar ao dashboard
 * - Design responsivo
 * 
 * @author EndoData Team
 * @since 1.0.0
 */
export function UnderDevelopment({ 
  title, 
  description, 
  features, 
  eta 
}: UnderDevelopmentProps): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          </div>

          {/* Card principal */}
          <Card className="p-8 text-center">
            <div className="space-y-6">
              {/* Ícone */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                  <Construction className="w-10 h-10 text-orange-600" />
                </div>
              </div>

              {/* Título e descrição */}
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Página em Desenvolvimento
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {description || `A página ${title} está sendo desenvolvida pela nossa equipe. 
                  Em breve você terá acesso a todas as funcionalidades planejadas.`}
                </p>
              </div>

              {/* Funcionalidades planejadas */}
              {features && features.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 text-left max-w-2xl mx-auto">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">
                      Funcionalidades Planejadas:
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-blue-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ETA */}
              {eta && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Previsão de conclusão: {eta}</span>
                </div>
              )}

              {/* Botão de voltar */}
              <div className="pt-4">
                <Link href="/dashboard">
                  <Button className="bg-[#2074E9] hover:bg-[#104CA0] text-white px-6">
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Card de contato */}
          <Card className="p-6 bg-gray-50">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-gray-800">
                Precisa de algo específico?
              </h3>
              <p className="text-sm text-gray-600">
                Entre em contato com nossa equipe de desenvolvimento para 
                priorizar funcionalidades ou tirar dúvidas.
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <Button variant="outline" size="sm">
                  Reportar Bug
                </Button>
                <Button variant="outline" size="sm">
                  Sugerir Funcionalidade
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}