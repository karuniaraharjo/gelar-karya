'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ViewTracker({ karyaId }: { karyaId: string }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only track once per mount
    if (hasTracked.current) return
    hasTracked.current = true

    const trackView = async () => {
      try {
        const supabase = createClient()
        const { error } = await (supabase.rpc as any)('increment_karya_view', { k_id: karyaId })
        if (error) throw error
      } catch (err) {
        // Silently fail view tracking on client
        console.error('Failed to track view:', err)
      }
    }

    trackView()
  }, [karyaId])

  return null
}

