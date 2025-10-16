'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Página de Calculadora de IMC
 * 
 * @description Calculadora de Índice de Massa Corporal e outras métricas
 * 
 * @returns {React.ReactElement} Página de calculadora de IMC
 */
export default function CalculadoraIMC(): React.ReactElement {
  const [peso, setPeso] = useState<string>('70')
  const [altura, setAltura] = useState<string>('175')
  const [idade, setIdade] = useState<string>('30')
  const [sexo, setSexo] = useState<'masculino' | 'feminino'>('masculino')
  const [nivelAtividade, setNivelAtividade] = useState<string>('moderado')
  const [resultado, setResultado] = useState<{
    imc: string
    classificacao: string
    cor: string
    tmbEstimada: number
  } | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const calcularIMC = async (): Promise<void> => {
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura)
    const idadeNum = parseInt(idade)
    if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(idadeNum) || alturaNum <= 0) {
      alert('Por favor, preencha todos os campos corretamente')
      return
    }
    setErro(null)
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
      
      if (!token) {
        setErro('Token de autenticação não encontrado')
        return
      }
      
      // IMC
      const resIMC = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/calculations/imc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          weight: pesoNum,
          height: alturaNum
        })
      })
      if (!resIMC.ok) throw new Error('Erro ao calcular IMC.')
      const imcData = await resIMC.json()
      // BMR
      const resBMR = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/calculations/bmr`, {
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
          activityLevel: nivelAtividade
        })
      })
      if (!resBMR.ok) throw new Error('Erro ao calcular BMR.')
      const bmrData = await resBMR.json()
      // Cor
      let cor = ''
      if (imcData.classification === 'Abaixo do Peso') cor = 'bg-[#60A5FA]'
      else if (imcData.classification === 'Normal') cor = 'bg-[#1DD75B4D]'
      else if (imcData.classification === 'Sobrepeso') cor = 'bg-[#FCD34D]'
      else if (imcData.classification === 'Obesidade Grau I') cor = 'bg-[#FB923C]'
      else if (imcData.classification === 'Obesidade Grau II') cor = 'bg-[#F87171]'
      else cor = 'bg-[#DC2626]'
      setResultado({
        imc: imcData.imc?.toFixed(1) || '-',
        classificacao: imcData.classification || '-',
        cor,
        tmbEstimada: bmrData.bmr ?? '-'
      })
    } catch (error: any) {
      setErro(error.message || 'Erro na requisição.')
      setResultado(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Calculadora de IMC</h1>
            <p className="text-gray-600 mt-2">
              Calcule seu Índice de Massa Corporal e taxa metabólica basal
            </p>
          </div>

          {/* Card do Formulário */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Dados para Cálculo
            </h2>

            <div className="space-y-6">
              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2074E9] focus:border-transparent"
                    placeholder="70"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">kg</span>
                </div>
              </div>

              {/* Altura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2074E9] focus:border-transparent"
                    placeholder="175"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">cm</span>
                </div>
              </div>

              {/* Idade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2074E9] focus:border-transparent"
                    placeholder="30"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">anos</span>
                </div>
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo
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

              {/* Nível de Atividade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade
                </label>
                <select
                  value={nivelAtividade}
                  onChange={(e) => setNivelAtividade(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2074E9] focus:border-transparent bg-white"
                >
                  <option value="sedentario">Sedentário (nenhum exercício)</option>
                  <option value="leve">Levemente Ativo (exercício 1-3 dias/semana)</option>
                  <option value="moderado">Moderadamente Ativo (exercício 3-5 dias/semana)</option>
                  <option value="intenso">Intensamente Ativo (exercício 6-7 dias/semana)</option>
                  <option value="muito-intenso">Muito Intenso (exercício 2x/dia)</option>
                </select>
              </div>

              {/* Botão Calcular */}
              <Button
                onClick={calcularIMC}
                className="w-full bg-[#2074E9] hover:bg-[#104CA0] text-white"
              >
                Calcular
              </Button>
            </div>
          </Card>

          {/* Resultados */}
          {erro && (
            <div className="p-4 bg-red-100 rounded-md text-red-600 mb-4">{erro}</div>
          )}
          {resultado && (
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Resultados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IMC */}
                <div className={`${resultado.cor} rounded-lg p-6 border-2 border-green-500`}>
                  <p className="text-xs font-semibold text-gray-700 mb-1">IMC</p>
                  <p className="text-3xl font-bold text-gray-900">{resultado.imc} kg/m²</p>
                  <p className="text-sm font-medium text-gray-800 mt-2">{resultado.classificacao}</p>
                </div>

                {/* TMB Estimada */}
                <div className="bg-gray-400 rounded-lg p-6 border-2 border-red-500">
                  <p className="text-xs font-semibold text-white mb-1">TMB Estimada</p>
                  <p className="text-3xl font-bold text-white">{resultado.tmbEstimada} kcal/dia</p>
                  <p className="text-sm font-medium text-white mt-2">(Taxa Metabólica Basal)</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}