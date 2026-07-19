'use client'

import { useState, useCallback, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { karyaFormSchema, KaryaFormValues, MediaItem } from '@/lib/schema/karya'
import { createClient } from '@/lib/supabase/client'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { X, GripVertical, Upload, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface KaryaFormProps {
  initialData?: Partial<KaryaFormValues>
  kategoriOptions: { id: string; nama: string }[]
  angkatanOptions: { id: string; label: string }[]
  techStackOptions: { id: string; nama: string }[]
  onSubmitAction: (data: KaryaFormValues) => Promise<{ success?: boolean; error?: string; isConflict?: boolean; id?: string; details?: any }>
}

export function KaryaForm({ 
  initialData, 
  kategoriOptions, 
  angkatanOptions, 
  techStackOptions,
  onSubmitAction 
}: KaryaFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [conflictMsg, setConflictMsg] = useState('')
  const [idempotencyKey, setIdempotencyKey] = useState('')
  const supabase = createClient()

  // Generate idempotency key only once per form session
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID())
  }, [])

  // Tech stack auto-complete state
  const [tsInput, setTsInput] = useState('')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<KaryaFormValues>({
    resolver: zodResolver(karyaFormSchema) as any,
    defaultValues: {
      judul: initialData?.judul || '',
      deskripsi: initialData?.deskripsi || '',
      nama_mahasiswa: initialData?.nama_mahasiswa || '',
      nim: initialData?.nim || '',
      tampilkan_nim: initialData?.tampilkan_nim || false,
      prodi: initialData?.prodi || '',
      kategori_id: initialData?.kategori_id || '',
      angkatan_id: initialData?.angkatan_id || '',
      dosen_pembimbing: initialData?.dosen_pembimbing || '',
      link_demo: initialData?.link_demo || '',
      link_github: initialData?.link_github || '',
      status: initialData?.status || 'draft',
      media: initialData?.media || [],
      tech_stacks: initialData?.tech_stacks || [],
      id: initialData?.id,
      version: initialData?.version,
    },
  })

  const { fields: mediaFields, append: appendMedia, remove: removeMedia, move: moveMedia } = useFieldArray({
    control,
    name: "media",
  })

  const watchTechStacks = watch('tech_stacks') || []

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    moveMedia(result.source.index, result.destination.index)
    
    // Update urutan
    const updatedMedia = [...watch('media')]
    const [moved] = updatedMedia.splice(result.source.index, 1)
    updatedMedia.splice(result.destination.index, 0, moved)
    updatedMedia.forEach((m, idx) => {
      setValue(`media.${idx}.urutan`, idx)
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validation
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        alert(`File ${file.name} ditolak. Hanya menerima gambar (jpeg, png, webp) atau video (mp4, webm).`)
        continue
      }

      if (isImage && file.size > 5 * 1024 * 1024) {
        alert(`Gambar ${file.name} terlalu besar. Maksimal 5MB.`)
        continue
      }
      if (isVideo && file.size > 50 * 1024 * 1024) {
        alert(`Video ${file.name} terlalu besar. Maksimal 50MB.`)
        continue
      }

      // Add to field array as pending upload (will generate object URL for preview)
      const objectUrl = URL.createObjectURL(file)
      appendMedia({
        tipe: isImage ? 'image' : 'video',
        url: objectUrl, // Temporary URL
        urutan: mediaFields.length + i,
        file: file // Store File object for upload during submit
      })
    }
  }

  const addTechStack = (id: string) => {
    if (!watchTechStacks.includes(id)) {
      setValue('tech_stacks', [...watchTechStacks, id])
    }
    setTsInput('')
  }

  const removeTechStack = (id: string) => {
    setValue('tech_stacks', watchTechStacks.filter(ts => ts !== id))
  }

  const onSubmit = async (data: KaryaFormValues) => {
    setIsSubmitting(true)
    setErrorMsg('')
    setConflictMsg('')

    try {
      // 1. Upload files first
      const uploadedMedia = [...data.media]
      for (let i = 0; i < uploadedMedia.length; i++) {
        const item = uploadedMedia[i]
        if (item.file) {
          const fileExt = item.file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
          const filePath = `${data.kategori_id}/${fileName}`

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('karya-media')
            .upload(filePath, item.file)

          if (uploadError) {
            throw new Error(`Gagal upload file ${item.file.name}: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from('karya-media')
            .getPublicUrl(filePath)

          uploadedMedia[i].url = publicUrl
          delete uploadedMedia[i].file // Remove file object before sending to server
        }
      }
      data.media = uploadedMedia

      // 2. Attach idempotency key and submit to server action
      const dataToSubmit = { ...data, idempotency_key: idempotencyKey }
      const result = await onSubmitAction(dataToSubmit)
      
      if (result.isConflict) {
        setConflictMsg(result.error || 'Terjadi konflik')
      } else if (result.error) {
        setErrorMsg(result.error)
      } else if (result.success) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTechStacks = techStackOptions.filter(ts => 
    ts.nama.toLowerCase().includes(tsInput.toLowerCase()) && 
    !watchTechStacks.includes(ts.id)
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-danger/10 border border-danger/30 text-danger rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      {conflictMsg && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-md text-sm">
          <strong>Peringatan Konflik:</strong> {conflictMsg}
          <div className="mt-2">
            <button 
              type="button" 
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-bg-elevated border border-border-subtle rounded-md text-text-primary text-xs"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
            <h3 className="text-lg font-medium text-text-primary mb-4">Informasi Utama</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Judul Karya *</label>
              <input 
                {...register('judul')} 
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
              {errors.judul && <p className="text-danger text-xs mt-1">{errors.judul.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Deskripsi *</label>
              <textarea 
                {...register('deskripsi')} 
                rows={5}
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
              {errors.deskripsi && <p className="text-danger text-xs mt-1">{errors.deskripsi.message}</p>}
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
            <h3 className="text-lg font-medium text-text-primary mb-4">Media (Gambar / Video) *</h3>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="media-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {mediaFields.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-4 p-3 bg-bg-base border border-border-subtle rounded-md group"
                          >
                            <div {...provided.dragHandleProps} className="text-text-secondary hover:text-text-primary cursor-grab">
                              <GripVertical size={20} />
                            </div>
                            
                            {item.tipe === 'image' ? (
                              <img src={item.url} alt="preview" className="w-16 h-16 object-cover rounded bg-bg-elevated" />
                            ) : (
                              <div className="w-16 h-16 bg-bg-elevated rounded flex items-center justify-center text-xs text-text-secondary">Video</div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary truncate">{item.file?.name || item.url}</p>
                                <p className="text-xs text-text-secondary capitalize">{item.tipe}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="p-2 text-text-secondary hover:text-danger rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {errors.media && <p className="text-danger text-xs mt-1">{errors.media.message}</p>}

            <div className="mt-4 flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border-subtle border-dashed rounded-lg cursor-pointer bg-bg-base hover:bg-bg-elevated transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-text-secondary" />
                        <p className="mb-2 text-sm text-text-primary"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                        <p className="text-xs text-text-secondary">JPEG, PNG, WEBP, MP4 (Max 5MB img, 50MB vid)</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={handleFileUpload} />
                </label>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
            <h3 className="text-lg font-medium text-text-primary mb-4">Tech Stack</h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {watchTechStacks.map(tsId => {
                const ts = techStackOptions.find(t => t.id === tsId)
                return ts ? (
                  <span key={tsId} className="inline-flex items-center gap-1 px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium">
                    {ts.nama}
                    <button type="button" onClick={() => removeTechStack(tsId)} className="hover:text-danger">
                      <X size={14} />
                    </button>
                  </span>
                ) : null
              })}
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="Ketik untuk mencari tech stack..."
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
              {tsInput && (
                <div className="absolute z-10 w-full mt-1 bg-bg-elevated border border-border-subtle rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredTechStacks.length > 0 ? (
                    filteredTechStacks.map(ts => (
                      <button
                        key={ts.id}
                        type="button"
                        onClick={() => addTechStack(ts.id)}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-base transition-colors"
                      >
                        {ts.nama}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-text-secondary">Tidak ditemukan</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
             <h3 className="text-lg font-medium text-text-primary mb-4">Status & Kategori</h3>
             
             <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
              <select 
                {...register('status')}
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Kategori *</label>
              <select 
                {...register('kategori_id')}
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              >
                <option value="">Pilih Kategori</option>
                {kategoriOptions.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nama}</option>
                ))}
              </select>
              {errors.kategori_id && <p className="text-danger text-xs mt-1">{errors.kategori_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Angkatan *</label>
              <select 
                {...register('angkatan_id')}
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              >
                <option value="">Pilih Angkatan</option>
                {angkatanOptions.map(angk => (
                  <option key={angk.id} value={angk.id}>{angk.label}</option>
                ))}
              </select>
              {errors.angkatan_id && <p className="text-danger text-xs mt-1">{errors.angkatan_id.message}</p>}
            </div>
          </div>

          <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
             <h3 className="text-lg font-medium text-text-primary mb-4">Data Kreator</h3>
             
             <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Nama Mahasiswa / Tim *</label>
              <input 
                {...register('nama_mahasiswa')} 
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
              {errors.nama_mahasiswa && <p className="text-danger text-xs mt-1">{errors.nama_mahasiswa.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">NIM (Opsional)</label>
              <input 
                {...register('nim')} 
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" id="tampilkan_nim" {...register('tampilkan_nim')} className="rounded border-border-subtle bg-bg-base text-accent-primary focus:ring-accent-primary" />
                <label htmlFor="tampilkan_nim" className="text-xs text-text-secondary">Tampilkan NIM ke publik</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Prodi</label>
              <input 
                {...register('prodi')} 
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Dosen Pembimbing</label>
              <input 
                {...register('dosen_pembimbing')} 
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="bg-bg-elevated p-6 rounded-lg border border-border-subtle space-y-4">
             <h3 className="text-lg font-medium text-text-primary mb-4">Tautan Eksternal</h3>
             
             <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Link Demo (URL)</label>
              <input 
                {...register('link_demo')} 
                placeholder="https://..."
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
              {errors.link_demo && <p className="text-danger text-xs mt-1">{errors.link_demo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Link GitHub (URL)</label>
              <input 
                {...register('link_github')} 
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-md text-text-primary focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
              />
              {errors.link_github && <p className="text-danger text-xs mt-1">{errors.link_github.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-border-subtle">
        <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
          Batal
        </Link>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Karya'}
        </button>
      </div>
    </form>
  )
}
