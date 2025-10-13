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

  const calcularIMC = (): void => {
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura) / 100 // converter cm para metros
    const idadeNum = parseInt(idade)

    if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(idadeNum) || alturaNum <= 0) {
      alert('Por favor, preencha todos os campos corretamente')
      return
    }

    const imc = pesoNum / (alturaNum * alturaNum)
    
    // Cálculo da TMB (Taxa Metabólica Basal) usando a fórmula de Harris-Benedict
    let tmb: number
    if (sexo === 'masculino') {
      tmb = 88.362 + (13.397 * pesoNum) + (4.799 * (alturaNum * 100)) - (5.677 * idadeNum)
    } else {
      tmb = 447.593 + (9.247 * pesoNum) + (3.098 * (alturaNum * 100)) - (4.330 * idadeNum)
    }

    // Multiplicadores de atividade física
    const multiplicadores: Record<string, number> = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'muito-intenso': 1.9
    }

    const tmbEstimada = Math.round(tmb * multiplicadores[nivelAtividade])

    let classificacao = ''
    let cor = ''
    
    if (imc < 18.5) {
      classificacao = 'Abaixo do Peso'
      cor = 'bg-[#60A5FA]' // blue-400
    } else if (imc >= 18.5 && imc < 25) {
      classificacao = 'Normal'
      cor = 'bg-[#1DD75B4D]' // success-500 com opacidade
    } else if (imc >= 25 && imc < 30) {
      classificacao = 'Sobrepeso'
      cor = 'bg-[#FCD34D]' // yellow-300
    } else if (imc >= 30 && imc < 35) {
      classificacao = 'Obesidade Grau I'
      cor = 'bg-[#FB923C]' // orange-400
    } else if (imc >= 35 && imc < 40) {
      classificacao = 'Obesidade Grau II'
      cor = 'bg-[#F87171]' // red-400
    } else {
      classificacao = 'Obesidade Grau III'
      cor = 'bg-[#DC2626]' // red-600
    }

    setResultado({
      imc: imc.toFixed(1),
      classificacao,
      cor,
      tmbEstimada
    })
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