import api from '@/lib/api'

export async function updateUserProfile(data: { name: string; email: string; phone?: string }) {
  return api.patch('/users/profile', data)
}

export async function updateUserPassword(data: { password: string; confirmPassword: string }) {
  return api.patch('/users/profile/password', data)
}
