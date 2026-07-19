'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { karyaFormSchema, KaryaFormValues } from '@/lib/schema/karya'

export async function createKarya(data: KaryaFormValues) {
  const supabase = await createClient()

  // 1. Validate data
  const parsed = karyaFormSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Validasi gagal', details: parsed.error.format() }
  }

  const { media, tech_stacks, id, version, idempotency_key, ...karyaData } = parsed.data

  // If no idempotency_key was provided from client, generate one as fallback
  const finalIdempotencyKey = idempotency_key || crypto.randomUUID()

  // Prepare RPC payloads
  const payload = {
    ...karyaData,
    status: karyaData.status || 'draft'
  }
  
  const mediaArray = media || []
  const techStacksArray = tech_stacks || []

  // Call the atomic RPC
  const { data: newKaryaId, error: rpcError } = await (supabase.rpc as any)('create_karya_with_media', {
    payload,
    media: mediaArray,
    tech_stacks: techStacksArray,
    idempotency_key: finalIdempotencyKey
  })

  if (rpcError || !newKaryaId) {
    console.error('RPC Error:', rpcError)
    // If the error code indicates unique violation on idempotency_key, it was a duplicate submit.
    if (rpcError?.code === '23505') {
      return { error: 'Karya ini sudah dikirim sebelumnya (duplikat).' }
    }
    return { error: 'Gagal menyimpan data karya.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true, id: newKaryaId }
}

export async function updateKarya(data: KaryaFormValues) {
  const supabase = await createClient()

  // 1. Validate data
  const parsed = karyaFormSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Validasi gagal', details: parsed.error.format() }
  }

  const { media, tech_stacks, id, version, tampilkan_nim, idempotency_key, ...karyaData } = parsed.data

  if (!id || version === undefined) {
    return { error: 'ID dan versi diperlukan untuk update.' }
  }

  // 2. Optimistic Locking Update
  const { data: updatedKarya, error: updateError } = await supabase
    .from('karya')
    .update({
      ...karyaData,
      version: version + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('version', version) // Must match exactly to avoid overwriting another admin's changes
    .select('id')
    
  if (updateError) {
    console.error('Update Error:', updateError)
    return { error: 'Gagal mengupdate karya.' }
  }

  // If affected rows == 0
  if (!updatedKarya || updatedKarya.length === 0) {
    return { 
      error: 'Konflik Perubahan: Karya ini telah diubah oleh admin lain saat Anda sedang mengeditnya. Silakan refresh halaman untuk melihat versi terbaru.',
      isConflict: true 
    }
  }

  // 3. Sync Media 
  // For simplicity in sequential logic without RPC: Delete all existing and re-insert
  await supabase.from('karya_media').delete().eq('karya_id', id)
  
  if (media && media.length > 0) {
    const mediaToInsert = media.map((m) => ({
      karya_id: id,
      tipe: m.tipe,
      url: m.url,
      thumbnail_url: m.thumbnail_url,
      urutan: m.urutan
    }))
    await supabase.from('karya_media').insert(mediaToInsert)
  }

  // 4. Sync Tech Stack
  await supabase.from('karya_tech_stack').delete().eq('karya_id', id)

  if (tech_stacks && tech_stacks.length > 0) {
    const techStacksToInsert = tech_stacks.map(tsId => ({
      karya_id: id,
      tech_stack_id: tsId
    }))
    await supabase.from('karya_tech_stack').insert(techStacksToInsert)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/edit/${id}`)
  revalidatePath('/')
  return { success: true }
}

export async function deleteKarya(id: string) {
  const supabase = await createClient()

  // Verify it exists
  const { data: karya } = await supabase.from('karya').select('id').eq('id', id).single()
  if (!karya) {
    return { error: 'Karya tidak ditemukan.' }
  }

  const { error } = await supabase.from('karya').delete().eq('id', id)
  
  if (error) {
    console.error('Delete Error:', error)
    return { error: 'Gagal menghapus karya.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}
