'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { addKategori, deleteKategori, addAngkatan, deleteAngkatan, addTechStack, deleteTechStack } from '../actions'

interface Kategori { id: string; nama: string; slug: string; urutan: number }
interface Angkatan { id: string; tahun: number; label: string }
interface TechStack { id: string; nama: string }

interface MasterFormProps {
  initialKategori: Kategori[]
  initialAngkatan: Angkatan[]
  initialTechStack: TechStack[]
}

export function MasterForm({ initialKategori, initialAngkatan, initialTechStack }: MasterFormProps) {
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const katRef = useRef<HTMLFormElement>(null)
  const angRef = useRef<HTMLFormElement>(null)
  const tsRef = useRef<HTMLFormElement>(null)

  const handleAction = async (action: any, params: any, formRef?: React.RefObject<HTMLFormElement | null>) => {
    setErrorMsg('')
    setLoading(true)
    try {
      const result = await action(params)
      if (result?.error) {
        setErrorMsg(result.error)
      } else if (formRef?.current) {
        formRef.current.reset()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-danger/10 border border-danger/30 text-danger rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kategori Section */}
        <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
          <h3 className="text-lg font-medium text-text-primary mb-4">Kategori</h3>
          
          <form 
            ref={katRef}
            action={(fd) => handleAction(addKategori, fd, katRef)} 
            className="space-y-3 bg-bg-base p-4 rounded-md border border-border-subtle"
          >
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Nama</label>
              <input name="nama" required className="w-full px-3 py-1.5 text-sm bg-bg-elevated border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Slug</label>
                <input name="slug" required className="w-full px-3 py-1.5 text-sm bg-bg-elevated border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Urutan</label>
                <input type="number" name="urutan" defaultValue="0" required className="w-full px-3 py-1.5 text-sm bg-bg-elevated border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Tambah
            </button>
          </form>

          <div className="space-y-2 mt-4 max-h-96 overflow-y-auto pr-2">
            {initialKategori.map(kat => (
              <div key={kat.id} className="flex items-center justify-between p-3 bg-bg-base border border-border-subtle rounded-md">
                <div>
                  <p className="text-sm font-medium text-text-primary">{kat.nama}</p>
                  <p className="text-xs text-text-secondary">/{kat.slug} • Urutan: {kat.urutan}</p>
                </div>
                <button onClick={() => handleAction(deleteKategori, kat.id)} disabled={loading} className="p-1.5 text-text-secondary hover:text-danger rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {initialKategori.length === 0 && <p className="text-sm text-text-secondary text-center py-4">Belum ada data</p>}
          </div>
        </div>

        {/* Angkatan Section */}
        <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
          <h3 className="text-lg font-medium text-text-primary mb-4">Angkatan</h3>
          
          <form 
            ref={angRef}
            action={(fd) => handleAction(addAngkatan, fd, angRef)} 
            className="space-y-3 bg-bg-base p-4 rounded-md border border-border-subtle"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Tahun</label>
                <input type="number" name="tahun" required className="w-full px-3 py-1.5 text-sm bg-bg-elevated border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Label</label>
                <input name="label" required placeholder="Contoh: 2024" className="w-full px-3 py-1.5 text-sm bg-bg-elevated border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Tambah
            </button>
          </form>

          <div className="space-y-2 mt-4 max-h-96 overflow-y-auto pr-2">
            {initialAngkatan.map(ang => (
              <div key={ang.id} className="flex items-center justify-between p-3 bg-bg-base border border-border-subtle rounded-md">
                <div>
                  <p className="text-sm font-medium text-text-primary">{ang.label}</p>
                  <p className="text-xs text-text-secondary">Tahun: {ang.tahun}</p>
                </div>
                <button onClick={() => handleAction(deleteAngkatan, ang.id)} disabled={loading} className="p-1.5 text-text-secondary hover:text-danger rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {initialAngkatan.length === 0 && <p className="text-sm text-text-secondary text-center py-4">Belum ada data</p>}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
          <h3 className="text-lg font-medium text-text-primary mb-4">Tech Stack</h3>
          
          <form 
            ref={tsRef}
            action={(fd) => handleAction(addTechStack, fd, tsRef)} 
            className="space-y-3 bg-bg-base p-4 rounded-md border border-border-subtle"
          >
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Nama Tech Stack</label>
              <input name="nama" required placeholder="Contoh: React, Tailwind..." className="w-full px-3 py-1.5 text-sm bg-bg-elevated border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Tambah
            </button>
          </form>

          <div className="space-y-2 mt-4 max-h-96 overflow-y-auto pr-2">
            {initialTechStack.map(ts => (
              <div key={ts.id} className="flex items-center justify-between p-3 bg-bg-base border border-border-subtle rounded-md">
                <p className="text-sm font-medium text-text-primary">{ts.nama}</p>
                <button onClick={() => handleAction(deleteTechStack, ts.id)} disabled={loading} className="p-1.5 text-text-secondary hover:text-danger rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {initialTechStack.length === 0 && <p className="text-sm text-text-secondary text-center py-4">Belum ada data</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
