import api from '@/lib/api'

export async function updateUserProfile(data: { name: string; email: string; phone?: string; crm?: string; especialidade?: string }) {
  return api.patch('/users/profile', data, { validateStatus: () => true });
}

export async function updateUserPassword(data: { password: string; confirmPassword: string }) {
  return api.patch('/users/password', data, { validateStatus: () => true });
}
