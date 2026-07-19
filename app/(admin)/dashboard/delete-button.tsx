'use client'

import { Trash2 } from 'lucide-react'
import { deleteKarya } from './actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan.')) {
      setIsDeleting(true)
      try {
        const result = await deleteKarya(id)
        if (result.error) {
          alert(result.error)
        }
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus karya')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-danger hover:text-danger/80 font-medium disabled:opacity-50 inline-flex items-center gap-1"
    >
      <Trash2 size={16} />
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  )
}
