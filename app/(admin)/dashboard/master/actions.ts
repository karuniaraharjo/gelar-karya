'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addKategori(formData: FormData) {
  const nama = formData.get('nama') as string
  const slug = formData.get('slug') as string
  const urutan = parseInt(formData.get('urutan') as string || '0')
  const supabase = await createClient()
  const { error } = await supabase.from('kategori').insert({ nama, slug, urutan })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/master')
  revalidatePath('/dashboard/tambah')
  return { success: true }
}

export async function deleteKategori(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('kategori').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/master')
  revalidatePath('/dashboard/tambah')
  return { success: true }
}

export async function addAngkatan(formData: FormData) {
  const tahun = parseInt(formData.get('tahun') as string)
  const label = formData.get('label') as string
  const supabase = await createClient()
  const { error } = await supabase.from('angkatan').insert({ tahun, label })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/master')
  revalidatePath('/dashboard/tambah')
  return { success: true }
}

export async function deleteAngkatan(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('angkatan').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/master')
  revalidatePath('/dashboard/tambah')
  return { success: true }
}

export async function addTechStack(formData: FormData) {
  const nama = formData.get('nama') as string
  const supabase = await createClient()
  const { error } = await supabase.from('tech_stack').insert({ nama })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/master')
  revalidatePath('/dashboard/tambah')
  return { success: true }
}

export async function deleteTechStack(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tech_stack').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/master')
  revalidatePath('/dashboard/tambah')
  return { success: true }
}
