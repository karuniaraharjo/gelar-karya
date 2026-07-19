'use client'

import { Search, Filter } from 'lucide-react'

export function FilterForm({ query, statusFilter }: { query: string, statusFilter: string }) {
  return (
    <form className="p-4 border-b border-border-subtle flex flex-col sm:flex-row gap-4" method="GET">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Cari judul karya..." 
            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-subtle rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-bg-base border border-border-subtle hover:bg-border-subtle text-text-primary rounded-md text-sm font-medium transition-colors">
          Cari
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-text-secondary" />
        <select 
            name="status"
            defaultValue={statusFilter || 'all'}
            onChange={(e) => e.target.form?.submit()}
            className="bg-bg-base border border-border-subtle rounded-md text-sm text-text-primary py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
        >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
        </select>
      </div>
    </form>
  )
}
