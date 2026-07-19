"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Settings } from 'lucide-react'

export function SidebarNav() {
  const pathname = usePathname()

  const links = [
    {
      href: '/dashboard',
      label: 'Daftar Karya',
      icon: LayoutDashboard,
      active: pathname === '/dashboard' || (pathname && pathname.startsWith('/dashboard/edit/'))
    },
    {
      href: '/dashboard/tambah',
      label: 'Tambah Karya',
      icon: PlusCircle,
      active: pathname === '/dashboard/tambah'
    },
    {
      href: '/dashboard/master',
      label: 'Data Master',
      icon: Settings,
      active: pathname === '/dashboard/master'
    }
  ]

  return (
    <nav className="flex-1 px-4 space-y-2 mt-4">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              link.active 
                ? 'bg-accent-primary/10 text-accent-primary' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-base'
            }`}
          >
            <Icon size={20} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
