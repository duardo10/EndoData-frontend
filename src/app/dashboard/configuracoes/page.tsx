
'use client'


import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useUserProfile } from '@/hooks/useUserProfile'
import { updateUserProfile, updateUserPassword } from '@/services/userService'


export default function Configuracoes(): React.ReactElement {
  const { user, loading } = useUserProfile()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: '', // Adapte se o backend retornar telefone
      }))
    }
  }, [user])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)
    try {
      await updateUserProfile({ name: profile.name, email: profile.email, phone: profile.phone })
      setSuccess('Perfil atualizado com sucesso!')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)
    if (profile.password !== profile.confirmPassword) {
      setError('As senhas não coincidem')
      setSaving(false)
      return
    }
    try {
      await updateUserPassword({ password: profile.password, confirmPassword: profile.confirmPassword })
      setSuccess('Senha alterada com sucesso!')
      setProfile((prev) => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao alterar senha')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações</h1>
        <p className="text-gray-600 mb-6">Gerencie seu perfil, preferências e segurança da conta.</p>

        {success && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-2">{success}</div>}
        {error && <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-2">{error}</div>}

        {/* Card de perfil */}
        <Card className="mb-6">
          <form onSubmit={handleProfileSave} autoComplete="off">
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" value={profile.name} onChange={handleChange} required disabled={loading || saving} />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} required disabled={loading || saving} />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} disabled={loading || saving} />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit" disabled={saving || loading} className="px-6">
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Card de preferências (apenas UI, não integrado) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="notifications"
                name="notifications"
                type="checkbox"
                checked={true}
                readOnly
                className="accent-[#2074E9] w-5 h-5"
              />
              <Label htmlFor="notifications">Receber notificações por e-mail</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="darkMode"
                name="darkMode"
                type="checkbox"
                checked={false}
                readOnly
                className="accent-[#2074E9] w-5 h-5"
              />
              <Label htmlFor="darkMode">Ativar modo escuro</Label>
            </div>
          </CardContent>
        </Card>

        {/* Card de segurança */}
        <Card>
          <form onSubmit={handlePasswordSave} autoComplete="off">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Nova senha</Label>
                <Input id="password" name="password" type="password" value={profile.password} onChange={handleChange} minLength={6} disabled={loading || saving} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={profile.confirmPassword} onChange={handleChange} minLength={6} disabled={loading || saving} />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit" disabled={saving || loading} className="px-6" variant="secondary">
                {saving ? 'Salvando...' : 'Alterar Senha'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}