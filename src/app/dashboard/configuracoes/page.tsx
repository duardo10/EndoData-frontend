"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { updateUserProfile, updateUserPassword } from "@/services/userService";

export default function Configuracoes(): React.ReactElement {
  const { user, loading } = useUserProfile();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    crm: "",
    especialidade: "",
    password: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        crm: user.crm || "",
        especialidade: user.especialidade || "",
      }));
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  async function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    // Validação: nenhum campo pode estar em branco
    if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim() || !profile.crm.trim() || !profile.especialidade.trim()) {
      setError("Preencha todos os campos do perfil.");
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        crm: profile.crm,
        especialidade: profile.especialidade,
      });
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    // Validação: senha e confirmação não podem estar em branco
    if (!profile.password.trim() || !profile.confirmPassword.trim()) {
      setError("Preencha a nova senha e a confirmação.");
      return;
    }
    if (profile.password !== profile.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setSaving(true);
    try {
      await updateUserPassword({ password: profile.password, confirmPassword: profile.confirmPassword });
      setSuccess("Senha alterada com sucesso!");
      setProfile((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err: any) {
      setError(err?.message || "Erro ao alterar senha.");
    } finally {
      setSaving(false);
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
                <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} disabled={loading || saving} placeholder="(99) 99999-9999" />
              </div>
              <div>
                <Label htmlFor="crm">CRM</Label>
                <Input id="crm" name="crm" value={profile.crm} onChange={handleChange} disabled={loading || saving} placeholder="CRM" />
              </div>
              <div>
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input id="especialidade" name="especialidade" value={profile.especialidade} onChange={handleChange} disabled={loading || saving} placeholder="Especialidade" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit" disabled={saving || loading} className="px-6">
                {saving ? "Salvando..." : "Salvar Alterações de Perfil"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        {/* Card de segurança */}
        <Card>
          <form onSubmit={handlePasswordSave} autoComplete="off">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={profile.password}
                  onChange={handleChange}
                  minLength={6}
                  disabled={loading || saving}
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 text-xs text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <div className="relative">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={profile.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  disabled={loading || saving}
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 text-xs text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}>
                  {showConfirmPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                type="submit"
                disabled={saving || loading}
                className="px-6 bg-green-600 hover:bg-green-700 text-white"
                style={{ backgroundColor: "#22c55e" }}
              >
                {saving ? "Salvando..." : "Alterar Senha"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}