import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { KaryaForm } from '../components/karya-form'
import { createKarya } from '../actions'

export default async function TambahKaryaPage() {
  const supabase = await createClient()

  // Load options for selects and autocomplete
  const { data: kategoriOptions } = await supabase.from('kategori').select('id, nama').order('urutan', { ascending: true })
  const { data: angkatanOptions } = await supabase.from('angkatan').select('id, tahun, label').order('tahun', { ascending: false })
  const { data: techStackOptions } = await supabase.from('tech_stack').select('id, nama').order('nama', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-bg-base border border-border-subtle hover:bg-border-subtle rounded-md transition-colors">
          <ArrowLeft size={20} className="text-text-secondary hover:text-text-primary" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Tambah Karya</h2>
          <p className="text-sm text-text-secondary mt-1">Upload karya baru ke dalam portofolio.</p>
        </div>
      </div>
      
      <KaryaForm 
        kategoriOptions={kategoriOptions || []}
        angkatanOptions={angkatanOptions || []}
        techStackOptions={techStackOptions || []}
        onSubmitAction={createKarya}
      />
    </div>
  )
}
