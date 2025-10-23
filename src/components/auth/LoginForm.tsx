'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cpf, setCpf] = useState('')
  const [crm, setCrm] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          }
        )
        if (!response.ok) throw new Error('Usuário ou senha inválidos!')
        const data = await response.json()
        localStorage.setItem('jwt', data.access_token)
        router.push('/dashboard')
      } else {
        if (password !== confirmPassword) throw new Error('As senhas não coincidem!')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, email, crm, password }),
          }
        )
        if (!response.ok) throw new Error('Erro ao criar conta!')
        const data = await response.json()
        localStorage.setItem('jwt', data.access_token)
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar a solicitação!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-[400px] bg-white rounded-[10px] shadow-xs p-8 relative max-sm:w-full">
        <div className="w-[61px] h-[50px] bg-[#2074E9] rounded-lg flex items-center justify-center mb-6 mx-auto">
          <Logo className="w-8 h-8 text-white" />
        </div>

        {isLogin ? (
          <>
            {/* LOGIN */}
            <h1 className="font-roboto text-[24px] leading-[32px] font-bold text-[#171A1F] mb-2 text-center">
              Bem-vindo de volta!
            </h1>
            <p className="font-roboto text-[14px] leading-[20px] text-[#565D6D] mb-6 text-center">
              Acesse sua conta para continuar gerenciando seus pacientes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-2 mb-3 bg-red-100 text-red-700 rounded">{error}</div>}

              <div>
                <Label
                  htmlFor="email"
                  className="font-roboto text-[14px] font-medium block mb-1 text-gray-700 bg-white px-2 rounded"
                >
                  Usuário ou E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[49px] px-3 text-[#2074E9] border border-[#DEE1E6] rounded-[6px] focus:ring-1 focus:ring-[#2074E9]"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="font-roboto text-[14px] font-medium block mb-1 text-gray-700 bg-white px-2 rounded"
                >
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[49px] px-3 text-[#2074E9] border border-[#DEE1E6] rounded-[6px] focus:ring-1 focus:ring-[#2074E9]"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="font-roboto text-[14px] text-[#2074E9] hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[40px] text-[14px] font-medium text-white bg-[#2074E9] rounded-[6px] hover:bg-[#104CA0] disabled:opacity-40"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-[14px] text-[#171A1F]">Não tem uma conta? </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false)
                  window.scrollTo(0, 0)
                }}
                className="text-[14px] text-[#2074E9] hover:underline"
              >
                Criar uma conta
              </button>
            </div>
          </>
        ) : (
          <>
            {/* CADASTRO */}
            <h1 className="font-roboto text-[24px] leading-[32px] font-bold text-[#171A1F] mb-2 text-center">
              Bem-vindo(a) ao <span className="text-[#2074E9]">EndoData</span>
            </h1>
            <p className="font-roboto text-[14px] leading-[20px] text-[#565D6D] mb-6 text-center">
              Preencha os campos abaixo para criar sua conta de médico.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-2 mb-3 bg-red-100 text-red-700 rounded">{error}</div>}

              <div>
                <Label
                  htmlFor="cpf"
                  className="text-[14px] font-medium block mb-1 text-gray-700 bg-white px-2 rounded"
                >
                  CPF
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  className="w-full h-[49px] px-3 text-[#2074E9] border border-[#DEE1E6] rounded-[6px] focus:ring-1 focus:ring-[#2074E9]"
                />
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-[14px] font-medium block mb-1 text-gray-700 bg-white px-2 rounded"
                >
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[49px] px-3 text-[#2074E9] border border-[#DEE1E6] rounded-[6px] focus:ring-1 focus:ring-[#2074E9]"
                />
              </div>

              <div>
                <Label
                  htmlFor="crm"
                  className="text-[14px] font-medium block mb-1 text-gray-700 bg-white px-2 rounded"
                >
                  CRM
                </Label>
                <Input
                  id="crm"
                  type="text"
                  placeholder="0000000-UF"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  required
                  className="w-full h-[49px] px-3 text-[#2074E9] border border-[#DEE1E6] rounded-[6px] focus:ring-1 focus:ring-[#2074E9]"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-[14px] font-medium block mb-1 text-gray-700 bg-white px-2 rounded"
                >
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Pelo menos 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full h-[49px] px-3 text-[#2074E9] border border-[#DEE1E6] rounded-[6px] focus:ring-1 focus:ring-[#2074E9]"
                />
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-[14px] font-medium block mb-1 text-gray-700 bg-white px-2 rounded"
                >
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-[49px] px-3 text-[#2074E9] border border-[#DEE1E6] rounded-[6px] focus:ring-1 focus:ring-[#2074E9]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[40px] text-[14px] font-medium text-white bg-[#2074E9] rounded-[6px] hover:bg-[#104CA0] disabled:opacity-40"
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-[14px] text-[#171A1F]">Já tem uma conta? </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true)
                  window.scrollTo(0, 0)
                }}
                className="text-[14px] text-[#2074E9] hover:underline"
              >
                Fazer login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
