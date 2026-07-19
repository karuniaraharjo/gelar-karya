import { LogOut, Menu } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SidebarNav } from './components/sidebar-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profileName = 'Admin'
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nama')
      .eq('id', user.id)
      .single()
      
    if (profile?.nama) {
        profileName = profile.nama
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-elevated border-r border-border-subtle hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-accent-gradient flex items-center justify-center text-white font-bold">K</span>
            KaryaFeed Panel
          </h1>
        </div>
        <SidebarNav />
        
        <div className="p-4 border-t border-border-subtle">
            <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-border-subtle flex items-center justify-center text-text-primary text-sm font-medium">
                    {profileName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 truncate text-sm">
                    <p className="text-text-primary font-medium truncate">{profileName}</p>
                    <p className="text-text-secondary truncate text-xs">{user?.email}</p>
                </div>
            </div>
            <form action={async () => {
                'use server'
                const sb = await createClient()
                await sb.auth.signOut()
                redirect('/login')
            }}>
                <button type="submit" className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-md transition-colors">
                    <LogOut size={16} />
                    Logout
                </button>
            </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-bg-elevated border-b border-border-subtle flex items-center justify-between px-4 md:px-8 md:hidden">
            <h1 className="text-lg font-bold text-text-primary">KaryaFeed Panel</h1>
            <button className="p-2 text-text-secondary hover:text-text-primary rounded-md">
                <Menu size={24} />
            </button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
