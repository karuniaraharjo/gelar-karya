import Link from 'next/link'
import { PlusCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

import { FilterForm } from './filter-form'
import { DeleteButton } from './delete-button'

export default async function DashboardPage(props: {
  searchParams?: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  const statusFilter = searchParams?.status || ''
  const currentPage = Number(searchParams?.page) || 1
  const ITEMS_PER_PAGE = 10
  
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const supabase = await createClient()

  let dbQuery = supabase
    .from('karya')
    .select(`
      id,
      judul,
      status,
      created_at,
      kategori:kategori_id(nama)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    dbQuery = dbQuery.ilike('judul', `%${query}%`)
  }
  if (statusFilter && statusFilter !== 'all') {
    dbQuery = dbQuery.eq('status', statusFilter)
  }

  const { data: karyaList, error, count } = await dbQuery
  
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (statusFilter) params.set('status', statusFilter)
    params.set('page', pageNumber.toString())
    return `/dashboard?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Daftar Karya</h2>
          <p className="text-sm text-text-secondary mt-1">Kelola portofolio karya mahasiswa yang ditampilkan di KaryaFeed.</p>
        </div>
        <Link 
          href="/dashboard/tambah" 
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <PlusCircle size={18} />
          Tambah Karya
        </Link>
      </div>

      <div className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden">
        <FilterForm query={query} statusFilter={statusFilter} />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-base/50 text-text-secondary text-sm">
                <th className="font-medium p-4 border-b border-border-subtle">Judul</th>
                <th className="font-medium p-4 border-b border-border-subtle">Kategori</th>
                <th className="font-medium p-4 border-b border-border-subtle">Status</th>
                <th className="font-medium p-4 border-b border-border-subtle">Tanggal</th>
                <th className="font-medium p-4 border-b border-border-subtle text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {karyaList && karyaList.length > 0 ? (
                karyaList.map((karya) => (
                  <tr key={karya.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-base/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-text-primary">{karya.judul}</p>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {/* @ts-ignore */}
                      {karya.kategori?.nama || '-'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${karya.status === 'published' ? 'bg-success/10 text-success' : 
                          karya.status === 'draft' ? 'bg-text-secondary/10 text-text-secondary' : 
                          'bg-danger/10 text-danger'}`}
                      >
                        {karya.status.charAt(0).toUpperCase() + karya.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {new Date(karya.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/dashboard/edit/${karya.id}`}
                          className="text-accent-primary hover:text-accent-primary/80 font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteButton id={karya.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">
                    {error ? 'Terjadi kesalahan saat memuat data.' : 'Tidak ada karya yang ditemukan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-subtle bg-bg-base/30 flex items-center justify-between sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-text-secondary">
                Menampilkan <span className="font-medium text-text-primary">{from + 1}</span> hingga{' '}
                <span className="font-medium text-text-primary">
                  {Math.min(to + 1, count || 0)}
                </span>{' '}
                dari <span className="font-medium text-text-primary">{count}</span> karya
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end gap-2">
              <Link
                href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-border-subtle ${
                  currentPage <= 1 
                    ? 'opacity-50 cursor-not-allowed bg-bg-base text-text-disabled pointer-events-none' 
                    : 'bg-bg-elevated text-text-primary hover:bg-bg-base transition-colors'
                }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Sebelumnya
              </Link>
              <Link
                href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-border-subtle ${
                  currentPage >= totalPages 
                    ? 'opacity-50 cursor-not-allowed bg-bg-base text-text-disabled pointer-events-none' 
                    : 'bg-bg-elevated text-text-primary hover:bg-bg-base transition-colors'
                }`}
              >
                Selanjutnya
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
