import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts'
import { encodeHex } from 'https://deno.land/std@0.168.0/encoding/hex.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Server configuration error')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const { karya_id } = await req.json()
    if (!karya_id) {
      return new Response(
        JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'karya_id is required' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Generate Session Hash based on IP and User-Agent
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip'
    const userAgent = req.headers.get('user-agent') || 'unknown-ua'
    
    const messageBuffer = new TextEncoder().encode(`${ip}-${userAgent}-${karya_id}`)
    const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer)
    const session_hash = encodeHex(hashBuffer)

    // Check rate limit / dedup (1 hour window)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data: existingLog, error: logError } = await supabase
      .from('karya_view_log')
      .select('id')
      .eq('session_hash', session_hash)
      .eq('karya_id', karya_id)
      .gte('created_at', oneHourAgo)
      .limit(1)

    if (logError) {
      throw logError
    }

    if (existingLog && existingLog.length > 0) {
      // Already viewed in the last hour, return 429 Rate Limited or 200 OK without incrementing
      // Returning 429 as specified in PRD for rate limit simulation
      return new Response(
        JSON.stringify({ error: { code: 'RATE_LIMITED', message: 'Terlalu banyak permintaan, coba lagi nanti.' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      )
    }

    // Insert log
    const { error: insertError } = await supabase
      .from('karya_view_log')
      .insert({ karya_id, session_hash })

    if (insertError) {
      throw insertError
    }

    // Increment atomically via RPC
    const { error: rpcError } = await supabase.rpc('increment_karya_view', { k_id: karya_id })

    if (rpcError) {
      throw rpcError
    }

    // Optional: get updated count
    const { data: updatedKarya } = await supabase
      .from('karya')
      .select('view_count')
      .eq('id', karya_id)
      .single()

    return new Response(
      JSON.stringify({ success: true, view_count: updatedKarya?.view_count }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: { code: 'SERVER_ERROR', message: err.message } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
