import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

type UpdateBody = {
  status?: string
  rating?: string | null
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'id is required' },
        { status: 400 },
      )
    }

    const body = (await req.json()) as UpdateBody

    if (!body.status && body.rating === undefined) {
      return NextResponse.json(
        { ok: false, error: 'status か rating のどちらかは指定してください' },
        { status: 400 },
      )
    }

    const update: Record<string, any> = {}
    if (body.status) update.status = body.status
    if (body.rating !== undefined) update.rating = body.rating

    const { data, error } = await supabase
      .from('nexus_transactions')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, transaction: data }, { status: 200 })
  } catch (err: any) {
    console.error('PATCH /api/nexus/transactions/[id] error', err)
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Unexpected error' },
      { status: 500 },
    )
  }
}
