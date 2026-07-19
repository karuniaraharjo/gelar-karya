import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { KaryaForm } from '../../components/karya-form'
import { updateKarya } from '../../actions'
import { notFound } from 'next/navigation'

export default async function EditKaryaPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  // Load options for selects and autocomplete
  const { data: kategoriOptions } = await supabase.from('kategori').select('id, nama').order('urutan', { ascending: true })
  const { data: angkatanOptions } = await supabase.from('angkatan').select('id, tahun, label').order('tahun', { ascending: false })
  const { data: techStackOptions } = await supabase.from('tech_stack').select('id, nama').order('nama', { ascending: true })

  // Load existing data
  const { data: karya } = await supabase
    .from('karya')
    .select(`
      *,
      karya_media ( id, tipe, url, thumbnail_url, alt_text, urutan ),
      karya_tech_stack ( tech_stack_id )
    `)
    .eq('id', params.id)
    .single()

  if (!karya) {
    notFound()
  }

  // Transform data for the form
  const initialData = {
    ...karya,
    // @ts-ignore
    media: (karya.karya_media || []).sort((a, b) => a.urutan - b.urutan),
    // @ts-ignore
    tech_stacks: (karya.karya_tech_stack || []).map(ts => ts.tech_stack_id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-bg-base border border-border-subtle hover:bg-border-subtle rounded-md transition-colors">
          <ArrowLeft size={20} className="text-text-secondary hover:text-text-primary" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Edit Karya</h2>
          <p className="text-sm text-text-secondary mt-1">Ubah data portofolio yang sudah ada.</p>
        </div>
      </div>
      
      <KaryaForm 
        // @ts-ignore
        initialData={initialData}
        kategoriOptions={kategoriOptions || []}
        angkatanOptions={angkatanOptions || []}
        techStackOptions={techStackOptions || []}
        onSubmitAction={updateKarya}
      />
    </div>
  )
}
