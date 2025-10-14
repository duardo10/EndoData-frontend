'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Página de Cálculos Clínicos
 * 
 * @description Centro de ferramentas para cálculos clínicos diversos
 * 
 * @returns {React.ReactElement} Página de cálculos clínicos
 */
export default function CalculosClinicos(): React.ReactElement {
  const [peso, setPeso] = useState<string>('70')
  const [altura, setAltura] = useState<string>('170')
  const [idade, setIdade] = useState<string>('30')
  const [sexo, setSexo] = useState<'masculino' | 'feminino'>('masculino')
  const [praticaAtividade, setPraticaAtividade] = useState<'sim' | 'nao'>('nao')
  const [metabolismoBasal, setMetabolismoBasal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const calcularMetabolismo = async (): Promise<void> => {
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura)
    const idadeNum = parseInt(idade)

    if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(idadeNum) || pesoNum <= 0 || alturaNum <= 0 || idadeNum <= 0) {
      alert('Por favor, preencha todos os campos corretamente')
      return
    }

    setLoading(true)
    setErro(null)

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/calculations/bmr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          weight: pesoNum,
          height: alturaNum,
          age: idadeNum,
          sex: sexo,
          activityLevel: praticaAtividade === 'sim' ? 'moderado' : 'sedentario',
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao calcular metabolismo basal. Tente novamente.')
      }
      const data = await response.json()
      setMetabolismoBasal(data.bmr ?? null)
    } catch (e: any) {
      setErro(e.message || 'Erro na requisição.')
      setMetabolismoBasal(null)
    } finally {
      setLoading(false)
    }
  }

  const fecharResultado = (): void => {
    setMetabolismoBasal(null)
    setErro(null)
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Cálculos Clínicos</h1>
            <p className="text-gray-600 mt-2">
              Ferramentas completas para cálculos clínicos essenciais
            </p>
          </div>

          {/* Card do Formulário */}
          <Card className="p-8 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wide">
              Calculadora de Metabolismo Basal
            </h2>

            <div className="space-y-6">
              {/* Peso e Altura na mesma linha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2074E9] focus:border-transparent bg-white"
                      placeholder="70"
                    />
                    <span className="absolute right-3 top-2 text-sm text-gray-500">Kg</span>
                  </div>
                </div>

                {/* Altura */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={altura}
                      onChange={(e) => setAltura(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2074E9] focus:border-transparent bg-white"
                      placeholder="170"
                    />
                    <span className="absolute right-3 top-2 text-sm text-gray-500">cm</span>
                  </div>
                </div>
              </div>

              {/* Idade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade:
                </label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2074E9] focus:border-transparent bg-white"
                  placeholder="30"
                />
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo:
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="masculino"
                      checked={sexo === 'masculino'}
                      onChange={(e) => setSexo(e.target.value as 'masculino' | 'feminino')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Masculino</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="feminino"
                      checked={sexo === 'feminino'}
                      onChange={(e) => setSexo(e.target.value as 'masculino' | 'feminino')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Feminino</span>
                  </label>
                </div>
              </div>

              {/* Prática de Atividade Física */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pratica atividade física regular?
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="sim"
                      checked={praticaAtividade === 'sim'}
                      onChange={(e) => setPraticaAtividade(e.target.value as 'sim' | 'nao')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sim</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="nao"
                      checked={praticaAtividade === 'nao'}
                      onChange={(e) => setPraticaAtividade(e.target.value as 'sim' | 'nao')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Não</span>
                  </label>
                </div>
              </div>

              {/* Resultado do Metabolismo */}
              <div className="bg-white border border-gray-300 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    METABOLISMO BASAL =
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {loading
                      ? 'Calculando...'
                      : erro
                        ? <span className="text-red-500 text-sm">{erro}</span>
                        : metabolismoBasal !== null ? `${metabolismoBasal.toFixed(2)} Kcal` : '0.00 Kcal'}
                  </span>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 justify-end">
                <Button
                  onClick={fecharResultado}
                  variant="outline"
                  className="px-6"
                >
                  Fechar
                </Button>
                <Button
                  onClick={calcularMetabolismo}
                  className="bg-[#2074E9] hover:bg-[#104CA0] text-white px-6"
                >
                  Calcular
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}