import { createClient } from '@/lib/supabase/server'
import { MasterForm } from './components/master-form'

export default async function MasterDataPage() {
  const supabase = await createClient()
  
  const { data: kategori } = await supabase.from('kategori').select('*').order('urutan', { ascending: true })
  const { data: angkatan } = await supabase.from('angkatan').select('*').order('tahun', { ascending: false })
  const { data: techStack } = await supabase.from('tech_stack').select('*').order('nama', { ascending: true })
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Data Master</h2>
        <p className="text-sm text-text-secondary mt-1">Kelola Kategori, Angkatan, dan Tech Stack.</p>
      </div>
      
      <MasterForm 
        initialKategori={kategori || []} 
        initialAngkatan={angkatan || []} 
        initialTechStack={techStack || []} 
      />
    </div>
  )
}
